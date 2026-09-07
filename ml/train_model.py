"""Train churn prediction models on telco_churn.csv."""

from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = PROJECT_ROOT / "telco_churn.csv"
MODELS_DIR = Path(__file__).resolve().parent / "models"


def load_and_preprocess(path: Path) -> tuple[pd.DataFrame, pd.Series, dict, list[str]]:
    df = pd.read_csv(path)

    # Drop identifier column if present
    if "customerID" in df.columns:
        df = df.drop(columns=["customerID"])

    # TotalCharges has blank strings for new customers; coerce to numeric
    if "TotalCharges" in df.columns:
        df["TotalCharges"] = pd.to_numeric(df["TotalCharges"], errors="coerce")

    # Fill remaining missing values
    for col in df.columns:
        if df[col].isna().any():
            if pd.api.types.is_numeric_dtype(df[col]):
                df[col] = df[col].fillna(df[col].median())
            else:
                df[col] = df[col].fillna(df[col].mode().iloc[0])

    # Binary target: Yes=1, No=0
    df["Churn"] = df["Churn"].map({"Yes": 1, "No": 0})

    y = df["Churn"]
    X = df.drop(columns=["Churn"])

    label_encoders: dict[str, LabelEncoder] = {}
    feature_order = list(X.columns)

    for col in X.select_dtypes(include=["object", "string"]).columns:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        label_encoders[col] = le

    return X, y, label_encoders, feature_order


def evaluate_model(name: str, model, X_test, y_test) -> float:
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)
    precision = report["1"]["precision"]
    recall = report["1"]["recall"]
    cm = confusion_matrix(y_test, y_pred)

    print(f"\n{'=' * 60}")
    print(f"{name} Results")
    print(f"{'=' * 60}")
    print(f"Accuracy:  {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"Confusion Matrix:\n{cm}")

    return accuracy


def main() -> None:
    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    X, y, label_encoders, feature_order = load_and_preprocess(DATA_PATH)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
    rf_model.fit(X_train, y_train)
    rf_accuracy = evaluate_model("Random Forest", rf_model, X_test, y_test)

    xgb_model = XGBClassifier(
        n_estimators=100,
        random_state=42,
        eval_metric="logloss",
    )
    xgb_model.fit(X_train, y_train)
    xgb_accuracy = evaluate_model("XGBoost", xgb_model, X_test, y_test)

    importances = pd.Series(rf_model.feature_importances_, index=feature_order)
    top_10 = importances.sort_values(ascending=False).head(10)

    print(f"\n{'=' * 60}")
    print("Top 10 Random Forest Feature Importances")
    print(f"{'=' * 60}")
    for feature, importance in top_10.items():
        print(f"  {feature}: {importance:.4f}")

    if rf_accuracy >= xgb_accuracy:
        best_model = rf_model
        best_name = "RandomForest"
    else:
        best_model = xgb_model
        best_name = "XGBoost"

    artifact = {
        "model": best_model,
        "model_name": best_name,
        "label_encoders": label_encoders,
        "feature_order": feature_order,
    }
    model_path = MODELS_DIR / "best_model.joblib"
    joblib.dump(artifact, model_path)

    print(f"\nBest model: {best_name} (accuracy={max(rf_accuracy, xgb_accuracy):.4f})")
    print(f"Saved to: {model_path}")


if __name__ == "__main__":
    main()

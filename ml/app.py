"""Flask API and Web Server for Telco Customer Churn Prediction."""

from pathlib import Path

import joblib
import pandas as pd
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DIST_DIR = PROJECT_ROOT / "dist"
MODEL_PATH = Path(__file__).resolve().parent / "models" / "best_model.joblib"

app = Flask(
    __name__,
    static_folder=str(DIST_DIR / "assets") if (DIST_DIR / "assets").exists() else None,
    static_url_path="/assets"
)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load model artifact
artifact = joblib.load(MODEL_PATH)
model = artifact["model"]
label_encoders = artifact["label_encoders"]
feature_order = artifact["feature_order"]

# Compute top 10 feature importances from the loaded model
if hasattr(model, "feature_importances_"):
    importances = pd.Series(model.feature_importances_, index=feature_order)
    top_10_series = importances.sort_values(ascending=False).head(10)
    feature_importance_list = [
        {
            "feature": feat,
            "name": feat,
            "importance": round(float(score), 6),
            "score": round(float(score), 6),
        }
        for feat, score in top_10_series.items()
    ]
else:
    feature_importance_list = []

MODEL_INFO = {
    "accuracy": 79.21,
    "precision": 63.73,
    "recall": 50.27,
    "confusion_matrix": [[928, 107], [186, 188]],
    "feature_importance": feature_importance_list,
}


def encode_features(data: dict) -> pd.DataFrame:
    """Validate and encode input features for prediction."""
    clean_data = {k: v for k, v in data.items() if k not in ("customerID", "Churn")}
    
    missing = [col for col in feature_order if col not in clean_data]
    if missing:
        raise ValueError(f"Missing required feature columns: {missing}")

    if "TotalCharges" in clean_data:
        tc = pd.to_numeric(clean_data["TotalCharges"], errors="coerce")
        if pd.isna(tc):
            tc = float(clean_data.get("MonthlyCharges", 0.0))
        clean_data["TotalCharges"] = float(tc)

    encoded_row = {}
    for col in feature_order:
        val = clean_data[col]
        if col in label_encoders:
            str_val = str(val)
            le = label_encoders[col]
            if str_val not in le.classes_:
                raise ValueError(
                    f"Invalid category '{str_val}' for feature '{col}'. "
                    f"Expected one of: {list(le.classes_)}"
                )
            encoded_row[col] = float(le.transform([str_val])[0])
        else:
            encoded_row[col] = float(val)

    return pd.DataFrame([encoded_row], columns=feature_order)


@app.route("/model-info", methods=["GET"])
def model_info():
    """Return model performance metrics and top 10 feature importances."""
    return jsonify(MODEL_INFO)


@app.route("/predict", methods=["POST"])
def predict():
    """Predict customer churn given feature JSON."""
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400

    payload = request.get_json()
    if not payload:
        return jsonify({"error": "JSON payload is empty"}), 400

    try:
        features_df = encode_features(payload)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        return jsonify({"error": f"Encoding error: {str(exc)}"}), 400

    prediction_idx = int(model.predict(features_df)[0])
    probabilities = model.predict_proba(features_df)[0]
    confidence_pct = round(float(probabilities[prediction_idx] * 100), 2)
    prediction_label = "Yes" if prediction_idx == 1 else "No"

    return jsonify({
        "prediction": prediction_label,
        "confidence": confidence_pct,
        "churn_probability": round(float(probabilities[1] * 100), 2),
    })


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    """Serve built frontend or status page."""
    if path and (DIST_DIR / path).exists():
        return send_from_directory(DIST_DIR, path)
    if (DIST_DIR / "index.html").exists():
        return send_from_directory(DIST_DIR, "index.html")
    return jsonify({
        "status": "online",
        "service": "ChurnLens ML Backend",
        "endpoints": {
            "model_info": "GET /model-info",
            "predict": "POST /predict",
        },
        "frontend_dev_server": "http://localhost:5173",
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)

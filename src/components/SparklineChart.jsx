import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

export function SparklineChart({ data, color }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <Tooltip
          contentStyle={{ background: '#111', border: '1px solid #1C1C1C', borderRadius: 2, fontSize: 10 }}
          itemStyle={{ color }}
          labelFormatter={() => ''}
          formatter={(v) => [v.toLocaleString(), '']}
        />
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, fill: color, stroke: '#000', strokeWidth: 1 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

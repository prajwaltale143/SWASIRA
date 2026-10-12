import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const NUTRIENT_CONFIG = [
  { key: 'carbs', label: 'Carbohydrates', color: '#0B4F4A', unit: 'g' },
  { key: 'protein', label: 'Protein', color: '#6FAE8B', unit: 'g' },
  { key: 'vitamins', label: 'Vitamins & Minerals', color: '#E9A23B', unit: 'mg' },
  { key: 'calcium', label: 'Calcium', color: '#136761', unit: 'mg' },
  { key: 'healthy_fats', label: 'Healthy Fats', color: '#91C4A9', unit: 'g' },
];

export default function NutrientDonut({ nutrientTotals = {} }) {
  const chartData = NUTRIENT_CONFIG.map(item => ({
    name: item.label,
    value: nutrientTotals[item.key] || 0,
    color: item.color,
    unit: item.unit,
  })).filter(item => item.value > 0);

  const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);

  if (chartData.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-swasira-muted">
        Nutrient breakdown will compute automatically from your personalized meal choices.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = totalValue > 0 ? Math.round((data.value / totalValue) * 100) : 0;
      return (
        <div className="bg-white px-3 py-2 rounded-xl shadow-md border border-swasira-mint-border text-xs">
          <p className="font-semibold text-swasira-charcoal">{data.name}</p>
          <p className="text-swasira-teal font-medium mt-0.5">
            {data.value} {data.unit} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-swasira-mint-border shadow-soft flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-swasira-teal">
            Nutrient Distribution
          </h3>
          <p className="text-xs text-swasira-muted">
            Balanced composite for today's plan
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-1 bg-swasira-mint rounded-full text-swasira-teal border border-swasira-mint-border">
          Optimal Balance
        </span>
      </div>

      {/* Donut Chart */}
      <div className="w-full h-56 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={88}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs font-medium text-swasira-muted">Daily Target</span>
          <span className="text-lg font-serif font-bold text-swasira-teal">100%</span>
        </div>
      </div>

      {/* Clean Legend */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-swasira-mint-border/70">
        {chartData.map((item, idx) => {
          const pct = totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0;
          return (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex flex-col truncate">
                <span className="text-swasira-charcoal truncate font-medium">{item.name}</span>
                <span className="text-[11px] text-swasira-muted">{item.value} {item.unit} ({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

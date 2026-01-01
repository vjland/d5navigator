import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { Hand } from '../types';

interface StrategyChartProps {
  hands: Hand[];
}

const StrategyChart: React.FC<StrategyChartProps> = ({ hands }) => {
  // We need at least one point to render a nice chart, even if empty
  const data = hands.length > 0 ? hands : [{ id: 0, runningTotal: 0 }];

  return (
    <div className="w-full h-full bg-zinc-900/50 rounded-xl border border-zinc-800 p-2 relative overflow-hidden select-none">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <ReferenceLine y={0} stroke="#52525b" strokeDasharray="3 3" />
          <XAxis 
            dataKey="id" 
            hide={true} 
            type="number" 
            domain={[0, 75]} 
          />
          <YAxis 
            domain={[-20, 20]} 
            tick={{ fill: '#71717a', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '6px', color: '#e4e4e7' }}
            itemStyle={{ color: '#fbbf24' }}
            labelStyle={{ color: '#a1a1aa', marginBottom: '0.25rem' }}
            formatter={(value: number) => [`${value > 0 ? '+' : ''}${value}`, 'Total Units']}
            labelFormatter={(label) => `Hand #${label}`}
            cursor={{ stroke: '#fbbf24', strokeWidth: 1, opacity: 0.5 }}
          />
          <Line 
            type="monotone" 
            dataKey="runningTotal" 
            stroke="#fbbf24" 
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 6, fill: '#fbbf24', stroke: '#18181b', strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StrategyChart;

import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
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
          <ReferenceLine y={0} stroke="#002455" strokeWidth={2} />
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
          <Line 
            type="linear" 
            dataKey="runningTotal" 
            stroke="#fbbf24" 
            strokeWidth={1} 
            dot={{ r: 1, fill: '#fbbf24', strokeWidth: 0 }}
            activeDot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StrategyChart;

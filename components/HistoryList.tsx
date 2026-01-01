import React from 'react';
import { ChevronUp, ChevronDown, History, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Hand, Winner, Result } from '../types';

interface HistoryListProps {
  hands: Hand[];
  isExpanded: boolean;
  onToggle: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ hands, isExpanded, onToggle }) => {
  // We want to show the newest hands at the top of the list
  const reversedHands = [...hands].reverse();

  return (
    <div 
      className={`flex-none bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 flex flex-col transition-all duration-300 ease-in-out shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.4)] z-20 ${
        isExpanded ? 'h-[260px]' : 'h-[92px]'
      }`}
    >
      {/* Header with Handle */}
      <div 
        onClick={onToggle} 
        className="relative px-4 pt-3 pb-2 border-b border-zinc-800 bg-zinc-900 flex justify-between items-center cursor-pointer hover:bg-zinc-800/80 transition-colors group"
      >
        {/* Drag Handle UI */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-zinc-800 rounded-full group-hover:bg-zinc-700 transition-colors" />
        
        <div className="flex items-center space-x-2 text-zinc-400 group-hover:text-zinc-300 mt-1">
          <History className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Hand History</span>
          <span className="text-[10px] text-zinc-600 font-mono ml-1">({hands.length})</span>
        </div>
        <button className="text-zinc-500 group-hover:text-zinc-300 mt-1">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* List */}
      <div className={`flex-1 p-1 space-y-1 custom-scroll ${isExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        {hands.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-xs italic space-y-2 py-4">
            <span>Waiting for first hand...</span>
          </div>
        ) : (
          reversedHands.map((h) => (
            <div 
              key={h.id} 
              className="grid grid-cols-12 gap-2 items-center p-2 rounded hover:bg-zinc-800/50 text-sm border border-transparent hover:border-zinc-800 transition-colors animate-in slide-in-from-bottom-2 h-[40px]"
            >
              {/* ID */}
              <div className="col-span-1 text-zinc-500 font-mono text-[10px]">#{h.id}</div>
              
              {/* Scores */}
              <div className="col-span-4 flex items-center space-x-2 font-mono">
                {h.winner === Winner.PLAYER && (
                  <>
                    <span className="font-bold text-blue-500">P:{h.playerScore}</span>
                    <span className="text-zinc-600">-</span>
                    <span className="font-bold text-zinc-600">B:{h.bankerScore}</span>
                  </>
                )}
                {h.winner === Winner.BANKER && (
                  <>
                    <span className="font-bold text-zinc-600">P:{h.playerScore}</span>
                    <span className="text-zinc-600">-</span>
                    <span className="font-bold text-red-500">B:{h.bankerScore}</span>
                  </>
                )}
                {h.winner === Winner.TIE && (
                  <>
                    <span className="font-bold text-zinc-500">P:{h.playerScore}</span>
                    <span className="text-zinc-600">-</span>
                    <span className="font-bold text-zinc-500">B:{h.bankerScore}</span>
                  </>
                )}
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded ml-1">
                  Δ{h.delta}
                </span>
              </div>

              {/* Prediction */}
              <div className="col-span-3 text-center">
                {h.prediction ? (
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-zinc-600 text-[9px] uppercase tracking-tighter">Bet:</span>
                    <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${
                      h.prediction === Winner.PLAYER ? 'bg-blue-900/30 text-blue-400' : 'bg-red-900/30 text-red-400'
                    }`}>
                      {h.prediction === Winner.PLAYER ? 'P' : 'B'}
                    </span>
                  </div>
                ) : (
                  <span className="text-zinc-700">-</span>
                )}
              </div>

              {/* Result Icon */}
              <div className="col-span-2 flex justify-center">
                {h.result === Result.WIN && (
                  <div className="flex items-center text-emerald-500 text-[10px] font-bold">
                    <TrendingUp className="w-3 h-3 mr-1" /> Win
                  </div>
                )}
                {h.result === Result.LOSS && (
                  <div className="flex items-center text-rose-500 text-[10px] font-bold">
                    <TrendingDown className="w-3 h-3 mr-1" /> Loss
                  </div>
                )}
                {h.result === Result.PUSH && (
                  <div className="flex items-center text-zinc-500 text-[10px]">
                    <Minus className="w-3 h-3 mr-1" /> Push
                  </div>
                )}
              </div>

              {/* Running Total */}
              <div className={`col-span-2 text-right font-mono font-bold ${
                h.runningTotal > 0 ? 'text-emerald-400' : h.runningTotal < 0 ? 'text-rose-400' : 'text-zinc-400'
              }`}>
                {h.runningTotal > 0 ? '+' : ''}{h.runningTotal}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryList;
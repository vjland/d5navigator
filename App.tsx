import React, { useState, useEffect } from 'react';
import { RefreshCw, Menu } from 'lucide-react';
import StrategyChart from './components/StrategyChart';
import Keypad from './components/Keypad';
import HistoryList from './components/HistoryList';
import { Hand, Winner, Result } from './types';

const App: React.FC = () => {
  // -- State --
  const [hands, setHands] = useState<Hand[]>([]);
  const [nextPrediction, setNextPrediction] = useState<Winner | null>(null);
  
  // UI State
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // -- Logic --

  const handleScoreSubmit = (playerScore: number, bankerScore: number) => {
    // 1. Determine Actual Winner
    let actualWinner = Winner.TIE;
    if (playerScore > bankerScore) actualWinner = Winner.PLAYER;
    else if (bankerScore > playerScore) actualWinner = Winner.BANKER;

    // 2. Evaluate Previous Prediction against actual outcome
    let result = Result.PENDING;
    let unitsChanged = 0;

    if (nextPrediction) {
      if (actualWinner === Winner.TIE) {
        result = Result.PUSH;
        unitsChanged = 0;
      } else if (actualWinner === nextPrediction) {
        result = Result.WIN;
        unitsChanged = 1;
      } else {
        result = Result.LOSS;
        unitsChanged = -1;
      }
    } else {
      // First hand or no prediction
      result = Result.PUSH; 
    }

    // 3. Calculate Running Total
    const lastTotal = hands.length > 0 ? hands[hands.length - 1].runningTotal : 0;
    const newTotal = lastTotal + unitsChanged;

    // 4. Strategy for NEXT hand (The "Delta" Strategy)
    const delta = Math.abs(playerScore - bankerScore);
    let strategyPrediction: Winner | null = null;

    if (actualWinner !== Winner.TIE) {
      if (delta >= 5) {
        // High delta: Trend Follow
        strategyPrediction = actualWinner; 
      } else {
        // Low delta: Chop (Opposite)
        strategyPrediction = actualWinner === Winner.PLAYER ? Winner.BANKER : Winner.PLAYER;
      }
    } else {
      // Tie: Hold previous prediction
      strategyPrediction = nextPrediction;
    }

    const newHand: Hand = {
      id: hands.length + 1,
      playerScore,
      bankerScore,
      winner: actualWinner,
      prediction: nextPrediction,
      result,
      runningTotal: newTotal,
      delta
    };

    setHands(prev => [...prev, newHand]);
    setNextPrediction(strategyPrediction);
    setIsKeypadOpen(false);
  };

  const handleReset = () => {
    setHands([]);
    setNextPrediction(null);
    setIsResetModalOpen(false);
  };

  // -- Render Helpers --

  const getNextBetIndicator = () => {
    if (nextPrediction === Winner.PLAYER) {
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-xl border-2 shadow-[0_0_15px_rgba(59,130,246,0.2)] bg-blue-500/10 border-blue-500 text-blue-500 transition-all duration-300">
          <span className="text-2xl font-black">P</span>
        </div>
      );
    } 
    if (nextPrediction === Winner.BANKER) {
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-xl border-2 shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-red-500/10 border-red-500 text-red-500 transition-all duration-300">
          <span className="text-2xl font-black">B</span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-12 h-12 rounded-xl border-2 bg-zinc-800/50 border-zinc-700 text-zinc-700 transition-all duration-300">
        <span className="text-2xl font-black">-</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      
      {/* HEADER */}
      <header className="flex-none h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 z-30 relative shadow-md">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-bold tracking-tight text-zinc-400 hidden sm:block">D5 Navigator</h1>
        </div>

        {/* Center Indicator */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center space-x-3">
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider hidden sm:block">Next Bet:</span>
          {getNextBetIndicator()}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsResetModalOpen(true)}
            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            title="Reset Game"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsKeypadOpen(true)}
            className={`p-2 rounded-lg transition-all active:scale-95 ${
              isKeypadOpen 
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Chart Area */}
        <div className="flex-1 min-h-0 p-4 bg-zinc-950 relative">
          <StrategyChart hands={hands} />
        </div>

        {/* History Area */}
        <HistoryList 
          hands={hands} 
          isExpanded={isHistoryExpanded} 
          onToggle={() => setIsHistoryExpanded(!isHistoryExpanded)} 
        />
      </main>

      {/* MODALS */}
      <Keypad 
        isOpen={isKeypadOpen} 
        onClose={() => setIsKeypadOpen(false)} 
        onSubmit={handleScoreSubmit} 
      />

      {/* Reset Confirmation */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
            <div className="flex items-center space-x-3 mb-4 text-amber-500">
              <RefreshCw className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Reset Game Data?</h3>
            </div>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              This will clear all hand history, reset your performance chart, and delete your current session statistics. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setIsResetModalOpen(false)} 
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleReset} 
                className="px-4 py-2 rounded-lg text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/20 transition-all hover:scale-105 active:scale-95"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
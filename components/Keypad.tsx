import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface KeypadProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (p: number, b: number) => void;
}

const Keypad: React.FC<KeypadProps> = ({ isOpen, onClose, onSubmit }) => {
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    if (isOpen) setInput('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePress = (num: number) => {
    if (input.length < 2) {
      setInput(prev => prev + num.toString());
    }
  };

  const handleBackspace = () => setInput(prev => prev.slice(0, -1));

  const pScore = input[0] ? parseInt(input[0]) : null;
  const bScore = input[1] ? parseInt(input[1]) : null;
  
  const isComplete = input.length === 2;
  const isTie = isComplete && pScore === bScore;
  const canSubmit = isComplete && !isTie;

  const handleSubmit = () => {
    if (canSubmit && pScore !== null && bScore !== null) {
      onSubmit(pScore, bScore);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]" onClick={onClose} />
      <div className="fixed top-20 right-2 sm:right-4 z-50 w-full max-w-[340px] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b border-zinc-800 bg-zinc-800/50">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Input Result</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-zinc-700 rounded-full transition-colors text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display */}
        <div className="bg-zinc-950 p-8 flex justify-center items-center border-b border-zinc-800">
          <div className="flex items-center space-x-12 text-5xl font-mono">
            <div className="flex flex-col items-center">
              <span className={`font-bold transition-colors duration-200 ${pScore !== null ? 'text-blue-500' : 'text-zinc-700'}`}>
                {pScore ?? 0}
              </span>
            </div>
            <span className="text-zinc-700 font-thin">:</span>
            <div className="flex flex-col items-center">
              <span className={`font-bold transition-colors duration-200 ${bScore !== null ? 'text-red-500' : 'text-zinc-700'}`}>
                {bScore ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-3 grid grid-cols-3 gap-2 bg-zinc-900">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePress(num)}
              className="h-14 text-2xl font-medium bg-zinc-800 rounded-lg hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 transition-colors"
            >
              {num}
            </button>
          ))}
          
          <button onClick={handleBackspace} className="h-14 flex items-center justify-center bg-zinc-800/50 rounded-lg hover:bg-zinc-700/50 text-red-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
            </svg>
          </button>
          
          <button
            onClick={() => handlePress(0)}
            className="h-14 text-2xl font-medium bg-zinc-800 rounded-lg hover:bg-zinc-700 active:bg-zinc-600 text-zinc-200 transition-colors"
          >
            0
          </button>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`h-14 flex items-center justify-center rounded-lg font-bold transition-all shadow-lg ${
              canSubmit 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20 active:scale-95' 
                : 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
            }`}
          >
            {isTie ? (
              <span className="text-xs font-bold text-rose-500">NO TIE</span>
            ) : (
              <Check className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Keypad;
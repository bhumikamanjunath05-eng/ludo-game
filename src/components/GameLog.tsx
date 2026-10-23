import React, { useEffect, useRef } from 'react';
import { GameLogEntry, PlayerColor } from '../types/ludo';
import { Crown, Dices, Flag, Flame, Shield, Sparkles, Swords, Zap } from 'lucide-react';

interface GameLogProps {
  logs: GameLogEntry[];
}

const COLOR_DOTS: Record<PlayerColor, string> = {
  red: 'bg-red-500',
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  blue: 'bg-blue-500',
};

export const GameLog: React.FC<GameLogProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogIcon = (type: GameLogEntry['type']) => {
    switch (type) {
      case 'roll':
      case 'six':
        return <Dices size={12} className="text-slate-500 shrink-0" />;
      case 'capture':
        return <Swords size={12} className="text-red-500 shrink-0" />;
      case 'home':
        return <Flag size={12} className="text-emerald-500 shrink-0" />;
      case 'bonus':
        return <Flame size={12} className="text-amber-500 shrink-0" />;
      case 'advantage':
        return <Zap size={12} className="text-amber-500 fill-amber-500 shrink-0" />;
      case 'win':
        return <Crown size={12} className="text-amber-500 shrink-0" />;
      default:
        return <Sparkles size={12} className="text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-800">Match Log</h3>
        <span className="text-[11px] font-mono text-slate-400 tabular-nums">
          {logs.length} events
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 p-2 space-y-1.5 overflow-y-auto max-h-[180px] sm:max-h-[220px] text-xs"
      >
        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">Game started. Roll dice to play!</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-2 p-1 rounded hover:bg-slate-50 transition-colors"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${COLOR_DOTS[log.color]}`} />
              <div className="flex items-center gap-1.5 min-w-0">
                {getLogIcon(log.type)}
                <span className="text-slate-700 truncate leading-snug">{log.text}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

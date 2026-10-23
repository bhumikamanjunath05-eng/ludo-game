import React, { useState } from 'react';
import { Play, User, Users, X } from 'lucide-react';
import { Player, PlayerColor } from '../types/ludo';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (configuredPlayers: { name: string; isBot: boolean; color: PlayerColor }[]) => void;
  currentPlayers: Player[];
}

export const SetupModal: React.FC<SetupModalProps> = ({
  isOpen,
  onClose,
  onStartGame,
  currentPlayers,
}) => {
  const [playerConfigs, setPlayerConfigs] = useState<{ name: string; isBot: boolean; color: PlayerColor }[]>(
    currentPlayers.map((p) => ({
      name: p.name,
      isBot: false,
      color: p.color,
    }))
  );

  if (!isOpen) return null;

  const handlePresetNames = (preset: 'numbers' | 'friends' | 'colors') => {
    switch (preset) {
      case 'numbers':
        setPlayerConfigs([
          { name: 'Player 1', isBot: false, color: 'red' },
          { name: 'Player 2', isBot: false, color: 'green' },
          { name: 'Player 3', isBot: false, color: 'yellow' },
          { name: 'Player 4', isBot: false, color: 'blue' },
        ]);
        break;
      case 'friends':
        setPlayerConfigs([
          { name: 'Alex', isBot: false, color: 'red' },
          { name: 'Sam', isBot: false, color: 'green' },
          { name: 'Jordan', isBot: false, color: 'yellow' },
          { name: 'Taylor', isBot: false, color: 'blue' },
        ]);
        break;
      case 'colors':
        setPlayerConfigs([
          { name: 'Red Champion', isBot: false, color: 'red' },
          { name: 'Green Master', isBot: false, color: 'green' },
          { name: 'Yellow Ace', isBot: false, color: 'yellow' },
          { name: 'Blue Knight', isBot: false, color: 'blue' },
        ]);
        break;
    }
  };

  const colorStyles: Record<PlayerColor, { ring: string; badge: string; text: string; bg: string }> = {
    red: { ring: 'focus:border-red-500', badge: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
    green: { ring: 'focus:border-emerald-500', badge: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    yellow: { ring: 'focus:border-amber-500', badge: 'bg-amber-500', text: 'text-amber-800', bg: 'bg-amber-50' },
    blue: { ring: 'focus:border-blue-500', badge: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-slate-700" />
            <h3 className="text-base font-bold text-slate-900">4-Player User Setup</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
            All 4 positions are played by human users taking turns (Pass & Play). Enter each player's name below to begin.
          </div>

          {/* Quick Name Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Quick Name Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePresetNames('numbers')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors text-center"
              >
                Player 1 – 4
              </button>
              <button
                type="button"
                onClick={() => handlePresetNames('friends')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors text-center"
              >
                Alex, Sam, Jordan, Taylor
              </button>
              <button
                type="button"
                onClick={() => handlePresetNames('colors')}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer transition-colors text-center"
              >
                Color Titles
              </button>
            </div>
          </div>

          {/* 4 User Players Config */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Player Names (4 Users)
            </label>

            {playerConfigs.map((config, index) => {
              const style = colorStyles[config.color];
              return (
                <div
                  key={`config_${config.color}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                >
                  {/* Color identifier badge */}
                  <div
                    className={`w-8 h-8 rounded-lg ${style.badge} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}
                  >
                    {index + 1}
                  </div>

                  {/* Name input */}
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 capitalize">
                      {config.color} Player
                    </label>
                    <input
                      type="text"
                      value={config.name}
                      maxLength={18}
                      onChange={(e) => {
                        const next = [...playerConfigs];
                        next[index].name = e.target.value;
                        setPlayerConfigs(next);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400"
                      placeholder={`Enter Player ${index + 1} Name`}
                    />
                  </div>

                  {/* Human User Badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    <User size={13} className="text-slate-500" />
                    <span>User</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onStartGame(playerConfigs.map((p) => ({ ...p, isBot: false })));
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            <Play size={13} />
            <span>Start Match</span>
          </button>
        </div>
      </div>
    </div>
  );
};

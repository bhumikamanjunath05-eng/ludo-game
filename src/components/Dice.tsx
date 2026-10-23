import React, { useEffect, useState } from 'react';
import { PlayerColor } from '../types/ludo';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  disabled: boolean;
  activeColor: PlayerColor;
  onRoll: () => void;
  bonusRollMessage?: string | null;
}

// 3D Rotation angles for each dice value
const ROTATION_MAP: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: -90, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: 90, y: 0 },
  6: { x: 180, y: 0 },
};

export const Dice: React.FC<DiceProps> = ({
  value,
  isRolling,
  disabled,
  activeColor,
  onRoll,
  bonusRollMessage,
}) => {
  const [rotations, setRotations] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (isRolling) {
      // Multiple random full spins
      const randomExtraX = (Math.floor(Math.random() * 4) + 3) * 360;
      const randomExtraY = (Math.floor(Math.random() * 4) + 3) * 360;
      setRotations({
        x: randomExtraX + (Math.random() > 0.5 ? 90 : 180),
        y: randomExtraY + (Math.random() > 0.5 ? 90 : 180),
      });
    } else if (value && ROTATION_MAP[value]) {
      const base = ROTATION_MAP[value];
      // Land cleanly
      setRotations({
        x: base.x + 720,
        y: base.y + 720,
      });
    }
  }, [isRolling, value]);

  const colorStyles: Record<PlayerColor, { ring: string; button: string; glow: string }> = {
    red: {
      ring: 'border-red-500 shadow-red-500/20',
      button: 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.35)]',
    },
    green: {
      ring: 'border-emerald-500 shadow-emerald-500/20',
      button: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
    },
    yellow: {
      ring: 'border-amber-400 shadow-amber-400/20',
      button: 'bg-amber-500 hover:bg-amber-400 text-amber-950 font-semibold shadow-amber-500/30',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
    },
    blue: {
      ring: 'border-blue-500 shadow-blue-500/20',
      button: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.35)]',
    },
  };

  const renderFacePips = (faceNum: number) => {
    switch (faceNum) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <span className="w-4 h-4 rounded-full bg-red-600 shadow-inner" />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full p-2 flex flex-col justify-between">
            <div className="flex justify-start">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
            </div>
            <div className="flex justify-end">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full p-2 flex flex-col justify-between">
            <div className="flex justify-start">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
            </div>
            <div className="flex justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
            </div>
            <div className="flex justify-end">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full p-2 flex flex-col justify-between">
            <div className="flex justify-between">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
            </div>
            <div className="flex justify-between">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full p-2 flex flex-col justify-between">
            <div className="flex justify-between">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
            </div>
            <div className="flex justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
            </div>
            <div className="flex justify-between">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full p-2 flex flex-col justify-between">
            <div className="flex justify-between">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
            </div>
            <div className="flex justify-between">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
            </div>
            <div className="flex justify-between">
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
              <span className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-inner" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 3D Dice Stage */}
      <div
        className={`relative w-20 h-20 perspective-[600px] cursor-pointer select-none transition-transform ${
          !disabled ? 'hover:scale-105 active:scale-95' : 'cursor-not-allowed opacity-85'
        }`}
        onClick={() => {
          if (!disabled && !isRolling) onRoll();
        }}
        title={disabled ? 'Wait for move or next turn' : 'Click to roll dice (or press Space)'}
      >
        <div
          className={`w-full h-full relative transition-transform duration-500 ease-out preserve-3d rounded-xl ${
            !disabled ? colorStyles[activeColor].glow : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotations.x}deg) rotateY(${rotations.y}deg)`,
          }}
        >
          {/* Face 1: Front */}
          <div
            className="absolute inset-0 bg-white border border-slate-200 rounded-xl shadow-md flex items-center justify-center backface-hidden"
            style={{ transform: 'translateZ(40px)' }}
          >
            {renderFacePips(1)}
          </div>

          {/* Face 6: Back */}
          <div
            className="absolute inset-0 bg-white border border-slate-200 rounded-xl shadow-md flex items-center justify-center backface-hidden"
            style={{ transform: 'rotateY(180deg) translateZ(40px)' }}
          >
            {renderFacePips(6)}
          </div>

          {/* Face 2: Top */}
          <div
            className="absolute inset-0 bg-white border border-slate-200 rounded-xl shadow-md flex items-center justify-center backface-hidden"
            style={{ transform: 'rotateX(90deg) translateZ(40px)' }}
          >
            {renderFacePips(2)}
          </div>

          {/* Face 5: Bottom */}
          <div
            className="absolute inset-0 bg-white border border-slate-200 rounded-xl shadow-md flex items-center justify-center backface-hidden"
            style={{ transform: 'rotateX(-90deg) translateZ(40px)' }}
          >
            {renderFacePips(5)}
          </div>

          {/* Face 3: Right */}
          <div
            className="absolute inset-0 bg-white border border-slate-200 rounded-xl shadow-md flex items-center justify-center backface-hidden"
            style={{ transform: 'rotateY(90deg) translateZ(40px)' }}
          >
            {renderFacePips(3)}
          </div>

          {/* Face 4: Left */}
          <div
            className="absolute inset-0 bg-white border border-slate-200 rounded-xl shadow-md flex items-center justify-center backface-hidden"
            style={{ transform: 'rotateY(-90deg) translateZ(40px)' }}
          >
            {renderFacePips(4)}
          </div>
        </div>
      </div>

      {/* Button & Notification */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={onRoll}
          disabled={disabled || isRolling}
          className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap shadow-sm active:translate-y-0.5 ${
            disabled || isRolling
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : `${colorStyles[activeColor].button} cursor-pointer`
          }`}
        >
          {isRolling ? 'Rolling...' : value ? `Rolled: ${value}` : 'Roll Dice'}
        </button>

        {bonusRollMessage && (
          <span className="text-xs font-semibold text-emerald-600 animate-bounce">
            {bonusRollMessage}
          </span>
        )}
      </div>
    </div>
  );
};

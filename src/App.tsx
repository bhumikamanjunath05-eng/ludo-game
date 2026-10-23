/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  BookOpen,
  Settings,
  Trophy,
  FastForward,
  Play,
  HelpCircle,
  Users,
  Zap,
} from 'lucide-react';
import { GameLogEntry, GameStatus, Player, PlayerColor } from './types/ludo';
import { getAdvantageAtTrackIndex, getGlobalTrackIndex, isTokenOnSafeSquare } from './utils/ludoCoordinates';
import { soundManager } from './utils/audio';
import { Board } from './components/Board';
import { Dice } from './components/Dice';
import { PlayerCard } from './components/PlayerCard';
import { GameLog } from './components/GameLog';
import { RulesModal } from './components/RulesModal';
import { SetupModal } from './components/SetupModal';
import { VictoryModal } from './components/VictoryModal';

const DEFAULT_PLAYERS: Player[] = [
  {
    id: 'p1',
    color: 'red',
    name: 'Player 1',
    isBot: false,
    tokens: [
      { id: 0, step: -1 },
      { id: 1, step: -1 },
      { id: 2, step: -1 },
      { id: 3, step: -1 },
    ],
    rank: null,
    stats: { captures: 0, sixesRolled: 0, tokensHome: 0 },
  },
  {
    id: 'p2',
    color: 'green',
    name: 'Player 2',
    isBot: false,
    tokens: [
      { id: 0, step: -1 },
      { id: 1, step: -1 },
      { id: 2, step: -1 },
      { id: 3, step: -1 },
    ],
    rank: null,
    stats: { captures: 0, sixesRolled: 0, tokensHome: 0 },
  },
  {
    id: 'p3',
    color: 'yellow',
    name: 'Player 3',
    isBot: false,
    tokens: [
      { id: 0, step: -1 },
      { id: 1, step: -1 },
      { id: 2, step: -1 },
      { id: 3, step: -1 },
    ],
    rank: null,
    stats: { captures: 0, sixesRolled: 0, tokensHome: 0 },
  },
  {
    id: 'p4',
    color: 'blue',
    name: 'Player 4',
    isBot: false,
    tokens: [
      { id: 0, step: -1 },
      { id: 1, step: -1 },
      { id: 2, step: -1 },
      { id: 3, step: -1 },
    ],
    rank: null,
    stats: { captures: 0, sixesRolled: 0, tokensHome: 0 },
  },
];

export default function App() {
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [hasRolled, setHasRolled] = useState<boolean>(false);
  const [consecutiveSixes, setConsecutiveSixes] = useState<number>(0);
  const [bonusRollMessage, setBonusRollMessage] = useState<string | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [middleAdvantagesEnabled, setMiddleAdvantagesEnabled] = useState<boolean>(true);
  const [advantageBanner, setAdvantageBanner] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('PLAYING');
  const [winnerRankings, setWinnerRankings] = useState<Player[]>([]);
  const [logs, setLogs] = useState<GameLogEntry[]>([
    {
      id: 'log_start',
      text: 'Game ready! Player 1 (Red) to roll.',
      color: 'red',
      type: 'turn',
      timestamp: Date.now(),
    },
  ]);

  // Modals
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);

  const addLog = useCallback(
    (text: string, color: PlayerColor, type: GameLogEntry['type']) => {
      setLogs((prev) => [
        ...prev.slice(-40),
        {
          id: `log_${Date.now()}_${Math.random()}`,
          text,
          color,
          type,
          timestamp: Date.now(),
        },
      ]);
    },
    []
  );

  // Compute legal moves for the active player with current diceValue
  const activePlayer = players[currentTurn];
  const validTokenIds = React.useMemo(() => {
    if (!hasRolled || diceValue === null || isRolling) return [];
    if (activePlayer.rank !== null) return [];

    const valids: number[] = [];
    activePlayer.tokens.forEach((token) => {
      // Token in base: requires rolling 6
      if (token.step === -1) {
        if (diceValue === 6) valids.push(token.id);
      }
      // Token on track: can move if target step <= 56
      else if (token.step >= 0 && token.step < 56) {
        if (token.step + diceValue <= 56) {
          valids.push(token.id);
        }
      }
    });

    return valids;
  }, [hasRolled, diceValue, isRolling, activePlayer]);

  // Turn Advancement Helper
  const advanceTurn = useCallback(
    (nextPlayersList: Player[]) => {
      setDiceValue(null);
      setHasRolled(false);
      setBonusRollMessage(null);
      setAdvantageBanner(null);

      // Find next player who has not finished yet
      let nextTurn = (currentTurn + 1) % 4;
      let checkCount = 0;
      while (nextPlayersList[nextTurn].rank !== null && checkCount < 4) {
        nextTurn = (nextTurn + 1) % 4;
        checkCount++;
      }

      // Check if all players or 3 players finished
      const unfinishedPlayers = nextPlayersList.filter((p) => p.rank === null);
      if (unfinishedPlayers.length <= 1) {
        setGameStatus('FINISHED');
        setIsVictoryOpen(true);
        return;
      }

      setCurrentTurn(nextTurn);
      setConsecutiveSixes(0);
      addLog(
        `${nextPlayersList[nextTurn].name}'s turn.`,
        nextPlayersList[nextTurn].color,
        'turn'
      );
    },
    [currentTurn, addLog]
  );

  // Handle Token Move
  const handleMoveToken = useCallback(
    (tokenId: number) => {
      if (diceValue === null || !validTokenIds.includes(tokenId)) return;

      const player = players[currentTurn];
      const token = player.tokens[tokenId];
      let newStep: number;

      if (token.step === -1) {
        newStep = 0; // Out of base onto start square
      } else {
        newStep = token.step + diceValue;
      }

      soundManager.playTokenHop();

      let isShield = Boolean(token.isShielded);
      let advantageBonusRoll = false;
      let triggeredAdvantageText: string | null = null;

      // 1. Middle Crossroads Advantages Activation
      if (middleAdvantagesEnabled && newStep >= 0 && newStep <= 50) {
        const destGlobalIdx = getGlobalTrackIndex(player.color, newStep);
        if (destGlobalIdx !== null) {
          const adv = getAdvantageAtTrackIndex(destGlobalIdx);
          if (adv) {
            soundManager.playAdvantage();
            if (adv.type === 'boost') {
              newStep = Math.min(56, newStep + 3);
              triggeredAdvantageText = '⚡ Turbo Boost! +3 Extra Steps!';
              addLog(
                `${player.name} activated ⚡ Turbo Boost (+3 extra steps)!`,
                player.color,
                'advantage'
              );
            } else if (adv.type === 'reroll') {
              advantageBonusRoll = true;
              triggeredAdvantageText = '🎲 Lucky Roll! Extra Turn Granted!';
              addLog(
                `${player.name} landed on 🎲 Lucky Roll! Extra dice roll granted!`,
                player.color,
                'advantage'
              );
            } else if (adv.type === 'shield') {
              isShield = true;
              triggeredAdvantageText = '🛡️ Energy Shield Activated!';
              addLog(
                `${player.name}'s token activated 🛡️ Energy Shield immunity!`,
                player.color,
                'advantage'
              );
            } else if (adv.type === 'leap') {
              newStep = Math.min(56, newStep + 4);
              triggeredAdvantageText = '🌟 Super Leap! Warped +4 Squares!';
              addLog(
                `${player.name} triggered 🌟 Super Leap (+4 squares across crossroads)!`,
                player.color,
                'advantage'
              );
            }
          }
        }
      }

      let isCapture = false;
      let isHome = false;
      const updatedPlayers = players.map((p, pIdx) => {
        if (pIdx === currentTurn) {
          const updatedTokens = p.tokens.map((t) =>
            t.id === tokenId ? { ...t, step: newStep, isShielded: isShield } : t
          );

          const updatedStats = { ...p.stats };
          if (newStep === 56) {
            isHome = true;
            updatedStats.tokensHome += 1;
          }

          return { ...p, tokens: updatedTokens, stats: updatedStats };
        }
        return p;
      });

      // 2. Capturing & Shield Deflection logic on track
      if (newStep <= 50 && !isTokenOnSafeSquare(player.color, newStep)) {
        const finalGlobalIdx = getGlobalTrackIndex(player.color, newStep);
        if (finalGlobalIdx !== null) {
          updatedPlayers.forEach((opp, oppIdx) => {
            if (oppIdx === currentTurn) return;
            let modifiedOpp = false;
            const updatedOppTokens = opp.tokens.map((oppToken) => {
              if (oppToken.step >= 0 && oppToken.step <= 50) {
                const oppGlobalIdx = getGlobalTrackIndex(opp.color, oppToken.step);
                if (oppGlobalIdx === finalGlobalIdx) {
                  // Energy Shield absorbs and deflects the attack
                  if (oppToken.isShielded) {
                    soundManager.playShieldDeflect();
                    addLog(
                      `🛡️ ${opp.name}'s Energy Shield deflected ${player.name}'s attack!`,
                      opp.color,
                      'advantage'
                    );
                    triggeredAdvantageText = `🛡️ ${opp.name}'s Shield deflected the attack!`;
                    modifiedOpp = true;
                    return { ...oppToken, isShielded: false };
                  } else {
                    isCapture = true;
                    soundManager.playCapture();
                    addLog(
                      `${player.name} captured ${opp.name}'s token!`,
                      player.color,
                      'capture'
                    );
                    modifiedOpp = true;
                    return { ...oppToken, step: -1, isShielded: false };
                  }
                }
              }
              return oppToken;
            });

            if (modifiedOpp) {
              updatedPlayers[oppIdx] = { ...opp, tokens: updatedOppTokens };
            }
          });

          if (isCapture) {
            updatedPlayers[currentTurn].stats.captures += 1;
          }
        }
      }

      if (isHome) {
        soundManager.playHome();
        addLog(`${player.name}'s token reached Home!`, player.color, 'home');
      }

      if (triggeredAdvantageText) {
        setAdvantageBanner(triggeredAdvantageText);
      }

      // 3. Check if player just finished all 4 tokens
      let playerFinishedNow = false;
      const allTokensHome = updatedPlayers[currentTurn].tokens.every(
        (t) => t.step === 56
      );
      if (allTokensHome && updatedPlayers[currentTurn].rank === null) {
        playerFinishedNow = true;
        const currentRank =
          updatedPlayers.filter((p) => p.rank !== null).length + 1;
        updatedPlayers[currentTurn].rank = currentRank;
        setWinnerRankings((prev) => [...prev, updatedPlayers[currentTurn]]);

        addLog(
          `${player.name} finished in #${currentRank} Place!`,
          player.color,
          'win'
        );

        if (currentRank === 1) {
          setIsVictoryOpen(true);
        }
      }

      setPlayers(updatedPlayers);

      // 4. Determine Bonus Roll:
      // A bonus roll is awarded if:
      // - Rolled a 6
      // - Captured an opponent
      // - Brought a token Home
      // - Triggered Lucky Roll Middle Advantage
      const getsBonusRoll =
        !playerFinishedNow &&
        (diceValue === 6 || isCapture || isHome || advantageBonusRoll);

      if (getsBonusRoll) {
        const bonusReason = advantageBonusRoll
          ? 'Lucky Roll Bonus!'
          : isCapture
          ? 'Capture Bonus Roll!'
          : isHome
          ? 'Home Run Bonus Roll!'
          : 'Rolled 6 Bonus Roll!';
        setBonusRollMessage(bonusReason);
        setDiceValue(null);
        setHasRolled(false);
        addLog(`${player.name} earned an extra roll!`, player.color, 'bonus');
      } else {
        advanceTurn(updatedPlayers);
      }
    },
    [
      diceValue,
      validTokenIds,
      players,
      currentTurn,
      advanceTurn,
      addLog,
      middleAdvantagesEnabled,
    ]
  );

  // Handle Dice Roll
  const handleRollDice = useCallback(() => {
    if (isRolling || hasRolled || activePlayer.rank !== null) return;

    setIsRolling(true);
    soundManager.playDiceRoll();

    const rollDuration = Math.max(300, 500 / speedMultiplier);

    setTimeout(() => {
      const rolled = Math.floor(Math.random() * 6) + 1;
      setDiceValue(rolled);
      setIsRolling(false);
      setHasRolled(true);
      soundManager.playDiceStop();

      // Check 6 count
      if (rolled === 6) {
        soundManager.playSix();
        const nextSixes = consecutiveSixes + 1;
        setConsecutiveSixes(nextSixes);

        // Three sixes rule
        if (nextSixes === 3) {
          addLog(
            `${activePlayer.name} rolled three 6s in a row! Turn forfeited.`,
            activePlayer.color,
            'six'
          );
          setTimeout(() => advanceTurn(players), 800 / speedMultiplier);
          return;
        } else {
          addLog(
            `${activePlayer.name} rolled a 6!`,
            activePlayer.color,
            'six'
          );
        }
      } else {
        setConsecutiveSixes(0);
        addLog(
          `${activePlayer.name} rolled a ${rolled}.`,
          activePlayer.color,
          'roll'
        );
      }

      // Check legal moves
      const available: number[] = [];
      activePlayer.tokens.forEach((token) => {
        if (token.step === -1 && rolled === 6) available.push(token.id);
        else if (token.step >= 0 && token.step < 56 && token.step + rolled <= 56) {
          available.push(token.id);
        }
      });

      // No valid moves: pass turn after brief moment
      if (available.length === 0) {
        addLog(
          `No valid moves for ${activePlayer.name}.`,
          activePlayer.color,
          'turn'
        );
        setTimeout(() => {
          advanceTurn(players);
        }, 800 / speedMultiplier);
      }
    }, rollDuration);
  }, [
    isRolling,
    hasRolled,
    activePlayer,
    consecutiveSixes,
    speedMultiplier,
    players,
    advanceTurn,
    addLog,
  ]);

  // Keyboard shortcut: Spacebar to roll for the active user
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        if (!hasRolled && !isRolling && activePlayer.rank === null) {
          e.preventDefault();
          handleRollDice();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePlayer, hasRolled, isRolling, handleRollDice]);

  // Restart match with configured player roster
  const handleStartGame = (
    configuredRoster: { name: string; isBot: boolean; color: PlayerColor }[]
  ) => {
    const newPlayers: Player[] = configuredRoster.map((c, i) => ({
      id: `p_${c.color}_${i}`,
      color: c.color,
      name: c.name || `Player ${i + 1}`,
      isBot: false,
      tokens: [
        { id: 0, step: -1 },
        { id: 1, step: -1 },
        { id: 2, step: -1 },
        { id: 3, step: -1 },
      ],
      rank: null,
      stats: { captures: 0, sixesRolled: 0, tokensHome: 0 },
    }));

    setPlayers(newPlayers);
    setCurrentTurn(0);
    setDiceValue(null);
    setIsRolling(false);
    setHasRolled(false);
    setConsecutiveSixes(0);
    setBonusRollMessage(null);
    setGameStatus('PLAYING');
    setWinnerRankings([]);
    setLogs([
      {
        id: `start_${Date.now()}`,
        text: `Match started! ${newPlayers[0].name} (Red) to roll first.`,
        color: 'red',
        type: 'turn',
        timestamp: Date.now(),
      },
    ]);
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* Top Bar Contract (Single-row, 3-zone layout) */}
      <header className="flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <div className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-sm">
            4P
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            Ludo Grand Arena
          </span>
        </div>

        {/* Zone 2: Single-line clean nav actions */}
        <nav className="flex items-center gap-4 sm:gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => setIsRulesOpen(true)}
            className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <HelpCircle size={14} />
            <span>Rules</span>
          </button>
          <button
            onClick={() => setIsSetupOpen(true)}
            className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Settings size={14} />
            <span>Roster</span>
          </button>
          <button
            onClick={toggleSound}
            className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound'}</span>
          </button>
          <button
            onClick={() => setMiddleAdvantagesEnabled((prev) => !prev)}
            className={`hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
              middleAdvantagesEnabled ? 'text-amber-400 font-semibold' : 'text-slate-400'
            }`}
            title="Toggle middle board advantage tiles"
          >
            <Zap size={14} className={middleAdvantagesEnabled ? 'text-amber-400 fill-amber-400' : ''} />
            <span>Middle Perks: {middleAdvantagesEnabled ? 'ON' : 'OFF'}</span>
          </button>
          <button
            onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 2 : 1))}
            className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            title="Toggle game pace"
          >
            <FastForward size={14} className={speedMultiplier === 2 ? 'text-amber-400' : ''} />
            <span>{speedMultiplier}x Speed</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsSetupOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>New Match</span>
          </button>
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Player Cards 1 (Red) and 4 (Blue) */}
        <div className="lg:col-span-3 flex flex-col gap-3 order-2 lg:order-1">
          <PlayerCard
            player={players[0]}
            playerIndex={0}
            isCurrentTurn={currentTurn === 0}
            validTokenIds={currentTurn === 0 ? validTokenIds : []}
            onTokenClick={handleMoveToken}
            isRolling={isRolling}
          />
          <PlayerCard
            player={players[3]}
            playerIndex={3}
            isCurrentTurn={currentTurn === 3}
            validTokenIds={currentTurn === 3 ? validTokenIds : []}
            onTokenClick={handleMoveToken}
            isRolling={isRolling}
          />

          {/* Controls Bar for Mobile / Tablet */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Game Status</span>
              <span className="text-emerald-400 font-medium capitalize">
                {gameStatus === 'PLAYING' ? 'Active Match' : 'Finished'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Current Turn</span>
              <span className="font-semibold text-white">
                {activePlayer.name} ({activePlayer.color})
              </span>
            </div>
          </div>
        </div>

        {/* Center Column: The 15x15 Ludo Board & Interactive Dice */}
        <div className="lg:col-span-6 flex flex-col items-center gap-4 order-1 lg:order-2">
          {/* Ludo Board */}
          <Board
            players={players}
            currentTurn={currentTurn}
            validTokenIds={validTokenIds}
            onTokenClick={(pIdx, tId) => {
              if (pIdx === currentTurn) {
                handleMoveToken(tId);
              }
            }}
            isRolling={isRolling}
            showAdvantages={middleAdvantagesEnabled}
          />

          {/* Central Turn Action Arena */}
          <div className="w-full max-w-[560px] bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            {/* Active Player Prompt & Advantage Notifications */}
            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3.5 h-3.5 rounded-full ring-4 shrink-0 ${
                    activePlayer.color === 'red'
                      ? 'bg-red-500 ring-red-500/20'
                      : activePlayer.color === 'green'
                      ? 'bg-emerald-500 ring-emerald-500/20'
                      : activePlayer.color === 'yellow'
                      ? 'bg-amber-400 ring-amber-400/20'
                      : 'bg-blue-500 ring-blue-500/20'
                  }`}
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 truncate">
                    <span>{activePlayer.name}</span>
                    <span className="text-xs font-normal text-slate-400">
                      (Click Dice or Press Space)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isRolling
                      ? 'Rolling dice...'
                      : hasRolled && validTokenIds.length > 0
                      ? `Select a highlighted token to move ${diceValue} square${diceValue === 1 ? '' : 's'}`
                      : hasRolled && validTokenIds.length === 0
                      ? 'No valid moves available this roll'
                      : 'Roll the dice to make your move'}
                  </p>
                </div>
              </div>

              {/* Middle Advantage Alert Banner */}
              {advantageBanner && (
                <div className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-950/80 via-purple-950/80 to-pink-950/80 border border-purple-500/50 text-xs font-bold text-amber-300 animate-pulse flex items-center gap-1.5 shadow-sm">
                  <Zap size={13} className="text-amber-400 fill-amber-400 shrink-0" />
                  <span>{advantageBanner}</span>
                </div>
              )}
            </div>

            {/* 3D Dice */}
            <Dice
              value={diceValue}
              isRolling={isRolling}
              disabled={
                hasRolled ||
                isRolling ||
                activePlayer.rank !== null
              }
              activeColor={activePlayer.color}
              onRoll={handleRollDice}
              bonusRollMessage={bonusRollMessage}
            />
          </div>

          {/* Middle Crossroads Perks Quick Legend */}
          {middleAdvantagesEnabled && (
            <div className="w-full max-w-[560px] px-3 py-2 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
              <span className="font-bold text-slate-300 text-xs">Middle Perks:</span>
              <span className="flex items-center gap-1">
                <span>⚡</span>
                <span className="text-cyan-400">Turbo (+3)</span>
              </span>
              <span className="flex items-center gap-1">
                <span>🎲</span>
                <span className="text-amber-400">Lucky Roll</span>
              </span>
              <span className="flex items-center gap-1">
                <span>🛡️</span>
                <span className="text-purple-400">Shield</span>
              </span>
              <span className="flex items-center gap-1">
                <span>🌟</span>
                <span className="text-pink-400">Leap (+4)</span>
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Player Cards 2 (Green) and 3 (Yellow) + Match Log */}
        <div className="lg:col-span-3 flex flex-col gap-3 order-3">
          <PlayerCard
            player={players[1]}
            playerIndex={1}
            isCurrentTurn={currentTurn === 1}
            validTokenIds={currentTurn === 1 ? validTokenIds : []}
            onTokenClick={handleMoveToken}
            isRolling={isRolling}
          />
          <PlayerCard
            player={players[2]}
            playerIndex={2}
            isCurrentTurn={currentTurn === 2}
            validTokenIds={currentTurn === 2 ? validTokenIds : []}
            onTokenClick={handleMoveToken}
            isRolling={isRolling}
          />

          {/* Live Game Log */}
          <div className="flex-1 min-h-[160px]">
            <GameLog logs={logs} />
          </div>
        </div>
      </main>

      {/* Modals */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <SetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onStartGame={handleStartGame}
        currentPlayers={players}
      />
      <VictoryModal
        isOpen={isVictoryOpen}
        winnerRankings={winnerRankings}
        allPlayers={players}
        onPlayAgain={() => {
          setIsVictoryOpen(false);
          handleStartGame(
            players.map((p) => ({
              name: p.name,
              isBot: p.isBot,
              color: p.color,
            }))
          );
        }}
        onClose={() => setIsVictoryOpen(false)}
      />
    </div>
  );
}

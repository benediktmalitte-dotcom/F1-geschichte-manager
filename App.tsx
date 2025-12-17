
import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { 
  Team, Driver, GameStage, NewsItem, Weather, RaceResult, Supplier, Staff, Sponsor, Factory 
} from './types';
import { 
  FREE_AGENTS, getInitialTeams, TRACKS, TRACK_CONFIGS, 
  SEASON_PACE_MODIFIERS, TESTING_COST, ENGINE_SUPPLIERS, TYRE_SUPPLIERS, 
  FUEL_SUPPLIERS, AVAILABLE_STAFF, MARKET_EVOLUTION,
  HISTORICAL_SEASON_DATA
} from './constants';
import * as GameLogic from './services/gameLogic';
import { Button } from './components/Button';

const formatMoney = (amount: number) => {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} Mio. €`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)} Tsd. €`;
    return `${amount} €`;
};

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds * 1000) % 1000);
    return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
};

const Header = ({ title, subTitle, teamName, budget }: { title: string, subTitle?: string, teamName: string, budget: number }) => (
  <header className="bg-black border-b-2 border-[#e10600] p-4 shadow-lg sticky top-0 z-10 w-full">
    <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
      <div className="min-w-0">
        <h1 className="text-sm md:text-xl font-black text-white tracking-tight truncate">{title}</h1>
        {subTitle && <div className="text-[10px] md:text-xs text-[#e10600] font-bold mt-1 truncate">{subTitle}</div>}
      </div>
      <div className="flex flex-col items-end text-right shrink-0">
        <div className="bg-[#222] px-2 py-1 rounded-sm text-[10px] md:text-xs text-gray-300 border border-[#333] mb-1 max-w-[150px] truncate">
          TEAM: <span className="font-bold text-white uppercase">{teamName}</span>
        </div>
        <div className={`bg-black px-2 py-1 rounded-sm text-[10px] md:text-xs border font-mono ${budget >= 0 ? 'text-white border-white' : 'text-red-500 border-red-500'}`}>
           KONTO: {formatMoney(budget)}
        </div>
      </div>
    </div>
  </header>
);

const Modal = ({ message, onClose }: { message: string, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-[#1a1a1a] border-t-4 border-[#e10600] p-6 max-w-md w-full relative shadow-2xl">
            <h3 className="text-xl font-black text-white mb-4 border-b border-[#333] pb-2">HINWEIS</h3>
            <div className="text-gray-300 mb-8 font-mono text-sm leading-relaxed">
                {message}
            </div>
            <div className="flex justify-end">
                <Button onClick={onClose} variant="primary" className="w-full sm:w-auto">VERSTANDEN</Button>
            </div>
        </div>
    </div>
);

const MoraleBar = ({ morale }: { morale: number }) => {
  let color = "bg-red-600";
  if (morale >= 90) color = "bg-green-500";
  else if (morale >= 70) color = "bg-green-700";
  else if (morale >= 50) color = "bg-yellow-600";

  return (
    <div className="w-full bg-[#111] h-1.5 overflow-hidden border border-[#333]" title={`Moral: ${morale}`}>
      <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${Math.min(100, Math.max(0, morale))}%` }}></div>
    </div>
  );
};

// Fix: Define the missing SessionLayoutProps interface
interface SessionLayoutProps {
    title: string;
    subTitle?: string;
    children: React.ReactNode;
    showNext?: boolean;
    nextLabel?: string;
    onNext?: () => void;
    teamName: string;
    budget: number;
}

const SessionLayout: React.FC<SessionLayoutProps> = ({ title, subTitle, children, showNext = false, nextLabel = "NÄCHSTE PHASE", onNext, teamName, budget }) => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
            <Header title={title} subTitle={subTitle} teamName={teamName} budget={budget} />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto flex flex-col">
                <div className="flex-1 bg-[#151515] border border-[#222] p-4 md:p-6 overflow-hidden flex flex-col shadow-inner">
                    <div className="overflow-x-auto custom-scrollbar">
                        {children}
                    </div>
                </div>
                {showNext && (
                    <div className="mt-6 flex justify-end">
                        <Button onClick={onNext} className="w-full md:w-auto text-lg py-3">{nextLabel}</Button>
                    </div>
                )}
            </main>
        </div>
    );
};

const generateSessionResults = (currentTeams: Team[], sessionType: 'Practice' | 'Qualifying', year: number, rIndex: number) => {
       const currentTrackConfig = TRACK_CONFIGS[rIndex] || { name: 'Unbekannt', baseTime: 92 };
       let baseLapTime = currentTrackConfig.baseTime;
       const seasonMod = SEASON_PACE_MODIFIERS[year] || 0;
       
       const results: RaceResult[] = currentTeams.flatMap(t => t.drivers).map(d => {
            const team = currentTeams.find(tm => tm.id === d.teamName || tm.name === d.teamName) || currentTeams[0];
            const carPerf = GameLogic.getCarPerformance(team);
            const basePace = GameLogic.calculateRawPace(d, carPerf); 
            const performanceImpact = basePace * 0.02;
            const time = (baseLapTime + seasonMod) - performanceImpact + (Math.random() * 1.5 - 0.75);
            return {
                driver: d, score: basePace, timeGap: formatTime(time), position: 0, pointsEarned: 0, earnedMoney: 0
            };
       });
       results.sort((a, b) => b.score - a.score);
       results.forEach((r, i) => r.position = i + 1);
       return results;
  };

const App: React.FC = () => {
  const [stage, setStage] = useState<GameStage>(GameStage.PlayerInput);
  const [currentYear, setCurrentYear] = useState<number>(1996);
  const [playerName, setPlayerName] = useState<string>('');
  
  const [teams, setTeams] = useState<Team[]>(() => {
      const init = getInitialTeams();
      return init.filter((t, index, self) => index === self.findIndex((t2) => t2.id === t.id));
  });

  const [marketDrivers, setMarketDrivers] = useState<Driver[]>(FREE_AGENTS);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [playerTeamId, setPlayerTeamId] = useState<string | null>(null);
  const [raceIndex, setRaceIndex] = useState(0);
  const [weather, setWeather] = useState<Weather>(Weather.Dry);
  const [sessionResults, setSessionResults] = useState<RaceResult[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [lastRaceFinances, setLastRaceFinances] = useState({ prize: 0, sponsors: 0, bonus: 0, upkeep: 0 });

  // Fix: Implement the missing saveGame function
  const saveGame = () => {
    const gameState = {
        currentYear,
        playerName,
        teams,
        marketDrivers,
        news,
        playerTeamId,
        raceIndex,
    };
    try {
        localStorage.setItem('f1_manager_save', JSON.stringify(gameState));
        setNotification("Ihr Spielstand wurde erfolgreich gespeichert.");
    } catch (e) {
        setNotification("Fehler beim Speichern des Spielstands.");
    }
  };

  const [isPending, startTransition] = useTransition();
  const [raceTarget, setRaceTarget] = useState(12);
  const playerTeam = teams.find(t => t.id === playerTeamId);
  const currentTrack = TRACKS[raceIndex] || "Unbekannt";

  const handleStartGame = () => {
    if (playerName.trim().length > 0) {
      startTransition(() => setStage(GameStage.TeamSelection));
    }
  };

  const handleSelectTeam = (id: string) => {
    setPlayerTeamId(id);
    const newTarget = GameLogic.calculateTeamTarget(teams, id);
    setRaceTarget(newTarget);
    setStage(GameStage.MainMenu);
  };

  const runRace = useCallback(() => {
    if (!playerTeamId) return;
    const finalResults = generateSessionResults(teams, 'Qualifying', currentYear, raceIndex);
    setSessionResults(finalResults as any);
    setStage(GameStage.RaceResults);
  }, [teams, playerTeamId, currentYear, raceIndex]);

  useEffect(() => {
      if (stage === GameStage.Race) {
          const timer = setTimeout(() => runRace(), 1500);
          return () => clearTimeout(timer);
      }
  }, [stage, runRace]);

  if (stage === GameStage.PlayerInput) {
    return (
      <div className="min-h-screen bg-black p-8 flex flex-col items-center justify-center relative">
        {notification && <Modal message={notification} onClose={() => setNotification(null)} />}
        <div className="z-10 text-center max-w-lg w-full">
          <div className="mb-4 inline-block bg-[#e10600] px-3 py-1 text-white text-[10px] font-black tracking-widest uppercase">Offizieller Manager</div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter italic border-b-8 border-[#e10600] pb-2">
            FORMEL1-<span className="text-[#e10600]">GESCHICHTE</span>.DE
          </h1>
          <p className="text-gray-400 mb-12 tracking-widest uppercase text-xs font-bold">Motorsport Management Simulation</p>
          <div className="bg-[#151515] p-8 rounded-sm border border-[#333] shadow-2xl text-left">
            <h2 className="text-sm font-black text-white mb-6 uppercase tracking-widest">Manager-Profil erstellen</h2>
            <div className="mb-8">
              <label className="block text-gray-500 text-[10px] font-black mb-2 uppercase tracking-widest">Name des Teamchefs</label>
              <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="NAME EINGEBEN..." className="w-full bg-black border border-[#333] text-white text-lg p-4 rounded-sm focus:outline-none focus:border-[#e10600] font-mono transition-all" />
            </div>
            <Button onClick={handleStartGame} disabled={playerName.trim().length === 0} className="w-full py-5 text-xl">KARRIERE STARTEN</Button>
          </div>
          <p className="mt-8 text-[10px] text-gray-600 uppercase tracking-widest">© Formel1-Geschichte.de</p>
        </div>
      </div>
    );
  }

  if (stage === GameStage.TeamSelection) {
    return (
      <div className="min-h-screen bg-black p-4 flex flex-col items-center">
        {notification && <Modal message={notification} onClose={() => setNotification(null)} />}
        <header className="mb-12 text-center">
          <h1 className="text-2xl md:text-4xl font-black text-white mb-2 italic tracking-tighter uppercase">Wähle dein <span className="text-[#e10600]">Rennteam</span></h1>
          <div className="h-1 w-24 bg-[#e10600] mx-auto"></div>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full pb-8">
          {teams.map(team => (
            <button key={team.id} onClick={() => handleSelectTeam(team.id)} className="bg-[#151515] border border-[#222] hover:border-[#e10600] transition-all p-6 rounded-sm text-left group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#e10600] translate-x-8 -translate-y-8 rotate-45 group-hover:bg-white transition-colors"></div>
              <h3 className="text-xl font-black text-white group-hover:text-[#e10600] mb-2 uppercase">{team.name}</h3>
              <div className="flex justify-between text-[10px] font-bold text-gray-500 bg-black p-3 rounded-sm mb-4 border border-[#222]">
                <span>CHASSIS: {team.chassis}</span>
                <span>MOTOR: {team.engine}</span>
              </div>
              <div className="space-y-2 mb-6">
                {team.drivers.map(d => (
                  <div key={d.id} className="text-xs text-gray-400 flex justify-between border-b border-[#222] pb-1 font-mono uppercase">
                    <span>{d.name}</span>
                    <span className="text-white font-bold">{d.skill}</span>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-white font-black bg-[#222] inline-block px-2 py-1 tracking-widest uppercase">Budget: {formatMoney(team.budget)}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (stage === GameStage.MainMenu) {
      return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        {notification && <Modal message={notification} onClose={() => setNotification(null)} />}
        <Header title={`SAISON ${currentYear} | RUNDE ${raceIndex + 1}`} teamName={playerTeam?.name || ''} budget={playerTeam?.budget || 0} />
        <main className="flex-1 p-4 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#151515] p-8 rounded-sm border border-[#222] shadow-xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">{currentTrack.split('(')[0]}</h2>
                  <div className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest">Nächstes Rennwochenende</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Saisonziel</div>
                  <div className="text-xl font-black text-white">Top {raceTarget}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <Button variant="secondary" className="text-xs py-3" onClick={() => setStage(GameStage.DriverMarket)}>Transfermarkt</Button>
                 <Button variant="secondary" className="text-xs py-3" onClick={() => setStage(GameStage.FactoryManagement)}>Entwicklung</Button>
                 <Button variant="primary" className="py-4 text-lg" onClick={() => setStage(GameStage.Race)}>START RENNWOCHENENDE</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#151515] p-6 rounded-sm border border-[#222]">
                  <h3 className="font-black text-xs mb-6 text-[#e10600] uppercase tracking-widest border-l-4 border-[#e10600] pl-3">Eingeschriebene Fahrer</h3>
                  <div className="space-y-4">
                      {playerTeam?.drivers.map(d => (
                          <div key={d.id} className="flex justify-between items-center bg-black p-4 rounded-sm border border-[#222]">
                              <div>
                                <div className="font-black text-sm uppercase tracking-tighter">{d.name}</div>
                                <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">Status: {d.skill >= 90 ? 'Weltklasse' : 'Profi'} | Moral: {d.morale}%</div>
                                <div className="mt-2 w-24"><MoraleBar morale={d.morale} /></div>
                              </div>
                              <div className="text-right">
                                <div className="text-[10px] text-gray-500 font-bold uppercase">Vertrag</div>
                                <div className="text-sm font-black text-white">{d.contractRemaining}J</div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
              <div className="bg-[#151515] p-6 rounded-sm border border-[#222]">
                  <h3 className="font-black text-xs mb-6 text-[#e10600] uppercase tracking-widest border-l-4 border-[#e10600] pl-3">Fahrzeug-Setup</h3>
                  <div className="space-y-2 font-mono text-xs uppercase">
                    <div className="flex justify-between p-2 bg-black border border-[#222]"><span>Antrieb</span><span className="font-bold">{playerTeam?.engine}</span></div>
                    <div className="flex justify-between p-2 bg-black border border-[#222]"><span>Aero</span><span className="font-bold">{playerTeam?.aero}</span></div>
                    <div className="flex justify-between p-2 bg-black border border-[#222]"><span>Chassis</span><span className="font-bold">{playerTeam?.chassis}</span></div>
                    <div className="flex justify-between p-2 bg-[#222] border border-[#333] mt-4 font-bold text-white"><span>Gesamt</span><span>{GameLogic.getCarPerformance(playerTeam!).toFixed(1)}</span></div>
                  </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#111] border border-[#222] flex flex-col h-[500px] lg:h-auto">
            <div className="p-4 bg-black border-b border-[#e10600] flex justify-between items-center">
              <h2 className="text-xs font-black uppercase tracking-widest">News & Medien</h2>
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[11px] font-mono scrollbar-hide">
                <div className="text-gray-500 italic border-l-2 border-[#333] pl-2 uppercase">Warten auf Rennbericht...</div>
                {news.map(n => (
                  <div key={n.id} className="border-l-2 border-[#e10600] pl-2 py-1 bg-[#1a1a1a]">
                    <div className="text-[9px] text-[#e10600] font-bold uppercase">Runde {n.round}</div>
                    <div className="text-white">{n.message}</div>
                  </div>
                ))}
            </div>
            <div className="p-3 bg-black border-t border-[#222]">
              <Button variant="secondary" className="w-full text-[9px] py-2" onClick={saveGame}>SPIELSTAND SICHERN</Button>
            </div>
          </div>
        </main>
      </div>
      );
  }

  return (
    <SessionLayout title={stage.replace(/_/g, ' ')} teamName={playerTeam?.name || ''} budget={playerTeam?.budget || 0}>
        {notification && <Modal message={notification} onClose={() => setNotification(null)} />}
        <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-16 h-16 border-t-4 border-[#e10600] border-solid rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Daten werden berechnet...</h2>
            <p className="text-gray-500 uppercase text-[10px] tracking-widest mb-8">Simulation läuft</p>
            <Button variant="secondary" onClick={() => setStage(GameStage.MainMenu)}>MANUELLER ABBRUCH</Button>
        </div>
    </SessionLayout>
  );
};

export default App;

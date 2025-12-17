
import React, { useState, useEffect, useCallback, useTransition, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

// --- 1. TYPES ---
type GameStage = 'PLAYER_INPUT' | 'TEAM_SELECTION' | 'MAIN_MENU' | 'RACE' | 'RACE_RESULTS' | 'DRIVER_MARKET' | 'FACTORY_MANAGEMENT';
type Weather = 'Dry' | 'Rain';

interface Driver {
  id: string;
  name: string;
  skill: number;
  morale: number;
  teamName: string;
  contractRemaining: number;
  cost: number;
  salary: number;
}

interface Team {
  id: string;
  name: string;
  chassis: number;
  engine: number;
  aero: number;
  tyres: number;
  fuel: number;
  budget: number;
  drivers: Driver[];
}

interface RaceResult {
  driver: Driver;
  position: number;
  timeGap: string;
  pointsEarned: number;
}

// --- 2. CONSTANTS & DATA ---
const F1_RED = "#e10600";
const TRACKS = ["Melbourne Kurs", "Amazonas Speed", "Rhein-Ring", "Apennin Kurs", "Azur Küste", "Iberia Ring", "Maple Leaf", "Loire Speed", "Silverstone Steile", "Schwarzwald GP", "Hungaro Ring", "Ardennen Steile", "Monza Park", "Atlantic Bend", "Suzuka Ring"];

const createDriver = (id: string, name: string, skill: number, team: string): Driver => ({
  id, name, skill, morale: 85, teamName: team, contractRemaining: 2, cost: skill * 50000, salary: skill * 100000
});

const INITIAL_TEAMS: Team[] = [
  { id: "vanguard", name: "Vanguard Racing", chassis: 95, engine: 98, aero: 94, tyres: 95, fuel: 95, budget: 65000000, drivers: [createDriver("v1", "Jack Village", 92, "Vanguard Racing"), createDriver("v2", "Hans Frontier", 85, "Vanguard Racing")] },
  { id: "magnifica", name: "Scuderia Magnifica", chassis: 92, engine: 96, aero: 90, tyres: 95, fuel: 95, budget: 75000000, drivers: [createDriver("m1", "Mikael Steiner", 99, "Scuderia Magnifica"), createDriver("m2", "Ed Iron", 82, "Scuderia Magnifica")] },
  { id: "apex", name: "Apex Motorsport", chassis: 88, engine: 94, aero: 89, tyres: 95, fuel: 95, budget: 55000000, drivers: [createDriver("a1", "Mikko Haki", 89, "Apex Motorsport"), createDriver("a2", "Dan Coldheart", 86, "Apex Motorsport")] },
  { id: "hornet", name: "Hornet GP", chassis: 80, engine: 85, aero: 78, tyres: 95, fuel: 90, budget: 28000000, drivers: [createDriver("h1", "Ruben Bar", 84, "Hornet GP"), createDriver("h2", "Martin Brund", 81, "Hornet GP")] }
];

const FREE_AGENTS: Driver[] = [
  createDriver("fa1", "Ray Storm", 88, "Free Agent"),
  createDriver("fa2", "Lance Archer", 91, "Free Agent"),
  createDriver("fa3", "Victor Valiant", 76, "Free Agent")
];

// --- 3. UTILS & LOGIC ---
const formatMoney = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)} Mio. €`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)} Tsd. €`;
    return `${amount} €`;
};

const getCarPerformance = (team: Team) => (team.chassis + team.engine + team.aero + team.tyres + team.fuel) / 5;

// --- 4. COMPONENTS ---
const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const base = "px-6 py-2 font-black uppercase tracking-widest transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-[2px] rounded-sm text-sm";
  const styles: any = {
    primary: "bg-[#e10600] border-[#b00500] text-white hover:bg-[#ff0700]",
    secondary: "bg-[#222] border-[#000] text-gray-300 hover:bg-[#333]"
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props}>{children}</button>;
};

const Header = ({ title, teamName, budget }: any) => (
  <header className="bg-black border-b-2 border-[#e10600] p-4 sticky top-0 z-50">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <div>
        <h1 className="text-lg font-black italic tracking-tighter text-white uppercase">{title}</h1>
      </div>
      <div className="flex gap-4 items-center">
        <div className="hidden sm:block text-[10px] font-bold text-gray-500 uppercase">Team: <span className="text-white">{teamName}</span></div>
        <div className="bg-[#111] border border-[#333] px-3 py-1 font-mono text-xs text-[#e10600]">{formatMoney(budget)}</div>
      </div>
    </div>
  </header>
);

const Modal = ({ message, onClose }: any) => (
  <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
    <div className="bg-[#151515] border-t-4 border-[#e10600] p-8 max-w-md w-full shadow-2xl">
      <h3 className="text-white font-black uppercase mb-4 tracking-widest">Benachrichtigung</h3>
      <p className="text-gray-400 font-mono text-sm mb-8 leading-relaxed">{message}</p>
      <Button onClick={onClose} className="w-full">Verstanden</Button>
    </div>
  </div>
);

// --- 5. MAIN APP ---
const App = () => {
  const [stage, setStage] = useState<GameStage>('PLAYER_INPUT');
  const [playerName, setPlayerName] = useState('');
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [playerTeamId, setPlayerTeamId] = useState<string | null>(null);
  const [raceIndex, setRaceIndex] = useState(0);
  const [results, setResults] = useState<RaceResult[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const playerTeam = teams.find(t => t.id === playerTeamId);

  const runSimulation = useCallback(() => {
    const allDrivers = teams.flatMap(t => t.drivers);
    const simulatedResults: RaceResult[] = allDrivers.map(d => {
      const team = teams.find(t => t.id === d.teamName || t.name === d.teamName)!;
      const perf = getCarPerformance(team) + (d.skill / 5) + (Math.random() * 5);
      return { driver: d, position: 0, timeGap: '', pointsEarned: 0, score: perf };
    }).sort((a: any, b: any) => b.score - a.score)
      .map((r, i) => ({ ...r, position: i + 1, timeGap: `+${(i * 1.2).toFixed(3)}s` }));

    setResults(simulatedResults);
    setStage('RACE_RESULTS');
  }, [teams]);

  if (stage === 'PLAYER_INPUT') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black">
        <div className="max-w-md w-full text-center">
          <div className="mb-2 bg-[#e10600] inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest">Manager Simulation</div>
          <h1 className="text-4xl font-black italic border-b-8 border-[#e10600] pb-2 mb-12 tracking-tighter">FORMEL1-<span className="text-[#e10600]">GESCHICHTE</span>.DE</h1>
          <div className="bg-[#111] p-8 border border-[#222] shadow-2xl text-left">
             <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Dein Name</label>
             <input value={playerName} onChange={e => setPlayerName(e.target.value)} className="w-full bg-black border border-[#333] p-4 text-white font-mono mb-8 focus:border-[#e10600] outline-none" placeholder="NAME EINGEBEN..." />
             <Button onClick={() => playerName && setStage('TEAM_SELECTION')} className="w-full py-4 text-lg" disabled={!playerName}>Karriere Starten</Button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'TEAM_SELECTION') {
    return (
      <div className="flex-1 p-8 bg-black">
        <h1 className="text-3xl font-black italic uppercase text-center mb-12">Wähle dein <span className="text-[#e10600]">Team</span></h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {teams.map(t => (
            <div key={t.id} onClick={() => { setPlayerTeamId(t.id); setStage('MAIN_MENU'); }} className="bg-[#111] border border-[#222] p-6 hover:border-[#e10600] cursor-pointer transition-all group">
              <h3 className="text-xl font-black uppercase group-hover:text-[#e10600] mb-4">{t.name}</h3>
              <div className="text-[10px] font-bold text-gray-500 space-y-1 mb-6">
                <div className="flex justify-between border-b border-[#222] pb-1"><span>Chassis</span><span>{t.chassis}</span></div>
                <div className="flex justify-between border-b border-[#222] pb-1"><span>Antrieb</span><span>{t.engine}</span></div>
                <div className="flex justify-between"><span>Budget</span><span>{formatMoney(t.budget)}</span></div>
              </div>
              <Button className="w-full text-[10px]">Übernehmen</Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stage === 'MAIN_MENU') {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-[#050505]">
        <Header title={`Saison 1998 | Runde ${raceIndex + 1}`} teamName={playerTeam?.name} budget={playerTeam?.budget} />
        <main className="flex-1 p-6 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-[#111] p-8 border border-[#222]">
              <div className="flex justify-between items-end mb-8">
                <div>
                   <div className="text-[10px] font-bold text-[#e10600] uppercase tracking-widest mb-1">Nächstes Rennen</div>
                   <h2 className="text-3xl font-black italic uppercase">{TRACKS[raceIndex]}</h2>
                </div>
                <Button onClick={() => setStage('RACE')} className="py-4 px-10">Rennen Starten</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary" onClick={() => setNotification("Der Transfermarkt öffnet nach dem nächsten Rennen.")}>Fahrermarkt</Button>
                <Button variant="secondary" onClick={() => setNotification("Die Fabrik ist derzeit voll ausgelastet.")}>Entwicklung</Button>
              </div>
            </section>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#111] p-6 border border-[#222]">
                 <h3 className="text-xs font-black uppercase text-[#e10600] mb-4 border-l-4 border-[#e10600] pl-3">Aktuelle Fahrer</h3>
                 <div className="space-y-3">
                   {playerTeam?.drivers.map(d => (
                     <div key={d.id} className="bg-black border border-[#222] p-4 flex justify-between items-center">
                        <span className="font-black text-sm uppercase">{d.name}</span>
                        <span className="text-[10px] font-mono text-gray-500">LVL {d.skill}</span>
                     </div>
                   ))}
                 </div>
              </div>
              <div className="bg-[#111] p-6 border border-[#222]">
                 <h3 className="text-xs font-black uppercase text-[#e10600] mb-4 border-l-4 border-[#e10600] pl-3">Fahrzeugstatus</h3>
                 <div className="space-y-2 font-mono text-[10px]">
                    <div className="flex justify-between"><span>AERO</span><span>{playerTeam?.aero}</span></div>
                    <div className="flex justify-between"><span>CHASSIS</span><span>{playerTeam?.chassis}</span></div>
                    <div className="flex justify-between font-bold text-white border-t border-[#333] pt-1"><span>GESAMT</span><span>{getCarPerformance(playerTeam!).toFixed(1)}</span></div>
                 </div>
              </div>
            </section>
          </div>
          
          <aside className="bg-[#0a0a0a] border border-[#222] flex flex-col h-[500px]">
            <div className="p-4 border-b border-[#e10600] bg-black font-black uppercase text-xs tracking-widest">News & Medien</div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-[11px]">
               <div className="border-l-2 border-[#e10600] pl-3 py-1">
                  <div className="text-[#e10600] font-bold">SYSTEM</div>
                  <div className="text-gray-400 uppercase">Willkommen in der Saison 1998, {playerName}. Viel Erfolg beim ersten Rennen in {TRACKS[raceIndex]}.</div>
               </div>
            </div>
          </aside>
        </main>
        {notification && <Modal message={notification} onClose={() => setNotification(null)} />}
      </div>
    );
  }

  if (stage === 'RACE') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black p-10">
        <div className="w-20 h-20 border-t-4 border-[#e10600] rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Qualifying & Rennen läuft...</h2>
        <p className="text-gray-600 font-mono text-[10px] uppercase tracking-widest">Simulation der Sektorenzeiten</p>
        <div className="mt-12 w-full max-w-xs h-1 bg-[#111]">
           <div className="h-full bg-[#e10600] animate-[load_1.5s_ease-in-out]" onAnimationEnd={runSimulation}></div>
        </div>
        <style>{`@keyframes load { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
      </div>
    );
  }

  if (stage === 'RACE_RESULTS') {
    return (
      <div className="flex-1 bg-black flex flex-col">
        <Header title="Rennergebnisse" teamName={playerTeam?.name} budget={playerTeam?.budget} />
        <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
           <div className="bg-[#111] border border-[#222] overflow-hidden shadow-2xl">
              <table className="w-full text-left font-mono text-xs uppercase">
                <thead className="bg-black border-b border-[#e10600] text-[#e10600]">
                   <tr>
                     <th className="p-4">POS</th>
                     <th className="p-4">FAHRER</th>
                     <th className="p-4">TEAM</th>
                     <th className="p-4 text-right">ABSTAND</th>
                   </tr>
                </thead>
                <tbody className="text-gray-300">
                  {results.map(r => (
                    <tr key={r.driver.id} className={`border-b border-[#222] ${r.driver.teamName === playerTeam?.name ? 'bg-[#e10600]/10 text-white' : ''}`}>
                      <td className="p-4 font-black">{r.position}</td>
                      <td className="p-4">{r.driver.name}</td>
                      <td className="p-4 opacity-60">{r.driver.teamName}</td>
                      <td className="p-4 text-right">{r.position === 1 ? 'SIEGER' : r.timeGap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
           <div className="mt-8 flex justify-center">
              <Button onClick={() => { setRaceIndex(i => (i + 1) % TRACKS.length); setStage('MAIN_MENU'); }} className="px-16 py-4">Paddock Verlassen</Button>
           </div>
        </main>
      </div>
    );
  }

  return null;
};

// --- 6. MOUNT ---
const rootEl = document.getElementById('root');
if (rootEl) createRoot(rootEl).render(<App />);

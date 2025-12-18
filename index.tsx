
import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

// --- 1. DATENSTRUKTUREN & KONSTANTEN ---
const TRACKS = [
  "Melbourne (Australien)", "Interlagos (Brasilien)", "Buenos Aires (Argentinien)", 
  "Imola (San Marino)", "Monaco (Monte Carlo)", "Barcelona (Spanien)", 
  "Montreal (Kanada)", "Magny-Cours (Frankreich)", "Silverstone (Großbritannien)", 
  "Hockenheim (Deutschland)", "Hungaroring (Ungarn)", "Spa-Francorchamps (Belgien)", 
  "Monza (Italien)", "Nürburgring (Luxemburg)", "Suzuka (Japan)"
];

const UPGRADE_COST = 2500000; // 2.5 Mio pro Punkt

const createDriver = (id: string, name: string, skill: number, team: string) => ({
  id, name, skill, morale: 85, teamName: team, contractRemaining: 2, salary: skill * 80000, cost: skill * 150000
});

const INITIAL_TEAMS = [
  { id: "woking", name: "Team Woking", chassis: 96, engine: 98, aero: 95, budget: 65000000, drivers: [createDriver("v1", "Jack Village", 94, "Team Woking"), createDriver("v2", "Hans Frontier", 87, "Team Woking")] },
  { id: "maranello", name: "Scuderia Maranello", chassis: 94, engine: 97, aero: 92, budget: 75000000, drivers: [createDriver("m1", "Mikael Steiner", 99, "Scuderia Maranello"), createDriver("m2", "Ed Iron", 84, "Scuderia Maranello")] },
  { id: "didcot", name: "Team Didcot", chassis: 90, engine: 95, aero: 91, budget: 55000000, drivers: [createDriver("a1", "Mikko Haki", 92, "Team Didcot"), createDriver("a2", "Dan Coldheart", 88, "Team Didcot")] },
  { id: "silverstone", name: "Team Silverstone", chassis: 84, engine: 86, aero: 82, budget: 28000000, drivers: [createDriver("h1", "Ruben Bar", 86, "Team Silverstone"), createDriver("h2", "Martin Brund", 82, "Team Silverstone")] },
  { id: "enstone", name: "Team Enstone", chassis: 82, engine: 84, aero: 80, budget: 24000000, drivers: [createDriver("p1", "Alan John", 83, "Team Enstone"), createDriver("p2", "Ben Gary", 79, "Team Enstone")] },
  { id: "hinwil", name: "Team Hinwil", chassis: 80, engine: 82, aero: 78, budget: 20000000, drivers: [createDriver("ih1", "Karl Kovac", 81, "Team Hinwil"), createDriver("ih2", "Leo Light", 77, "Team Hinwil")] },
  { id: "guyancourt", name: "Team Guyancourt", chassis: 78, engine: 80, aero: 76, budget: 18000000, drivers: [createDriver("c1", "Sam Speed", 79, "Team Guyancourt"), createDriver("c2", "Tom Torque", 75, "Team Guyancourt")] },
  { id: "leafield", name: "Team Leafield", chassis: 76, engine: 78, aero: 74, budget: 16000000, drivers: [createDriver("e1", "Paul Petrol", 77, "Team Leafield"), createDriver("e2", "Greg Gear", 73, "Team Leafield")] },
  { id: "miltonkeynes", name: "Team Milton Keynes", chassis: 74, engine: 76, aero: 72, budget: 14000000, drivers: [createDriver("s1", "Udo Under", 75, "Team Milton Keynes"), createDriver("s2", "Otto Over", 71, "Team Milton Keynes")] },
  { id: "faenza", name: "Scuderia Faenza", chassis: 72, engine: 74, aero: 70, budget: 12000000, drivers: [createDriver("vc1", "Vic Volt", 73, "Scuderia Faenza"), createDriver("vc2", "Xavier Xenon", 69, "Scuderia Faenza")] },
  { id: "ockham", name: "Team Ockham", chassis: 70, engine: 72, aero: 68, budget: 10000000, drivers: [createDriver("o1", "Zack Zenith", 71, "Team Ockham"), createDriver("o2", "Yanis Yard", 67, "Team Ockham")] }
];

const FREE_AGENTS = [
  createDriver("fa1", "Ayrton Future", 95, "Free Agent"),
  createDriver("fa2", "Michael Speed", 92, "Free Agent"),
  createDriver("fa3", "Sebastian New", 85, "Free Agent"),
  createDriver("fa4", "Lewis Talent", 82, "Free Agent"),
  createDriver("fa5", "Max Prodigy", 78, "Free Agent")
];

// --- 2. HILFSFUNKTIONEN ---
const formatMoney = (val: number) => val >= 1000000 ? `${(val/1000000).toFixed(1)} Mio. €` : `${(val/1000).toFixed(0)} Tsd. €`;
const getPerf = (t: any) => (t.chassis + t.engine + t.aero) / 3;

// --- 3. KOMPONENTEN ---
const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const base = "px-6 py-2 font-black uppercase tracking-widest transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-[2px] rounded-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed";
  const styles: any = {
    primary: "bg-[#006de3] border-[#004ba1] text-white hover:bg-[#007eff]",
    secondary: "bg-[#d9dbd7] border-[#909392] text-[#151515] hover:bg-[#e9ebe7]"
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props}>{children}</button>;
};

const Header = ({ title, teamName, budget }: any) => (
  <header className="bg-[#151515] border-b-2 border-[#006de3] p-4 sticky top-0 z-50">
    <div className="max-w-6xl mx-auto flex justify-between items-center">
      <h1 className="text-lg font-black italic tracking-tighter text-white uppercase">{title}</h1>
      <div className="flex gap-4 items-center">
        <div className="hidden sm:block text-[10px] font-bold text-[#909392] uppercase">Team: <span className="text-white">{teamName}</span></div>
        <div className="bg-[#d9dbd7] border border-[#909392] px-3 py-1 font-mono text-xs text-[#006de3] font-bold">{formatMoney(budget)}</div>
      </div>
    </div>
  </header>
);

// --- 4. HAUPTAPP ---
const App = () => {
  const [stage, setStage] = useState('PLAYER_INPUT');
  const [playerName, setPlayerName] = useState('');
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [playerTeamId, setPlayerTeamId] = useState<string | null>(null);
  const [raceIndex, setRaceIndex] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [freeAgents, setFreeAgents] = useState(FREE_AGENTS);

  const playerTeam = teams.find(t => t.id === playerTeamId);

  const updatePlayerTeam = useCallback((updater: (team: any) => any) => {
    setTeams(prev => prev.map(t => t.id === playerTeamId ? updater(t) : t));
  }, [playerTeamId]);

  const runSimulation = useCallback(() => {
    const allDrivers = teams.flatMap(t => t.drivers.map(d => ({ ...d, team: t })));
    const simulatedResults = allDrivers.map(d => {
      const performance = getPerf(d.team) + (d.skill / 4) + (Math.random() * 8);
      return { driver: d, score: performance };
    })
    .sort((a, b) => b.score - a.score)
    .map((r, i) => ({
      driver: r.driver,
      position: i + 1,
      timeGap: i === 0 ? 'FÜHRENDER' : `+${(i * 1.45 + Math.random()).toFixed(3)}s`
    }));

    setResults(simulatedResults);
    setStage('RACE_RESULTS');
  }, [teams]);

  if (stage === 'PLAYER_INPUT') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#d9dbd7] h-screen">
        <div className="max-w-md w-full text-center">
          <div className="mb-2 bg-[#006de3] inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">Manager Simulation</div>
          <h1 className="text-4xl font-black italic border-b-8 border-[#006de3] pb-2 mb-12 tracking-tighter uppercase text-[#151515]">FORMEL1-<span className="text-[#006de3]">GESCHICHTE</span>.DE</h1>
          <div className="bg-white p-8 border border-[#909392] shadow-2xl text-left">
             <label className="block text-[10px] font-black text-[#909392] uppercase mb-2">Manager Name</label>
             <input value={playerName} onChange={e => setPlayerName(e.target.value)} className="w-full bg-[#f3f4f6] border border-[#909392] p-4 text-[#151515] font-mono mb-8 focus:border-[#006de3] outline-none" placeholder="NAME EINGEBEN..." />
             <Button onClick={() => playerName && setStage('TEAM_SELECTION')} className="w-full py-4 text-lg" disabled={!playerName}>Karriere Starten</Button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'TEAM_SELECTION') {
    return (
      <div className="flex-1 p-8 bg-[#d9dbd7] min-h-screen">
        <h1 className="text-3xl font-black italic uppercase text-center mb-12 text-[#151515]">Wähle dein <span className="text-[#006de3]">Team</span></h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {teams.map(t => (
            <div key={t.id} onClick={() => { setPlayerTeamId(t.id); setStage('MAIN_MENU'); }} className="bg-white border border-[#909392] p-5 hover:border-[#006de3] cursor-pointer transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-8 h-8 bg-[#909392] group-hover:bg-[#006de3] rotate-45 translate-x-4 -translate-y-4 transition-colors"></div>
              <h3 className="text-lg font-black uppercase group-hover:text-[#006de3] mb-3 text-[#151515]">{t.name}</h3>
              <div className="text-[10px] font-bold text-[#909392] space-y-1 mb-4">
                <div className="flex justify-between"><span>Technik</span><span>{getPerf(t).toFixed(0)}</span></div>
                <div className="flex justify-between"><span>Budget</span><span>{formatMoney(t.budget)}</span></div>
              </div>
              <div className="space-y-1 mb-6">
                {t.drivers.map(d => (
                  <div key={d.id} className="text-[10px] text-[#151515] border-b border-[#909392]/20 flex justify-between uppercase"><span>{d.name}</span><span>{d.skill}</span></div>
                ))}
              </div>
              <Button className="w-full text-[10px] py-1">Übernehmen</Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stage === 'MAIN_MENU') {
    return (
      <div className="flex-1 flex flex-col bg-[#e9ebe7] min-h-screen">
        <Header title={`Saison 1998 | Runde ${raceIndex + 1}`} teamName={playerTeam?.name} budget={playerTeam?.budget} />
        <main className="flex-1 p-6 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 text-[#151515]">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-8 border border-[#909392] shadow-sm">
              <div className="flex justify-between items-end mb-8">
                <div>
                   <div className="text-[10px] font-bold text-[#006de3] uppercase tracking-widest mb-1">Nächster Grand Prix</div>
                   <h2 className="text-3xl font-black italic uppercase text-[#151515]">{TRACKS[raceIndex]}</h2>
                </div>
                <Button onClick={() => setStage('RACE')} className="py-4 px-10">Starten</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary" className="text-xs" onClick={() => setStage('MANAGEMENT')}>Management</Button>
                <Button variant="secondary" className="text-xs" onClick={() => setStage('DEVELOPMENT')}>Entwicklung</Button>
              </div>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 border border-[#909392] shadow-sm">
                 <h3 className="text-xs font-black uppercase text-[#006de3] mb-4 border-l-4 border-[#006de3] pl-3">Fahrerlager</h3>
                 <div className="space-y-3">
                   {playerTeam?.drivers.map(d => (
                     <div key={d.id} className="bg-[#f3f4f6] border border-[#909392]/30 p-4 flex justify-between items-center">
                        <span className="font-black text-xs uppercase text-[#151515]">{d.name}</span>
                        <span className="text-[10px] font-mono text-[#909392]">TALENT {d.skill}</span>
                     </div>
                   ))}
                 </div>
              </div>
              <div className="bg-white p-6 border border-[#909392] shadow-sm">
                 <h3 className="text-xs font-black uppercase text-[#006de3] mb-4 border-l-4 border-[#006de3] pl-3">Fahrzeug-Daten</h3>
                 <div className="space-y-2 font-mono text-[10px] text-[#909392]">
                    <div className="flex justify-between"><span>AERODYNAMIK</span><span>{playerTeam?.aero}</span></div>
                    <div className="flex justify-between"><span>ANTRIEBSEINHEIT</span><span>{playerTeam?.engine}</span></div>
                    <div className="flex justify-between"><span>CHASSIS</span><span>{playerTeam?.chassis}</span></div>
                    <div className="flex justify-between font-bold text-[#151515] border-t border-[#909392]/30 pt-1"><span>GESAMT-PERFORMANCE</span><span>{getPerf(playerTeam).toFixed(1)}</span></div>
                 </div>
              </div>
            </div>
          </div>
          <aside className="bg-white border border-[#909392] flex flex-col h-[400px] lg:h-auto overflow-hidden shadow-sm">
            <div className="p-3 border-b border-[#006de3] bg-[#151515] font-black uppercase text-[10px] tracking-widest text-white">Nachrichten-Ticker</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[10px]">
               <div className="border-l-2 border-[#006de3] pl-3 py-1">
                  <div className="text-[#006de3] font-bold uppercase">REDAKTION</div>
                  <div className="text-[#151515] uppercase leading-tight">Willkommen {playerName}. Die Welt blickt auf den Saisonauftakt in {TRACKS[raceIndex].split('(')[0]}. Kann {playerTeam?.name} überraschen?</div>
               </div>
            </div>
          </aside>
        </main>
      </div>
    );
  }

  if (stage === 'DEVELOPMENT') {
    const handleUpgrade = (stat: string) => {
      if (playerTeam!.budget >= UPGRADE_COST) {
        updatePlayerTeam(team => ({
          ...team,
          [stat]: team[stat] + 1,
          budget: team.budget - UPGRADE_COST
        }));
      } else {
        setNotification("Nicht genügend Budget für dieses Upgrade!");
      }
    };

    return (
      <div className="flex-1 flex flex-col bg-[#d9dbd7] min-h-screen">
        <Header title="Forschung & Entwicklung" teamName={playerTeam?.name} budget={playerTeam?.budget} />
        <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <Button variant="secondary" onClick={() => setStage('MAIN_MENU')}>Zurück zum Paddock</Button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {['chassis', 'engine', 'aero'].map(stat => (
              <div key={stat} className="bg-white border border-[#909392] p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-black uppercase text-[#151515]">{stat === 'chassis' ? 'Chassis Optimierung' : stat === 'engine' ? 'Motor-Entwicklung' : 'Aerodynamik-Paket'}</h3>
                  <p className="text-[#909392] font-mono text-xs uppercase">Aktueller Wert: <span className="text-[#151515] font-bold">{(playerTeam as any)[stat]}</span></p>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="text-[#006de3] font-mono text-sm font-bold">-{formatMoney(UPGRADE_COST)}</div>
                  <Button onClick={() => handleUpgrade(stat)} disabled={playerTeam!.budget < UPGRADE_COST}>Verbessern (+1)</Button>
                </div>
              </div>
            ))}
          </div>
        </main>
        {notification && (
          <div className="fixed inset-0 bg-[#151515]/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-white border-t-4 border-[#006de3] p-6 max-w-sm w-full shadow-2xl">
              <p className="text-[#151515] font-mono text-xs mb-6 uppercase tracking-tight font-bold">{notification}</p>
              <Button onClick={() => setNotification(null)} className="w-full py-2">OK</Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (stage === 'MANAGEMENT') {
    const handleHire = (agent: any, slotIndex: number) => {
      if (playerTeam!.budget >= agent.cost) {
        const newDrivers = [...playerTeam!.drivers];
        const firedDriver = newDrivers[slotIndex];
        newDrivers[slotIndex] = { ...agent, teamName: playerTeam!.name };
        
        updatePlayerTeam(team => ({
          ...team,
          drivers: newDrivers,
          budget: team.budget - agent.cost
        }));

        setFreeAgents(prev => [...prev.filter(a => a.id !== agent.id), { ...firedDriver, teamName: "Free Agent", cost: firedDriver.skill * 100000 }]);
        setNotification(`${agent.name} wurde erfolgreich unter Vertrag genommen!`);
      } else {
        setNotification("Budget reicht nicht für die Verpflichtung aus.");
      }
    };

    return (
      <div className="flex-1 flex flex-col bg-[#d9dbd7] min-h-screen">
        <Header title="Transfermarkt" teamName={playerTeam?.name} budget={playerTeam?.budget} />
        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
          <div className="mb-8 flex justify-between items-center">
            <Button variant="secondary" onClick={() => setStage('MAIN_MENU')}>Zurück zum Paddock</Button>
            <div className="text-[10px] font-bold text-[#909392] uppercase">Fahrer-Rotation verwalten</div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-[#151515]">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-black uppercase text-[#006de3] border-b border-[#006de3] pb-2">Verfügbare Fahrer</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {freeAgents.map(agent => (
                  <div key={agent.id} className="bg-white border border-[#909392] p-5 flex flex-col gap-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[#151515] font-black uppercase">{agent.name}</div>
                        <div className="text-[10px] text-[#909392] font-mono">SKILL: {agent.skill}</div>
                      </div>
                      <div className="text-[#006de3] font-mono text-xs font-bold">{formatMoney(agent.cost || 0)}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 text-[10px] py-1" onClick={() => handleHire(agent, 0)}>Cockpit 1</Button>
                      <Button className="flex-1 text-[10px] py-1" onClick={() => handleHire(agent, 1)}>Cockpit 2</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-xl font-black uppercase text-[#151515] border-b border-[#909392]/30 pb-2">Aktives Team</h3>
               {playerTeam?.drivers.map((d, i) => (
                 <div key={d.id} className="bg-white p-4 border-l-4 border-[#006de3] shadow-sm">
                    <div className="text-[10px] text-[#909392] uppercase font-bold">Cockpit {i+1}</div>
                    <div className="text-[#151515] font-black uppercase text-lg">{d.name}</div>
                    <div className="text-xs text-[#151515]/60 font-mono">Skill-Level: {d.skill}</div>
                 </div>
               ))}
            </div>
          </div>
        </main>
        {notification && (
          <div className="fixed inset-0 bg-[#151515]/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-white border-t-4 border-[#006de3] p-6 max-w-sm w-full shadow-2xl">
              <p className="text-[#151515] font-mono text-xs mb-6 uppercase tracking-tight font-bold">{notification}</p>
              <Button onClick={() => setNotification(null)} className="w-full py-2">OK</Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (stage === 'RACE') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#d9dbd7] p-10 h-screen">
        <div className="w-32 h-1 bg-white relative overflow-hidden mb-8 shadow-sm">
           <div className="absolute h-full bg-[#006de3] animate-[race_2s_linear_infinite]"></div>
        </div>
        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2 text-[#151515]">Rennsimulation läuft...</h2>
        <p className="text-[#909392] font-mono text-[10px] uppercase tracking-widest mb-12">Synchronisiere Streckendaten</p>
        <div className="w-full max-w-xs h-0.5 bg-white">
           <div className="h-full bg-[#006de3] transition-all duration-[2000ms] w-0 animate-[fill_2s_forwards]" onAnimationEnd={runSimulation}></div>
        </div>
        <style>{`
          @keyframes race { 0% { left: -100%; width: 50%; } 100% { left: 100%; width: 50%; } }
          @keyframes fill { from { width: 0%; } to { width: 100%; } }
        `}</style>
      </div>
    );
  }

  if (stage === 'RACE_RESULTS') {
    return (
      <div className="flex-1 bg-[#d9dbd7] flex flex-col min-h-screen">
        <Header title="Renn-Ergebnisse" teamName={playerTeam?.name} budget={playerTeam?.budget} />
        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
           <div className="bg-white border border-[#909392] shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px] uppercase">
                  <thead className="bg-[#151515] border-b border-[#006de3] text-white">
                     <tr>
                       <th className="p-3">POS</th>
                       <th className="p-3">PILOT</th>
                       <th className="p-3">RENNSTALL</th>
                       <th className="p-3 text-right">ZEIT</th>
                     </tr>
                  </thead>
                  <tbody className="text-[#151515]">
                    {results.map(r => (
                      <tr key={r.driver.id} className={`border-b border-[#909392]/20 ${r.driver.teamName === playerTeam?.name ? 'bg-[#006de3]/10 text-black font-bold' : ''}`}>
                        <td className="p-3 font-black text-[#151515]">{r.position}</td>
                        <td className="p-3">{r.driver.name}</td>
                        <td className="p-3 opacity-50">{r.driver.teamName}</td>
                        <td className="p-3 text-right">{r.timeGap}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
           <div className="mt-8 flex justify-center">
              <Button onClick={() => { setRaceIndex(i => (i + 1) % TRACKS.length); setStage('MAIN_MENU'); }} className="px-12 py-3">Paddock Verlassen</Button>
           </div>
        </main>
      </div>
    );
  }
  return null;
};

const rootEl = document.getElementById('root');
if (rootEl) createRoot(rootEl).render(<App />);

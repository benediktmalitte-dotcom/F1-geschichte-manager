
import { Team, Driver, Supplier, Staff, StaffRole } from './types';

// Punktesysteme (unverändert in der Logik)
export const POINTS_SYSTEM_1991 = [10, 6, 4, 3, 2, 1];
export const POINTS_SYSTEM_2003 = [10, 8, 6, 5, 4, 3, 2, 1];

// Strecken (Fiktive Namen für internationale Standorte)
export const TRACKS = [
  "Southern Cross (Ozeanien)", "Amazonas Speed (Südamerika)", "Pampas Circuit (Argentinien)", "Rhein-Ring (Europa)",
  "Apennin Kurs (Italien)", "Azur Küste (Stadtkurs)", "Iberia Ring (Spanien)", "Maple Leaf (Nordamerika)",
  "Loire Speed (Frankreich)", "Isle of Speed (UK)", "Schwarzwald GP (Deutschland)", "Danube Arena (Ungarn)",
  "Ardennen Steile (Belgien)", "Royal Park (Italien)", "Atlantic Bend (Portugal)", "Rising Sun (Japan)"
];

export const TRACK_CONFIGS = [
  { name: "Southern Cross", baseTime: 92 },
  { name: "Amazonas Speed", baseTime: 78 },
  { name: "Pampas Circuit", baseTime: 80 },
  { name: "Rhein-Ring", baseTime: 83 },
  { name: "Apennin Kurs", baseTime: 86 },
  { name: "Azur Küste", baseTime: 75 },
  { name: "Iberia Ring", baseTime: 85 },
  { name: "Maple Leaf", baseTime: 80 },
  { name: "Loire Speed", baseTime: 79 },
  { name: "Isle of Speed", baseTime: 87 },
  { name: "Schwarzwald GP", baseTime: 82 },
  { name: "Danube Arena", baseTime: 77 },
  { name: "Ardennen Steile", baseTime: 105 },
  { name: "Royal Park", baseTime: 82 },
  { name: "Atlantic Bend", baseTime: 81 },
  { name: "Rising Sun", baseTime: 96 }
];

export const SEASON_PACE_MODIFIERS: Record<number, number> = {
  1996: 0, 1997: -0.5, 1998: -1.0, 1999: -1.5, 2000: -2.0, 
  2001: -2.5, 2002: -3.0, 2003: -3.2, 2004: -4.0, 2005: -3.5, 
  2006: -3.0, 2007: -3.2, 2008: -3.4
};

export const TESTING_COST = 500_000;

export const SPONSOR_NAMES = [
  "GlobalOil", "SwiftBank", "Apex Tech", "Vertex Log", "NeoEnergy", "PrimeAir", "Zenith", 
  "Flux Gear", "Nova Wear", "Core Systems", "Alpha Drinks", "Beta Watch", "Delta Force", "Epsilon",
  "Titan Steel", "Aries", "Lunar Corp", "Solaris", "Quantum", "Nexus", "Empire", "Republic",
  "Arcade", "Pixel", "Vector", "Matrix", "Cipher", "Sonic", "Hydro", "Pyro",
  "Terra", "Aero", "Gravity", "Fusion", "Catalyst", "Summit", "Horizon", "Infinity"
];

// Fiktive Zulieferer
export const ENGINE_SUPPLIERS: Supplier[] = [
    { id: "vortex_e", name: "Vortex V10", type: "Engine", performance: 98, cost: 18_000_000, minPositionReq: 22 },
    { id: "magnific_e", name: "Magnifica Racing", type: "Engine", performance: 96, cost: 20_000_000, minPositionReq: 1 }, 
    { id: "silverstar_e", name: "SilverStar", type: "Engine", performance: 95, cost: 15_000_000, minPositionReq: 22 },
    { id: "force_e", name: "Force One", type: "Engine", performance: 88, cost: 10_000_000, minPositionReq: 22 },
    { id: "zenith_e", name: "Zenith Power", type: "Engine", performance: 90, cost: 12_000_000, minPositionReq: 22 },
    { id: "beast_e", name: "Iron Beast", type: "Engine", performance: 89, cost: 11_000_000, minPositionReq: 22 },
    { id: "core_e", name: "Core Performance", type: "Engine", performance: 82, cost: 6_000_000, minPositionReq: 22 }
];

export const TYRE_SUPPLIERS: Supplier[] = [
    { id: "grip_y", name: "GripYear", type: "Tyres", performance: 95, cost: 3_000_000, minPositionReq: 22 },
    { id: "brick_s", name: "BrickStone", type: "Tyres", performance: 94, cost: 2_500_000, minPositionReq: 22 },
    { id: "flex_m", name: "FlexiRubber", type: "Tyres", performance: 96, cost: 3_500_000, minPositionReq: 22 }
];

export const FUEL_SUPPLIERS: Supplier[] = [
    { id: "pearl_f", name: "Pearl Fuel", type: "Fuel", performance: 95, cost: 2_000_000, minPositionReq: 22 },
    { id: "flux_f", name: "Flux X", type: "Fuel", performance: 94, cost: 1_800_000, minPositionReq: 22 },
    { id: "ultra_f", name: "Ultra Pure", type: "Fuel", performance: 94, cost: 1_800_000, minPositionReq: 22 }
];

// Helper Creators
const createTeamDriver = (id: string, name: string, age: number, skill: number, teamName: string): Driver => ({
  id, name, age, skill, morale: 90, teamName, points: 0, qualifyingPos: 0, strategyStops: 2, strategyTyres: 'Soft',
  cost: Math.floor(skill * 50_000), salary: Math.floor(skill * 100_000), contractRemaining: 2, history: []
});

const createTeamStaff = (id: string, name: string, role: StaffRole, skill: number, teamName: string): Staff => ({
  id, name, role, skill, cost: Math.floor(skill * 30_000), salary: Math.floor(skill * 80_000), contractRemaining: 2, teamName
});

// Fiktiver Fahrermarkt
export const FREE_AGENTS: Driver[] = [
    createTeamDriver("storm", "Ray Storm", 42, 85, "Free Agent"),
    createTeamDriver("archer", "Lance Archer", 41, 90, "Free Agent"),
    createTeamDriver("valiant", "Victor Valiant", 30, 75, "Free Agent"),
    createTeamDriver("pioneer", "Paul Pioneer", 25, 70, "Free Agent"),
    createTeamDriver("novak", "Nick Novak", 32, 50, "Free Agent"),
];

export const AVAILABLE_STAFF: Staff[] = [
    createTeamStaff("brain", "Dr. Brain", "Chief Designer", 96, "Free Agent"),
    createTeamStaff("wing", "Aeris Wing", "Aerodynamicist", 85, "Free Agent"),
    createTeamStaff("sketch", "Sam Sketch", "Chief Designer", 88, "Free Agent")
];

// Fiktive historische Daten (Abgeleitet)
export const HISTORICAL_SEASON_DATA: Record<number, Record<string, any>> = {
    1997: {
        "vanguard": { basePerf: 96, engineId: "vortex_e", drivers: ["v_jacks", "f_frontier"] },
        "magnifica": { basePerf: 94, engineId: "magnific_e", drivers: ["s_mikael", "i_iron"] },
        "prism": { basePerf: 90, engineId: "vortex_e", drivers: ["a_john", "b_gary"] }
    }
};

export const MARKET_EVOLUTION: Record<number, { newDrivers: Driver[] }> = {
    1997: { newDrivers: [ createTeamDriver("rookie1", "Tim Turbo", 21, 80, "F3 Series") ]}
};

// Initial-Teams (Fiktive Versionen)
export const getInitialTeams = (): Team[] => [
    { 
      id: "vanguard", name: "Vanguard Racing Team", chassisName: "Vanguard", principal: "F. Vane", chassis: 98, engine: 98, tyres: 95, fuel: 97, aero: 98, points: 0, budget: 60_000_000, testData: 0,
      sponsors: [{ name: "Vertex", type: "Main", value: 5_000_000 }],
      supplierNames: { engine: "Vortex", tyres: "GripYear", fuel: "Pearl" }, supplierCostPerRace: 1_200_000,
      factory: { size: 4, windTunnel: 3, cfd: 2, cad: 3 }, 
      staff: { designer: createTeamStaff('dr_vane', 'Arnold Vane', 'Chief Designer', 99, 'Vanguard'), aerodynamicist: createTeamStaff('geo_wing', 'Geoff Wing', 'Aerodynamicist', 92, 'Vanguard') },
      nextYearDev: { chassis: 90, aero: 90 },
      drivers: [createTeamDriver("v_jacks", "Jack Village", 25, 93, "Vanguard"), createTeamDriver("f_frontier", "Hans Frontier", 29, 85, "Vanguard")],
      testDriver: null,
      history: [{ year: 1995, position: 2 }]
    },
    { 
      id: "magnifica", name: "Scuderia Magnifica", chassisName: "Magnifica", principal: "M. Magnifico", chassis: 90, engine: 96, tyres: 95, fuel: 95, aero: 88, points: 0, budget: 70_000_000, testData: 0,
      sponsors: [{ name: "Empire", type: "Main", value: 6_000_000 }],
      supplierNames: { engine: "Magnifica", tyres: "GripYear", fuel: "Pearl" }, supplierCostPerRace: 1_400_000,
      factory: { size: 4, windTunnel: 3, cfd: 1, cad: 2 },
      staff: { designer: createTeamStaff('designer_m', 'Marco Designo', 'Chief Designer', 92, 'Magnifica'), aerodynamicist: createTeamStaff('aero_m', 'Luigi Wing', 'Aerodynamicist', 80, 'Magnifica') },
      nextYearDev: { chassis: 85, aero: 85 },
      drivers: [createTeamDriver("s_mikael", "Mikael Steiner", 27, 99, "Magnifica"), createTeamDriver("i_iron", "Ed Iron", 30, 82, "Magnifica")],
      testDriver: null,
      history: [{ year: 1995, position: 3 }] 
    },
    { 
      id: "apex", name: "Apex Motorsport", chassisName: "Apex", principal: "R. Apex", chassis: 85, engine: 95, tyres: 95, fuel: 95, aero: 85, points: 0, budget: 55_000_000, testData: 0,
      sponsors: [{ name: "Quantum", type: "Main", value: 5_000_000 }],
      supplierNames: { engine: "SilverStar", tyres: "GripYear", fuel: "Fluid X" }, supplierCostPerRace: 1_100_000,
      factory: { size: 4, windTunnel: 2, cfd: 2, cad: 2 },
      staff: { designer: createTeamStaff('des_a', 'Alex Apex', 'Chief Designer', 85, 'Apex'), aerodynamicist: createTeamStaff('aero_a', 'Andy Aero', 'Aerodynamicist', 82, 'Apex') },
      nextYearDev: { chassis: 80, aero: 80 },
      drivers: [createTeamDriver("h_mikko", "Mikko Haki", 27, 89, "Apex"), createTeamDriver("c_dan", "Dan Coldheart", 25, 86, "Apex")],
      testDriver: null,
      history: [{ year: 1995, position: 4 }]
    },
    { 
      id: "hornet", name: "Hornet Grand Prix", chassisName: "Hornet", principal: "E. Hornet", chassis: 82, engine: 85, tyres: 95, fuel: 90, aero: 80, points: 0, budget: 25_000_000, testData: 0,
      sponsors: [{ name: "Delta", type: "Main", value: 3_000_000 }],
      supplierNames: { engine: "Iron Beast", tyres: "GripYear", fuel: "Alpha" }, supplierCostPerRace: 800_000,
      factory: { size: 2, windTunnel: 1, cfd: 0, cad: 1 },
      staff: { designer: createTeamStaff('des_h', 'Henry Hornet', 'Chief Designer', 85, 'Hornet'), aerodynamicist: createTeamStaff('aero_h', 'Hillary Wing', 'Aerodynamicist', 75, 'Hornet') },
      nextYearDev: { chassis: 75, aero: 75 },
      drivers: [createTeamDriver("b_ruben", "Ruben Bar", 24, 84, "Hornet"), createTeamDriver("b_martin", "Martin Brund", 37, 81, "Hornet")],
      testDriver: null,
      history: []
    }
];

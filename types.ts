
export interface DriverHistory {
  year: number;
  team: string;
  position: number;
  points: number;
}

export interface Driver {
  id: string;
  name: string;
  age: number;
  skill: number;
  morale: number; // 0 to 100
  teamName: string;
  points: number;
  qualifyingPos: number;
  strategyStops: number;
  strategyTyres: 'Soft' | 'Hard' | 'Wets';
  // Market / Contract Props
  cost: number;        // Signing Fee in $ (Previously Dev Points)
  salary: number;      // Yearly salary in $
  contractRemaining: number; // Years remaining
  history: DriverHistory[];
}

export type StaffRole = 'Chief Designer' | 'Aerodynamicist';

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  skill: number; // Affects development efficiency
  cost: number;  // Signing Fee in $
  salary: number; // Yearly salary in $
  contractRemaining: number;
  teamName: string;
}

export interface Sponsor {
  name: string;
  type: 'Main' | 'Secondary';
  value: number; // Payment per race
  signingBonus?: number; // One-time payment immediately
}

export interface Factory {
    size: number; // 1 to 6
    windTunnel: number; // Level 0 to size
    cfd: number; // Level 0 to size
    cad: number; // Level 0 to size
}

export interface TeamHistory {
    year: number;
    position: number;
}

export interface Team {
  id: string;
  name: string;
  chassisName: string; // The base name, e.g., "Williams"
  principal: string; // Team Principal Name
  chassis: number;
  engine: number;
  tyres: number;
  fuel: number;
  aero: number; // New stat for Aerodynamics
  points: number;
  budget: number;
  testData: number; // 0 to 100 (Percentage of data gathered for next upgrade)
  sponsors: Sponsor[];
  factory: Factory; // New Factory Data
  supplierNames: {
      engine: string;
      tyres: string;
      fuel: string;
  };
  supplierCostPerRace: number; // New: Fixed costs for suppliers divided by race count
  drivers: Driver[]; // The 2 Race Drivers
  testDriver: Driver | null; // The Optional Test Driver
  staff: {
    designer: Staff;
    aerodynamicist: Staff;
  };
  nextYearDev: {
    chassis: number;
    aero: number;
  };
  preContracts?: {
      engine?: Supplier;
      tyres?: Supplier;
      fuel?: Supplier;
      sponsor?: Sponsor;
  };
  history: TeamHistory[]; // Past constructors championship positions
}

export interface NewsItem {
  id: number;
  round: number;
  message: string;
  type: 'general' | 'race' | 'transfer' | 'development' | 'contract' | 'staff' | 'finance' | 'factory' | 'morale';
}

export enum Weather {
  Dry = 'Dry',
  Rain = 'Rain',
}

export enum GameStage {
  PlayerInput = 'PLAYER_INPUT',
  TeamSelection = 'TEAM_SELECTION',
  SeasonStart = 'SEASON_START', // New Stage
  MainMenu = 'MAIN_MENU',
  DriverMarket = 'DRIVER_MARKET',
  StaffMarket = 'STAFF_MARKET',
  SponsorMarket = 'SPONSOR_MARKET',
  FactoryManagement = 'FACTORY_MANAGEMENT',
  SupplierMarket = 'SUPPLIER_MARKET',
  Planning = 'PLANNING', 
  TestDrive = 'TEST_DRIVE',
  Practice = 'PRACTICE',
  Qualifying = 'QUALIFYING',
  Strategy = 'STRATEGY',
  Race = 'RACE',
  RaceResults = 'RACE_RESULTS',
  PostRaceAnalysis = 'POST_RACE_ANALYSIS',
  Standings = 'STANDINGS',
  SeasonEnd = 'SEASON_END',
  GameOver = 'GAME_OVER'
}

export interface RaceResult {
  driver: Driver;
  score: number; // -1 for DNF
  timeGap?: string; // formatted string for display
  position: number | 'DNF' | 'DNQ';
  pointsEarned: number;
  earnedMoney: number;
}

export interface Supplier {
  id: string;
  name: string;
  type: 'Engine' | 'Tyres' | 'Fuel';
  performance: number;
  cost: number;
  minPositionReq: number; // e.g., 1 for only champions, 11 for everyone
}

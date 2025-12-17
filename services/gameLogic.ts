
import { Team, Driver, Weather, Sponsor, Staff, RaceResult } from '../types';
import { SPONSOR_NAMES, POINTS_SYSTEM_1991, POINTS_SYSTEM_2003 } from '../constants';

export const getPointsSystem = (year: number): number[] => {
    return year >= 2003 ? POINTS_SYSTEM_2003 : POINTS_SYSTEM_1991;
};

export const calculateRawPace = (driver: Driver, carPerformance: number): number => {
  // Base pace calculation
  const base = (carPerformance * 2.5) + driver.skill;
  const variation = Math.floor(Math.random() * 9) - 4; 
  // Morale Impact: 100 morale = +4 pace, 50 morale = -6 pace
  const moraleEffect = (driver.morale - 80) / 5;
  return base + variation + moraleEffect;
};

export const calculateRacePerformance = (
  driver: Driver, 
  carPerformance: number, 
  weather: Weather, 
  qualifyingPos: number
): number => {
  const basePace = calculateRawPace(driver, carPerformance);
  // Starting further back is a penalty (traffic), not just lack of bonus
  // P1 gets 0 penalty. P22 gets -11 points roughly.
  const gridPenalty = (qualifyingPos - 1) * 0.5;

  let tyreScore = 0;
  if (weather === Weather.Dry) {
    if (driver.strategyTyres === 'Wets') {
      tyreScore -= 200; // Massive penalty for wets in dry
    } else if (driver.strategyTyres === 'Soft') {
      tyreScore += 25; 
    } else if (driver.strategyTyres === 'Hard') {
      tyreScore += 5; 
    }
  } else if (weather === Weather.Rain) {
    if (driver.strategyTyres !== 'Wets') {
      tyreScore -= 200; // Massive penalty for slicks in rain
    } else {
      tyreScore += 10; 
    }
  }

  let wearPenalty = 0;
  if (weather === Weather.Dry) {
    if (driver.strategyTyres === 'Soft') {
      if (driver.strategyStops === 1) wearPenalty = 60; // Softs die with 1 stop
      else if (driver.strategyStops === 2) wearPenalty = 10; 
      else if (driver.strategyStops === 3) wearPenalty = 0; 
    } else if (driver.strategyTyres === 'Hard') {
      if (driver.strategyStops === 1) wearPenalty = 10; 
      else wearPenalty = 0; 
    }
  }

  let fuelBonus = 0;
  let pitTimeLoss = 0;

  if (driver.strategyStops === 1) {
    fuelBonus = 0; 
    pitTimeLoss = 25;
  } else if (driver.strategyStops === 2) {
    fuelBonus = 18; // Less fuel weight
    pitTimeLoss = 50;
  } else if (driver.strategyStops === 3) {
    fuelBonus = 35; // Very light car
    pitTimeLoss = 75;
  }

  const luck = Math.floor(Math.random() * 11) - 5; 
  
  // Reliability Check
  // Lower car performance = higher fail chance. 
  // Perf 90 = ~3% chance. Perf 50 = ~8% chance.
  const failChance = Math.max(2, 15 - (carPerformance / 8));
  const reliabilityRoll = Math.random() * 100;
  
  if (reliabilityRoll < failChance) {
    return -1; // DNF
  }

  const totalScore = basePace - gridPenalty + fuelBonus + tyreScore - wearPenalty - pitTimeLoss + luck;
  return totalScore;
};

export const calculateMoraleChange = (result: RaceResult): number => {
    let change = 0;
    
    if (result.position === 'DNF') {
        change -= 5; // Reduced from 10 to prevent death spirals
    } else if (result.position === 'DNQ') {
        change -= 10;
    } else if (typeof result.position === 'number') {
        if (result.position === 1) change += 10;
        else if (result.position <= 3) change += 5;
        else if (result.position <= 6) change += 3;
        else if (result.position <= 10) change += 1;
        else if (result.position >= 18) change -= 2;
        else change -= 1; 
    }

    return change;
};

export const generateWeather = (): Weather => {
  return Math.random() < 0.25 ? Weather.Rain : Weather.Dry; // Slight bump to 25% rain chance
};

export const getCarPerformance = (team: Team): number => {
  const aero = team.aero !== undefined ? team.aero : team.chassis;
  return (team.chassis + team.engine + team.tyres + team.fuel + aero) / 5;
};

export const updateAIStrategies = (teams: Team[], weather: Weather, playerTeamId: string): Team[] => {
  return teams.map(team => {
    if (team.id === playerTeamId) return team;
    const isTopTeam = team.budget > 40_000_000;
    
    const updatedDrivers = team.drivers.map(driver => {
      let strategyTyres: 'Soft' | 'Hard' | 'Wets' = 'Soft';
      let strategyStops = 2;

      if (weather === Weather.Rain) {
        strategyTyres = 'Wets';
        strategyStops = 2; 
      } else {
        const stratRoll = Math.random();
        if (isTopTeam) {
            // Top teams prefer Softs and aggressive strategies
            if (stratRoll < 0.8) {
                strategyTyres = 'Soft';
                strategyStops = 2; 
            } else {
                strategyTyres = 'Soft';
                strategyStops = 3; 
            }
        } else {
            // Backmarkers try weird things or conservative 1-stops
            if (stratRoll < 0.4) {
                strategyTyres = 'Soft';
                strategyStops = 2;
            } else if (stratRoll < 0.9) {
                strategyTyres = 'Hard';
                strategyStops = 1; 
            } else {
                strategyTyres = 'Hard'; 
                strategyStops = 2; 
            }
        }
      }
      return { ...driver, strategyTyres, strategyStops } as Driver;
    });
    return { ...team, drivers: updatedDrivers };
  });
};

export const calculateTeamTarget = (teams: Team[], playerTeamId: string): number => {
    const teamsWithStrength = teams.map(t => {
        const carPerf = getCarPerformance(t);
        const avgDriverSkill = t.drivers.reduce((acc, d) => acc + d.skill, 0) / t.drivers.length;
        return {
            id: t.id,
            strength: carPerf + avgDriverSkill
        };
    });
    teamsWithStrength.sort((a, b) => b.strength - a.strength);
    const playerRank = teamsWithStrength.findIndex(t => t.id === playerTeamId);
    let target = Math.floor(playerRank * 1.5) + 3;
    if (target < 1) target = 1;
    if (target > 18) target = 18; 
    return target;
};

// Generates a full sponsor list for a team, respecting unavailable sponsors
export const generateSponsors = (unavailableSponsors: string[] = []): Sponsor[] => {
    const count = Math.floor(Math.random() * 6) + 5; // 5 to 10
    const available = SPONSOR_NAMES.filter(name => !unavailableSponsors.includes(name));
    const pool = available.length >= count ? available : SPONSOR_NAMES;
    
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    
    const main: Sponsor = {
        name: shuffled[0],
        type: 'Main',
        value: Math.floor(Math.random() * 2_000_000) + 3_000_000 
    };
    
    const secondary: Sponsor[] = [];
    for(let i=1; i<count; i++) {
        secondary.push({
            name: shuffled[i],
            type: 'Secondary',
            value: Math.floor(Math.random() * 400_000) + 200_000 
        });
    }
    
    return [main, ...secondary];
};

export const generateSponsorOffers = (currentPos: number, unavailableSponsors: string[] = []): Sponsor[] => {
    const available = SPONSOR_NAMES.filter(name => !unavailableSponsors.includes(name));
    const pool = available.length >= 3 ? available : SPONSOR_NAMES;
    
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 3);
    const offers: Sponsor[] = [];
    const baseValue = Math.max(1_000_000, 6_000_000 - (currentPos * 200_000));

    shuffled.forEach((name, idx) => {
        const variation = (Math.random() * 0.4) + 0.8;
        const raceValue = Math.floor(baseValue * variation);
        const signingBonus = Math.floor(raceValue * (3 + Math.random() * 2));

        offers.push({
            name,
            type: 'Main',
            value: Math.floor(raceValue / 10000) * 10000,
            signingBonus: Math.floor(signingBonus / 100000) * 100000
        });
    });

    return offers;
}

export const generateSecondarySponsorOffers = (currentPos: number, unavailableSponsors: string[] = []): Sponsor[] => {
    const available = SPONSOR_NAMES.filter(name => !unavailableSponsors.includes(name));
    const pool = available.length >= 3 ? available : SPONSOR_NAMES;

    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 3);
    const offers: Sponsor[] = [];
    const baseValue = Math.max(100_000, 600_000 - (currentPos * 20_000));

    shuffled.forEach((name) => {
        const variation = (Math.random() * 0.4) + 0.8;
        const raceValue = Math.floor(baseValue * variation);
        
        offers.push({
            name,
            type: 'Secondary',
            value: Math.floor(raceValue / 5000) * 5000, 
            signingBonus: 0 
        });
    });
    return offers;
};

export const validateHiring = (
    team: Team, 
    candidate: Driver | Staff, 
    currentStandingsPos: number,
    type: 'Driver' | 'Staff'
): { success: boolean; reason?: string } => {
    const totalCash = team.budget; 
    const totalSigningCost = candidate.cost + candidate.salary; // Signing Fee + 1st Year Salary

    // Financial Check
    if (totalCash < totalSigningCost) {
        return { 
            success: false, 
            reason: `Finance Rejection: Your current budget ($${(totalCash/1000000).toFixed(1)}M) is insufficient. Total needed: $${(totalSigningCost/1000000).toFixed(2)}M (Signing Fee + Salary).` 
        };
    }

    // Performance Check
    if (type === 'Driver') {
        const carPerformance = getCarPerformance(team);
        const requiredCarPerf = Math.max(50, candidate.skill - 10);
        
        if (carPerformance < requiredCarPerf) {
            return {
                success: false,
                reason: `Performance Rejection: "Your car is too slow. My skill is ${candidate.skill}, but your package is rated only ${carPerformance.toFixed(0)}. I need a car rated at least ${requiredCarPerf} to compete."`
            };
        }
    } else {
        // Staff Rejection Logic
        let requiredPos = 22;
        if (candidate.skill > 90) requiredPos = 6; // Top staff want top 6
        else if (candidate.skill > 80) requiredPos = 12; // Good staff want midfield
        else if (candidate.skill > 70) requiredPos = 18;

        if (currentStandingsPos > requiredPos) {
             return {
                success: false,
                reason: `Reputation Rejection: "I only work for competitive teams. Your current position (P${currentStandingsPos}) is not attractive enough."`
            };
        }
    }

    return { success: true };
};

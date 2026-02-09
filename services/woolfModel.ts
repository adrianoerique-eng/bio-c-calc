import { CalculatorInputs, CalculationResult, SoilTempScenario, TimePoint, MassUnit } from '../types';

export const WOOLF_TABLE_3: Record<number, Record<number, { chc: number; mhc: number }>> = {
  5: {
    100: { chc: 1.13, mhc: -0.46 },
    500: { chc: 0.99, mhc: -0.65 },
    1000: { chc: 0.80, mhc: -0.62 },
  },
  10: {
    100: { chc: 1.10, mhc: -0.59 },
    500: { chc: 0.74, mhc: -0.60 },
    1000: { chc: 0.47, mhc: -0.42 },
  },
  15: {
    100: { chc: 1.04, mhc: -0.64 },
    500: { chc: 0.57, mhc: -0.49 },
    1000: { chc: 0.30, mhc: -0.27 },
  },
  20: {
    100: { chc: 1.01, mhc: -0.65 },
    500: { chc: 0.48, mhc: -0.43 },
    1000: { chc: 0.23, mhc: -0.21 },
  },
  25: {
    100: { chc: 0.98, mhc: -0.66 },
    500: { chc: 0.43, mhc: -0.39 },
    1000: { chc: 0.20, mhc: -0.17 },
  },
  10.9: {
    100: { chc: 1.09, mhc: -0.60 },
    500: { chc: 0.71, mhc: -0.58 },
    1000: { chc: 0.43, mhc: -0.38 },
  },
  14.9: {
    100: { chc: 1.04, mhc: -0.64 },
    500: { chc: 0.57, mhc: -0.50 },
    1000: { chc: 0.30, mhc: -0.28 },
  }
};

export const calculateSequestration = (inputs: CalculatorInputs): CalculationResult => {
  const { massInput, massUnit, isDirectBiocharInput, biocharYield, carbonContent, hcRatio, selectedSoilTemps } = inputs;

  // Normalização para Toneladas Métricas
  let normalizedMass = massInput;
  if (massUnit === MassUnit.GRAM) {
    normalizedMass = massInput / 1_000_000;
  } else if (massUnit === MassUnit.KILOGRAM) {
    normalizedMass = massInput / 1_000;
  }

  // 1. Corrente de Massa Final (em Toneladas)
  let biocharMassTons = 0;
  if (isDirectBiocharInput) {
    biocharMassTons = normalizedMass;
  } else {
    biocharMassTons = normalizedMass * (biocharYield / 100);
  }
  
  const carbonMassTons = biocharMassTons * (carbonContent / 100); 

  const scenarios: SoilTempScenario[] = [];

  selectedSoilTemps.forEach(temp => {
    const dataPoints: TimePoint[] = [];
    const horizons = [100, 500, 1000];
    const coeffs100 = WOOLF_TABLE_3[temp]?.[100] || { chc: 0, mhc: 0 };

    dataPoints.push({
      year: 0,
      fPerm: 1.0,
      co2Sequestered: carbonMassTons * (44 / 12)
    });

    horizons.forEach(year => {
      const coeffs = WOOLF_TABLE_3[temp]?.[year];
      let fPerm = 0;
      if (coeffs) {
        fPerm = coeffs.chc + (coeffs.mhc * hcRatio);
      }
      fPerm = Math.max(0, Math.min(1, fPerm));
      const co2e = carbonMassTons * (44 / 12) * fPerm;

      dataPoints.push({
        year,
        fPerm,
        co2Sequestered: co2e
      });
    });

    scenarios.push({
      temp,
      chc: coeffs100.chc,
      mhc: coeffs100.mhc,
      dataPoints
    });
  });

  const mainScenario = scenarios[0];
  const p100 = mainScenario?.dataPoints.find(p => p.year === 100);
  const efficiencyRatio = p100 && biocharMassTons > 0 ? (p100.co2Sequestered / biocharMassTons) : 0;

  return {
    inputs,
    scenarios,
    totalBiocharMass: biocharMassTons,
    totalCarbonMass: carbonMassTons,
    efficiencyRatio
  };
};
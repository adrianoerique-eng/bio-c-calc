import { CalculatorInputs, CalculationResult, SoilTempScenario, TimePoint } from '../types';

// Tabela 3 EXATA extraída de Woolf et al. (2021)
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
    100: { chc: 0.98, mhc: -0.66 }, // SEUS DADOS DO EXCEL BATEM AQUI
    500: { chc: 0.43, mhc: -0.39 },
    1000: { chc: 0.20, mhc: -0.17 },
  },
  10.9: { // US Croplands Average
    100: { chc: 1.09, mhc: -0.60 },
    500: { chc: 0.71, mhc: -0.58 },
    1000: { chc: 0.43, mhc: -0.38 },
  },
  14.9: { // Global Croplands Average
    100: { chc: 1.04, mhc: -0.64 },
    500: { chc: 0.57, mhc: -0.50 },
    1000: { chc: 0.30, mhc: -0.28 },
  }
};

// Helper para UI
export const getWoolfCoefficients = (temp: number, year: number) => {
  return WOOLF_TABLE_3[temp]?.[year] || { chc: 0, mhc: 0 };
};

export const calculateSequestration = (inputs: CalculatorInputs): CalculationResult => {
  const { massInput, isDirectBiocharInput, biocharYield, carbonContent, hcRatio, selectedSoilTemps } = inputs;

  // 1. Corrente de Massa
  let biocharMass = 0;
  
  if (isDirectBiocharInput) {
    // Usuário já inseriu a massa final (Qbiochar do Excel)
    biocharMass = massInput;
  } else {
    // Usuário inseriu biomassa bruta, aplicar rendimento
    biocharMass = massInput * (biocharYield / 100);
  }
  
  // Massa de Carbono Orgânico (Corg)
  const carbonMass = biocharMass * (carbonContent / 100); 

  const scenarios: SoilTempScenario[] = [];

  // 2. Iterar sobre temperaturas de solo selecionadas
  selectedSoilTemps.forEach(temp => {
    const dataPoints: TimePoint[] = [];
    const horizons = [100, 500, 1000];
    
    // Captura coeficientes de 100 anos para registro no cenário (para debug/auditoria)
    const coeffs100 = getWoolfCoefficients(temp, 100);

    dataPoints.push({
      year: 0,
      fPerm: 1.0,
      co2Sequestered: carbonMass * (44 / 12)
    });

    horizons.forEach(year => {
      const coeffs = WOOLF_TABLE_3[temp]?.[year];
      
      let fPerm = 0;
      
      if (coeffs) {
        // Eq 5: Fperm = chc + mhc * H/C
        fPerm = coeffs.chc + (coeffs.mhc * hcRatio);
      }
      
      fPerm = Math.max(0, Math.min(1, fPerm));

      // CO2e = M_biochar * (%C) * (44/12) * Fperm
      const co2e = carbonMass * (44 / 12) * fPerm;

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

  // Calcula razão de eficiência para o primeiro cenário (100 anos)
  // Útil para comparar com a coluna "tCO2e/t biochar" do Excel
  const mainScenario = scenarios[0];
  const p100 = mainScenario?.dataPoints.find(p => p.year === 100);
  const efficiencyRatio = p100 && biocharMass > 0 ? (p100.co2Sequestered / biocharMass) : 0;

  return {
    inputs,
    scenarios,
    totalBiocharMass: biocharMass,
    totalCarbonMass: carbonMass,
    efficiencyRatio
  };
};
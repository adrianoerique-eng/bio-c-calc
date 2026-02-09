
export enum BiomassType {
  ELEPHANT_GRASS = 'Capim Elefante',
  SORGHUM = 'Sorgo',
  CASHEW_SHELL = 'Casca da Castanha de Caju',
  SUGARCANE_BAGASSE = 'Bagaço de Cana',
  CARNAUBA = 'Carnaúba',
  COCONUT_HUSK = 'Casca de Coco',
  BABASSU = 'Casca de Babaçu',
  CASSAVA = 'Resíduos de Mandioca',
  WOOD = 'Madeira/Lenha',
  MANURE = 'Esterco',
  OTHER = 'Outra Biomassa'
}

export enum AcademicLevel {
  UNDERGRADUATE = 'Graduação',
  MASTERS = 'Mestrado',
  PHD = 'Doutorado',
  POSTDOC = 'Pós-Doutorado',
  OTHER = 'Outro'
}

export enum MassUnit {
  GRAM = 'g',
  KILOGRAM = 'kg',
  TON = 't'
}

export interface CalculatorInputs {
  studentName: string;
  level: AcademicLevel;
  researchTitle: string;
  advisorName: string;
  institution: string;
  city: string;
  state: string;
  sampleName: string;
  biomassType: BiomassType;
  isDirectBiocharInput: boolean;
  massInput: number;
  massUnit: MassUnit;
  biocharYield: number;
  pyrolysisTemp: number;
  carbonContent: number;
  hcRatio: number;
  ocRatio: number;
  selectedSoilTemps: number[];
}

export interface TimePoint {
  year: number;
  fPerm: number;
  co2Sequestered: number;
}

export interface SoilTempScenario {
  temp: number;
  chc: number;
  mhc: number;
  dataPoints: TimePoint[]; 
}

export interface CalculationResult {
  inputs: CalculatorInputs;
  scenarios: SoilTempScenario[];
  totalBiocharMass: number; // Sempre em Toneladas para o cálculo
  totalCarbonMass: number;
  efficiencyRatio: number;
}
export enum BiomassType {
  // Solicitados
  ELEPHANT_GRASS = 'Capim Elefante',
  SORGHUM = 'Sorgo',
  CASHEW_SHELL = 'Casca da Castanha de Caju',
  SUGARCANE_BAGASSE = 'Bagaço de Cana',
  CARNAUBA = 'Carnaúba',

  // Sugestões Regionais (Nordeste)
  COCONUT_HUSK = 'Casca de Coco',
  BABASSU = 'Casca de Babaçu',
  CASSAVA = 'Resíduos de Mandioca',
  
  // Genéricos
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

export interface CalculatorInputs {
  // Metadados do Projeto
  studentName: string;
  level: AcademicLevel;
  researchTitle: string;
  advisorName: string;
  institution: string;
  city: string;
  state: string;
  sampleName: string;
  
  // Dados de Entrada
  biomassType: BiomassType;
  isDirectBiocharInput: boolean;
  massInput: number;
  biocharYield: number;
  pyrolysisTemp: number;
  carbonContent: number;
  hcRatio: number; // Razão Molar H/Corg
  ocRatio: number; // Novo: Razão Molar O/Corg
  selectedSoilTemps: number[];
  
  // Termos
  dataAuthorization: boolean;
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
  totalBiocharMass: number;
  totalCarbonMass: number;
  efficiencyRatio: number;
}
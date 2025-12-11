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
  level: AcademicLevel; // Novo campo
  researchTitle: string;
  advisorName: string;
  institution: string;
  city: string;
  state: string;
  sampleName: string;
  
  // Dados de Entrada
  biomassType: BiomassType;
  isDirectBiocharInput: boolean; // Novo: Define se input é massa final ou matéria prima
  massInput: number; // Toneladas (pode ser Feedstock ou Biochar dependendo da flag)
  biocharYield: number; // % (Relevante apenas se !isDirectBiocharInput)
  pyrolysisTemp: number; // °C
  carbonContent: number; // %
  hcRatio: number; // Razão Molar H/Corg
  selectedSoilTemps: number[]; // Lista de temperaturas de solo
  
  // Termos
  dataAuthorization: boolean;
}

export interface TimePoint {
  year: number;
  fPerm: number; // Fração de permanência (0-1)
  co2Sequestered: number; // tCO2e
}

export interface SoilTempScenario {
  temp: number;
  chc: number; // Coeficiente usado (para auditoria)
  mhc: number; // Coeficiente usado (para auditoria)
  dataPoints: TimePoint[]; 
}

export interface CalculationResult {
  inputs: CalculatorInputs;
  scenarios: SoilTempScenario[];
  totalBiocharMass: number;
  totalCarbonMass: number;
  efficiencyRatio: number; // tCO2e / t Biochar (para 100 anos no cenário principal)
}
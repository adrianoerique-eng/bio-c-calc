import { createClient } from '@supabase/supabase-js';
import { CalculatorInputs } from '../types';

// CONFIGURAÇÃO DO BANCO DE DADOS (SUPABASE)
// Para produção, recomenda-se usar variáveis de ambiente (process.env.SUPABASE_URL)
// Você deve substituir as strings abaixo pelas credenciais do seu projeto Supabase.
const SUPABASE_URL = process.env.SUPABASE_URL || ''; 
const SUPABASE_ANON_KEY = process.env.SUPABASE_KEY || '';

// Inicialização segura do cliente
const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

export const saveResearchData = async (inputs: CalculatorInputs, calculatedBiocharMass: number) => {
  // 1. Verifica se o usuário autorizou
  if (!inputs.dataAuthorization) {
    return;
  }

  // 2. Verifica se o banco está configurado
  if (!supabase) {
    console.warn("BioC-Calc: Banco de dados não configurado. Dados não foram salvos.");
    return;
  }

  try {
    // 3. Prepara o payload para o banco de dados
    const payload = {
      student_name: inputs.studentName,
      level: inputs.level, // Nível acadêmico
      advisor_name: inputs.advisorName,
      research_title: inputs.researchTitle,
      institution: inputs.institution,
      city: inputs.city,
      state: inputs.state,
      sample_id: inputs.sampleName,
      biomass_type: inputs.biomassType,
      
      // Dados Técnicos
      pyrolysis_temp: inputs.pyrolysisTemp,
      carbon_content: inputs.carbonContent,
      hc_ratio: inputs.hcRatio,
      
      // Resultados Calculados
      biochar_mass_ton: calculatedBiocharMass,
      
      // Metadados
      collected_at: new Date().toISOString(),
      app_version: '1.0.0'
    };

    // 4. Insere na tabela 'biochar_research'
    const { data, error } = await supabase
      .from('biochar_research')
      .insert([payload]);

    if (error) {
      console.error('Erro ao salvar dados no NPCO2:', error);
    } else {
      console.log('Dados salvos com sucesso na base do NPCO2.');
    }
  } catch (err) {
    console.error('Erro inesperado ao conectar ao banco:', err);
  }
};
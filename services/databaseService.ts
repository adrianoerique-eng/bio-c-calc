import { createClient } from '@supabase/supabase-js';
import { CalculatorInputs } from '../types';

const getEnvVar = (name: string): string => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[name] || '';
    }
  } catch (e) {}
  return '';
};

const SUPABASE_URL = getEnvVar('SUPABASE_URL'); 
const SUPABASE_ANON_KEY = getEnvVar('SUPABASE_KEY');

const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

export const saveResearchData = async (inputs: CalculatorInputs, calculatedBiocharMass: number) => {
  if (!inputs.dataAuthorization || !supabase) {
    return;
  }

  try {
    const payload = {
      student_name: inputs.studentName,
      level: inputs.level,
      advisor_name: inputs.advisorName,
      research_title: inputs.researchTitle,
      institution: inputs.institution,
      city: inputs.city,
      state: inputs.state,
      sample_id: inputs.sampleName,
      biomass_type: inputs.biomassType,
      pyrolysis_temp: inputs.pyrolysisTemp,
      carbon_content: inputs.carbonContent,
      hc_ratio: inputs.hcRatio,
      oc_ratio: inputs.ocRatio,
      biochar_mass_ton: calculatedBiocharMass,
      collected_at: new Date().toISOString(),
      app_version: '1.2.2'
    };

    const { error } = await supabase.from('biochar_research').insert([payload]);
    if (error) console.error('Supabase error:', error.message);
  } catch (err) {}
};
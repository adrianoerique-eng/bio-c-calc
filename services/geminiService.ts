import { GoogleGenAI } from "@google/genai";
import { CalculationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBiocharReport = async (data: CalculationResult): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Chave da API não encontrada.";
  }

  // Simplificando o envio de dados para o prompt (pegando o primeiro cenário como principal)
  const mainScenario = data.scenarios[0];
  const p100 = mainScenario.dataPoints.find(p => p.year === 100);

  const prompt = `
    Aja como um especialista em certificação de carbono de biochar.
    
    Analise o seguinte projeto calculado pelo método Woolf et al. (2021):
    
    Amostra: ${data.inputs.sampleName}
    Biomassa: ${data.inputs.biomassType}
    Razão H/C (molar): ${data.inputs.hcRatio}
    Temperatura do Solo Principal: ${mainScenario.temp}°C
    
    Resultados para 100 Anos (Temp Principal):
    - Fperm (Permanência): ${((p100?.fPerm || 0) * 100).toFixed(1)}%
    - Sequestro: ${p100?.co2Sequestered.toFixed(2)} tCO2e
    
    Crie um parágrafo técnico curto validando se este biochar tem alta estabilidade (H/C < 0.4 ideal) e como a temperatura do solo (${mainScenario.temp}C) afeta a permanência comparada a solos mais quentes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Sem resposta.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro IA.";
  }
};
import { GoogleGenAI } from "@google/genai";
import { CalculationResult } from "../types";

export const generateBiocharReport = async (data: CalculationResult): Promise<string> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("Gemini API Key missing.");
    return "";
  }

  const ai = new GoogleGenAI({ apiKey });

  const mainScenario = data.scenarios[0];
  const p100 = mainScenario.dataPoints.find(p => p.year === 100);

  // Prompt otimizado para ser ultra-conciso e científico
  const prompt = `Analise este biochar (Woolf Model):
Biomassa: ${data.inputs.biomassType}
H/C: ${data.inputs.hcRatio}
O/C: ${data.inputs.ocRatio}
Temp Solo: ${mainScenario.temp}°C
Permanência (100a): ${((p100?.fPerm || 0) * 100).toFixed(1)}%
Sequestro: ${p100?.co2Sequestered.toFixed(2)} tCO2e

Forneça um insight técnico curto (máx 250 caracteres) sobre a estabilidade e elegibilidade para créditos de carbono.
REGRAS: Use apenas texto puro, sem markdown, sem negritos, sem aspas. Seja direto e acadêmico.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text?.trim() || "";
  } catch (error) {
    // Log interno, mas retorno vazio para a UI não mostrar erro ao usuário
    console.error("Gemini API Error:", error);
    return "";
  }
};
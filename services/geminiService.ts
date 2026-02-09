
import { GoogleGenAI } from "@google/genai";
import { CalculationResult } from "../types";

export const generateBiocharReport = async (data: CalculationResult): Promise<string> => {
  // A variável é injetada via vite.config.ts define
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("Gemini API Key missing in runtime context.");
    return "";
  }

  const ai = new GoogleGenAI({ apiKey });

  const mainScenario = data.scenarios[0];
  const p100 = mainScenario.dataPoints.find(p => p.year === 100);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise estes resultados do Modelo Woolf:
Biomassa: ${data.inputs.biomassType}
Razão H/C: ${data.inputs.hcRatio.toFixed(2)}
Temperatura Solo: ${mainScenario.temp}°C
Permanência 100 anos: ${((p100?.fPerm || 0) * 100).toFixed(1)}%
CO2 Sequestrado: ${p100?.co2Sequestered.toFixed(2)} tCO2e`,
      config: {
        systemInstruction: "Você é um cientista sênior especializado em sequestro de carbono via biochar. Forneça insights técnicos curtíssimos (máx 240 caracteres), focando na estabilidade química e elegibilidade para créditos. Use tom acadêmico, sem markdown, sem negritos, sem aspas e sem saudações.",
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 0 } // Velocidade máxima para análise direta
      },
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Technical Insight Error:", error);
    return "";
  }
};
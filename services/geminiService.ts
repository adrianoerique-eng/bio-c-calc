
import { GoogleGenAI } from "@google/genai";
import { CalculationResult } from "../types";

export const generateBiocharReport = async (data: CalculationResult): Promise<string> => {
  // Captura a chave injetada pelo Vite
  const apiKey = process.env.API_KEY;

  // Verifica se a chave é válida (evita strings 'undefined' ou vazias)
  if (!apiKey || apiKey === 'undefined' || apiKey.length < 10) {
    console.warn("Gemini Service: API Key não configurada ou inválida no ambiente.");
    return "";
  }

  const ai = new GoogleGenAI({ apiKey });

  const mainScenario = data.scenarios[0];
  const p100 = mainScenario.dataPoints.find(p => p.year === 100);

  const prompt = `Analise tecnicamente este biochar (Woolf Model):
- Matéria-prima: ${data.inputs.biomassType}
- Estabilidade (H/C): ${data.inputs.hcRatio.toFixed(2)}
- Retenção 100 anos: ${((p100?.fPerm || 0) * 100).toFixed(1)}%
- Carbono Sequestrado: ${p100?.co2Sequestered.toFixed(2)} tCO2e
- Temperatura Solo: ${mainScenario.temp}°C

Instrução: Forneça um resumo científico ultra-conciso (máx 220 caracteres) sobre a viabilidade de créditos de carbono e estabilidade de longo prazo. Não use markdown, negritos ou saudações.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Você é um perito em certificação de biochar. Sua resposta deve ser puramente textual, direta e acadêmica.",
        temperature: 0.1, // Baixa temperatura para maior precisão nos dados
        topP: 0.8,
        thinkingConfig: { thinkingBudget: 0 }
      },
    });

    const text = response.text?.trim() || "";
    if (!text) console.warn("Gemini Service: Resposta vazia recebida do modelo.");
    return text;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return "";
  }
};
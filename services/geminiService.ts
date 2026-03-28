
import { GoogleGenAI, Type } from "@google/genai";
import { FractalParams, AIInsight } from "../types";

export async function getFractalInsight(params: FractalParams, customApiKey?: string): Promise<AIInsight> {
  const apiKey = customApiKey || process.env.API_KEY || "";
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const prompt = `
    作为一位世界顶级的数学美学专家和生物学家，请基于以下分形参数提供深刻的洞察：
    分形类型: ${params.type}
    参数详情: 
    - 迭代次数: ${params.maxIterations}
    - 缩放级别: ${params.zoom}
    - 坐标位置: (${params.offsetX}, ${params.offsetY})

    请以JSON格式回答，包含以下字段：
    - mathConcept: 这个参数设置所反映的核心数学原理。
    - natureAnalogy: 这种视觉形态在自然界中最贴切的类比（如某种植物、云朵或地貌）。
    - philosophy: 这种分形结构带给人类的哲学启示。
    请确保使用中文回答。
  `;

  try {
    if (params.aiModel === 'deepseek-r1') {
      // DeepSeek R1 API (OpenAI Compatible)
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-reasoner", // This is the model ID for DeepSeek R1
          messages: [
            { role: "system", content: "你是一个数学和分形几何专家。请只输出JSON格式的回答。" },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "DeepSeek API Error");
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      return JSON.parse(content) as AIInsight;
    } else {
      // Gemini 3 Flash
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: params.aiModel,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mathConcept: { type: Type.STRING },
              natureAnalogy: { type: Type.STRING },
              philosophy: { type: Type.STRING },
            },
            required: ["mathConcept", "natureAnalogy", "philosophy"],
          },
        },
      });

      const result = JSON.parse(response.text || "{}");
      return result as AIInsight;
    }
  } catch (error) {
    console.error("AI Insight Error:", error);
    return {
      mathConcept: "自相似性是分形的核心，代表了简单规则产生复杂性的力量。",
      natureAnalogy: "由于 API Key 未设置或失效，显示默认洞察：这类似于自然界中不断自我重复的生长脉络。",
      philosophy: "局部包含整体的信息，一沙一世界，一叶一菩提。请在设置中检查 API Key 以获取深度分析。",
    };
  }
}

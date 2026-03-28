
export enum FractalType {
  FractalTree = 'FractalTree',
  BarnsleyFern = 'BarnsleyFern',
  KochSnowflake = 'KochSnowflake',
  Lorenz = 'LorenzAttractor',
  CantorSet = 'CantorSet',
}

export type AIModelType = 'gemini-3-flash-preview' | 'deepseek-r1';

export interface FractalParams {
  type: FractalType;
  maxIterations: number;
  zoom: number;
  offsetX: number;
  offsetY: number;
  juliaCReal: number;
  juliaCImg: number;
  treeAngle: number;
  treeLengthRatio: number;
  aiModel: AIModelType;
}

export interface AIInsight {
  mathConcept: string;
  natureAnalogy: string;
  philosophy: string;
}

export interface FractalKnowledge {
  title: string;
  generator: string;
  formula: string;
  description: string;
}

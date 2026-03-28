
import { FractalType, FractalParams, FractalKnowledge } from './types';

export const INITIAL_PARAMS: FractalParams = {
  type: FractalType.FractalTree,
  maxIterations: 120,
  zoom: 0.8,
  offsetX: 0,
  offsetY: 0,
  juliaCReal: -0.8,
  juliaCImg: 0.156,
  treeAngle: 25,
  treeLengthRatio: 0.7,
  aiModel: 'gemini-3-flash-preview',
};

export const FRACTAL_ENCYCLOPEDIA: Record<FractalType, FractalKnowledge> = {
  [FractalType.FractalTree]: {
    title: "分形树：生命的生长逻辑",
    generator: "基于 L-System 的递归分叉基元。每一根主干在末端都会根据预设的长度比例和角度，分裂出两个或多个子分支。",
    formula: "L_next = L_current * r; θ_left = θ - δ; θ_right = θ + δ (递归深度 n → ∞)",
    description: "分形树深刻地模拟了自然界中植物的能量分配逻辑。这种结构不仅出现在森林的树冠中，还完美契合了人类肺部的支气管分布以及循环系统中的毛细血管网络。通过极简的递归指令，自然界实现了表面积的最大化，从而高效地进行物质交换。其数学本质是拓扑学中的分叉树图论。"
  },
  [FractalType.BarnsleyFern]: {
    title: "巴恩斯利蕨：确定的随机性",
    generator: "迭代函数系统 (IFS)。通过四组不同的线性仿射变换，根据不同的概率权重（85%, 7%, 7%, 1%）对空间点进行映射。",
    formula: "W(x,y) = [a, b; c, d][x; y] + [e; f]; 概率分布 P_i 决定形态走向",
    description: "由迈克尔·巴恩斯利在1988年提出。它展示了如何用仅仅四行数学公式，就能生成与现实中的铁线蕨几乎无异的复杂形态。这证明了自然界的复杂有机形态可能并非来源于复杂的指令，而是来源于简单逻辑在概率驱动下的海量叠加。它是计算机图形学中“分形压缩”技术的灵感来源。"
  },
  [FractalType.KochSnowflake]: {
    title: "科赫雪花：无限周长的奇迹",
    generator: "三分剔除与等边构建。将每一条直线段均分为三段，用一个向外突出的等边三角形的两边替换掉中间的那一段。",
    formula: "周长 P_n = 3 * L * (4/3)^n; 面积 A_n = A_0 * [1 + 3/5(1 - (4/9)^n)]",
    description: "科赫雪花是一个迷人的数学悖论：它的周长随着迭代趋向于无穷大，但它所围成的面积却是有限的。这种性质在物理学中被用来解释海岸线的长度测量问题。它揭示了“维度”并非只能是整数——科赫曲线的豪斯多夫维度大约是 1.2619。它是研究超大规模集成电路布线优化和分形天线设计的重要模型。"
  },
  [FractalType.Lorenz]: {
    title: "洛伦兹吸引子：混沌的蝴蝶",
    generator: "三阶非线性常微分方程组。描述大气对流的简化模型，展示了在相空间中永不重复且永不相交的奇轨迹。",
    formula: "dx/dt = σ(y-x); dy/dt = x(ρ-z)-y; dz/dt = xy-βz (经典参数: 10, 28, 8/3)",
    description: "这是混沌理论的基石，“蝴蝶效应”的直观表达。它表明在某些非线性系统中，初始条件的极微小差异会导致最终结果的巨大偏差。洛伦兹吸引子的轨迹像是一双永恒舞动的蝴蝶翅膀，它揭示了在看似完全不可预测的混沌背后，依然存在着一个结构化的、拥有固定维度的几何吸引中心。"
  },
  [FractalType.CantorSet]: {
    title: "康托尔集：连续统的尘埃",
    generator: "中间三分剔除法。将单位闭区间 [0,1] 均分为三段，剔除中间的开区间，对剩余的两段不断重复此操作。",
    formula: "C = [0, 1] \\ ∪_{m=1}^∞ ∪_{k=0}^{3^{m-1}-1} ( (3k+1)/3^m, (3k+2)/3^m )",
    description: "康托尔集是集合论中最神秘的构造之一。它是一个“处处不稠密”的集合，测度为零（几乎不占空间），但其中的点数却与实数轴上的点数一样多（不可数）。这种“分形尘埃”的概念在描述土星环的分布、某些噪声信号的间歇性以及多孔介质的物理特性时具有不可替代的科学价值。"
  }
};

export const CONCEPTS = [
  {
    id: 'self-similarity',
    title: '自相似性：万物归一',
    subtitle: 'Self-Similarity',
    desc: '局部以某种精确或统计的方式与整体相似。这种特性意味着无论你在显微镜下如何放大，你依然能看到最初的模式。它是分形几何最灵魂的特征，预示着宇宙中微观与宏观信息的全息关联，局部即是整体的缩影。',
    icon: 'Infinity'
  },
  {
    id: 'iteration',
    title: '反馈迭代：简单孕育伟大',
    subtitle: 'Iteration',
    desc: '简单的数学规则通过千百万次的递归与反馈，演化出令人惊叹的无限复杂结构。这正如生命的进化：DNA中简单的碱基对编码，在亿万年的生命进程中迭代出如此璀璨的生物多样性。简单并不简陋，它是复杂性的种子。',
    icon: 'RefreshCw'
  },
  {
    id: 'chaos-order',
    title: '混沌之序：隐藏的逻辑',
    subtitle: 'Chaos & Order',
    desc: '在看似随机、无序的自然现象背后（如闪电、云团、山脉），隐藏着严密的数学逻辑。分形几何提供了一套全新的语言，让我们能够量化自然界的粗糙度与非规则性。混沌并非混乱，而是更高维度、更深层次的和谐秩序。',
    icon: 'Waves'
  }
];

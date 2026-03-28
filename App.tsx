
import React, { useState, useEffect } from 'react';
import { INITIAL_PARAMS, CONCEPTS, FRACTAL_ENCYCLOPEDIA } from './constants';
import { FractalType, FractalParams, AIInsight, AIModelType } from './types';
import FractalCanvas from './components/FractalCanvas';
import { getFractalInsight } from './services/geminiService';
import { 
  Settings, 
  Play, 
  Pause, 
  RefreshCcw, 
  Infinity,
  Waves,
  RefreshCw,
  Sparkles,
  Zap,
  Brain,
  MousePointer2,
  Loader2,
  Cpu,
  ChevronRight,
  BookOpen,
  Key,
  FunctionSquare,
  Eye,
  EyeOff
} from 'lucide-react';

const App: React.FC = () => {
  const [params, setParams] = useState<FractalParams>(INITIAL_PARAMS);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(process.env.API_KEY || '');
  const [showKey, setShowKey] = useState(false);
  const [loadingText, setLoadingText] = useState("正在解码数学规律...");

  const knowledge = FRACTAL_ENCYCLOPEDIA[params.type];

  useEffect(() => {
    let interval: any;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setParams(prev => {
          if (prev.type === FractalType.FractalTree) {
            return {
              ...prev,
              treeAngle: prev.treeAngle + Math.sin(Date.now() / 2000) * 0.5,
            };
          }
          const nextZoom = prev.zoom + 0.001;
          return { ...prev, zoom: nextZoom > 1.0 ? 0.05 : nextZoom };
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  useEffect(() => {
    if (isLoadingInsight) {
      const texts = [
        "正在构建几何逻辑树...",
        "分析混沌系统吸引子...",
        "映射自然分形生长规律...",
        "计算豪斯多夫维度...",
        `调用深度模型 ${params.aiModel === 'deepseek-r1' ? 'DeepSeek R1' : 'Gemini 3 Flash'}...`
      ];
      let i = 0;
      const t = setInterval(() => {
        setLoadingText(texts[i % texts.length]);
        i++;
      }, 1500);
      return () => clearInterval(t);
    }
  }, [isLoadingInsight, params.aiModel]);

  const handleParamChange = (key: keyof FractalParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handlePan = (dx: number, dy: number) => {
    setParams(prev => ({
      ...prev,
      offsetX: prev.offsetX + dx,
      offsetY: prev.offsetY + dy
    }));
  };

  const handleZoomScroll = (delta: number) => {
    setParams(prev => ({
      ...prev,
      zoom: Math.max(0.01, Math.min(1.0, prev.zoom + delta * 0.1))
    }));
  };

  const fetchAIInsight = async () => {
    if (!apiKey) {
      alert("请先在 AI 设置中配置您的 API Key");
      setShowSettings(true);
      return;
    }
    setIsLoadingInsight(true);
    try {
      const insight = await getFractalInsight(params, apiKey);
      setAiInsight(insight);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const IconMap: any = { Infinity, Waves, RefreshCw };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 font-bold text-slate-800 pb-24 selection:bg-blue-100">
      {/* 顶部标题区 */}
      <header className="pt-16 pb-8 text-center z-10 px-4">
        <h1 className="text-6xl md:text-7xl font-black text-gradient-bright special-font tracking-tighter mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          分形之境
        </h1>
        <div className="flex items-center justify-center gap-4">
           <div className="h-[1px] w-12 bg-blue-200"></div>
           <p className="text-slate-400 font-black tracking-[0.4em] uppercase text-xs">
             混沌中的秩序 • 无限的几何美学
           </p>
           <div className="h-[1px] w-12 bg-blue-200"></div>
        </div>
      </header>

      {/* 核心画布交互区 */}
      <section className="relative w-full max-w-[96vw] h-[70vh] mx-auto px-2 mb-10 group">
        <div className="relative w-full h-full glass-light rounded-[48px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border-4 border-white">
          <FractalCanvas params={params} onPan={handlePan} onZoom={handleZoomScroll} />
          
          {/* 实验室控制面板 - 极致亮丽风格 */}
          <div className="absolute top-8 left-8 p-7 bg-white/80 backdrop-blur-2xl rounded-[36px] w-80 space-y-6 shadow-2xl border border-white/60 animate-in fade-in slide-in-from-left-4 duration-700">
             <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Settings size={20} className="text-blue-500 animate-spin-slow" />
                  <span className="text-sm font-black tracking-widest uppercase text-slate-600">实验室控制</span>
                </div>
                <div className="px-2 py-1 bg-blue-50 text-[10px] text-blue-500 rounded-md font-black tracking-tighter">BETA 2.0</div>
             </div>
             
             <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">分形算法引擎</label>
                  <select 
                    value={params.type}
                    onChange={(e) => handleParamChange('type', e.target.value)}
                    className="w-full bg-slate-50/80 border border-slate-100 rounded-2xl p-3 text-sm font-black outline-none focus:ring-4 focus:ring-blue-500/10 hover:bg-white transition-all appearance-none cursor-pointer"
                  >
                    {Object.values(FractalType).map(type => (
                      <option key={type} value={type}>
                        {type === FractalType.Lorenz ? '🦋 洛伦兹吸引子' : 
                         type === FractalType.CantorSet ? '⌛ 康托尔集' : 
                         type === FractalType.FractalTree ? '🌿 分形演化树' : 
                         type === FractalType.BarnsleyFern ? '🌱 巴恩斯利蕨' : 
                         type === FractalType.KochSnowflake ? '❄️ 科赫雪花曲线' : type}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                     <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">全局缩放比例</span>
                     <span className="text-xs text-blue-600 font-mono font-black bg-blue-50 px-2 py-0.5 rounded-full">{(params.zoom * 100).toFixed(0)}%</span>
                   </div>
                   <div className="relative group/slider">
                    <input 
                      type="range" min="0" max="1" step="0.01" value={params.zoom}
                      onChange={(e) => handleParamChange('zoom', parseFloat(e.target.value))}
                      className="w-full accent-blue-500 h-2 rounded-full appearance-none bg-slate-100 cursor-pointer"
                    />
                    <div className="flex justify-between mt-2 px-1">
                      <span className="text-[8px] text-slate-300 font-black uppercase">极简</span>
                      <span className="text-[8px] text-slate-300 font-black uppercase">宏观</span>
                    </div>
                   </div>
                </div>
             </div>

             <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className={`flex-2 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-xs font-black transition-all shadow-lg active:scale-95 ${isAutoPlaying ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-slate-900 text-white shadow-slate-900/10'}`}
                >
                  {isAutoPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                  {isAutoPlaying ? "暂停演化" : "开始演化"}
                </button>
                <button 
                   onClick={() => setParams(INITIAL_PARAMS)}
                   className="flex-1 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-500 transition-all active:rotate-180 duration-500"
                   title="重置空间"
                >
                  <RefreshCcw size={18} />
                </button>
             </div>
          </div>

          {/* 指南针交互提示 */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-white/50 flex items-center gap-3 shadow-xl animate-bounce-subtle">
             <MousePointer2 size={16} className="text-blue-500" />
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">拖拽探索空间 • 滚轮精准切入无限</span>
          </div>
        </div>
      </section>

      {/* 知识百科模块 - 亮丽科学画报风格 */}
      <section className="w-full max-w-[96vw] px-2 mb-10">
        <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-[48px] p-10 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.05)] border-2 border-white relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-1 space-y-8">
              <div className="flex items-center gap-4 border-b border-blue-100 pb-6">
                <div className="p-4 bg-blue-600 text-white rounded-[24px] shadow-xl shadow-blue-500/30">
                  <BookOpen size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-wider">{knowledge.title}</h2>
                  <p className="text-[10px] text-blue-400 font-black tracking-[0.3em] mt-1 uppercase">FRACTAL ENCYCLOPEDIA • VOLUME 1.0</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3 p-6 bg-white rounded-3xl shadow-sm border border-slate-50 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-blue-500 text-[11px] font-black uppercase tracking-widest">
                    <RefreshCw size={14} className="animate-spin-slow" /> 几何生成基元 (Generator)
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">{knowledge.generator}</p>
                </div>
                
                <div className="space-y-3 p-6 bg-white rounded-3xl shadow-sm border border-slate-50 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-emerald-500 text-[11px] font-black uppercase tracking-widest">
                    <FunctionSquare size={14} /> 数学核心公式 (The Formula)
                  </div>
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 text-emerald-800 text-sm font-mono tracking-tight font-bold break-all">
                    {knowledge.formula}
                  </div>
                </div>
              </div>
              
              <div className="p-8 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-[32px] shadow-xl">
                 <div className="flex items-center gap-3 mb-4">
                   <Infinity size={20} className="text-blue-100" />
                   <h3 className="text-xs font-black uppercase tracking-widest text-blue-50">深度几何释义与自然映射</h3>
                 </div>
                 <p className="text-base leading-relaxed font-medium text-white/90">
                   {knowledge.description}
                 </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI 智慧透视 - 增强设置面板 */}
      <section className="w-full max-w-[96vw] px-2 mb-16">
        <div className="bg-white/60 backdrop-blur-xl rounded-[48px] p-10 relative overflow-hidden shadow-sm border-2 border-white">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-tr from-cyan-400 to-blue-500 text-white rounded-2xl shadow-lg shadow-cyan-500/20">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase tracking-widest">AI 智慧透视</h2>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                       推理引擎: {params.aiModel === 'deepseek-r1' ? 'DEEPSEEK R1 (深度推理)' : 'GEMINI 3 FLASH (实时感知)'}
                     </span>
                     <div className="h-1 w-1 bg-slate-200 rounded-full"></div>
                     <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1">
                       <Zap size={8} /> 联机就绪
                     </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${showSettings ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <Settings size={18} className={showSettings ? 'animate-spin-slow' : ''} />
                配置引擎
              </button>
            </div>

            {showSettings ? (
              <div className="p-8 bg-slate-50/50 rounded-[40px] border border-white shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* API Key 设置 */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                       <div className="flex items-center gap-2 text-slate-500 text-[11px] font-black uppercase tracking-widest">
                         <Key size={14} className="text-blue-500" /> API Access Key (必须输入)
                       </div>
                       <button onClick={() => setShowKey(!showKey)} className="text-blue-400 hover:text-blue-600 transition-colors">
                          {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                       </button>
                    </div>
                    <div className="relative group">
                      <input 
                        type={showKey ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="在此粘贴您的 API Key"
                        className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300"
                      />
                      {!apiKey && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-amber-500 font-black uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-md">未配置</div>}
                    </div>
                    <p className="text-[10px] text-slate-400 px-2 leading-relaxed">提示：Gemini 3 Flash 请使用 Google AI Studio 的 Key；DeepSeek R1 请使用 DeepSeek 官方平台的 Key。</p>
                  </div>

                  {/* 模型选择面板 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 text-slate-500 text-[11px] font-black uppercase tracking-widest">
                       <Cpu size={14} className="text-purple-500" /> 选择智能逻辑引擎
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleParamChange('aiModel', 'gemini-3-flash-preview')}
                        className={`flex flex-col items-center gap-3 p-6 rounded-[28px] border-2 transition-all group ${params.aiModel === 'gemini-3-flash-preview' ? 'bg-white border-blue-500 shadow-xl' : 'bg-transparent border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className={`p-4 rounded-2xl ${params.aiModel === 'gemini-3-flash-preview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                          <Zap size={20} />
                        </div>
                        <div className="text-center">
                          <div className={`font-black text-xs uppercase tracking-widest ${params.aiModel === 'gemini-3-flash-preview' ? 'text-blue-600' : 'text-slate-400'}`}>Gemini 3 Flash</div>
                          <div className="text-[9px] text-slate-300 font-medium mt-1">极速感知</div>
                        </div>
                      </button>

                      <button 
                        onClick={() => handleParamChange('aiModel', 'deepseek-r1')}
                        className={`flex flex-col items-center gap-3 p-6 rounded-[28px] border-2 transition-all group ${params.aiModel === 'deepseek-r1' ? 'bg-white border-purple-500 shadow-xl' : 'bg-transparent border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className={`p-4 rounded-2xl ${params.aiModel === 'deepseek-r1' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                          <Brain size={20} />
                        </div>
                        <div className="text-center">
                          <div className={`font-black text-xs uppercase tracking-widest ${params.aiModel === 'deepseek-r1' ? 'text-purple-600' : 'text-slate-400'}`}>DeepSeek R1</div>
                          <div className="text-[9px] text-slate-300 font-medium mt-1">深度推理</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                   <button 
                    onClick={() => setShowSettings(false)}
                    className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                   >
                     完成引擎配置
                   </button>
                </div>
              </div>
            ) : (
              <div className="min-h-[180px] flex items-center justify-center">
                {!aiInsight && !isLoadingInsight ? (
                  <div className="text-center">
                    <p className="text-base text-slate-400 font-black mb-8 italic tracking-wide">“数学不只是公式，它是宇宙写给自然的底层代码”</p>
                    <button 
                      onClick={fetchAIInsight}
                      className="group relative px-14 py-5 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        解构几何之美 <ChevronRight size={16} />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>
                  </div>
                ) : isLoadingInsight ? (
                  <div className="flex flex-col items-center gap-6 animate-pulse">
                    <div className="relative">
                       <Loader2 size={48} className="text-blue-500 animate-spin" />
                       <Sparkles size={18} className="text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-500 font-black tracking-[0.4em] uppercase">{loadingText}</p>
                      <p className="text-[9px] text-slate-300 mt-2 font-black uppercase tracking-widest">正在连接至 {params.aiModel.toUpperCase()} 智慧中心</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
                     <div className="bg-white p-8 rounded-[36px] border border-blue-50 shadow-sm hover:shadow-xl transition-all group">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all">
                          <Brain size={20} />
                        </div>
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-3">数学奥秘解析</span>
                        <p className="text-lg text-slate-700 leading-relaxed font-black tracking-tight">{aiInsight?.mathConcept}</p>
                     </div>
                     <div className="bg-white p-8 rounded-[36px] border border-emerald-50 shadow-sm hover:shadow-xl transition-all group">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                          <Waves size={20} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-3">自然形态映射</span>
                        <p className="text-lg text-slate-700 leading-relaxed font-black tracking-tight">{aiInsight?.natureAnalogy}</p>
                     </div>
                     <div className="bg-white p-8 rounded-[36px] border border-purple-50 shadow-sm hover:shadow-xl transition-all group md:col-span-2 lg:col-span-1">
                        <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 group-hover:text-white transition-all">
                          <Infinity size={20} />
                        </div>
                        <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest block mb-3">哲学与数学启示</span>
                        <p className="text-lg text-slate-700 leading-relaxed font-black tracking-tight">{aiInsight?.philosophy}</p>
                     </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 底部思想模块 - 优雅展示 */}
      <section className="w-full bg-white/20 py-24 px-6 border-y border-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {CONCEPTS.map((concept) => {
            const Icon = IconMap[concept.icon];
            return (
              <div key={concept.id} className="group p-10 rounded-[48px] bg-white shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] transition-all duration-500 border border-transparent hover:border-blue-50/50">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                  <Icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">{concept.title}</h3>
                <p className="text-[11px] text-blue-400 font-black uppercase tracking-[0.2em] mb-4">{concept.subtitle}</p>
                <p className="text-slate-500 text-base leading-relaxed font-medium">{concept.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="w-full py-20 px-6 text-center">
        <div className="max-w-xl mx-auto space-y-6">
           <div className="flex justify-center gap-6 text-slate-200">
             <Sparkles size={24} />
             <Infinity size={24} />
             <Brain size={24} />
           </div>
           <p className="text-sm text-slate-400 font-black tracking-[0.4em] uppercase">
             分形之境 • 人类智慧与数学规律的终极交汇
           </p>
           <p className="text-[10px] text-slate-300 font-black tracking-widest uppercase italic border-t border-slate-100 pt-6">
             © 2024 FRACTAL REALM PROJECT • DESIGNED FOR CURIOUS MINDS • POWERED BY GEMINI ENGINE
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;

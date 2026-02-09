import React, { useState, useEffect } from 'react';
import { CalculationResult, CalculatorInputs } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ScatterChart, Scatter, ZAxis, ReferenceArea, Label
} from 'recharts';
import { Sparkles, Calculator, Clock, Activity, ClipboardCheck } from 'lucide-react';
import { generateBiocharReport } from '../services/geminiService';

interface ResultsDashboardProps { data: CalculationResult | null; }

// Função auxiliar para limpar o texto da IA (remove **, aspas e notações matemáticas como $F_perm$)
const cleanAiText = (text: string) => {
  if (!text) return '';
  return text
    .replace(/\*\*/g, '')      // Remove negritos markdown
    .replace(/"/g, '')         // Remove aspas
    .replace(/\$.*?\$/g, '')   // Remove fórmulas matemáticas entre $ $ (ex: $F_{perm}$)
    .replace(/\\/g, '')        // Remove barras invertidas residuais
    .trim();
};

const VanKrevelenDiagram = ({ inputs }: { inputs: CalculatorInputs }) => {
  const { hcRatio, ocRatio } = inputs;
  const vanKleveData = [{ x: ocRatio, y: hcRatio }];
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 15, right: 25, bottom: 60, left: 55 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <ReferenceArea x1={0} x2={0.4} y1={0.4} y2={0.7} fill="#e0f2fe" fillOpacity={0.5}>
               <Label value="crédito elegível" position="insideTop" offset={5} style={{ fontSize: '7px', fontWeight: 500, fill: '#0369a1', pointerEvents: 'none' }} />
            </ReferenceArea>
            <ReferenceArea x1={0} x2={0.4} y1={0} y2={0.4} fill="#dcfce7" fillOpacity={0.7}>
               <Label value="biochar WBC premium" position="insideBottom" offset={5} style={{ fontSize: '7px', fontWeight: 500, fill: '#15803d', pointerEvents: 'none' }} />
            </ReferenceArea>
            <XAxis type="number" dataKey="x" name="O/C" domain={[0, 1.2]} ticks={[0, 0.4, 0.8, 1.2]} fontSize={10} tick={{ fill: '#0f172a', fontWeight: 600 }} stroke="#0f172a" axisLine={{ stroke: '#0f172a', strokeWidth: 2 }} tickLine={{ stroke: '#0f172a', strokeWidth: 1.5 }}>
              <Label value="Razão O/C" offset={-35} position="insideBottom" style={{ textAnchor: 'middle', fontSize: 10, fontWeight: 900, fill: '#0f172a' }} />
            </XAxis>
            <YAxis type="number" dataKey="y" name="H/C" domain={[0, 1.2]} ticks={[0, 0.4, 0.8, 1.2]} fontSize={10} tick={{ fill: '#0f172a', fontWeight: 600 }} stroke="#0f172a" axisLine={{ stroke: '#0f172a', strokeWidth: 2 }} tickLine={{ stroke: '#0f172a', strokeWidth: 1.5 }} tickMargin={8} width={60}>
              <Label value="Razão H/C" angle={-90} position="insideLeft" offset={-45} style={{ textAnchor: 'middle', fontSize: 10, fontWeight: 900, fill: '#0f172a' }} />
            </YAxis>
            <ZAxis type="number" range={[140, 140]} />
            <Scatter name="Amostra" data={vanKleveData} fill="#ef4444" shape="circle" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const TechnicalAnalysisCard = ({ inputs, aiAnalysis, isAiLoading }: { inputs: CalculatorInputs, aiAnalysis: string, isAiLoading: boolean }) => {
  const { hcRatio } = inputs;
  let level = "Baixa";
  let colorClass = "text-amber-600";
  let barColor = "bg-amber-500";
  if (hcRatio <= 0.4) { level = "Alta"; colorClass = "text-emerald-600"; barColor = "bg-emerald-500"; }
  else if (hcRatio <= 0.7) { level = "Média"; colorClass = "text-blue-600"; barColor = "bg-blue-500"; }
  const progressWidth = Math.max(0, Math.min(100, (1.2 - hcRatio) / 1.2 * 100));

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center gap-3 text-slate-800 font-black uppercase tracking-widest text-sm mb-8">
        <ClipboardCheck className="w-6 h-6 text-emerald-600" />
        ANÁLISE TÉCNICA DO BIOCHAR
      </div>

      <div className="mb-10">
        <div className="w-full bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Estabilidade Química</span>
                <span className={`text-sm font-black ${colorClass}`}>{level}</span>
              </div>
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                 <div className={`h-full ${barColor} transition-all duration-1000`} style={{ width: `${progressWidth}%` }} />
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end justify-center">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Razão H/C</span>
               <span className="text-2xl font-black text-slate-800 tabular-nums">{hcRatio.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-8">
        {aiAnalysis ? (
          <div className="bg-emerald-50/40 rounded-2xl p-6 border border-emerald-100/50 animate-fade-in">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-4 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Insight Técnico
            </div>
            <p className="text-sm text-emerald-900 leading-relaxed text-justify">
              {cleanAiText(aiAnalysis)}
            </p>
          </div>
        ) : isAiLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 text-slate-400 text-xs py-10 animate-pulse">
            <Sparkles className="w-6 h-6" />
            <span>Processando interpretação técnica...</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const TemporalChart = ({ data }: { data: CalculationResult }) => {
  const horizons = [0, 100, 500, 1000];
  const chartLineColors = ['#059669', '#2563eb', '#db2777', '#d97706', '#7c3aed'];
  const chartData = horizons.map(year => {
    const point: any = { year };
    data.scenarios.forEach(scenario => {
      const dataPoint = scenario.dataPoints.find(dp => dp.year === year);
      point[`temp_${scenario.temp}`] = Number((dataPoint?.co2Sequestered || 0).toFixed(2));
    });
    return point;
  });
  return (
    <div className="w-full h-[320px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 15, right: 25, left: 55, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="year" stroke="#0f172a" fontSize={10} tickFormatter={(v) => `${v}a`} tick={{ fill: '#0f172a', fontWeight: 600 }} axisLine={{ stroke: '#0f172a', strokeWidth: 2 }} tickLine={{ stroke: '#0f172a', strokeWidth: 1.5 }}>
            <Label value="Tempo (Anos)" offset={-35} position="insideBottom" style={{ textAnchor: 'middle', fontSize: 10, fontWeight: 900, fill: '#0f172a' }} />
          </XAxis>
          <YAxis stroke="#0f172a" fontSize={10} tick={{ fill: '#0f172a', fontWeight: 600 }} axisLine={{ stroke: '#0f172a', strokeWidth: 2 }} tickLine={{ stroke: '#0f172a', strokeWidth: 1.5 }} tickMargin={8} width={60}>
            <Label value="Sequestro (tCO₂e)" angle={-90} position="insideLeft" offset={-45} style={{ textAnchor: 'middle', fontSize: 10, fontWeight: 900, fill: '#0f172a' }} />
          </YAxis>
          <Legend verticalAlign="top" align="right" iconType="circle" iconSize={6} wrapperStyle={{ fontSize: '10px', paddingBottom: '15px', fontWeight: 700 }} />
          {data.scenarios.map((scenario, idx) => (
            <Line key={scenario.temp} name={`${scenario.temp}°C`} type="monotone" dataKey={`temp_${scenario.temp}`} stroke={chartLineColors[idx % chartLineColors.length]} strokeWidth={1.5} dot={{ r: 2, fill: chartLineColors[idx % chartLineColors.length] }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (data) {
      const fetchAiInsight = async () => {
        setIsAiLoading(true);
        try {
          const insight = await generateBiocharReport(data);
          setAiAnalysis(insight);
        } catch (err) {
          console.error("AI Analysis failed:", err);
          setAiAnalysis("Falha ao obter análise técnica.");
        } finally { setIsAiLoading(false); }
      };
      fetchAiInsight();
    }
  }, [data]);

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-12 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm no-print">
        <Sparkles className="w-12 h-12 mb-4 text-slate-300" />
        <p className="text-lg text-center font-medium text-slate-600 uppercase tracking-tight">BioC-Calc</p>
        <p className="text-sm text-center mt-2 max-w-xs text-slate-400">Insira os dados técnicos para gerar a análise.</p>
      </div>
    );
  }

  const isMultiTemp = data.scenarios.length > 1;

  return (
    <div className="space-y-6 animate-fade-in no-print relative">
      <div className="bg-slate-800 text-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-2 mb-8 border-b border-slate-700 pb-5">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-300">Sequestro Estimado ({isMultiTemp ? 'Multitemperatura' : `${data.scenarios[0].temp}°C`})</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-700">
            <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
                <span className="text-emerald-400 font-black text-[11px] uppercase tracking-wider mb-4">100 Anos</span>
                <div className={`flex items-center ${isMultiTemp ? 'flex-row flex-wrap justify-center gap-6' : 'flex-col'}`}>
                  {data.scenarios.map((scenario) => (
                    <div key={scenario.temp} className="flex flex-col items-center">
                      {isMultiTemp && <span className="text-[10px] text-slate-500 uppercase font-black mb-1">{scenario.temp}°C</span>}
                      <div className={`${isMultiTemp ? 'text-2xl' : 'text-4xl'} font-black tabular-nums`}>{scenario.dataPoints.find(dp => dp.year === 100)?.co2Sequestered?.toFixed(2) || "0.00"}</div>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 mt-2 font-bold tracking-widest">tCO₂e</span>
            </div>
            <div className="flex flex-col items-center justify-center pt-4 md:pt-0 px-2">
                <span className="text-blue-400 font-black text-[11px] uppercase tracking-wider mb-4">500 Anos</span>
                <div className={`flex items-center ${isMultiTemp ? 'flex-row flex-wrap justify-center gap-6' : 'flex-col'}`}>
                  {data.scenarios.map((scenario) => (
                    <div key={scenario.temp} className="flex flex-col items-center">
                      {isMultiTemp && <span className="text-[10px] text-slate-500 uppercase font-black mb-1">{scenario.temp}°C</span>}
                      <div className={`${isMultiTemp ? 'text-2xl' : 'text-4xl'} font-black tabular-nums`}>{scenario.dataPoints.find(dp => dp.year === 500)?.co2Sequestered?.toFixed(2) || "0.00"}</div>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 mt-2 font-bold tracking-widest">tCO₂e</span>
            </div>
            <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
                <span className="text-purple-400 font-black text-[11px] uppercase tracking-wider mb-4">1000 Anos</span>
                <div className={`flex items-center ${isMultiTemp ? 'flex-row flex-wrap justify-center gap-6' : 'flex-col'}`}>
                  {data.scenarios.map((scenario) => (
                    <div key={scenario.temp} className="flex flex-col items-center">
                      {isMultiTemp && <span className="text-[10px] text-slate-500 uppercase font-black mb-1">{scenario.temp}°C</span>}
                      <div className={`${isMultiTemp ? 'text-2xl' : 'text-4xl'} font-black tabular-nums`}>{scenario.dataPoints.find(dp => dp.year === 1000)?.co2Sequestered?.toFixed(2) || "0.00"}</div>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 mt-2 font-bold tracking-widest">tCO₂e</span>
            </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-8 flex items-center gap-3"><Clock className="w-5 h-5 text-emerald-600" /> Projeção Temporal</h3>
            <div className="h-[350px] w-full"><TemporalChart data={data} /></div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-8 flex items-center gap-3"><Activity className="w-5 h-5 text-emerald-600" /> Van Krevelen</h3>
            <div className="max-w-4xl mx-auto"><VanKrevelenDiagram inputs={data.inputs} /></div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <TechnicalAnalysisCard inputs={data.inputs} aiAnalysis={aiAnalysis} isAiLoading={isAiLoading} />
          </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
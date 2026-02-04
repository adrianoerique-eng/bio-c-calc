import React, { useState, useEffect } from 'react';
import { CalculationResult, CalculatorInputs } from '../types';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ScatterChart, Scatter, ZAxis, ReferenceArea, Label
} from 'recharts';
import { Sparkles, Calculator, Clock, Printer, Eye, X, Activity, TrendingUp, ClipboardCheck } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface ResultsDashboardProps {
  data: CalculationResult | null;
}

const VanKrevelenDiagram = ({ inputs, isReport = false }: { inputs: CalculatorInputs, isReport?: boolean }) => {
  const { hcRatio, ocRatio } = inputs;
  const vanKleveData = [{ x: ocRatio, y: hcRatio }];

  return (
    <div className="w-full flex flex-col gap-4">
      <div className={`w-full ${isReport ? 'h-[200px]' : 'h-[300px]'} relative`}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={isReport ? { top: 10, right: 15, bottom: 45, left: 65 } : { top: 15, right: 25, bottom: 60, left: 55 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            
            <ReferenceArea x1={0} x2={0.4} y1={0.4} y2={0.7} fill="#e0f2fe" fillOpacity={0.5}>
               <Label 
                 value="crédito elegível" 
                 position="insideTop" 
                 offset={5}
                 style={{ fontSize: '7px', fontWeight: 500, fill: '#0369a1', pointerEvents: 'none' }} 
               />
            </ReferenceArea>
            
            <ReferenceArea x1={0} x2={0.4} y1={0} y2={0.4} fill="#dcfce7" fillOpacity={0.7}>
               <Label 
                 value="biochar WBC premium" 
                 position="insideBottom" 
                 offset={5}
                 style={{ fontSize: '7px', fontWeight: 500, fill: '#15803d', pointerEvents: 'none' }} 
               />
            </ReferenceArea>

            <XAxis 
              type="number" 
              dataKey="x" 
              name="O/C" 
              domain={[0, 1.2]} 
              ticks={[0, 0.4, 0.8, 1.2]}
              fontSize={10}
              tick={{ fill: '#0f172a', fontWeight: 600 }}
              stroke="#0f172a"
              axisLine={{ stroke: '#0f172a', strokeWidth: 2 }}
              tickLine={{ stroke: '#0f172a', strokeWidth: 1.5 }}
            >
              <Label 
                value="Razão O/C" 
                offset={isReport ? -15 : -35} 
                position="insideBottom" 
                style={{ textAnchor: 'middle', fontSize: 10, fontWeight: 900, fill: '#0f172a' }} 
              />
            </XAxis>
            <YAxis 
              type="number" 
              dataKey="y" 
              name="H/C" 
              domain={[0, 1.2]} 
              ticks={[0, 0.4, 0.8, 1.2]}
              fontSize={10}
              tick={{ fill: '#0f172a', fontWeight: 600 }}
              stroke="#0f172a"
              axisLine={{ stroke: '#0f172a', strokeWidth: 2 }}
              tickLine={{ stroke: '#0f172a', strokeWidth: 1.5 }}
              tickMargin={isReport ? 4 : 8}
              width={isReport ? 60 : 60}
            >
              <Label 
                value="Razão H/C" 
                angle={-90} 
                position="insideLeft" 
                offset={isReport ? -50 : -45}
                style={{ textAnchor: 'middle', fontSize: 10, fontWeight: 900, fill: '#0f172a' }} 
              />
            </YAxis>
            <ZAxis type="number" range={[140, 140]} />
            <Scatter name="Amostra" data={vanKleveData} fill="#ef4444" shape="circle" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const TechnicalAnalysisCard = ({ inputs }: { inputs: CalculatorInputs }) => {
  const { hcRatio, biomassType, carbonContent } = inputs;
  
  let level = "Baixa";
  let colorClass = "text-amber-600";
  let barColor = "bg-amber-500";
  let stabilityDesc = "A razão H/C acima de 0,7 indica um biochar com baixo grau de carbonização, mantendo muitas características da biomassa original e apresentando menor resistência à degradação biológica no solo.";
  
  if (hcRatio <= 0.4) {
    level = "Alta";
    colorClass = "text-emerald-600";
    barColor = "bg-emerald-500";
    stabilityDesc = "A razão H/C abaixo de 0,4 indica um biochar altamente condensado e aromático, típico de pirólise em altas temperaturas. Este material apresenta máxima resistência à degradação biológica no solo.";
  } else if (hcRatio <= 0.7) {
    level = "Média";
    colorClass = "text-blue-600";
    barColor = "bg-blue-500";
    stabilityDesc = "A razão H/C entre 0,4 e 0,7 indica um biochar com estabilidade moderada. O material possui estrutura carbonizada desenvolvida, mas ainda contém frações passíveis de degradação lenta ao longo de décadas.";
  }

  const progressWidth = Math.max(0, Math.min(100, (1.2 - hcRatio) / 1.2 * 100));

  return (
    <div className="bg-slate-50/50 border border-slate-200 rounded-3xl p-8">
      <div className="flex items-center gap-3 text-slate-800 font-black uppercase tracking-widest text-sm mb-8">
        <ClipboardCheck className="w-6 h-6 text-emerald-600" />
        ANÁLISE TÉCNICA DO BIOCHAR
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-slate-600 leading-relaxed text-sm">
        <div className="text-justify">
          <p>
            <span className="font-bold text-slate-800 block mb-1 uppercase tracking-tighter">Caracterização</span>
            O biochar analisado, proveniente de {biomassType}, apresenta um teor de carbono de {carbonContent}% e uma razão H/C molar de {hcRatio.toFixed(2)}.
          </p>
        </div>
        <div className="text-justify">
          <p>
            <span className="font-bold text-slate-800 block mb-1 uppercase tracking-tighter">Estabilidade ({level})</span>
            {stabilityDesc}
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-2xl bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Estabilidade Química</span>
                <span className={`text-sm font-black ${colorClass}`}>{level}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
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
    </div>
  );
};

const TemporalChartReport = ({ data, isReport = false }: { data: CalculationResult, isReport?: boolean }) => {
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
    <div className={`w-full ${isReport ? 'h-[160px]' : 'h-[320px]'} relative`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={isReport ? { top: 10, right: 15, left: 65, bottom: 45 } : { top: 15, right: 25, left: 55, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="year" 
            stroke="#0f172a" 
            fontSize={10} 
            tickFormatter={(v) => `${v}a`}
            tick={{ fill: '#0f172a', fontWeight: 600 }}
            axisLine={{ stroke: '#0f172a', strokeWidth: 2 }}
            tickLine={{ stroke: '#0f172a', strokeWidth: 1.5 }}
          >
            <Label 
              value="Tempo (Anos)" 
              offset={isReport ? -15 : -35} 
              position="insideBottom" 
              style={{ textAnchor: 'middle', fontSize: 10, fontWeight: 900, fill: '#0f172a' }} 
            />
          </XAxis>
          <YAxis 
            stroke="#0f172a" 
            fontSize={10} 
            tick={{ fill: '#0f172a', fontWeight: 600 }} 
            axisLine={{ stroke: '#0f172a', strokeWidth: 2 }}
            tickLine={{ stroke: '#0f172a', strokeWidth: 1.5 }}
            tickMargin={isReport ? 4 : 8}
            width={isReport ? 60 : 60}
          >
            <Label 
              value="Sequestro (tCO₂e)" 
              angle={-90} 
              position="insideLeft" 
              offset={isReport ? -50 : -45}
              style={{ textAnchor: 'middle', fontSize: 10, fontWeight: 900, fill: '#0f172a' }} 
            />
          </YAxis>
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle" 
            iconSize={6}
            wrapperStyle={isReport ? { fontSize: '8px', paddingBottom: '0px', fontWeight: 700, top: 0 } : { fontSize: '10px', paddingBottom: '15px', fontWeight: 700 }} 
          />
          {data.scenarios.map((scenario, idx) => (
            <Line 
              key={scenario.temp} 
              name={`${scenario.temp}°C`} 
              type="monotone" 
              dataKey={`temp_${scenario.temp}`} 
              stroke={chartLineColors[idx % chartLineColors.length]} 
              strokeWidth={1.5} 
              dot={{ r: 2, fill: chartLineColors[idx % chartLineColors.length] }} 
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const ReportContent = ({ data }: { data: CalculationResult }) => {
  const { inputs, scenarios } = data;
  const { hcRatio } = inputs;

  let stabilityLevel = hcRatio <= 0.4 ? "Alta" : hcRatio <= 0.7 ? "Média" : "Baixa";
  let stabilityText = stabilityLevel === "Alta" 
    ? "Alta Estabilidade: Razão H/C ≤ 0,4 indica biochar altamente condensado." 
    : stabilityLevel === "Média" 
    ? "Estabilidade Moderada: Razão H/C entre 0,4 e 0,7 sugere degradação lenta." 
    : "Baixa Estabilidade: Razão H/C > 0,7 indica baixo grau de carbonização.";

  return (
    <div className="flex flex-col text-slate-900 font-sans max-w-[210mm] mx-auto bg-white min-h-[270mm] p-2">
      <div className="text-center border-b-2 border-slate-900 pb-4 mb-6 pt-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-1">RELATÓRIO TÉCNICO</h1>
          <p className="text-[10px] text-slate-400 mt-1">Gerado em: {new Date().toLocaleDateString()} às {new Date().toLocaleTimeString()}</p>
      </div>

      <div className="mb-6 break-inside-avoid">
         <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-100 pb-1 mb-3 flex items-center gap-2">
           <Calculator className="w-3 h-3" /> 1. Identificação do Projeto
         </h2>
         <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-[10px] bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="font-bold text-slate-500 uppercase tracking-tight">AMOSTRA:</span>
                <span className="text-slate-800 font-normal uppercase">{inputs.sampleName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="font-bold text-slate-500 uppercase tracking-tight">BIOMASSA:</span>
                <span className="text-slate-800 font-normal uppercase">{inputs.biomassType}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="font-bold text-slate-500 uppercase tracking-tight">ESTUDANTE:</span>
                <span className="text-slate-800 font-normal uppercase">{inputs.studentName || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="font-bold text-slate-500 uppercase tracking-tight">TEMP PIRÓLISE (°C):</span>
                <span className="text-slate-800 font-normal uppercase">{inputs.pyrolysisTemp}°C</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="font-bold text-slate-500 uppercase tracking-tight">ORIENTADOR:</span>
                <span className="text-slate-800 font-normal uppercase">{inputs.advisorName || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="font-bold text-slate-500 uppercase tracking-tight">INSTITUIÇÃO:</span>
                <span className="text-slate-800 font-normal uppercase">{inputs.institution || '-'}</span>
            </div>
         </div>
      </div>

      <div className="mb-6 break-inside-avoid">
         <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-100 pb-1 mb-4 flex items-center gap-2">
           <Activity className="w-3 h-3" /> 2. Análise Técnica e Modelagem
         </h2>
         <div className="grid grid-cols-2 gap-8 mb-6 text-[10px] leading-relaxed">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
               <span className="font-bold text-emerald-800 block mb-1 uppercase tracking-tight">Decaimento Temporal</span>
               <p className="text-slate-600 text-justify">Projeção fundamentada conforme Woolf et al. (2021).</p>
               <div className="flex gap-2 mt-2 font-normal text-slate-800">
                  <span className="font-bold text-slate-500 uppercase">Carbono Orgânico:</span> <span>{inputs.carbonContent}%</span>
               </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
               <span className="font-bold text-emerald-800 block mb-1 uppercase tracking-tight">Estabilidade</span>
               <p className="text-slate-600 text-justify">{stabilityText}</p>
               <div className="flex gap-4 mt-2 font-normal text-slate-800">
                  <div className="flex gap-1"><span className="font-bold text-slate-500 uppercase">H/C:</span> {inputs.hcRatio}</div>
                  <div className="flex gap-1"><span className="font-bold text-slate-500 uppercase">O/C:</span> {inputs.ocRatio}</div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            <div className="border border-slate-100 rounded-lg p-0.5 bg-white shadow-sm flex flex-col justify-center overflow-visible">
                <span className="text-[7px] font-bold text-slate-400 uppercase mb-0.5 text-center block">Projeção Temporal</span>
                <TemporalChartReport data={data} isReport={true} />
            </div>
            <div className="border border-slate-100 rounded-lg p-0.5 bg-white shadow-sm flex flex-col justify-center overflow-visible">
                <span className="text-[7px] font-bold text-slate-400 uppercase mb-0.5 text-center block">Van Krevelen</span>
                <VanKrevelenDiagram inputs={inputs} isReport={true} />
            </div>
         </div>
      </div>

      <div className="mb-6 break-inside-avoid">
         <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 border-b border-emerald-100 pb-1 mb-4 flex items-center gap-2">
            <TrendingUp className="w-3 h-3" /> 3. Resultados Consolidados
         </h2>
         <table className="w-full text-[10px] border-collapse">
             <thead>
                <tr className="bg-slate-900 text-white">
                   <th className="border border-slate-800 px-3 py-2 text-center font-bold">Temperatura Solo</th>
                   <th className="border border-slate-800 px-3 py-2 text-center font-bold">Horizonte Temporal</th>
                   <th className="border border-slate-800 px-3 py-2 text-center font-bold">Fator Permanência</th>
                   <th className="border border-slate-800 px-3 py-2 text-center font-bold">Sequestro (tCO₂e)</th>
                </tr>
             </thead>
             <tbody>
                {scenarios.map((scenario) => {
                  const pts = scenario.dataPoints.filter(p => p.year !== 0);
                  return pts.map((p, pIdx) => (
                    <tr key={`${scenario.temp}-${p.year}`} className={pIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        {pIdx === 0 && (
                           <td className="border border-slate-200 px-3 py-2 text-center align-middle font-bold text-slate-700" rowSpan={3}>
                             {scenario.temp}°C
                           </td>
                        )}
                        <td className="border border-slate-200 px-3 py-2 text-center font-normal">
                           {p.year} Anos
                        </td>
                        <td className="border border-slate-200 px-3 py-2 text-center font-normal">
                           {(p.fPerm * 100).toFixed(1)}%
                        </td>
                        <td className="border border-slate-200 px-3 py-2 text-center text-slate-900 font-normal">
                           {p.co2Sequestered.toFixed(3)}
                        </td>
                    </tr>
                  ));
                })}
             </tbody>
         </table>
      </div>

      <div className="mt-auto border-t border-slate-100 pt-4 flex flex-col items-center justify-center gap-1">
         <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-tight">NPCO2/UFERSA & LAPIS/IFCE</span>
         <span className="text-[9px] text-slate-400">© 2026 BioC-Calc. Todos os direitos reservados.</span>
      </div>
    </div>
  );
};

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data }) => {
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (showPreview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showPreview]);

  const handlePrint = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const element = document.querySelector('.print-content-container');
    if (!element || !data) {
      window.print();
      return;
    }

    const opt = {
      margin: 10,
      filename: `Relatorio-Biochar-${data.inputs.sampleName.replace(/\s+/g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("Falha ao gerar arquivo PDF, tentando impressão nativa:", err);
      window.print();
    }
  };

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
    <>
      <div className="space-y-6 animate-fade-in no-print relative">
        <div className="flex justify-end items-center">
           <button 
             type="button"
             onClick={() => setShowPreview(true)}
             className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-all shadow-lg shadow-slate-200 cursor-pointer z-40 active:scale-95"
           >
             <Eye className="w-4 h-4" />
             Visualizar Relatório
           </button>
        </div>

        <div className="bg-slate-800 text-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-8 border-b border-slate-700 pb-5">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-300">
                Sequestro Estimado ({isMultiTemp ? 'Multitemperatura' : `${data.scenarios[0].temp}°C`})
              </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-700">
              <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
                  <span className="text-emerald-400 font-black text-[11px] uppercase tracking-wider mb-4">100 Anos</span>
                  <div className={`flex items-center ${isMultiTemp ? 'flex-row flex-wrap justify-center gap-6' : 'flex-col'}`}>
                    {data.scenarios.map((scenario) => {
                      const p = scenario.dataPoints.find(dp => dp.year === 100);
                      return (
                        <div key={scenario.temp} className="flex flex-col items-center">
                          {isMultiTemp && <span className="text-[10px] text-slate-500 uppercase font-black mb-1">{scenario.temp}°C</span>}
                          <div className={`${isMultiTemp ? 'text-2xl' : 'text-4xl'} font-black tabular-nums`}>{p?.co2Sequestered?.toFixed(2) || "0.00"}</div>
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 font-bold tracking-widest">tCO₂e</span>
              </div>

              <div className="flex flex-col items-center justify-center pt-4 md:pt-0 px-2">
                  <span className="text-blue-400 font-black text-[11px] uppercase tracking-wider mb-4">500 Anos</span>
                  <div className={`flex items-center ${isMultiTemp ? 'flex-row flex-wrap justify-center gap-6' : 'flex-col'}`}>
                    {data.scenarios.map((scenario) => {
                      const p = scenario.dataPoints.find(dp => dp.year === 500);
                      return (
                        <div key={scenario.temp} className="flex flex-col items-center">
                          {isMultiTemp && <span className="text-[10px] text-slate-500 uppercase font-black mb-1">{scenario.temp}°C</span>}
                          <div className={`${isMultiTemp ? 'text-2xl' : 'text-4xl'} font-black tabular-nums`}>{p?.co2Sequestered?.toFixed(2) || "0.00"}</div>
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 font-bold tracking-widest">tCO₂e</span>
              </div>

              <div className="flex flex-col items-center justify-center pt-4 md:pt-0">
                  <span className="text-purple-400 font-black text-[11px] uppercase tracking-wider mb-4">1000 Anos</span>
                  <div className={`flex items-center ${isMultiTemp ? 'flex-row flex-wrap justify-center gap-6' : 'flex-col'}`}>
                    {data.scenarios.map((scenario) => {
                      const p = scenario.dataPoints.find(dp => dp.year === 1000);
                      return (
                        <div key={scenario.temp} className="flex flex-col items-center">
                          {isMultiTemp && <span className="text-[10px] text-slate-500 uppercase font-black mb-1">{scenario.temp}°C</span>}
                          <div className={`${isMultiTemp ? 'text-2xl' : 'text-4xl'} font-black tabular-nums`}>{p?.co2Sequestered?.toFixed(2) || "0.00"}</div>
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 font-bold tracking-widest">tCO₂e</span>
              </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-8 flex items-center gap-3">
                 <Clock className="w-5 h-5 text-emerald-600" /> Projeção Temporal
              </h3>
              <div className="h-[350px] w-full">
                <TemporalChartReport data={data} isReport={false} />
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-8 flex items-center gap-3">
                 <Activity className="w-5 h-5 text-emerald-600" /> Van Krevelen
              </h3>
              <div className="max-w-4xl mx-auto">
                <VanKrevelenDiagram inputs={data.inputs} isReport={false} />
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <TechnicalAnalysisCard inputs={data.inputs} />
            </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-4 sm:p-8 print:hidden" onClick={() => setShowPreview(false)}>
          <div className="bg-white w-full max-w-5xl h-full max-h-[95vh] rounded-[2rem] flex flex-col shadow-2xl relative overflow-hidden modal-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex justify-between items-center shrink-0">
               <div>
                 <h2 className="text-xl font-black text-slate-800 tracking-tight">Visualizar Relatório</h2>
                 <p className="text-sm text-slate-500">Este layout simula a folha A4.</p>
               </div>
               <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setShowPreview(false)} 
                    className="px-5 py-2.5 text-slate-600 font-bold hover:bg-white rounded-xl transition-all text-sm flex items-center gap-2 border border-slate-200 cursor-pointer active:scale-95"
                  >
                    <X className="w-4 h-4" /> Fechar
                  </button>
                  <button 
                    type="button" 
                    onClick={handlePrint} 
                    className="px-6 py-2.5 bg-emerald-600 text-white font-bold hover:bg-emerald-700 rounded-xl transition-all text-sm flex items-center gap-2 shadow-xl shadow-emerald-200 cursor-pointer active:scale-95 z-[9999]"
                  >
                    <Printer className="w-4 h-4" /> Imprimir / PDF
                  </button>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-200/50 p-6 sm:p-12 flex justify-center">
               <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-12 shrink-0 border border-slate-100">
                   <ReportContent data={data} />
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="print-content-container print-only">
        <ReportContent data={data} />
      </div>
    </>
  );
};

export default ResultsDashboard;
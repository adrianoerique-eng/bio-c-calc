import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsDashboard from './components/ResultsDashboard';
import { CalculatorInputs, CalculationResult } from './types';
import { calculateSequestration } from './services/woolfModel';
import { saveResearchData } from './services/databaseService';
import { Sprout, FileText, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = (inputs: CalculatorInputs) => {
    const calcResult = calculateSequestration(inputs);
    setResult(calcResult);

    if (inputs.dataAuthorization) {
       saveResearchData(inputs, calcResult.totalBiocharMass)
         .catch(err => console.error("Falha silenciosa ao salvar dados:", err));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-200">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800">BioC-Calc</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://pubs.acs.org/doi/10.1021/acs.est.1c02425" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs md:text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-50"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Referência Técnica</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Ajustado de col-span-4 para col-span-5 para dar mais largura aos inputs */}
          <div className="lg:col-span-5 xl:col-span-5 no-print">
             <div className="sticky top-24 space-y-6">
                <InputForm onCalculate={handleCalculate} />
                
                <div className="p-5 bg-white rounded-xl border border-slate-200 text-xs text-slate-500 leading-relaxed shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold uppercase tracking-wide">
                     <BookOpen className="w-4 h-4 text-emerald-600" />
                     Base Científica
                  </div>
                  <p className="mb-2 text-justify">
                    Esta ferramenta estima o sequestro de CO₂ no solo a partir da aplicação de biochar, utilizando como base o modelo proposto por Woolf et al. (2021).
                  </p>
                  <p className="text-justify">
                    Os cálculos de permanência utilizam coeficientes calibrados para diferentes temperaturas de solo, considerando a razão H/C como principal indicador de estabilidade.
                  </p>
                </div>
             </div>
          </div>

          {/* Ajustado de col-span-8 para col-span-7 */}
          <div className="lg:col-span-7 xl:col-span-7">
            <ResultsDashboard data={result} />
          </div>
          
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-600">Produto desenvolvido por NPCO2/UFERSA e LAPIS/IFCE</p>
          <p className="text-xs text-slate-400 mt-2">© 2026 BioC-Calc. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
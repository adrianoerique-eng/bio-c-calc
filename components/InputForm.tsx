
import React, { useState } from 'react';
import { BiomassType, CalculatorInputs, AcademicLevel, MassUnit } from '../types';
import { 
  FlaskConical, Scale, ArrowRight, CheckCircle2, Thermometer, Tag, User, 
  Building2, BookOpenText, GraduationCap, MapPin,
  Fingerprint, Map, Leaf, Weight, Atom, Orbit, Award, Flame, Droplet
} from 'lucide-react';

interface InputFormProps {
  onCalculate: (inputs: CalculatorInputs) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onCalculate }) => {
  const [values, setValues] = useState<CalculatorInputs>({
    studentName: '',
    level: AcademicLevel.UNDERGRADUATE,
    researchTitle: '',
    advisorName: '',
    institution: '',
    city: '',
    state: '',
    sampleName: 'Amostra 01',
    biomassType: BiomassType.CASHEW_SHELL,
    isDirectBiocharInput: true,
    massInput: 1,
    massUnit: MassUnit.TON,
    biocharYield: 30,
    pyrolysisTemp: 500,
    carbonContent: 75.0, 
    hcRatio: 0.35,
    ocRatio: 0.20, 
    selectedSoilTemps: [14.9]
  });

  const soilTempOptions = [5, 10, 10.9, 14.9, 15, 20, 25];

  const handleChange = (field: keyof CalculatorInputs, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSoilTemp = (temp: number) => {
    setValues(prev => {
      const current = prev.selectedSoilTemps;
      if (current.includes(temp)) {
        if (current.length === 1) return prev; 
        return { ...prev, selectedSoilTemps: current.filter(t => t !== temp) };
      } else {
        if (current.length >= 3) return prev;
        return { ...prev, selectedSoilTemps: [...current, temp].sort((a, b) => a - b) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(values);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="space-y-6">
        {/* Identificação do Projeto */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600" /> Identificação do Projeto
              </h3>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-8">
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" /> Nome do Estudante
                  </label>
                  <input
                    type="text"
                    required
                    value={values.studentName}
                    onChange={(e) => handleChange('studentName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 text-sm placeholder-slate-400 bg-white"
                    placeholder="Seu nome"
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Award className="w-3 h-3 text-slate-400" /> Nível
                  </label>
                  <select
                    value={values.level}
                    onChange={(e) => handleChange('level', e.target.value as AcademicLevel)}
                    className="w-full px-2 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 text-sm bg-white truncate"
                  >
                    {Object.values(AcademicLevel).map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
            </div>

             <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                 <BookOpenText className="w-3 h-3 text-slate-400" /> Título da Pesquisa
              </label>
              <input
                type="text"
                value={values.researchTitle}
                onChange={(e) => handleChange('researchTitle', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 text-sm placeholder-slate-400 bg-white"
                placeholder="Título do trabalho"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-slate-400" /> Nome do Orientador
              </label>
              <input
                type="text"
                value={values.advisorName}
                onChange={(e) => handleChange('advisorName', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 text-sm placeholder-slate-400 bg-white"
                placeholder="Nome do orientador"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" /> Instituição
              </label>
              <input
                type="text"
                value={values.institution}
                onChange={(e) => handleChange('institution', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 text-sm placeholder-slate-400 bg-white"
                placeholder="Sigla (Ex: UFERSA)"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> Cidade
                </label>
                <input
                  type="text"
                  value={values.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 text-sm placeholder-slate-400 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Map className="w-3 h-3 text-slate-400" /> Estado
                </label>
                <input
                  type="text"
                  value={values.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 text-sm placeholder-slate-400 bg-white"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Fingerprint className="w-3 h-3 text-slate-400" /> ID da Amostra
                  </label>
                  <input
                    type="text"
                    required
                    value={values.sampleName}
                    onChange={(e) => handleChange('sampleName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-slate-400" /> Matéria-Prima
                  </label>
                  <select
                    value={values.biomassType}
                    onChange={(e) => handleChange('biomassType', e.target.value as BiomassType)}
                    className="w-full px-2 py-2 rounded-lg border border-slate-300 focus:ring-emerald-500 text-sm bg-white truncate"
                  >
                    {Object.values(BiomassType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Massa */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-600" /> Massa
               </h3>
               <div className="flex bg-slate-200 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleChange('isDirectBiocharInput', false)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${!values.isDirectBiocharInput ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Biomassa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('isDirectBiocharInput', true)}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${values.isDirectBiocharInput ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Biochar
                  </button>
               </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                 <Weight className="w-3 h-3 text-slate-400" /> {values.isDirectBiocharInput ? 'Qtd. Biochar' : 'Qtd. Biomassa'}
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex w-full max-w-[160px] shrink-0">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={values.massInput}
                    onChange={(e) => handleChange('massInput', Number(e.target.value))}
                    className="flex-1 min-w-0 px-3 py-2 rounded-l-lg border border-slate-300 text-sm focus:ring-1 focus:ring-emerald-500 outline-none font-normal"
                  />
                  <select
                    value={values.massUnit}
                    onChange={(e) => handleChange('massUnit', e.target.value as MassUnit)}
                    className="w-16 px-1 py-2 rounded-r-lg border border-l-0 border-slate-300 bg-slate-100 text-xs font-bold text-slate-700 focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                  >
                    <option value={MassUnit.GRAM}>g</option>
                    <option value={MassUnit.KILOGRAM}>kg</option>
                    <option value={MassUnit.TON}>t</option>
                  </select>
                </div>
                
                <div className="flex-1 min-w-[120px]">
                   {values.isDirectBiocharInput ? (
                      <p className="text-[9px] text-slate-400 italic leading-tight">
                         Insira a massa final seca aplicada ao solo.
                      </p>
                   ) : (
                      <div className="flex items-center gap-2">
                        <div className="relative w-24">
                          <input
                            type="number"
                            value={values.biocharYield}
                            onChange={(e) => handleChange('biocharYield', Number(e.target.value))}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-normal pr-6 outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <span className="absolute right-2 top-1.5 text-slate-400 text-[10px]">% Rend.</span>
                        </div>
                        <p className="text-[8px] text-slate-400 italic leading-tight max-w-[80px]">Massa estimada via rendimento.</p>
                      </div>
                   )}
                </div>
              </div>
            </div>
        </div>

        {/* Parâmetros Químicos */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
           <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-600" /> Parâmetros Químicos
              </h3>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-normal text-slate-700 mb-1 flex items-center gap-1">
                  <Atom className="w-3 h-3 text-slate-400" /> Carbono Orgânico (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={values.carbonContent}
                    onChange={(e) => handleChange('carbonContent', Number(e.target.value))}
                    className="w-full pl-3 pr-8 py-2 rounded-lg border border-slate-300 text-sm font-normal bg-white focus:ring-emerald-500"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 text-xs">%</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                   <Flame className="w-3 h-3 text-slate-400" /> Temp. Pirólise (°C)
                </label>
                <input
                  type="number"
                  value={values.pyrolysisTemp}
                  onChange={(e) => handleChange('pyrolysisTemp', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-normal bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                   <Orbit className="w-3 h-3 text-slate-400" /> Razão H/C (molar)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={values.hcRatio}
                  onChange={(e) => handleChange('hcRatio', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-normal bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                   <Droplet className="w-3 h-3 text-slate-400" /> Razão O/C (molar)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={values.ocRatio}
                  onChange={(e) => handleChange('ocRatio', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-normal bg-white"
                />
              </div>
           </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
             <Thermometer className="w-4 h-4 text-emerald-600" /> Temperatura do Solo
          </h3>
          <div className="flex flex-wrap gap-2">
            {soilTempOptions.map(temp => {
               const isSelected = values.selectedSoilTemps.includes(temp);
               return (
                 <button
                   key={temp}
                   type="button"
                   onClick={() => toggleSoilTemp(temp)}
                   className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 ${
                     isSelected ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'
                   }`}
                 >
                   {isSelected ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-slate-300"></div>}
                   {temp}°C
                 </button>
               );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          Calcular Resultados
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

export default InputForm;
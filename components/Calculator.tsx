
import React, { useState, useRef, useEffect } from 'react';
import { Intervention, UserType, PAType, BusinessSize, MunicipalitySize, CalculationResult, HeatPumpTechnology } from '../types';
import { CLIMATIC_ZONES, Quf_COEFFICIENTS, SOLAR_CI, SOLAR_QU } from '../constants';

interface Props {
  intervention: Intervention;
  userType: UserType;
  paType: PAType;
  businessSize: BusinessSize;
  municipalitySize: MunicipalitySize;
  onBack: () => void;
}

interface DetailedResult extends CalculationResult {
  maxPerc: number;
}

const Calculator: React.FC<Props> = ({ 
  intervention, 
  userType, 
  paType,
  businessSize, 
  municipalitySize,
  onBack 
}) => {
  // Riferimenti agli input per evitare re-render durante la digitazione
  const costRef = useRef<HTMLInputElement>(null);
  const sizeRef = useRef<HTMLInputElement>(null);
  const storageRef = useRef<HTMLInputElement>(null);
  const scopRef = useRef<HTMLInputElement>(null);
  
  const [zone, setZone] = useState('E');
  const [tech, setTech] = useState<HeatPumpTechnology>(HeatPumpTechnology.ARIA_ACQUA);
  const [result, setResult] = useState<DetailedResult | null>(null);
  const [isAuditRequired, setIsAuditRequired] = useState(false);

  // Effetto per controllare se l'intervento richiede diagnosi a prescindere dalla potenza
  useEffect(() => {
    if (intervention.id === 'ii_a' || intervention.id === 'ii_d') {
      setIsAuditRequired(true);
    }
  }, [intervention.id]);

  const getNum = (ref: React.RefObject<HTMLInputElement>) => {
    if (!ref.current) return 0;
    const val = ref.current.value.trim().replace(',', '.');
    return parseFloat(val) || 0;
  };

  // Monitora il cambio della potenza per la diagnosi energetica (> 200 kWt)
  const handleSizeChange = () => {
    const sizeValue = getNum(sizeRef);
    if (intervention.id === 'ii_a' || intervention.id === 'ii_d') {
      setIsAuditRequired(true);
    } else if ((intervention.id === 'iii_a' || intervention.id === 'iii_b') && sizeValue > 200) {
      setIsAuditRequired(true);
    } else {
      setIsAuditRequired(false);
    }
  };

  // Funzione per determinare Ci in base alla Tabella 9 del CT 3.0
  const getCiValue = (technology: HeatPumpTechnology, power: number): number => {
    const isSmall = power <= 35;
    switch (technology) {
      case HeatPumpTechnology.ARIA_ARIA_SPLIT:
      case HeatPumpTechnology.ARIA_ARIA_VRF:
      case HeatPumpTechnology.ARIA_ARIA_FIXED:
        return isSmall ? 0.04 : 0.02;
      case HeatPumpTechnology.ARIA_ACQUA:
        return isSmall ? 0.11 : 0.05;
      case HeatPumpTechnology.GEOTERMICA:
        return isSmall ? 0.15 : 0.06;
      default:
        return isSmall ? 0.11 : 0.05;
    }
  };

  const calcGSEIncentive = (intv: Intervention, cost: number, size: number, scopVal: number, zoneVal: string) => {
    let annualIncentive = 0;
    let years = 5;
    let maxPerc = 0.65; 

    // Aliquote basate sul profilo (Regole Generali)
    if (userType === UserType.PA) {
      if (municipalitySize === MunicipalitySize.SMALL) maxPerc = 1.0;
      else if ([PAType.SCUOLA, PAType.SANITARIA].includes(paType)) maxPerc = 0.80;
    } else if (userType === UserType.IMPRESA) {
      if (businessSize === BusinessSize.MEDIA) maxPerc = 0.55;
      else if (businessSize === BusinessSize.GRANDE) maxPerc = 0.45;
    }

    // Calcolo specifico CT 3.0 per tipologia
    switch (intv.id) {
      case 'ii_e': 
        annualIncentive = (maxPerc * Math.min(cost, 30 * size)) / 5;
        break;
      case 'ii_f': // Building Automation
        let baPerc = 0.40;
        if (userType === UserType.PA) {
          if (municipalitySize === MunicipalitySize.SMALL || paType === PAType.SCUOLA || paType === PAType.SANITARIA) {
            baPerc = 1.0;
          }
        }
        const eligibleCostBA = Math.min(cost, 60 * size);
        const totalIncentiveBA = Math.min(eligibleCostBA * baPerc, 100000);
        annualIncentive = totalIncentiveBA / 5;
        maxPerc = baPerc;
        break;
      case 'ii_g': 
        years = 2;
        annualIncentive = (maxPerc * Math.min(cost, 1500 * size)) / 2;
        break;
      case 'ii_h': 
        const storageVal = getNum(storageRef);
        const totalCmaxFv = (size * 1500) + (storageVal * 1000);
        annualIncentive = (maxPerc * Math.min(cost, totalCmaxFv)) / 5;
        break;
      case 'iii_a':
      case 'iii_b':
        years = size > 35 ? 5 : 2;
        const effectiveTech = intv.id === 'iii_b' ? HeatPumpTechnology.ARIA_ACQUA : tech;
        const ci = getCiValue(effectiveTech, size);
        const kp = Math.max(1.0, (scopVal || 4.2) / 2.8);
        const quf = Quf_COEFFICIENTS[zoneVal] || 1700;
        annualIncentive = size * quf * (1 - (1 / Math.max(1.1, scopVal || 4.2))) * ci * kp;
        break;
      case 'iii_c':
        years = size > 35 ? 5 : 2;
        annualIncentive = size * (Quf_COEFFICIENTS[zoneVal] || 1700) * (size <= 35 ? 0.06 : 0.025);
        break;
      case 'iii_d':
        years = size > 50 ? 5 : 2;
        annualIncentive = size * (SOLAR_QU[zoneVal] || 440) * SOLAR_CI;
        break;
      default:
        annualIncentive = (maxPerc * cost) / 5;
    }

    const totalFormula = annualIncentive * years;
    const finalVal = Math.min(totalFormula, cost);

    return {
      estimatedIncentive: finalVal,
      years: (finalVal <= 15000 || userType === UserType.PA) ? 1 : years,
      maxPerc,
      notes: [] as string[]
    };
  };

  const handleRunCalculation = () => {
    const costValue = getNum(costRef);
    const sizeValue = getNum(sizeRef);
    const scopValue = getNum(scopRef) || 4.2;

    if (costValue <= 0 || sizeValue <= 0) {
      alert("Inserisci numeri validi per spesa e dimensione/potenza.");
      return;
    }

    const res = calcGSEIncentive(intervention, costValue, sizeValue, scopValue, zone);
    const notes = [];
    if (intervention.id === 'ii_g' || intervention.id === 'ii_h') notes.push("Nota: Intervento trainato. Richiede installazione PdC.");
    if (res.estimatedIncentive <= 5000) notes.push("Importo erogabile in un'unica rata (Sotto soglia).");
    if (isAuditRequired) notes.push("⚠️ OBBLIGO DIAGNOSI ENERGETICA: L'intervento richiede la diagnosi energetica ante-operam e la certificazione energetica post-operam.");
    if (intervention.id === 'ii_f' && (costValue / sizeValue) > 60) notes.push("Attenzione: La spesa al m² supera il massimale di 60 €/m².");
    
    setResult({ ...res, notes });
  };

  const inputClass = "w-full p-4 bg-white rounded-xl border-2 border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none font-bold text-lg text-black placeholder-gray-300 transition-all";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Colonna Input */}
      <div className="space-y-6">
        <button 
          onClick={onBack} 
          className="text-green-600 font-bold flex items-center gap-2 hover:bg-green-50 px-4 py-2 rounded-xl transition-all"
        >
          <i className="fas fa-arrow-left"></i> Torna alla scelta intervento
        </button>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="pb-4 border-b border-gray-100">
            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded-md mb-2 inline-block">CODICE: {intervention.code}</span>
            <h2 className="text-xl font-black text-gray-900">{intervention.name}</h2>
          </div>

          {/* Avviso Diagnosi Energetica Visibile */}
          {isAuditRequired && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl animate-pulse">
              <div className="flex items-center gap-3">
                <i className="fas fa-exclamation-triangle text-amber-600"></i>
                <p className="text-amber-800 text-xs font-black uppercase tracking-wider">Diagnosi Energetica Necessaria</p>
              </div>
              <p className="text-amber-700 text-[10px] mt-1 font-medium italic">
                {intervention.id === 'ii_a' || intervention.id === 'ii_d' 
                  ? "Obbligatoria per la tipologia di intervento selezionata." 
                  : "Obbligatoria per impianti con potenza superiore a 200 kWt."}
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Campo Tecnologia (Solo per PdC) */}
            {intervention.id === 'iii_a' && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">Tecnologia Pompa di Calore</label>
                <select 
                  value={tech} 
                  onChange={(e) => setTech(e.target.value as HeatPumpTechnology)}
                  className="w-full p-4 bg-white rounded-xl border-2 border-gray-200 focus:border-green-600 outline-none font-bold text-black cursor-pointer"
                >
                  <option value={HeatPumpTechnology.ARIA_ACQUA}>Aria-Acqua</option>
                  <option value={HeatPumpTechnology.ARIA_ARIA_SPLIT}>Aria-Aria (Split/Multi)</option>
                  <option value={HeatPumpTechnology.GEOTERMICA}>Acqua-Acqua / Geotermica</option>
                </select>
              </div>
            )}

            {/* Campo Spesa Totale */}
            <div className="space-y-1">
              <label htmlFor="cost" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">Spesa Totale Stimata (€)</label>
              <input 
                id="cost"
                ref={costRef}
                type="text" 
                inputMode="decimal"
                placeholder="Esempio: 12000"
                className={inputClass}
                autoFocus
              />
            </div>

            {/* Campo Dimensione o Potenza */}
            {intervention.id !== 'ii_h' ? (
              <div className="space-y-1">
                <label htmlFor="size" className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">
                  {['ii_a', 'ii_b', 'ii_c', 'ii_d', 'ii_e', 'ii_f'].includes(intervention.id) ? 'Superficie Utile (m²)' : 'Potenza Nominale (kW)'}
                </label>
                <input 
                  id="size"
                  ref={sizeRef}
                  type="text" 
                  inputMode="decimal"
                  placeholder="Esempio: 15.5"
                  className={inputClass}
                  onChange={handleSizeChange}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block ml-1">Potenza (kWp)</label>
                  <input ref={sizeRef} type="text" inputMode="decimal" placeholder="6.0" className={inputClass.replace('focus:border-green-600', 'focus:border-blue-600')} onChange={handleSizeChange} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block ml-1">Accumulo (kWh)</label>
                  <input ref={storageRef} type="text" inputMode="decimal" placeholder="10" className={inputClass.replace('focus:border-green-600', 'focus:border-blue-600')} />
                </div>
              </div>
            )}

            {/* Parametri Ambientali */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">Zona Climatica</label>
                <select 
                  value={zone} 
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full p-4 bg-white rounded-xl border-2 border-gray-200 focus:border-green-600 outline-none font-bold text-black cursor-pointer"
                >
                  {CLIMATIC_ZONES.map(z => <option key={z} value={z}>Zona {z}</option>)}
                </select>
              </div>
              {['iii_a', 'iii_b'].includes(intervention.id) && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block ml-1">Efficienza SCOP</label>
                  <input 
                    ref={scopRef}
                    type="text" 
                    inputMode="decimal"
                    defaultValue="4.2"
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            <button 
              onClick={handleRunCalculation}
              className="w-full py-5 bg-black hover:bg-green-700 text-white rounded-2xl font-black text-xl shadow-lg transition-colors flex items-center justify-center gap-3 mt-4 active:scale-95"
            >
              <i className="fas fa-calculator"></i>
              Calcola Incentivo
            </button>
          </div>
        </div>
      </div>

      {/* Colonna Risultato */}
      <div className="space-y-6">
        {result ? (
          <div className="bg-green-600 rounded-3xl p-8 text-white shadow-xl animate-in zoom-in-95 duration-200">
            <div className="mb-6 pb-6 border-b border-white/20">
              <h3 className="text-green-100 font-bold text-[11px] uppercase tracking-widest mb-1">Incentivo Totale Estimato</h3>
              <p className="text-5xl font-black tracking-tight">
                € {result.estimatedIncentive.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <span className="text-[10px] font-black text-green-200 uppercase block mb-1">Durata Erogazione</span>
                <span className="text-2xl font-bold">{result.years} {result.years === 1 ? 'Rata' : 'Anni'}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-green-200 uppercase block mb-1">Copertura Spesa</span>
                <span className="text-2xl font-bold">{Math.round((result.estimatedIncentive / getNum(costRef)) * 100)}%</span>
              </div>
            </div>

            {result.notes.length > 0 && (
              <div className="space-y-3 bg-white/10 p-5 rounded-xl border border-white/10">
                {result.notes.map((note, idx) => (
                  <div key={idx} className="flex gap-3 text-sm text-green-50 items-start italic font-medium">
                    <i className={`fas ${note.includes('OBBLIGO') || note.includes('supera') ? 'fa-exclamation-triangle' : 'fa-info-circle'} mt-1 opacity-70`}></i>
                    <p>{note}</p>
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-[9px] text-green-200/50 mt-8 text-center uppercase font-bold tracking-widest">
              GSE - Conto Termico 3.0 (Simulatore 2025)
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 border-4 border-dashed border-gray-200 rounded-3xl bg-gray-50">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
              <i className="fas fa-keyboard text-4xl text-gray-300"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-400 mb-2 tracking-tight">Inserisci i parametri</h3>
            <p className="text-gray-400 text-sm max-w-[240px]">Digita i valori nei campi a sinistra per generare istantaneamente il calcolo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;


import React from 'react';
import { UserType, BusinessSize, MunicipalitySize, PAType } from '../types';

interface Props {
  onSelect: (type: UserType) => void;
  businessSize: BusinessSize;
  onBusinessSizeChange: (size: BusinessSize) => void;
  municipalitySize: MunicipalitySize;
  onMunicipalitySizeChange: (size: MunicipalitySize) => void;
  paType: PAType;
  onPaTypeChange: (type: PAType) => void;
}

const UserTypeSelector: React.FC<Props> = ({ 
  onSelect, 
  businessSize, 
  onBusinessSizeChange,
  municipalitySize,
  onMunicipalitySizeChange,
  paType,
  onPaTypeChange
}) => {
  const types = [
    {
      id: UserType.PRIVATO,
      icon: 'fa-user-house',
      title: 'Privato / Condominio',
      desc: 'Incentivi per la casa e parti comuni condominiali.',
      color: 'bg-blue-600',
      shadow: 'shadow-blue-200'
    },
    {
      id: UserType.IMPRESA,
      icon: 'fa-industry',
      title: 'Impresa / Azienda',
      desc: 'Soluzioni per PMI e grandi industrie energivore.',
      color: 'bg-indigo-600',
      shadow: 'shadow-indigo-200'
    },
    {
      id: UserType.PA,
      icon: 'fa-university',
      title: 'Pubblica Amministrazione',
      desc: 'Comuni, scuole, sanità e infrastrutture pubbliche.',
      color: 'bg-amber-600',
      shadow: 'shadow-amber-200'
    }
  ];

  const paCategories = [
    { id: PAType.STANDARD, label: 'PA Standard', icon: 'fa-building' },
    { id: PAType.SCUOLA, label: 'Scuole/Università', icon: 'fa-graduation-cap' },
    { id: PAType.SANITARIA, label: 'Sanità Pubblica', icon: 'fa-hospital' },
    { id: PAType.PENITENZIARIO, label: 'Ist. Penitenziari', icon: 'fa-gavel' },
    { id: PAType.ETS_ECONOMICO, label: 'ETS Economico', icon: 'fa-chart-line' },
    { id: PAType.ETS_NON_ECONOMICO, label: 'ETS Non Economico', icon: 'fa-leaf' },
  ];

  return (
    <div className="space-y-10">
      <div className="grid md:grid-cols-3 gap-6">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className="group flex flex-col p-8 rounded-3xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50/30 transition-all text-left shadow-sm hover:shadow-xl hover:shadow-green-100 relative overflow-hidden"
          >
            <div className={`${t.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${t.shadow} group-hover:scale-110 transition-transform duration-300`}>
              <i className={`fas ${t.icon} text-2xl`}></i>
            </div>
            <h3 className="font-black text-gray-900 text-xl mb-3 leading-tight">{t.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t.desc}</p>
            <div className="mt-6 flex items-center text-xs font-black text-green-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
              Seleziona <i className="fas fa-chevron-right ml-2 text-[10px]"></i>
            </div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Opzioni Imprese */}
        <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
          <h4 className="font-black text-gray-900 mb-6 flex items-center gap-3 text-sm uppercase tracking-wider">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
               <i className="fas fa-building text-xs"></i>
            </div>
            Configurazione Impresa
          </h4>
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Dimensione Aziendale</label>
            <div className="flex gap-2 p-1.5 bg-white border border-gray-200 rounded-2xl shadow-sm">
              {Object.values(BusinessSize).map((size) => (
                <button
                  key={size}
                  onClick={() => onBusinessSizeChange(size)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${
                    businessSize === size 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Opzioni PA Avanzate */}
        <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
          <h4 className="font-black text-gray-900 mb-6 flex items-center gap-3 text-sm uppercase tracking-wider">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
               <i className="fas fa-university text-xs"></i>
            </div>
            Dettagli Pubblica Amministrazione
          </h4>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Tipologia Ente / ETS</label>
              <div className="grid grid-cols-2 gap-2">
                {paCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => onPaTypeChange(cat.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-tighter border ${
                      paType === cat.id 
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md' 
                        : 'bg-white text-gray-400 border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <i className={`fas ${cat.icon} w-4`}></i>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Bacino d'Utenza (Popolazione)</label>
              <div className="flex gap-2 p-1 bg-white border border-gray-200 rounded-xl">
                {Object.values(MunicipalitySize).map((mSize) => (
                  <button
                    key={mSize}
                    onClick={() => onMunicipalitySizeChange(mSize)}
                    className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all uppercase tracking-widest ${
                      municipalitySize === mSize 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {mSize === MunicipalitySize.SMALL ? '< 15k Ab.' : '> 15k Ab.'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelector;

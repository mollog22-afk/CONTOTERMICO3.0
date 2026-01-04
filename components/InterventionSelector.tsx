
import React, { useState, useMemo } from 'react';
import { UserType, Intervention, Category } from '../types';
import { INTERVENTIONS } from '../constants';

interface Props {
  userType: UserType;
  onSelect: (intervention: Intervention) => void;
  onBack: () => void;
}

const InterventionSelector: React.FC<Props> = ({ userType, onSelect, onBack }) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'ALL'>('ALL');

  // Calcola gli interventi disponibili per l'utente una sola volta
  const availableInterventions = useMemo(() => {
    return INTERVENTIONS.filter(i => i.allowedFor.includes(userType));
  }, [userType]);

  // Controlla quali categorie sono effettivamente disponibili per questo utente
  const hasTitoloII = availableInterventions.some(i => i.category === Category.TITOLO_II);
  const hasTitoloIII = availableInterventions.some(i => i.category === Category.TITOLO_III);

  const filtered = availableInterventions.filter(i => {
    return activeCategory === 'ALL' || i.category === activeCategory;
  });

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        {/* Mostra i filtri solo se ci sono interventi in entrambi i titoli per l'utente corrente */}
        {(hasTitoloII && hasTitoloIII) ? (
          <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
            <button 
              onClick={() => setActiveCategory('ALL')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeCategory === 'ALL' ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Tutti
            </button>
            <button 
              onClick={() => setActiveCategory(Category.TITOLO_II)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeCategory === Category.TITOLO_II ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Titolo II
            </button>
            <button 
              onClick={() => setActiveCategory(Category.TITOLO_III)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeCategory === Category.TITOLO_III ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Titolo III
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <i className="fas fa-list-check"></i>
             </div>
             <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Interventi Ammissibili</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {userType === UserType.PRIVATO ? 'Esclusivo Titolo III - Rinnovabili' : 'Filtrati per il tuo profilo'}
                </p>
             </div>
          </div>
        )}
        
        <button 
          onClick={onBack} 
          className="text-gray-400 hover:text-green-600 text-xs font-bold uppercase tracking-widest flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
        >
          <i className="fas fa-arrow-left"></i> Cambia profilo
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((i) => (
          <button
            key={i.id}
            onClick={() => onSelect(i)}
            className="group p-6 rounded-[2rem] border-2 border-gray-100 hover:border-green-500 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all text-left flex gap-5 relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
              <span className="text-sm font-black text-gray-400 group-hover:text-white">{i.code}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                  i.category === Category.TITOLO_II ? 'border-indigo-200 text-indigo-500 bg-indigo-50' : 'border-amber-200 text-amber-500 bg-amber-50'
                }`}>
                  {i.category === Category.TITOLO_II ? 'Titolo II' : 'Titolo III'}
                </span>
                {i.isLeading && <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-green-200 text-green-500 bg-green-50">Trainante</span>}
              </div>
              <h4 className="font-black text-gray-900 mb-1 group-hover:text-green-700 transition-colors leading-tight">{i.name}</h4>
              <p className="text-xs text-gray-500 line-clamp-2 font-medium">{i.description}</p>
            </div>
            <div className="absolute top-4 right-4 text-gray-100 group-hover:text-green-50 transition-colors">
               <i className="fas fa-chevron-right text-xl"></i>
            </div>
          </button>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <i className="fas fa-search text-3xl text-gray-200"></i>
          </div>
          <h3 className="text-lg font-black text-gray-400 uppercase tracking-tighter">Nessun intervento trovato</h3>
          <p className="text-gray-400 text-sm mt-1">Non ci sono interventi disponibili per i criteri selezionati.</p>
        </div>
      )}
    </div>
  );
};

export default InterventionSelector;

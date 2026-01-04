
import React from 'react';

interface Props {
  onBack: () => void;
}

const ContactsPage: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Contatti Tecnici</h1>
          <p className="text-gray-500 mt-2 font-medium italic">Supporto professionale per le tue pratiche Conto Termico 3.0</p>
        </div>
        <button 
          onClick={onBack} 
          className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-green-600 transition-all flex items-center gap-2 shadow-lg active:scale-95"
        >
          <i className="fas fa-arrow-left"></i> Torna all'App
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Emiliano Card */}
          <div className="p-10 md:p-16 border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50 transition-colors group">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-user-tie text-3xl"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">Ing. Emiliano Domestico</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-8">Esperto Efficienza Energetica</p>
            
            <div className="space-y-6">
              <a 
                href="mailto:emiliano.domestico@gmail.com" 
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-green-500 transition-all group/link"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover/link:bg-green-50 group-hover/link:text-green-600">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Personale</span>
                  <span className="font-bold text-gray-700 group-hover/link:text-green-700">emiliano.domestico@gmail.com</span>
                </div>
              </a>
              
              <div className="flex items-start gap-4 p-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 shrink-0">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <p className="text-sm text-gray-500 font-medium">Consulenza tecnica su tutto il territorio nazionale per progetti residenziali e industriali.</p>
              </div>
            </div>
          </div>

          {/* Marcello Card */}
          <div className="p-10 md:p-16 hover:bg-gray-50 transition-colors group">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <i className="fas fa-hard-hat text-3xl"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">Ing. Marcello Santelli</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mb-8">Esperto Efficienza Energetica</p>
            
            <div className="space-y-6">
              <a 
                href="mailto:sancit71@gmail.com" 
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-500 transition-all group/link"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover/link:bg-blue-50 group-hover/link:text-blue-600">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Personale</span>
                  <span className="font-bold text-gray-700 group-hover/link:text-blue-700">sancit71@gmail.com</span>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 shrink-0">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <p className="text-sm text-gray-500 font-medium">Specializzato in sistemi ibridi, fotovoltaico e riqualificazione energetica PA.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 p-8 text-center">
          <p className="text-white font-bold text-sm tracking-wide">
            Hai dubbi sulla fattibilità del tuo intervento? 
            <span className="text-green-500 ml-2">Scrivici per una consulenza preliminare gratuita.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;

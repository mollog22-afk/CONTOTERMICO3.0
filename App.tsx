
import React, { useState } from 'react';
import { UserType, PAType, BusinessSize, MunicipalitySize, Category, Intervention } from './types';
import { INTERVENTIONS } from './constants';
import UserTypeSelector from './components/UserTypeSelector';
import InterventionSelector from './components/InterventionSelector';
import Calculator from './components/Calculator';
import ContactsPage from './components/ContactsPage';

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [paType, setPaType] = useState<PAType>(PAType.STANDARD);
  const [businessSize, setBusinessSize] = useState<BusinessSize>(BusinessSize.PICCOLA);
  const [municipalitySize, setMunicipalitySize] = useState<MunicipalitySize>(MunicipalitySize.LARGE);
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [showContacts, setShowContacts] = useState(false);

  const reset = () => {
    setStep(1);
    setUserType(null);
    setSelectedIntervention(null);
    setShowContacts(false);
  };

  const handleUserSelect = (type: UserType) => {
    setUserType(type);
    setStep(2);
  };

  const handleInterventionSelect = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setStep(3);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="bg-green-600 text-white p-1.5 rounded-lg">
              <i className="fas fa-leaf text-xl"></i>
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">Conto Termico 3.0</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
            <a 
              href="https://www.gse.it/servizi-per-te/efficienza-energetica/conto-termico-3-0" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-green-600 transition-colors"
            >
              Guida GSE
            </a>
            <button 
              onClick={() => setShowContacts(true)} 
              className={`hover:text-green-600 transition-colors ${showContacts ? 'text-green-600 font-bold' : ''}`}
            >
              Contatti
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
        {showContacts ? (
          <ContactsPage onBack={() => setShowContacts(false)} />
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      step >= s ? 'bg-green-600 text-white scale-110 shadow-lg shadow-green-200' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {s}
                    </div>
                    {s < 3 && <div className={`w-12 h-0.5 rounded-full ${step > s ? 'bg-green-600' : 'bg-gray-200'}`}></div>}
                  </div>
                ))}
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                {step === 1 && "Seleziona la tua categoria"}
                {step === 2 && "Scegli l'intervento"}
                {step === 3 && `Configura: ${selectedIntervention?.name}`}
              </h1>
              <p className="text-gray-500 mt-1 font-medium">
                {step === 1 && "Identifica il soggetto responsabile per calcolare le aliquote corrette."}
                {step === 2 && "Visualizza solo gli interventi ammessi per il tuo profilo."}
                {step === 3 && "Inserisci i parametri tecnici per ottenere la stima dell'incentivo."}
              </p>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-6 md:p-10 min-h-[500px]">
              {step === 1 && (
                <UserTypeSelector 
                  onSelect={handleUserSelect} 
                  businessSize={businessSize} 
                  onBusinessSizeChange={setBusinessSize}
                  municipalitySize={municipalitySize}
                  onMunicipalitySizeChange={setMunicipalitySize}
                  paType={paType}
                  onPaTypeChange={setPaType}
                />
              )}
              {step === 2 && userType && (
                <InterventionSelector 
                  userType={userType} 
                  onSelect={handleInterventionSelect} 
                  onBack={() => setStep(1)} 
                />
              )}
              {step === 3 && selectedIntervention && userType && (
                <Calculator 
                  intervention={selectedIntervention} 
                  userType={userType} 
                  paType={paType}
                  businessSize={businessSize}
                  municipalitySize={municipalitySize}
                  onBack={() => setStep(2)} 
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer id="contatti-footer" className="bg-gray-900 py-16 text-gray-400">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <div className="bg-green-600 text-white p-1 rounded-md">
                <i className="fas fa-leaf text-sm"></i>
              </div>
              <span className="text-white font-bold tracking-tight">Conto Termico 3.0</span>
            </div>
            <p className="text-sm leading-relaxed">
              Strumento professionale di calcolo e consulenza per l'accesso agli incentivi GSE dedicati alla transizione energetica.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Link Utili</h3>
            <ul className="text-sm space-y-3">
              <li><a href="https://www.gse.it/servizi-per-te/efficienza-energetica/conto-termico-3-0" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">• Portale GSE</a></li>
              <li><a href="#" className="hover:text-green-500 transition-colors">• Normativa D.M. 2025</a></li>
              <li><a href="https://www.gse.it/documenti_site/Documenti%20GSE/Servizi%20per%20te/Efficienza%20Energetica/Conto%20Termico/Conto%20Termico%203.0%20-%20Guida%20agli%20interventi.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">• Guida agli Interventi</a></li>
            </ul>
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Contatti Tecnici</h3>
            <div className="space-y-6">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-white font-black text-sm mb-1 uppercase tracking-tighter">Ing. Emiliano Domestico</p>
                <a href="mailto:emiliano.domestico@gmail.com" className="text-green-500 text-xs font-bold hover:underline block truncate">
                  <i className="fas fa-envelope mr-2"></i>emiliano.domestico@gmail.com
                </a>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-white font-black text-sm mb-1 uppercase tracking-tighter">Ing. Marcello Santelli</p>
                <a href="mailto:sancit71@gmail.com" className="text-green-500 text-xs font-bold hover:underline block truncate">
                  <i className="fas fa-envelope mr-2"></i>sancit71@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-[10px] font-medium tracking-wide uppercase">
          &copy; 2024 Conto Termico Advisor &bull; Basato sulle regole applicative del Conto Termico 3.0
        </div>
      </footer>
    </div>
  );
};

export default App;

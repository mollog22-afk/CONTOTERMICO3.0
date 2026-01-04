
import { Category, UserType, Intervention, HeatPumpTechnology, EnvelopeType } from './types';

export const INTERVENTIONS: Intervention[] = [
  // TITOLO II
  { id: 'ii_a', code: 'II.A', name: 'Isolamento termico', category: Category.TITOLO_II, description: 'Coibentazione di pareti, coperture e pavimenti.', allowedFor: [UserType.IMPRESA, UserType.PA], isLeading: true },
  { id: 'ii_b', code: 'II.B', name: 'Infissi', category: Category.TITOLO_II, description: 'Sostituzione di chiusure trasparenti e finestre.', allowedFor: [UserType.IMPRESA, UserType.PA], isLeading: true },
  { id: 'ii_c', code: 'II.C', name: 'Schermature solari', category: Category.TITOLO_II, description: 'Sistemi di ombreggiamento o filtrazione solare.', allowedFor: [UserType.IMPRESA, UserType.PA] },
  { id: 'ii_d', code: 'II.D', name: 'Edifici nZEB', category: Category.TITOLO_II, description: 'Trasformazione in edifici a energia quasi zero.', allowedFor: [UserType.PA], isLeading: true },
  { id: 'ii_e', code: 'II.E', name: 'Illuminazione efficiente', category: Category.TITOLO_II, description: 'Sostituzione sistemi illuminazione con tecnologia LED.', allowedFor: [UserType.PA] },
  { id: 'ii_f', code: 'II.F', name: 'Building Automation', category: Category.TITOLO_II, description: 'Sistemi di gestione e controllo automatico degli impianti.', allowedFor: [UserType.IMPRESA, UserType.PA] },
  { id: 'ii_g', code: 'II.G', name: 'Ricarica veicoli elettrici', category: Category.TITOLO_II, description: 'Infrastrutture di ricarica congiunte a pompe di calore.', allowedFor: [UserType.IMPRESA, UserType.PA] },
  { id: 'ii_h', code: 'II.H', name: 'Fotovoltaico', category: Category.TITOLO_II, description: 'Impianti solari e accumulo abbinati a pompe di calore.', allowedFor: [UserType.IMPRESA, UserType.PA] },
  
  // TITOLO III
  { id: 'iii_a', code: 'III.A', name: 'Pompe di calore', category: Category.TITOLO_III, description: 'Sostituzione con pompe di calore elettriche o a gas.', allowedFor: [UserType.PRIVATO, UserType.IMPRESA, UserType.PA], isLeading: true },
  { id: 'iii_b', code: 'III.B', name: 'Sistemi ibridi', category: Category.TITOLO_III, description: 'Caldaia a condensazione + pompa di calore "factory made".', allowedFor: [UserType.PRIVATO, UserType.IMPRESA, UserType.PA], isLeading: true },
  { id: 'iii_c', code: 'III.C', name: 'Caldaie a biomassa', category: Category.TITOLO_III, description: 'Sostituzione con generatori alimentati a biomassa.', allowedFor: [UserType.PRIVATO, UserType.IMPRESA, UserType.PA], isLeading: true },
  { id: 'iii_d', code: 'III.D', name: 'Solare termico', category: Category.TITOLO_III, description: 'Collettori solari per ACS, riscaldamento o solar cooling.', allowedFor: [UserType.PRIVATO, UserType.IMPRESA, UserType.PA] },
  { id: 'iii_e', code: 'III.E', name: 'Scaldacqua a PdC', category: Category.TITOLO_III, description: 'Sostituzione scaldacqua elettrici con modelli a pompa di calore.', allowedFor: [UserType.PRIVATO, UserType.IMPRESA, UserType.PA] },
  { id: 'iii_f', code: 'III.F', name: 'Teleriscaldamento', category: Category.TITOLO_III, description: 'Allacciamento a reti di teleriscaldamento efficienti.', allowedFor: [UserType.PRIVATO, UserType.IMPRESA, UserType.PA] },
  { id: 'iii_g', code: 'III.G', name: 'Microcogenerazione', category: Category.TITOLO_III, description: 'Sostituzione con unità di microcogenerazione rinnovabile.', allowedFor: [UserType.PRIVATO, UserType.IMPRESA, UserType.PA] }
];

export const CLIMATIC_ZONES = ['A', 'B', 'C', 'D', 'E', 'F'];

export const Quf_COEFFICIENTS: Record<string, number> = {
  'A': 600, 'B': 850, 'C': 1100, 'D': 1400, 'E': 1700, 'F': 1800
};

export const MIN_EFFICIENCY_LIMITS: Record<string, number> = {
  [HeatPumpTechnology.ARIA_ACQUA]: 2.825,
  [HeatPumpTechnology.ARIA_ARIA_SPLIT]: 3.8,
  [HeatPumpTechnology.ARIA_ARIA_VRF]: 3.5,
  [HeatPumpTechnology.ARIA_ARIA_FIXED]: 2.6,
  [HeatPumpTechnology.GEOTERMICA]: 2.825
};

export const ENVELOPE_CMAX: Record<EnvelopeType, number | ((zone: string) => number)> = {
  [EnvelopeType.WALL_EXT]: 200,
  [EnvelopeType.WALL_INT]: 100,
  [EnvelopeType.WALL_VENT]: 250,
  [EnvelopeType.ROOF_EXT]: 300,
  [EnvelopeType.ROOF_INT]: 150,
  [EnvelopeType.ROOF_VENT]: 350,
  [EnvelopeType.FLOOR_EXT]: 170,
  [EnvelopeType.FLOOR_INT]: 150,
  [EnvelopeType.WINDOWS]: (zone) => (['A', 'B', 'C'].includes(zone) ? 700 : 800),
  [EnvelopeType.SOLAR_SHIELD]: 250,
  [EnvelopeType.NZEB]: (zone) => (['A', 'B', 'C'].includes(zone) ? 1000 : 1300)
};

export const SOLAR_CI = 0.32;
export const SOLAR_QU: Record<string, number> = {
  'A': 320, 'B': 360, 'C': 400, 'D': 440, 'E': 480, 'F': 500
};

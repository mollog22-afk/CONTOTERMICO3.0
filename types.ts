
export enum UserType {
  PRIVATO = 'Privato',
  IMPRESA = 'Impresa',
  PA = 'Pubblica Amministrazione'
}

export enum PAType {
  STANDARD = 'Standard PA',
  SCUOLA = 'Scuole e Università',
  SANITARIA = 'Strutture Sanitarie',
  PENITENZIARIO = 'Istituti Penitenziari',
  ETS_ECONOMICO = 'ETS - Attività Economica',
  ETS_NON_ECONOMICO = 'ETS - Attività Non Economica'
}

export enum BusinessSize {
  PICCOLA = 'Piccola',
  MEDIA = 'Media',
  GRANDE = 'Grande'
}

export enum MunicipalitySize {
  SMALL = 'Sotto 15.000 abitanti',
  LARGE = 'Sopra 15.000 abitanti'
}

export enum Category {
  TITOLO_II = 'Titolo II - Incremento Efficienza Energetica',
  TITOLO_III = 'Titolo III - Fonti Rinnovabili e Sistemi Alta Efficienza'
}

export enum HeatPumpTechnology {
  ARIA_ACQUA = 'Aria-Acqua',
  ARIA_ARIA_SPLIT = 'Aria-Aria (Split/Multisplit)',
  ARIA_ARIA_VRF = 'Aria-Aria (VRF/VRV/Rooftop)',
  ARIA_ARIA_FIXED = 'Aria-Aria (Monoblocco/Fixed Duct)',
  GEOTERMICA = 'Geotermica / Acqua-Acqua'
}

export enum BiomassType {
  PELLET = 'Stufa/Termocamino a Pellet',
  LEGNA = 'Caldaia a Legna',
  CHIPS = 'Caldaia a Cippato'
}

export enum EnvelopeType {
  WALL_EXT = 'Parete Esterna / Cappotto',
  WALL_INT = 'Parete Interna / Intercapedine',
  WALL_VENT = 'Parete Ventilata',
  ROOF_EXT = 'Copertura Esterna',
  ROOF_INT = 'Copertura Interna',
  ROOF_VENT = 'Copertura Ventilata',
  FLOOR_EXT = 'Pavimento Esterno',
  FLOOR_INT = 'Pavimento Interno',
  WINDOWS = 'Sostituzione Infissi',
  SOLAR_SHIELD = 'Schermature Solari',
  NZEB = 'Trasformazione nZEB'
}

export interface Intervention {
  id: string;
  code: string;
  name: string;
  category: Category;
  description: string;
  allowedFor: UserType[];
  isLeading?: boolean;
}

export interface CalculationResult {
  estimatedIncentive: number;
  years: number;
  notes: string[];
}

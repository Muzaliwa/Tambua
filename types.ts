
export interface User {
    name: string;
    role: 'Superviseur' | 'Agent';
    avatar: string;
}

export interface Fine {
    id: string;
    plate: string;
    reason: string;
    driver: string;
    location: string;
    date: string;
    amount: number;
    currency: string;
    status: 'Payée' | 'En retard' | 'En attente';
}

export interface Infraction {
    id: string;
    code: string;
    label: string;
    description: string;
    severity: 'LEGER' | 'MOYEN' | 'GRAVE' | 'TRES_GRAVE';
    amount: number;
    createdAt: string;
    updatedAt: string;
}

type ValidityStatus = 'Valide' | 'Bientôt expiré' | 'Expiré';

export interface Vehicle {
  id: string;
  photo: string;
  owner: string;
  address: string;
  taxId: string;
  plate: string;
  makeModel: string;
  year: number;
  color: string;
  infractions?: Infraction[];
  payments?: Fine[];
  documentStatus: ValidityStatus;
  insuranceStatus: ValidityStatus;
}

export interface Motorcycle {
  id: string;
  photo: string;
  owner: string;
  address: string;
  plate: string;
  makeModel: string;
  year: number;
  color: string;
  infractions?: Infraction[];
  payments?: Fine[];
  documentStatus: ValidityStatus;
  insuranceStatus: ValidityStatus;
}
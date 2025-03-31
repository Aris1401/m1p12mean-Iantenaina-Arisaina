import { Injectable } from '@angular/core';

interface EtatAffichage {
    etatString: string;
    etatColor: 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast';
}

@Injectable({
    providedIn: 'root'
})
export class EtatsService {
    constructor() {}

    getEtatDevis(etatDevis: any): EtatAffichage {
        switch (etatDevis) {
            case 0:
                return {
                    etatString: 'En attente',
                    etatColor: 'info'
                };
            case 10:
                return {
                    etatColor: 'success',
                    etatString: 'Valider'
                };
            case -10:
                return {
                    etatColor: 'danger',
                    etatString: 'Refuser'
                };
        }

        return {
            etatColor: 'info',
            etatString: 'Impossible'
        };
    }

    getEtatIntervention(etatIntervention: any): EtatAffichage {
        switch (etatIntervention) {
            case -10:
                return {
                    etatColor: 'info',
                    etatString: 'En attente'
                };
            case 0:
                return {
                    etatColor: 'secondary',
                    etatString: 'En cours'
                };
            case 10:
                return {
                    etatColor: 'warn',
                    etatString: 'En attente de piece'
                };
            default:
                return {
                    etatColor: 'success',
                    etatString: 'Fini'
                };
        }
    }

    getEtatTravaux(etatTravaux: any) {}

    getEtatRendezVous(etat: number): EtatAffichage {
        switch (etat) {
            case 0:  // EN_ATTENTE
                return { etatColor: 'info', etatString: 'En attente' };
            case -10: // ANNULER
                return { etatColor: 'danger', etatString: 'Annulé' };
            case 10: // EN_COURS
                return { etatColor: 'secondary', etatString: 'En cours' };
            case 20: // FINI
                return { etatColor: 'success', etatString: 'Fini' };
            default:
                return { etatColor: 'info', etatString: 'Inconnu' };
        }
    }
    
}

import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { MecanicienService } from '../../../_services/mecaniciens/mecanicien.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-manager.mecaniciens',
    imports: [CardModule, TableModule, ButtonModule, InputTextModule, FormsModule, DialogModule, ToastModule, RouterModule],
    template: `
        <p-toast></p-toast>

        <p-card header="Mecaniciens">
            <p-table [value]="mecaniciensData" [loading]="isLoading" #mcTable [paginator]="true" [rows]="10" [globalFilterFields]="['nom', 'prenom', 'email', 'adresse', 'telephone']">
                <ng-template #caption>
                    <div class="flex justify-between">
                        <p-button label="Ajouter mecanicien" (onClick)="showAddMecanicien()" icon="pi pi-plus" />

                        <div>
                            <input pInputText type="text" name="search" id="search" placeholder="Rechercher" (input)="mcTable.filterGlobal($any($event.target).value, 'contains')" />
                        </div>
                    </div>
                </ng-template>

                <ng-template #header>
                    <tr>
                        <th>Nom / Prenoms</th>
                        <th>Telephone</th>
                        <th>Email</th>
                        <th>Adresse</th>
                        <th></th>
                    </tr>
                </ng-template>

                <ng-template #body let-mecanicien>
                    <tr>
                        <td>{{ mecanicien.nom + ' ' + mecanicien.prenom }}</td>
                        <td>{{ mecanicien.telephone || 'N/A' }}</td>
                        <td>{{ mecanicien.email || 'N/A' }}</td>
                        <td>{{ mecanicien.adresse || 'N/A' }}</td>
                        <td>
                            <a pButton label="Plus de details" [routerLink]="['/manager/mecaniciens', mecanicien._id]"></a>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </p-card>

        <p-dialog [modal]="true" [(visible)]="isAddMecanicienVisible" header="Ajouter mecanicien">
            <form (submit)="onSubmitAddMecancien()">
                <div class="flex gap-2 w-full">
                    <div class="w-full">
                        <label for="nom" class="block mb-2 w-full text-xl font-medium">Nom</label>
                        <input
                            type="text"
                            id="nom"
                            name="nom"
                            pInputText
                            class="w-full"
                            placeholder="Nom"
                            [(ngModel)]="mecanicienData.nom"
                            [class.ng-dirty]="mecanicienInvalid && mecanicienErrors.nom"
                            [class.ng-invalid]="mecanicienInvalid && mecanicienErrors.nom"
                        />
                        @if (mecanicienInvalid && mecanicienErrors.nom) {
                            <small id="nom-error" class="text-red-500">{{ mecanicienErrors.nom.message }}</small>
                        }
                    </div>

                    <div class="w-full">
                        <label for="prenom" class="block mb-2 w-full text-xl font-medium">Prenom</label>
                        <input
                            type="text"
                            id="prenom"
                            name="prenom"
                            pInputText
                            class="w-full"
                            placeholder="Prenom"
                            [(ngModel)]="mecanicienData.prenom"
                            [class.ng-dirty]="mecanicienInvalid && mecanicienErrors.prenom"
                            [class.ng-invalid]="mecanicienInvalid && mecanicienErrors.prenom"
                        />
                        @if (mecanicienInvalid && mecanicienErrors.prenom) {
                            <small id="nom-error" class="text-red-500">{{ mecanicienErrors.prenom.message }}</small>
                        }
                    </div>
                </div>

                <div class="flex gap-2">
                    <div class="w-full mt-4 flex flex-col">
                        <label for="telephone" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Telephone</label>
                        <input
                            pInputText
                            type="text"
                            id="telephone"
                            name="telephone"
                            placeholder="03x xx xxx xx"
                            class="w-full md:w-[20rem]"
                            [(ngModel)]="mecanicienData.telephone"
                            [class.ng-dirty]="mecanicienInvalid && mecanicienErrors.telephone"
                            [class.ng-invalid]="mecanicienInvalid && mecanicienErrors.telephone"
                        />
                        @if (mecanicienInvalid && mecanicienErrors.telephone) {
                            <small id="nom-error" class="text-red-500">{{ mecanicienErrors.telephone.message }}</small>
                        }
                    </div>

                    <div class="w-full mt-4 flex flex-col">
                        <label for="date-naissance" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Date de naissance</label>
                        <input
                            pInputText
                            type="date"
                            id="date-naissance"
                            name="date-naissance"
                            placeholder="Votre date de naissance"
                            class="w-full md:w-[20rem]"
                            [(ngModel)]="mecanicienData.date_naissance"
                            [class.ng-dirty]="mecanicienInvalid && mecanicienErrors.date_naissance"
                            [class.ng-invalid]="mecanicienInvalid && mecanicienErrors.date_naissance"
                        />
                        @if (mecanicienInvalid && mecanicienErrors.date_naissance) {
                            <small id="nom-error" class="text-red-500">{{ mecanicienErrors.date_naissance.message }}</small>
                        }
                    </div>
                </div>

                <div class="w-full mt-4">
                    <label for="adresse" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Adresse</label>
                    <input
                        pInputText
                        type="string"
                        id="adresse"
                        name="adresse"
                        placeholder="Votre adresse"
                        class="w-full"
                        [(ngModel)]="mecanicienData.adresse"
                        [class.ng-dirty]="mecanicienInvalid && mecanicienErrors.adresse"
                        [class.ng-invalid]="mecanicienInvalid && mecanicienErrors.adresse"
                    />
                    @if (mecanicienInvalid && mecanicienErrors.adresse) {
                        <small id="nom-error" class="text-red-500">{{ mecanicienErrors.adresse.message }}</small>
                    }
                </div>

                <div class="w-full mt-4">
                    <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                    <input
                        pInputText
                        id="email1"
                        name="email"
                        type="text"
                        placeholder="Email address"
                        class="w-full"
                        [(ngModel)]="mecanicienData.email"
                        value="user1@gmail.com"
                        [class.ng-dirty]="mecanicienInvalid && mecanicienErrors.email"
                        [class.ng-invalid]="mecanicienInvalid && mecanicienErrors.email"
                    />
                    @if (mecanicienInvalid && mecanicienErrors.email) {
                        <small id="nom-error" class="text-red-500">{{ mecanicienErrors.email.message }}</small>
                    }
                </div>

                <p-button label="Ajouter mecanicien" styleClass="w-full mt-4" type="submit" [loading]="isAddMecanicienLoading"></p-button>
            </form>
        </p-dialog>
    `,
    styles: ``
})
export class ManagerMecaniciensComponent implements OnInit {
    mecaniciensData: any[] = [];

    isAddMecanicienVisible: boolean = false;
    mecanicienData: any = {
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
        date_naissance: ''
    };

    mecanicienInvalid: boolean = false;
    mecanicienErrors: any = null;

    // Loaders
    isLoading: boolean = false;
    isAddMecanicienLoading: boolean = false;

    constructor(
        private mecanicienService: MecanicienService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.isLoading = true;

        this.mecanicienService.getMecaniciens().subscribe({
            next: (response: any) => {
                this.mecaniciensData = response.data;

                this.isLoading = false;
            }
        });
    }

    showAddMecanicien() {
        this.isAddMecanicienVisible = true;
    }

    onSubmitAddMecancien() {
        this.isAddMecanicienLoading = true;

        this.mecanicienService.ajouterMecanicien(this.mecanicienData).subscribe({
            next: (response: any) => {
                this.mecanicienInvalid = false;

                this.mecanicienData = {
                    nom: '',
                    prenom: '',
                    email: '',
                    telephone: '',
                    adresse: '',
                    date_naissance: ''
                };

                this.messageService.add({
                    summary: response.message,
                    severity: 'success'
                });

                this.isAddMecanicienLoading = false;

                this.ngOnInit()
            },
            error: (err) => {
                this.mecanicienInvalid = true;

                this.mecanicienErrors = err.error.error;

                this.messageService.add({
                    summary: 'Veuillez verifier les informations',
                    severity: 'error'
                });

                this.isAddMecanicienLoading = false;
            }
        });
    }
}

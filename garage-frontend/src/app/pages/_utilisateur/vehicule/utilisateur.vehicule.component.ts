import { Component, effect, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { VehiculeService } from '../../../_services/vehicule/vehicule.service';
import { BadgeModule } from 'primeng/badge';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { map } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService, ScrollerOptions } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CarouselModule } from 'primeng/carousel';
import { ChipModule } from 'primeng/chip';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
    selector: 'app-utilisateur.vehicule',
    imports: [CarouselModule, InputGroupModule, InputGroupAddonModule, ToastModule, CardModule, DataViewModule, ButtonModule, ChipModule, RouterModule, DialogModule, SelectModule, InputTextModule, DividerModule, FileUploadModule, FormsModule],
    template: `
        <p-toast></p-toast>

        <p-card>
            <div class="flex flex-col gap-1">
                <div class="flex justify-between">
                    <h3>Mes voitures</h3>
    
                    <p-button label="Ajouter une voiture" icon="pi pi-plus" (onClick)="showAddVehiculeModal()" />
                </div>

                <div class="justify-end">
                    <p-input-group>
                        <input pInputText type='text' name="seach" id="seach" placeholder="Rechercher" [(ngModel)]="vehiculeSearch" />
                        
                        <p-inputgroup-addon>
                            <p-button icon="pi pi-search" (onClick)="vehiculesData.filter(vehiculeSearch)" />
                        </p-inputgroup-addon>
                    </p-input-group>
                </div>
            </div>

            <p-divider />

            <p-data-view [value]="userVehiculesData" emptyMessage="Aucune voiture trouvee" layout="grid" #vehiculesData filterBy="modele,marque,annee,immatriculation">
                <ng-template #grid let-items>
                    <div class="grid grid-cols-12 gap-2">
                        @for (vehicule of items; track vehicule._id) {
                            <div class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-6 p-2">
                                <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                                    @if (vehicule.images && vehicule.images.length > 0) {
                                        <p-carousel [value]="vehicule.images">
                                            <ng-template let-image #item>
                                                <div class="bg-surface-50 flex justify-center rounded p-4">
                                                    <div class="relative mx-auto">
                                                        <img class="rounded w-full" [src]="'data:image/png;base64, ' + image" [alt]="vehicule.modele" style="max-width: 300px" />
                                                        <!-- <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product)" class="absolute" styleClass="dark:!bg-surface-900" [style.left.px]="4" [style.top.px]="4" /> -->
                                                    </div>
                                                </div>
                                            </ng-template>
                                        </p-carousel>
                                    } @else {
                                        <div class="bg-surface-50 flex justify-center rounded p-4">
                                            <div class="relative mx-auto">
                                                <img class="rounded w-full" [src]="'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'" [alt]="vehicule.modele" style="max-width: 300px" />
                                                <!-- <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product)" class="absolute" styleClass="dark:!bg-surface-900" [style.left.px]="4" [style.top.px]="4" /> -->
                                            </div>
                                        </div>
                                    }
                                    <div class="pt-6">
                                        <div class="flex flex-row justify-between products-start gap-2">
                                            <div>
                                                <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
                                                    <div class="flex gap-2">
                                                        <p class="mb-0">
                                                            {{ vehicule.marque }}
                                                        </p>
                                                    </div>
                                                </span>
                                                <div class="text-lg font-medium mt-1">{{ vehicule.modele }}</div>
                                            </div>
                                        </div>

                                        <div class="flex gap-2 flex-wrap mt-3">
                                            <p-chip [label]="vehicule.annee" icon="pi pi-calendar" />
                                            <p-chip [label]="vehicule.boite_de_vitesse" />
                                            <p-chip [label]="vehicule.carburant" />
                                        </div>

                                        <div class="flex flex-col gap-6 mt-2">
                                            <div class="flex gap-2">
                                                <a pButton [routerLink]="['/vehicule', vehicule._id]" icon="pi pi-info" label="Plus de details" class="flex-auto whitespace-nowrap"></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </ng-template>
            </p-data-view>
        </p-card>

        <p-dialog [modal]="true" [(visible)]="isAddVehiculeModalVisible" header="Ajouter vehicule" [style]="{ width: '60%' }">
            <form class="flex flex-col gap-2" (submit)="onSubmitAddVehicule()">
                <div class="flex gap-2">
                    <div class="w-full">
                        <label for="marque" class="block">Marque</label>
                        <p-select
                            inputId="marque"
                            name="marque"
                            [styleClass]="'w-full'"
                            [class]="uploadVehiculeErrors.marque ? 'ng-invalid ng-dirty' : ''"
                            optionLabel="Make_Name"
                            optionValue="Make_Name"
                            [filter]="true"
                            filterBy="Make_Name"
                            [options]="marqueVehicule()"
                            [loading]="marqueVehicule().length == 0"
                            [virtualScroll]="true"
                            [virtualScrollItemSize]="38"
                            [(ngModel)]="uploadVehiculeData.marque"
                        />
                        @if (uploadVehiculeErrors.marque) {
                            <small class="text-red-500">Veuillez selectionner une marque</small>
                        }
                    </div>

                    <div class="w-full">
                        <label for="annee">Annee</label>
                        <p-select
                            inputId="annee"
                            name="annee"
                            styleClass="w-full"
                            [class]="uploadVehiculeErrors.annee ? 'ng-invalid ng-dirty' : ''"
                            emptyMessage="Veuillez selectionner une marque"
                            optionValue="annee"
                            optionLabel="annee"
                            [options]="anneeVehicule()"
                            [loading]="anneeVehicule().length == 0"
                            [filter]="true"
                            [(ngModel)]="uploadVehiculeData.annee"
                        />
                        @if (uploadVehiculeErrors.annee) {
                            <small class="text-red-500">Veuillez selectionner une annee</small>
                        }
                    </div>
                </div>

                <div class="flex gap-2">
                    <div class="w-full">
                        <label for="modele">Modele</label>
                        <p-select
                            inputId="modele"
                            name="modele"
                            styleClass="w-full"
                            [class]="uploadVehiculeErrors.modele ? 'ng-invalid ng-dirty' : ''"
                            [loading]="modeleLoading"
                            optionLabel="Model_Name"
                            optionValue="Model_Name"
                            [filter]="true"
                            filterBy="Make_Name"
                            [options]="modeleVehicule()"
                            [virtualScroll]="true"
                            [virtualScrollItemSize]="38"
                            [(ngModel)]="uploadVehiculeData.modele"
                        />
                        @if (uploadVehiculeErrors.modele) {
                            <small class="text-red-500">Veuillez selectionner une modele</small>
                        }
                    </div>
                </div>

                <div class="flex gap-2">
                    <div class="w-full">
                        <label for="boite_de_vitesse">Boite de vitesse</label>
                        <p-select
                            inputId="boite_de_vitesse"
                            name="boite_de_vitesse"
                            [class]="uploadVehiculeErrors.boite_de_vitesse ? 'ng-dirty ng-invalid' : ''"
                            styleClass="w-full"
                            [options]="boiteVitesseVehicule"
                            optionLabel="Name"
                            optionValue="Name"
                            [(ngModel)]="uploadVehiculeData.boite_de_vitesse"
                        />
                        @if (uploadVehiculeErrors.boite_de_vitesse) {
                            <small class="text-red-500">Veuillez selectionner une boite de vitesse</small>
                        }
                    </div>

                    <div class="w-full">
                        <label for="kilometrage">Kilometrage</label>
                        <input
                            type="number"
                            pInputText
                            class="w-full"
                            value="0"
                            [class.ng-dirty]="uploadVehiculeErrors.kilometrage"
                            [class.ng-invalid]="uploadVehiculeErrors.kilometrage"
                            name="kilometrage"
                            id="kilometrage"
                            [(ngModel)]="uploadVehiculeData.kilometrage"
                        />
                    </div>

                    <div class="w-full">
                        <label for="carburant">Carburant</label>
                        <p-select
                            inputId="carburant"
                            name="carburant"
                            styleClass="w-full"
                            [class]="uploadVehiculeErrors.carburant ? 'ng-dirty ng-invalid' : ''"
                            [options]="carburantVehicule"
                            optionLabel="Name"
                            optionValue="Name"
                            [(ngModel)]="uploadVehiculeData.carburant"
                        />
                        @if (uploadVehiculeErrors.carburant) {
                            <small class="text-red-500">Veuillez selectionner un carburant</small>
                        }
                    </div>
                </div>

                <p-divider />

                <div class="w-full">
                    <label for="immutraction">Immatriculation</label>
                    <input
                        type="text"
                        pInputText
                        class="w-full"
                        id="immutriculation"
                        name="immatriculation"
                        [class.ng-dirty]="uploadVehiculeErrors.immatriculation"
                        [class.ng-invalid]="uploadVehiculeErrors.immatriculation"
                        [(ngModel)]="uploadVehiculeData.immatriculation"
                    />
                    @if (uploadVehiculeErrors.immatriculation) {
                        <small class="text-red-500">Veuillez entrer votre immatriculation</small>
                    }
                </div>

                <div class="w-full">
                    <label for="images">Images vehicules</label>
                    <p-fileupload name="images[]" itemid="images" [multiple]="true" accept="image/*" maxFileSize="1000000" mode="advanced" [showUploadButton]="false" class="mt-2" (onSelect)="onImageSelected($event)">
                        <ng-template #empty>
                            <div>Drag and drop files to here to upload.</div>
                        </ng-template>
                    </p-fileupload>
                </div>

                <p-button type="submit" label="Ajouter vehicule" styleClass="w-full" />
            </form>
        </p-dialog>
    `,
    styles: ``
})
export class UtilisateurVehiculeComponent implements OnInit {
    userVehiculesData: any[] = [];

    isAddVehiculeModalVisible: boolean = false;

    // Vehicules info
    anneeVehicule = signal([]);
    marqueVehicule = signal([]);
    modeleVehicule = signal([]);

    boiteVitesseVehicule = [];
    carburantVehicule = [];

    modeleLoading: boolean = false;

    uploadVehiculeData: any = {
        marque: signal(''),
        annee: signal(''),
        modele: signal(''),
        boite_de_vitesse: '',
        carburant: '',
        immatriculation: '',
        kilometrage: '0',
        images: []
    };

    uploadVehiculeErrors: any = {};

    // Recherhce
    vehiculeSearch : string = ""

    constructor(
        private vehiculeService: VehiculeService,
        private messageService: MessageService
    ) {
        effect(() => {
            if (this.uploadVehiculeData.marque() && this.uploadVehiculeData.annee()) {
                this.modeleLoading = true;

                this.vehiculeService.getModeles(this.uploadVehiculeData.annee(), this.uploadVehiculeData.marque()).subscribe({
                    next: (response: any) => {
                        if (response.data.Count > 0) {
                            this.modeleVehicule.set(response.data.Results);
                        }
                        this.modeleLoading = false;
                    }
                });
            }
        });
    }

    ngOnInit(): void {
        this.vehiculeService.getVehicules().subscribe({
            next: (response: any) => {
                this.userVehiculesData = response.data;
            }
        });
    }

    onImageSelected(event: any) {
        console.log(event);
        for (let i = 0; i < event.files.length; i++) {
            this.uploadVehiculeData.images.push(event.files[i]);
        }

        console.log(this.uploadVehiculeData.images);
    }

    showAddVehiculeModal() {
        this.isAddVehiculeModalVisible = true;

        this.vehiculeService.getMarques().subscribe({
            next: (response: any) => {
                this.marqueVehicule.set(response.data.Results);
            }
        });

        this.vehiculeService.getAnnees().subscribe({
            next: (response: any) => {
                this.anneeVehicule.set(response.data);
            }
        });

        this.vehiculeService.getBoiteDeVitesse().subscribe({
            next: (response: any) => {
                this.boiteVitesseVehicule = response.data.Results;
            }
        });

        this.vehiculeService.getCarburants().subscribe({
            next: (repsponse: any) => {
                this.carburantVehicule = repsponse.data.Results;
            }
        });
    }

    onSubmitAddVehicule() {
        const formData = new FormData();

        formData.append('marque', this.uploadVehiculeData.marque());
        formData.append('modele', this.uploadVehiculeData.modele());
        formData.append('annee', this.uploadVehiculeData.annee());
        formData.append('immatriculation', this.uploadVehiculeData.immatriculation);
        formData.append('boite_de_vitesse', this.uploadVehiculeData.boite_de_vitesse);
        formData.append('carburant', this.uploadVehiculeData.carburant);
        this.uploadVehiculeData.images.forEach((image: File) => {
            formData.append('images[]', image, image.name);
        });

        console.log(formData);

        this.vehiculeService.addVehicule(formData).subscribe({
            next: (response: any) => {
                this.isAddVehiculeModalVisible = false;

                // Vider
                this.uploadVehiculeData.marque.set('');
                this.uploadVehiculeData.annee.set('');
                this.uploadVehiculeData.modele.set('');
                this.uploadVehiculeData.boite_de_vitesse = '';
                this.uploadVehiculeData.carburant = '';
                this.uploadVehiculeData.immatriculation = '';
                this.uploadVehiculeData.kilometrage = '0';
                this.uploadVehiculeData.images = [];

                this.uploadVehiculeErrors = {}

                // Affiche message resuissite
                this.messageService.add({
                    severity: 'success',
                    summary: response.message
                });
            },
            error: (err) => {
                this.uploadVehiculeErrors = err.error.error;
                console.log(this.uploadVehiculeErrors);
            }
        });
    }
}

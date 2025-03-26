import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiculeService } from '../../../_services/vehicule/vehicule.service';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUpload } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { ChipModule } from 'primeng/chip';
import { environment } from '../../../../_env/environment';
import { UtilisateurVehiculesIntervetionsComponent } from './utilisateur.vehicules-intervetions.component';
import { InfosVehiculeComponent } from '../../utils/vehicule/infos-vehicule.component';

@Component({
    selector: 'app-utilisateur.details-vehicule',
    imports: [InfosVehiculeComponent, CarouselModule, CardModule, ChipModule, DividerModule, ButtonModule, DataViewModule, DialogModule, InputTextModule, TextareaModule, FileUpload, FormsModule, CommonModule, UtilisateurVehiculesIntervetionsComponent],
    template: `
        <div class="flex gap-2">
            <div class="w-2/3">
                <!-- Details vehicule -->
                <app-infos-vehicule [vehicule]="currentVehicule" />
            </div>

            <div class="w-1/3">
                <!-- Documents vehicules -->
                <p-card>
                    <div class="flex justify-between">
                        <h3>Documents</h3>

                        <p-button label="Ajouter documents" icon="pi pi-plus" (onClick)="showDocumentsModal()" />
                    </div>

                    <div class="mt-3">
                        <p-data-view emptyMessage="Aucun document enregistrer" [value]="documentsVehicule" paginator [rows]="5">
                            <ng-template #list let-items>
                                <div class="flex flex-col gap-2">
                                    @for (document of items; track document._id) {
                                        <p-card>
                                            <div class="flex justify-between align-middle">
                                                <div class="flex flex-col gap-2">
                                                    <div class="flex gap-2">
                                                        <h6 class="mb-0">{{ document.titre }}</h6>
                                                        <p-chip label="{{ document.createdAt | date: 'yyyy-MM-dd HH:mm' }}" />
                                                    </div>
                                                    <p>{{ document.description }}</p>
                                                </div>

                                                <a class="p-button w-fit h-fit" [href]="getDocumentDowloadLink(document._id)">
                                                    <i class="pi pi-download"></i>
                                                </a>
                                            </div>
                                        </p-card>
                                    }
                                </div>
                            </ng-template>
                        </p-data-view>
                    </div>
                </p-card>

                <p-dialog header="Ajouter document" [(visible)]="isDocumentsModalVisible" modal [style]="{ width: '50rem' }">
                    <form (submit)="onSubmitUploadDocument()" class="flex flex-col gap-2">
                        <div class="w-full">
                            <label for="titre" class="block">Titre</label>
                            <input pInputText type="text" name="titre" id="titre" class="w-full" [(ngModel)]="documentUploadData.titre" />
                        </div>

                        <div class="w-full">
                            <label for="description" class="block">Description</label>
                            <textarea pTextarea name="description" id="description" rows="5" class="w-full" [(ngModel)]="documentUploadData.description"></textarea>
                        </div>

                        <div class="w-full">
                            <label for="ficher">Document</label>
                            <p-fileUpload mode="basic" chooseLabel="Veuillez selectionner votre fichier" chooseIcon="pi pi-upload" name="fichier" id="fichier" uploadStyleClass="w-full" (onSelect)="onSelectedFile($event)" />
                        </div>

                        <p-divider />

                        <div class="w-full">
                            <p-button type="submit" label="Enregistrer document" styleClass="w-full" />
                        </div>
                    </form>
                </p-dialog>
            </div>
        </div>

        <div class="mt-2">
            <app-utilisateur-vehicules-intervetions [vehiculeId]="currentVehiculeId"></app-utilisateur-vehicules-intervetions>
        </div>
    `,
    styles: ``
})
export class UtilisateurDetailsVehiculeComponent implements OnInit {
    currentVehiculeId: string = '';

    currentVehicule: any;

    // Documents
    documentsVehicule: any[] = [];

    isDocumentsModalVisible: boolean = false;

    documentUploadData: { titre: string; description: string; document: any } = {
        titre: '',
        description: '',
        document: ''
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private vehiculeService: VehiculeService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            this.currentVehiculeId = params.id;

            this.vehiculeService.getVehicule(this.currentVehiculeId).subscribe({
                next: (response: any) => {
                    this.currentVehicule = response.data;

                    this.updateDocuments();
                }
            });
        });
    }

    updateDocuments() {
        this.vehiculeService.getDocumentVehicule(this.currentVehicule._id).subscribe({
            next: (response: any) => {
                this.documentsVehicule = response.data;
            }
        });
    }

    showDocumentsModal() {
        this.isDocumentsModalVisible = true;
    }

    onSelectedFile(event: any) {
        this.documentUploadData.document = event.files[0];
    }

    onSubmitUploadDocument() {
        // this.isDocumentsModalVisible = false
        const formData = new FormData();
        formData.append('titre', this.documentUploadData.titre);
        formData.append('description', this.documentUploadData.description);
        formData.append('document', this.documentUploadData.document);

        this.vehiculeService.addDocumentVehicule(this.currentVehicule._id, formData).subscribe({
            next: (response) => {
                this.isDocumentsModalVisible = false;

                this.documentUploadData = {
                    titre: '',
                    description: '',
                    document: ''
                };

                this.updateDocuments();
            },
            error: (err) => {}
        });
    }

    getDocumentDowloadLink(documentId : string) {
        return environment.apiUrl + "vehicules/" + this.currentVehicule._id + "/documents/" + documentId
    }
}

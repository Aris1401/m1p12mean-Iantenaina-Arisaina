import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { VehiculeService } from '../../../_services/vehicule/vehicule.service';
import { BadgeModule } from 'primeng/badge';
import { RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-utilisateur.vehicule',
    imports: [CardModule, DataViewModule, ButtonModule, BadgeModule, RouterModule, DialogModule],
    template: `
        <p-card>
            <div class="flex justify-between">
                <h3>Mes voitures</h3>

                <p-button label="Ajouter une voiture" icon="pi pi-plus" (onClick)="showAddVehiculeModal()" />
            </div>

            <p-data-view [value]="userVehiculesData" emptyMessage="Aucune voiture" layout="grid">
                <ng-template #grid let-items>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 sm:col-span-6 md:col-span-4 xl:col-span-6 p-2">
                            @for (vehicule of items; track vehicule._id) {
                                <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                                    <div class="bg-surface-50 flex justify-center rounded p-4">
                                        <div class="relative mx-auto">
                                            <img class="rounded w-full" [src]="'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'" [alt]="vehicule.modele" style="max-width: 300px" />
                                            <!-- <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product)" class="absolute" styleClass="dark:!bg-surface-900" [style.left.px]="4" [style.top.px]="4" /> -->
                                        </div>
                                    </div>
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
											<p-badge [value]="vehicule.annee" />
											<p-badge [value]="vehicule.boite_de_vitesse" />
											<p-badge [value]="vehicule.carburant" />

										</div>

                                        <div class="flex flex-col gap-6 mt-2">
                                            <div class="flex gap-2">
                                                <a pButton [routerLink]="['/vehicule', vehicule._id]" icon="pi pi-info" label="Plus de details" class="flex-auto whitespace-nowrap"></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </ng-template>
            </p-data-view>
        </p-card>

		<p-dialog [modal]="true" [(visible)]="isAddVehiculeModalVisible" header="Ajouter vehicule" [style]="{ width: '60%' }">

		</p-dialog>
    `,
    styles: ``
})
export class UtilisateurVehiculeComponent implements OnInit {
    userVehiculesData: any[] = [];

	isAddVehiculeModalVisible : boolean = false

    constructor(private vehiculeService: VehiculeService) {}

    ngOnInit(): void {
        this.vehiculeService.getVehicules().subscribe({
            next: (response: any) => {
                this.userVehiculesData = response.data;
				console.log(this.userVehiculesData)
            }
        });
    }

	showAddVehiculeModal() {
		this.isAddVehiculeModalVisible = true
	}
}

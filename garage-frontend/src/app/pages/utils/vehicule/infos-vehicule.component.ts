import { Component, input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-infos-vehicule',
    imports: [ChipModule, CardModule, DividerModule, CarouselModule],
    template: `
        <p-card>
            <div class="flex gap-10">
                @if (vehicule() && vehicule().images && vehicule().images.length > 0) {
                    <p-carousel [value]="vehicule().images">
                        <ng-template let-image #item>
                            <div class="bg-surface-50 flex justify-center rounded p-4">
                                <div class="relative mx-auto">
                                    <img class="rounded w-full" [src]="'data:image/png;base64, ' + image" [alt]="vehicule().modele" style="max-height: 200px" />
                                    <!-- <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product)" class="absolute" styleClass="dark:!bg-surface-900" [style.left.px]="4" [style.top.px]="4" /> -->
                                </div>
                            </div>
                        </ng-template>
                    </p-carousel>
                } @else {
                    <div class="bg-surface-50 flex justify-center rounded p-4 w-1/3">
                        <div class="relative mx-auto">
                            <img class="rounded w-full" [src]="'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'" [alt]="vehicule() && vehicule().modele" style="max-width: 300px" />
                            <!-- <p-tag [value]="product.inventoryStatus" [severity]="getSeverity(product)" class="absolute" styleClass="dark:!bg-surface-900" [style.left.px]="4" [style.top.px]="4" /> -->
                        </div>
                    </div>
                }

                <div class="flex flex-col gap-2 mt-auto mb-auto w-2/3">
                    <h3>{{ vehicule() && vehicule().immatriculation }}</h3>

                    <div class="flex gap-2 align-middle">
                        <p class="m-0">Marque: <p-chip [label]="vehicule() && vehicule().marque" /></p>
                        <p-divider layout="vertical" />
                        <p class="m-0">Type: <p-chip label="N/A" /></p>
                    </div>

                    <div class="flex gap-2 align-middle">
                        <p class="m-0">Modele: <p-chip [label]="(vehicule() && vehicule().modele) || 'N/A'" /></p>
                        <p-divider layout="vertical" />
                        <p class="m-0">Annne modele: <p-chip [label]="vehicule() && vehicule().annee" /></p>
                    </div>

                    <div class="flex gap-2 align-middle">
                        <p class="m-0">Couleur: <p-chip [label]="'N/A'" /></p>
                        <p-divider layout="vertical" />
                        <p class="m-0">Boite de vitesse: <p-chip [label]="vehicule() && vehicule().boite_de_vitesse" /></p>
                        <p-divider layout="vertical" />
                        <p class="m-0">Energie: <p-chip [label]="vehicule() && vehicule().carburant" /></p>
                    </div>

                    <div class="flex gap-2 align-middle">
                        <p class="m-0">Kilometrage: <p-chip [label]="vehicule() && vehicule().kilometrage + ' km'" /></p>
                    </div>
                </div>
            </div>
        </p-card>
    `,
    styles: ``
})
export class InfosVehiculeComponent {
    vehicule : any = input();
}

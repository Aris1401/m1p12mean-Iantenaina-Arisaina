import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { MecanicienService } from '../../../_services/mecaniciens/mecanicien.service';
import { FormsModule } from '@angular/forms';
import { ManagerMecaniciensInterventionsComponent } from './manager.mecaniciens-interventions.component';

@Component({
    selector: 'app-manager.details-mecanicien',
    imports: [CardModule, InputTextModule, ImageModule, FormsModule, ManagerMecaniciensInterventionsComponent],
    template: `
        <div class="flex gap-2 w-full">
            <!-- Details -->
            <p-card class="w-1/4">
                <!-- <h4>Mon profil</h4> -->

                <div class="flex items-center justify-center flex-col mt-6">
                    <p-image src="https://sarahclaysocial.com/wp-content/uploads/2020/10/sarah-clay-3.jpg" imageClass="rounded-full" width="100" />

                    <div class="mt-3 text-center">
                        <p class="mb-0 font-bold text-xl">{{ mecanicienData.nom }}</p>
                        <p>{{ mecanicienData.prenom }}</p>
                    </div>
                </div>
            </p-card>

            <!-- Modifications -->
            <div class="w-3/4 flex flex-col gap-3">
                <p-card>
                    <h3>Informations personnelles</h3>

                    <div class="flex flex-col gap-2">
                        <div class="flex gap-2 w-full">
                            <div class="w-full">
                                <label for="nom" class="block mb-2 w-full text-xl font-medium">Nom</label>
                                <input readonly type="text" id="nom" name="nom" pInputText class="w-full" placeholder="Nom" [(ngModel)]="mecanicienData.nom" />
                            </div>

                            <div class="w-full">
                                <label for="prenom" class="block mb-2 w-full text-xl font-medium">Prenom</label>
                                <input readonly type="text" id="prenom" name="prenom" pInputText class="w-full" placeholder="Prenom" [(ngModel)]="mecanicienData.prenom" />
                            </div>
                        </div>

                        <div class="flex gap-2">
                            <div class="w-full mt-4 flex flex-col">
                                <label for="telephone" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Telephone</label>
                                <input readonly pInputText type="text" id="telephone" name="telephone" placeholder="03x xx xxx xx" class="w-full" [(ngModel)]="mecanicienData.telephone" />
                            </div>

                            <div class="w-full mt-4 flex flex-col">
                                <label for="date-naissance" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Date de naissance</label>
                                <input readonly pInputText type="date" id="date-naissance" name="date-naissance" placeholder="Votre date de naissance" class="w-full" [(ngModel)]="mecanicienData.date_naissance" />
                            </div>
                        </div>

                        <div class="w-full mt-4">
                            <label for="adresse" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Adresse</label>
                            <input readonly pInputText type="string" id="adresse" name="adresse" placeholder="Votre adresse" class="w-full" [(ngModel)]="mecanicienData.adresse" />
                        </div>

                        <div class="w-full mt-4">
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                            <input readonly pInputText id="email1" name="email" type="text" placeholder="Email address" class="w-full" [(ngModel)]="mecanicienData.email" value="user1@gmail.com" />
                        </div>
                    </div>
                </p-card>
            </div>
        </div>

        <!-- Liste des intervetions des mecaniciens -->
        <div class="mt-2">
            <app-manager-mecaniciens-interventions [idMecanicien]="currentMecanicienId" />
        </div>
    `,
    styles: ``
})
export class ManagerDetailsMecanicienComponent implements OnInit {
    currentMecanicienId: string = '';

    mecanicienData: any = {};

    constructor(
        private route: ActivatedRoute,
        private mecanicienService: MecanicienService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params: any) => {
            this.currentMecanicienId = params.id;

            this.mecanicienService.getMecanicienById(this.currentMecanicienId).subscribe({
                next: (response: any) => {
                    this.mecanicienData = response.data;
                }
            });
        });
    }
}

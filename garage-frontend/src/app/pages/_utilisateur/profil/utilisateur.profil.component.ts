import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LazyLoadEvent, MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { AuthStorageService } from '../../../_services/storage/auth-storage.service';
import { AuthentificationService } from '../../../_services/auth/authentification.service';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { UtilisateurService } from '../../../_services/utilisateur/utilisateur.service';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
    selector: 'app-utilisateur.profil',
    standalone: true,
    imports: [CardModule, ImageModule, MenuModule, FormsModule, CommonModule, InputTextModule, ButtonModule, ToastModule, TableModule, DialogModule, FileUploadModule, DividerModule],
    template: `
        <p-toast></p-toast>

        <div class="flex gap-2 w-full">
            <!-- Details -->
            <p-card class="w-1/4">
                <!-- <h4>Mon profil</h4> -->

                <div class="flex items-center justify-center flex-col mt-6">
                    <p-image src="https://sarahclaysocial.com/wp-content/uploads/2020/10/sarah-clay-3.jpg" imageClass="rounded-full" width="100" />

                    <div class="mt-3 text-center">
                        <p class="mb-0 font-bold text-xl">{{ userData.nom }}</p>
                        <p>{{ userData.prenom }}</p>
                    </div>

                    <div class="mt-6">
                        <p-menu [model]="profileItems" />
                    </div>
                </div>
            </p-card>

            <!-- Modifications -->
            <div class="w-3/4 flex flex-col gap-3">
                <p-card>
                    <h3>Informations personnelles</h3>

                    <form (submit)="onUpdateProfile()">
                        <div class="flex flex-col gap-2">
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
                                        [(ngModel)]="userData.nom"
                                        [class.ng-dirty]="signupInvalid && signupErrors.nom"
                                        [class.ng-invalid]="signupInvalid && signupErrors.nom"
                                    />
                                    @if (signupInvalid && signupErrors.nom) {
                                        <small id="nom-error" class="text-red-500">{{ signupErrors.nom.message }}</small>
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
                                        [(ngModel)]="userData.prenom"
                                        [class.ng-dirty]="signupInvalid && signupErrors.prenom"
                                        [class.ng-invalid]="signupInvalid && signupErrors.prenom"
                                    />
                                    @if (signupInvalid && signupErrors.prenom) {
                                        <small id="nom-error" class="text-red-500">{{ signupErrors.prenom.message }}</small>
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
                                        class="w-full"
                                        [(ngModel)]="userData.telephone"
                                        [class.ng-dirty]="signupInvalid && signupErrors.telephone"
                                        [class.ng-invalid]="signupInvalid && signupErrors.telephone"
                                    />
                                    @if (signupInvalid && signupErrors.telephone) {
                                        <small id="nom-error" class="text-red-500">{{ signupErrors.telephone.message }}</small>
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
                                        class="w-full"
                                        [(ngModel)]="userData.date_naissance"
                                        [class.ng-dirty]="signupInvalid && signupErrors.date_naissance"
                                        [class.ng-invalid]="signupInvalid && signupErrors.date_naissance"
                                    />
                                    @if (signupInvalid && signupErrors.date_naissance) {
                                        <small id="nom-error" class="text-red-500">{{ signupErrors.date_naissance.message }}</small>
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
                                    [(ngModel)]="userData.adresse"
                                    [class.ng-dirty]="signupInvalid && signupErrors.adresse"
                                    [class.ng-invalid]="signupInvalid && signupErrors.adresse"
                                />
                                @if (signupInvalid && signupErrors.adresse) {
                                    <small id="nom-error" class="text-red-500">{{ signupErrors.adresse.message }}</small>
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
                                    [(ngModel)]="userData.email"
                                    value="user1@gmail.com"
                                    [class.ng-dirty]="signupInvalid && signupErrors.email"
                                    [class.ng-invalid]="signupInvalid && signupErrors.email"
                                />
                                @if (signupInvalid && signupErrors.email) {
                                    <small id="nom-error" class="text-red-500">{{ signupErrors.email.message }}</small>
                                }
                            </div>

                            <p-button type="submit" label="Modifier les informations" class="mt-3 ml-auto" />
                        </div>
                    </form>
                </p-card>

                <p-card>
                    <div class="flex justify-between">
                        <h3>Mes documents</h3>

                        <p-button label="Ajouter document" icon="pi pi-plus" (onClick)="showUserDocumentModal()" />
                    </div>

                    <p-table [value]="documentsUser" [lazy]="true" stripedRows [paginator]="true" [rows]="5" (onLazyLoad)="onLoadUserDocs($event)">
                        <ng-template #header>
                            <tr>
                                <th class="font-extrabold">Titre</th>
                                <th  class="font-extrabold">Date ajout</th>
                                <th></th>
                            </tr>
                        </ng-template>

                        <ng-template #body let-item>
                            <tr>
                                <td>{{ item.titre }}</td>
                                <td>
									<p class="font-bold">
										@if (item.date_ajout) { {{ item.date_ajout | date: "yyyy/MM/dd HH:mm" }} } @else { {{ "N/A" }} }
									</p>
								</td>
                                <td>
									<a class="p-button" [href]="getDowloadPath(item._id)">
                                        <i class="pi pi-download"></i>
										Telecharger
									</a>
								</td>
                            </tr>
                        </ng-template>
                    </p-table>

                    <!-- Document modal -->
                    <p-dialog [modal]="true" [(visible)]="uploadDocumentVisible" header="Ajouter document" [style]="{ width: '25rem' }">
                        <form class="w-full" (submit)="onSubmitUploadFile()">
                            <div class="w-full">
                                <label for="titre-document" class="block" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Titre document</label>
                                <input pInputText type="text" id="titre-document" name="titre-documet" class="w-full" [(ngModel)]="userDocumentUploadData.titre" />
                            </div>

                            <div class="w-full mt-3">
                                <label for="fichier" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Fichier</label>
                                <p-fileUpload mode="basic" chooseLabel="Veuillez selectionner votre fichier" chooseIcon="pi pi-upload" name="fichier" id="fichier" uploadStyleClass="w-full" (onSelect)="onSelectedFile($event)" />
                            </div>

                            <p-divider />

                            <div class="p-card-footer mt-4">
                                <p-button type="submit" label="Ajouter document" styleClass="w-full" />
                            </div>
                        </form>
                    </p-dialog>
                </p-card>
            </div>
        </div>
    `,
    styles: ``
})
export class UtilisateurProfilComponent implements OnInit {
	environementApi : string = ""

    profileItems: MenuItem[] = [
        {
            label: 'Se deconnecter',
            icon: PrimeIcons.SIGN_OUT,
			command: () => {
				this.authStorage.clear()
				this.router.navigate(['login'])
			}
        }
    ];

    userData: any = {
        nom: '',
        prenom: '',
        email: '',
        mot_de_passe: '',
        telephone: '',
        adresse: '',
        date_naissance: ''
    };

    signupErrors: any;
    signupInvalid: boolean = false;

    documentsUser: any[] = [];

    // Upload
    userDocumentUploadData: { titre: string; fichier: any } = {
        titre: '',
        fichier: ''
    };

    uploadDocumentVisible: boolean = false;

    constructor(
        private authStorage: AuthStorageService,
        private authService: AuthentificationService,
        private messageService: MessageService,
        private userService: UtilisateurService,
		private router : Router
    ) {}

    ngOnInit(): void {
		this.environementApi = environment.apiUrl;

        this.authStorage.getUser().then((user: any) => {
            this.userData = user;
            this.documentsUser = user.documents;

            if (user.date_naissance) {
                this.userData.date_naissance = new Date(user.date_naissance).toISOString().split('T')[0];
            }
        });
    }

    onUpdateProfile() {
        this.authService.updateUser(this.userData).subscribe({
            next: (response: any) => {
                console.log('Successs');

                this.messageService.add({
                    severity: 'success',
                    summary: response.message
                });

                this.signupInvalid = false;
            },
            error: (err) => {
                this.signupInvalid = true;
                this.signupErrors = err.error.error;
            }
        });
    }

	showUserDocumentModal() {
		this.uploadDocumentVisible = true
	}

	getDowloadPath(documentId : string) {
		return this.environementApi + "user/document/dowload/" + documentId
	}

    onLoadUserDocs(event: TableLazyLoadEvent): void {
        // handle the event with rows
    }

    onSubmitUploadFile() {
        console.log(this.userDocumentUploadData);

        // Creation a form data
        let formData = new FormData();
        formData.append('titre', this.userDocumentUploadData.titre);
        formData.append('document', this.userDocumentUploadData.fichier);

        this.userService.addUtilisateurDocument(formData).subscribe({
            next: (response : any) => {
                console.log('Fichier uploader avec success');

				this.userDocumentUploadData = {
					fichier: "",
					titre: ""
				}

				this.uploadDocumentVisible = false

				// Mis a jour de la liste
				this.documentsUser = response.data
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: err.error.error
                })
            }
        });
    }

    onSelectedFile(event: any) {
        this.userDocumentUploadData.fichier = event.files[0];
    }
}

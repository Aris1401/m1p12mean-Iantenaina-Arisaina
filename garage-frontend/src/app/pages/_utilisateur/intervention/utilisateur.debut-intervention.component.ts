import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InterventionService } from '../../../_services/intervention/intervention.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-utilisateur-debut-intervention',
    imports: [InputTextModule, ButtonModule, CommonModule, FormsModule, ToastModule],
    template: `
        <!-- <p-toast></p-toast> -->

        <form class="w-full" (submit)="onSubmit()">
            <div class="w-full">
                <label for="date-selectionner" class="block">Date debut</label>
                <input pInputText class="w-full" type="datetime-local" name="date-selectionner" id="date-selectionner" [ngModel]="$any(selectedDate) | date: 'yyyy-MM-dd HH:mm'" (ngModelChange)="selectedDate = $event" />
            </div>

            <div class="mt-2 w-full">
                <p-button label="Selectionner" styleClass="w-full" type="submit" [loading]="isLoading" />
            </div>
        </form>
    `,
    styles: ``
})
export class UtilisateurDebutInterventionComponent {
    intervetionId = input('');

    dateValider = output<void>();

    selectedDate = new Date();

    isLoading : boolean = false

    constructor (
      private intervetionService : InterventionService,
      private messageService : MessageService
    ) {}

    onSubmit() {
      this.isLoading = true

      this.intervetionService.updateDateDebutIntervetion(this.intervetionId(), this.selectedDate).subscribe({
        next: (response : any) => {
          this.messageService.add({
            summary: 'Date valider',
            detail: response.message,
            severity: 'success'
          })

          this.isLoading = false

          this.dateValider.emit()
        }, 
        error: (err) => {
          this.messageService.add({
            summary: 'Erreur',
            detail: err.error.error,
            severity: 'error'
          })

          this.isLoading = false
        }
      })

    }
}

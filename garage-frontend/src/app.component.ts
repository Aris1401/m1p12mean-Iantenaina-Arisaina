import { Component } from '@angular/core';
import { Event, Router, RouterModule } from '@angular/router';
import { CalendarModule, DateAdapter } from "angular-calendar"

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `<router-outlet></router-outlet>`
})
export class AppComponent {}

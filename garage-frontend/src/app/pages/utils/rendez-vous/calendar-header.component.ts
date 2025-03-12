import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarModule, CalendarView } from 'angular-calendar';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';

@Component({
    selector: 'app-calendar-header',
    imports: [CalendarModule, ButtonGroupModule, ButtonModule],
    template: `
        <div class="flex justify-between">
            <div class="">
                <p-button-group>
                    <div pButton mwlCalendarPreviousView [view]="view" [(viewDate)]="viewDate" (viewDateChange)="viewDateChange.next(viewDate)">Previous</div>
                    <div pButton mwlCalendarToday [(viewDate)]="viewDate" (viewDateChange)="viewDateChange.next(viewDate)">Today</div>
                    <div pButton mwlCalendarNextView [view]="view" [(viewDate)]="viewDate" (viewDateChange)="viewDateChange.next(viewDate)">Next</div>
                </p-button-group>
            </div>
            <div class="">
                <h3>{{ viewDate | calendarDate: view + 'ViewTitle' : locale }}</h3>
            </div>
            <div class="">
                <p-button-group>
                    <div pButton (click)="viewChange.emit(CalendarView.Month)" [severity]="view === CalendarView.Month ? 'secondary' : 'primary'">Month</div>
                    <div pButton (click)="viewChange.emit(CalendarView.Week)" [severity]="view === CalendarView.Week ? 'secondary' : 'primary'">Week</div>
                    <div pButton (click)="viewChange.emit(CalendarView.Day)" [severity]="view === CalendarView.Day ? 'secondary' : 'primary'">Day</div>
                </p-button-group>
            </div>
        </div>
    `,
    styles: ``
})
export class CalendarHeaderComponent {
    @Input() view!: CalendarView;

    @Input() viewDate!: Date;

    @Input() locale: string = 'en';

    @Output() viewChange = new EventEmitter<CalendarView>();

    @Output() viewDateChange = new EventEmitter<Date>();

    CalendarView = CalendarView;
}

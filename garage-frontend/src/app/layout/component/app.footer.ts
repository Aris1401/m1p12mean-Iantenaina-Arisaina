import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [ DividerModule ],
    template: `
    <div class="layout-footer flex align-middle">
        <p class="m-0">RAKOTONDRAMANANA Tanjona Iantenaina</p>
        <p-divider layout="vertical" />
        <p>SOLOFOARISON Tolotry Ny Avo Arisaina</p>    
    </div>`
})
export class AppFooter {}

import {bootstrapApplication} from '@angular/platform-browser';
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {provideRouter, RouterModule, RouterOutlet} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {AppointmentListComponent} from './app/components/appointment-list/appointment-list.component';
import {AppointmentFormComponent} from './app/components/appointment-form/appointment-form.component';
import {MatPaginatorIntl} from "@angular/material/paginator";

/*
Componente Main

Nota:
    Aggiunta di un bottone affianco al titolo per semplificare il ritorno alla home su dispositivi fullscreen
 */

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, MatToolbarModule, MatIconModule, RouterModule],
    template: `
        <mat-toolbar color="primary">
            <button mat-icon-button routerLink="/">
                <mat-icon>event</mat-icon>
            </button>
            <span class="app-title">Gestore Appuntamenti</span>
        </mat-toolbar>
        <router-outlet></router-outlet>
    `,
    styles: [`
        .app-title {
            margin-left: 1rem;
            font-size: 1.2rem;
            font-weight: 500;
        }
    `]
})
export class App {
    name = 'Gestore Appuntamenti';
}

const routes = [
    {path: '', component: AppointmentListComponent},
    {path: 'create', component: AppointmentFormComponent},
    {path: 'edit/:id', component: AppointmentFormComponent}
];

const paginatorIntl = new MatPaginatorIntl();
paginatorIntl.itemsPerPageLabel = 'Elementi per pagina:';
paginatorIntl.nextPageLabel = 'Prossima pagina';

bootstrapApplication(App, {
    providers: [
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient(),
        {provide: MatPaginatorIntl, useValue: paginatorIntl},
    ]
});
import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {AppointmentService} from '../../services/appointment.service';
import {Appointment} from '../../models/appointment.model';

/*
Componente riservato al display degli appuntamenti esistenti.
 */

@Component({
    selector: 'app-appointment-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        RouterModule,
        DatePipe
    ],
    template: `
        <div class="container">
            <div class="header">
                <h1>Appuntamenti</h1>
                <button mat-raised-button color="primary" routerLink="/create" class="add-button">
                    <mat-icon>add</mat-icon>
                    Nuovo Appuntamento
                </button>
            </div>

            <mat-form-field appearance="outline" class="search-field">
                <mat-label>Cerca un appuntamento</mat-label>
                <mat-icon matPrefix>search</mat-icon>
                <input matInput (keyup)="applyFilter($event)" placeholder="Ogni campo è ricercabile..." #input>
            </mat-form-field>

            <div class="table-container mat-elevation-z8">
                <table mat-table [dataSource]="dataSource" matSort>
                    <ng-container matColumnDef="date">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Data</th>
                        <td mat-cell *matCellDef="let row"> {{ row.date | date:'dd/MM/yyyy' }}</td>
                    </ng-container>

                    <ng-container matColumnDef="time">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Ora</th>
                        <td mat-cell *matCellDef="let row"> {{ row.time }}</td>
                    </ng-container>

                    <ng-container matColumnDef="customerName">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Cliente</th>
                        <td mat-cell *matCellDef="let row"> {{ row.customerName }}</td>
                    </ng-container>

                    <ng-container matColumnDef="address">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Indirizzo</th>
                        <td mat-cell *matCellDef="let row"> {{ row.address }}</td>
                    </ng-container>

                    <ng-container matColumnDef="city">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Città</th>
                        <td mat-cell *matCellDef="let row"> {{ row.city }}</td>
                    </ng-container>

                    <ng-container matColumnDef="cost">
                        <th mat-header-cell *matHeaderCellDef mat-sort-header> Tariffa prevista</th>
                        <td mat-cell *matCellDef="let row" class="cost-cell"> {{ row.cost | currency }}</td>
                    </ng-container>

                    <ng-container matColumnDef="actions">
                        <th mat-header-cell *matHeaderCellDef> Azioni</th>
                        <td mat-cell *matCellDef="let row" class="actions-cell">
                            <button mat-icon-button color="primary" [routerLink]="['/edit', row.id]"
                                    class="edit-button">
                                <mat-icon>edit</mat-icon>
                            </button>
                            <button mat-icon-button color="warn" (click)="deleteAppointment(row.id)"
                                    class="delete-button">
                                <mat-icon>delete</mat-icon>
                            </button>
                        </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                </table>

                <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Appuntamenti visibili"
                               lang="it-IT"></mat-paginator>
            </div>
        </div>
    `,
    styles: [`
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }

        .add-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0 24px;
        }

        .search-field {
            margin-bottom: 2rem;
        }

        .table-container {
            margin-bottom: 2rem;
        }

        .mat-mdc-row {
            transition: background-color 0.2s ease;
        }

        .cost-cell {
            font-weight: 500;
            color: #1a237e;
        }

        .edit-button:hover {
            background-color: rgba(63, 81, 181, 0.1);
        }

        .delete-button:hover {
            background-color: rgba(244, 67, 54, 0.1);
        }

        @media (max-width: 768px) {
            .header {
                flex-direction: column;
                gap: 1rem;
                align-items: stretch;
            }

            .add-button {
                width: 100%;
                justify-content: center;
            }
        }
    `]
})
export class AppointmentListComponent implements OnInit {
    displayedColumns: string[] = ['date', 'time', 'customerName', 'address', 'city', 'cost', 'actions'];
    dataSource: MatTableDataSource<Appointment>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(private appointmentService: AppointmentService) {
        this.dataSource = new MatTableDataSource();
    }

    ngOnInit() {
        this.loadAppointments();
    }

    loadAppointments() {
        this.appointmentService.getAppointments().subscribe(appointments => {
            this.dataSource.data = appointments;
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    deleteAppointment(id: number) {
        if (confirm(`Vuoi cancellare l'appuntamento selezionato?`)) {
            this.appointmentService.deleteAppointment(id).subscribe(() => {
                this.loadAppointments();
            });
        }
    }
}
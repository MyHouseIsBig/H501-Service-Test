import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {AppointmentService} from '../../services/appointment.service';

/*
Componente riservato alla creazione e modifica degli appuntamenti
 */

@Component({
    selector: 'app-appointment-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        RouterModule
    ],
    template: `
        <div class="container form-container">
            <div class="form-header">
                <button mat-icon-button color="primary" routerLink="/" class="back-button">
                    <mat-icon>arrow_back</mat-icon>
                </button>
                <h1>{{ isEditMode ? 'Modifica' : 'Nuovo' }} Appuntamento</h1>
            </div>

            <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()" class="appointment-form">
                <div class="form-row">
                    <mat-form-field appearance="outline">
                        <mat-label>Data</mat-label>
                        <input matInput [matDatepicker]="picker" formControlName="date">
                        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                        <mat-datepicker #picker></mat-datepicker>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Ora</mat-label>
                        <input matInput type="time" formControlName="time">
                    </mat-form-field>
                </div>

                <mat-form-field appearance="outline">
                    <mat-label>Cliente</mat-label>
                    <input matInput formControlName="customerName">
                    <mat-icon matSuffix>person</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>Indirizzo</mat-label>
                    <input matInput formControlName="address">
                    <mat-icon matSuffix>home</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>Città</mat-label>
                    <input matInput formControlName="city">
                    <mat-icon matSuffix>location_city</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                    <mat-label>Tariffa prevista</mat-label>
                    <input matInput type="number" formControlName="cost">
                    <mat-icon matSuffix>attach_money</mat-icon>
                </mat-form-field>

                <div class="button-row">
                    <button mat-raised-button color="primary" type="submit" [disabled]="!appointmentForm.valid">
                        <mat-icon>{{ isEditMode ? 'save' : 'add' }}</mat-icon>
                        {{ isEditMode ? 'Salva' : 'Crea' }} Appuntamento
                    </button>
                    <button mat-stroked-button type="button" routerLink="/">
                        <mat-icon>close</mat-icon>
                        Annulla
                    </button>
                </div>
            </form>
        </div>
    `,
    styles: [`
        .form-container {
            max-width: 800px;
            margin: 2rem auto;
        }

        .form-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .back-button {
            margin-left: -8px;
        }

        .appointment-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .form-row {
            display: flex;
            gap: 1rem;
        }

        .form-row > * {
            flex: 1;
        }

        .button-row {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }

        .button-row button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0 24px;
            height: 45px;
        }

        @media (max-width: 768px) {
            .form-row {
                flex-direction: column;
                gap: 0;
            }

            .button-row {
                flex-direction: column;
            }

            .button-row button {
                width: 100%;
                justify-content: center;
            }
        }
    `]
})
export class AppointmentFormComponent implements OnInit {
    appointmentForm: FormGroup;
    isEditMode = false;
    appointmentId?: number;

    constructor(
        private fb: FormBuilder,
        private appointmentService: AppointmentService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.appointmentForm = this.fb.group({
            date: ['', Validators.required],
            time: ['', Validators.required],
            customerName: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            cost: ['', [Validators.required, Validators.min(0)]]
        });
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.appointmentId = +id;
            this.loadAppointment(this.appointmentId);
        }
    }

    loadAppointment(id: number) {
        this.appointmentService.getAppointment(id).subscribe(appointment => {
            console.log("salvata: ", appointment.date);
            const appointmentData = {
                ...appointment,
                date: new Date(appointment.date)
            };
            this.appointmentForm.patchValue(appointmentData);
        });
    }

    onSubmit() {
        if (this.appointmentForm.valid) {
            const formValue = this.appointmentForm.value;
            console.log("submit: ", formValue.date);
            const appointment = {
                ...formValue,
                date: formValue.date
            };

            console.log("submit obj: ", appointment.date);

            if (this.isEditMode && this.appointmentId) {
                appointment.id = this.appointmentId;
                this.appointmentService.updateAppointment(appointment).subscribe(() => {
                    this.router.navigate(['/']);
                });
            } else {
                this.appointmentService.createAppointment(appointment).subscribe(() => {
                    this.router.navigate(['/']);
                });
            }
        }
    }
}
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Appointment} from '../models/appointment.model';

/*
Metodi disponibili:
    getAppointments (no parametri): Ottieni tutti gli appuntamenti
    getAppointment (id: number): Ottieni l'appuntamento ricercato
    createAppointment (appointment: Appointment): Crea un nuovo appuntamento
    updateAppointment (appointment: Appointment): Aggiorna un appuntamento esistente
    deleteAppointment (id: number): Elimina un appuntamento esistente
 */

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
    private apiUrl = 'http://localhost:3000/appointments';

    constructor(private http: HttpClient) {
    }

    getAppointments(): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(this.apiUrl);
    }

    getAppointment(id: number): Observable<Appointment> {
        return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
    }

    createAppointment(appointment: Appointment): Observable<Appointment> {
        return this.http.post<Appointment>(this.apiUrl, appointment);
    }

    updateAppointment(appointment: Appointment): Observable<Appointment> {
        return this.http.put<Appointment>(`${this.apiUrl}/${appointment.id}`, appointment);
    }

    deleteAppointment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
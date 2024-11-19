/*
Modello riservato agli appuntamenti standard
 */
export interface Appointment {
    id?: number;
    date: string;
    time: string;
    customerName: string;
    address: string;
    city: string;
    cost: number;
}
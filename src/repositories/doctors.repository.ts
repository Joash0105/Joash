import { inject, injectable } from "tsyringe";
import { DatabaseDaoInterface } from "../dao/databaseDao.interface.js";
import lodash from 'lodash';

@injectable()
export class DoctorRepository {
    dao: DatabaseDaoInterface;

    constructor(@inject('DatabaseDaoInterface') dao: DatabaseDaoInterface) {
        this.dao = dao;
    }

    async getAllAppointments() {
        let result;
        try {
            const appointments_query = `
                SELECT 
                    appointments.id, CONCAT(doctors.first_name, ' ', doctors.last_name) as assigned_doctor, CONCAT(patients.first_name, ' ', patients.last_name) as patient, datetime as scheduled_time, is_booked as status
                FROM \`appointments\`
                INNER JOIN \`doctors\`
                    ON appointments.doctor_id = doctors.id
                INNER JOIN \`patients\`
                    ON appointments.patient_id = patients.id
            `;
            const appointments = await this.dao.executeQuery(appointments_query);
            result = appointments;
        } catch (err) {
            console.log(err);
        }
        return result;
    }

    /**
     * Get all patients.
     * @returns array of patients
     */
    async getAllPatients() {
        let result;
        try {
            const patient_query = `
                SELECT id, first_name, last_name, CONCAT(first_name, ' ', last_name) as full_name FROM \`patients\`
            `;
            const patients = await this.dao.executeQuery(patient_query);
            result = patients;
        } catch (err) {
            console.log(err);
        }
        return result;
    }

    async deleteAppointment(appointment_id: string, patient_id: string) {
        let result;
        try {
            const update_booking_query = `
                DELETE FROM \`appointments\`
                WHERE id = ? AND patient_id = ?
            `;

            const appointments_query = `
                SELECT 
                    appointments.id, CONCAT(doctors.first_name, ' ', doctors.last_name) as assigned_doctor, CONCAT(patients.first_name, ' ', patients.last_name) as patient, datetime as scheduled_time, is_booked as status
                FROM \`appointments\`
                INNER JOIN \`doctors\`
                    ON appointments.doctor_id = doctors.id
                INNER JOIN \`patients\`
                    ON appointments.patient_id = patients.id
                AND patients.id = ?
            `;
        
        

            await this.dao.executeQuery(update_booking_query, [parseInt(appointment_id), parseInt(patient_id)]);
            const appointments = await this.dao.executeQuery(appointments_query, [parseInt(patient_id)]);

            result = { appointments: appointments};
        } catch (err) {
            console.log(err);
        }
        return result;
    }

    /**
     * Updates patient's appointment.
     * @param body request body
     * @param appointment_id appointment ID
     * @param patient_id patient ID
     * @returns 
     */
    async updateAppointment(body: any, appointment_id: string, patient_id: string) {
        let result;
        try {
            const update_booking_query = `
                UPDATE \`appointments\`
                    SET doctor_id = ?, datetime = ?, is_booked = ?
                WHERE id = ? AND patient_id = ?
            `;

            const appointment_query = `
                SELECT 
                    appointments.id, CONCAT(patients.first_name, ' ', patients.last_name) as patient, datetime as scheduled_time, is_booked as status
                FROM \`appointments\`
                INNER JOIN \`doctors\`
                    ON appointments.doctor_id = doctors.id
                INNER JOIN \`patients\`
                    ON appointments.patient_id = patients.id
                WHERE patient_id = ?
            `;

            await this.dao.executeQuery(update_booking_query, [body.doctor_id, body.datetime, body.is_booked, parseInt(appointment_id), parseInt(patient_id)]);
            const appointment = await this.dao.executeQuery(appointment_query, [parseInt(patient_id)]);

            result = { appointment_status: appointment};
        } catch (err) {
            console.log(err);
        }
        return result;
    }

    /**
     * Creates an appointment.
     * @param id doctor ID
     * @param datetime date and time of booking
     * @param is_booked status of booking
     * @returns doctor and its appointments
     */
    async bookAppointment(doctor_id: number, patient_id: number, datetime: string, is_booked: string) {
        let result;
        try {
            const allDoctors: any[] = [];

            const booking_query = `
                INSERT INTO \`appointments\` (doctor_id, patient_id, datetime, is_booked)
                VALUES (?, ?, ?, ?)
            `

            await this.dao.executeQuery(booking_query, [doctor_id, patient_id, datetime, is_booked]);

            const doctor_query = `
                SELECT 
                    doctors.id, first_name, last_name, CONCAT(first_name,' ',last_name) as full_name, specialty, phone_number, email, CONCAT(hospital_name, ', ', city, ', ', state) as location 
                FROM \`doctors\`
                INNER JOIN \`hospitals\`
                    ON doctors.hospital_id = hospitals.id
                INNER JOIN \`location\`
                    ON hospitals.location_id = location.id
                AND doctors.id = ?
            `;

            const appointment_query = `
                SELECT 
                    appointments.id, CONCAT(patients.first_name, ' ', patients.last_name) as patient, datetime as scheduled_time, is_booked as status
                FROM \`appointments\`
                INNER JOIN \`doctors\`
                    ON appointments.doctor_id = doctors.id
                INNER JOIN \`patients\`
                    ON appointments.patient_id = patients.id
                WHERE doctor_id = ? AND patient_id = ?
            `

            const doctors = await this.dao.executeQuery(doctor_query, [doctor_id]);

            for(let i = 0; i < doctors.length; i++) {
                const appointments = await this.dao.executeQuery(appointment_query, [doctors[i].id, patient_id]);
                allDoctors.push(lodash.extend({doctor_information: doctors[i], appointments: appointments}));
            }

            result = allDoctors;
        } catch (err) {
            console.log(err);
        }
        return result;
    }

    /**
     * Get specific doctor by ID.
     * @param id doctor ID
     * @returns doctor and its appointments
     */
    async getDoctorById(id: string) {
        let result;
        try {
            const allDoctors: any[] = [];

            const doctor_query = `
                SELECT doctors.id, first_name, last_name, CONCAT(first_name,' ',last_name) as full_name, specialty, phone_number, email, CONCAT(hospital_name, ', ', city, ', ', state) as location FROM \`doctors\`
                INNER JOIN \`hospitals\`
                ON doctors.hospital_id = hospitals.id
                INNER JOIN \`location\`
                ON hospitals.location_id = location.id
                AND doctors.id = ?
            `;

            const appointment_query = `
                SELECT 
                    appointments.id, CONCAT(patients.first_name, ' ', patients.last_name) as patient, datetime as scheduled_time, is_booked as status
                FROM \`appointments\`
                INNER JOIN \`doctors\`
                    ON appointments.doctor_id = doctors.id
                INNER JOIN \`patients\`
                    ON appointments.patient_id = patients.id
                WHERE doctor_id = ?
            `

            const doctors = await this.dao.executeQuery(doctor_query, [parseInt(id)]);

            for(let i = 0; i < doctors.length; i++) {
                const appointments = await this.dao.executeQuery(appointment_query, [doctors[i].id]);
                allDoctors.push(lodash.extend({doctor_information: doctors[i], appointments: appointments}));
            }

            result = allDoctors;
        } catch (err) {
            console.log(err);
        }
        return result;
    }

    /**
     * Get all doctors
     * @returns array of doctors and its appointments
     */
    async getAllDoctors() {
        let result;
        try {
            const allDoctors: any[] = [];

            const doctor_query = `
                SELECT doctors.id, first_name, last_name, CONCAT(first_name,' ',last_name) as full_name, specialty, phone_number, email, CONCAT(hospital_name, ', ', city, ', ', state) as location FROM \`doctors\`
                INNER JOIN \`hospitals\`
                ON doctors.hospital_id = hospitals.id
                INNER JOIN \`location\`
                ON hospitals.location_id = location.id
            `;

            const appointment_query = `
                SELECT 
                    appointments.id, CONCAT(patients.first_name, ' ', patients.last_name) as patient, datetime as scheduled_time, is_booked as status
                FROM \`appointments\`
                INNER JOIN \`doctors\`
                    ON appointments.doctor_id = doctors.id
                INNER JOIN \`patients\`
                    ON appointments.patient_id = patients.id
                WHERE doctor_id = ?
            `

            const doctors = await this.dao.executeQuery(doctor_query);

            for(let i = 0; i < doctors.length; i++) {
                const appointments = await this.dao.executeQuery(appointment_query, [doctors[i].id]);
                allDoctors.push(lodash.extend({doctor_information: doctors[i], appointments: appointments}));
            }

            result = allDoctors;
        } catch (err) {
            console.log(err);
        }
        return result;
    }
}
import express, { Request, Response } from "express";
import { getDoctorRepo } from "./factories/doctors.repo.factory.js";

import 'reflect-metadata';
import { inject, injectable } from "tsyringe";
import { ApplicationConfigFactoryInterface } from "./config/appConfigFactory.interface.js";
import { ServerConfigurationInterface } from './config/serverConfiguration.interface.js';
import { createServer } from "http";

@injectable()
export class ApiServer {
    appConfigFactory: ApplicationConfigFactoryInterface;
    constructor(@inject('ApplicationConfigFactoryInterface') appConfigFactory: ApplicationConfigFactoryInterface) {
        this.appConfigFactory = appConfigFactory;
    }

    async create(): Promise<ServerConfigurationInterface> {
        const app = express();
        const httpServer = createServer(app);
        const config = this.appConfigFactory.getApplicationConfig();

        app.use(express.json());
        
        const repo = getDoctorRepo();

        // Home
        app.get('/', (_req: Request, res: Response) => {
            res.send({title: 'Welcome to Doctor Database API!'});
        });

        // Get All Patients
        app.get('/patients', async (_req: Request, res: Response) => {
            res.send({patients: await repo.getAllPatients()});
        })

        // Get All Appointments
        app.get('/appointments', async (_req: Request, res: Response) => {
            res.send({appointments: await repo.getAllAppointments()});
        })

        // Get All Doctors
        app.get('/doctors', async (_req: Request, res: Response) => {
            res.send({doctors: await repo.getAllDoctors()});
        });

        // Get Specific Doctor
        app.get('/doctor/:id', async (req: Request, res: Response) => {
            res.send({doctor: await repo.getDoctorById(req.params.id)})
        });

        // Post Appointment
        app.post('/patient/appointment/book', async (req: Request, res: Response) => {
            const doctor_id = req.body.doctor_id;
            const patient_id = req.body.patient_id;        
            const datetime = req.body.datetime;
            const is_booked = req.body.is_booked;
            res.send({doctor: await repo.bookAppointment(doctor_id, patient_id, datetime, is_booked)});
        });

        // Update Patient Appointment
        app.patch('/patient/:patient_id/appointment/:appointment_id/update', async (req: Request, res: Response) => {
            const appointment_id = req.params.appointment_id;
            const patient_id = req.params.patient_id;        
            res.send({patient: await repo.updateAppointment(req.body, appointment_id, patient_id)});
        });

        // Delete Patient Appointment
        app.delete('/patient/:patient_id/appointment/:appointment_id/delete', async (req: Request, res: Response) => {
            const appointment_id = req.params.appointment_id;
            const patient_id = req.params.patient_id;   
            res.send({patient: await repo.deleteAppointment(appointment_id, patient_id)});
        })


        await new Promise<void>((resolve) => httpServer.listen({ port: config.port }, resolve));
        const url = `http://localhost:${config.port}`;
        console.log(`Server up at ${url}!`);

        return {
            server: httpServer,
            port: config.port,
            app: app,
            url: url,
        };
    }
}
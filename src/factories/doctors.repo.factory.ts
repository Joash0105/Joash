import { container } from 'tsyringe';
import { DatabaseDao } from '../dao/databaseDao.js';
import { DoctorRepository } from '../repositories/doctors.repository.js';

/**
 * Retrieves Membership Repository.
 * @returns Membership Repository.
 */
export const getDoctorRepo = (): DoctorRepository => {
  let repo: DoctorRepository;
  if (container.isRegistered('DatabaseDaoInterface')) {
    repo = new DoctorRepository(container.resolve('DatabaseDaoInterface'));
  } else {
    const dao = new DatabaseDao(container.resolve('DatabaseConfigFactoryInterface'));
    repo = new DoctorRepository(dao);
  }
  return repo;
};
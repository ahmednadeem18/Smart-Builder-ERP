import * as repo
  from '../repositories/hr.repository.js'

export const GetAllHumanResources = async () => {
  return await repo.GetAllHumanResources();
}
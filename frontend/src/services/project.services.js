import { request } from './api.js'


export function GetProjects() {
  return request('api/projects');
}
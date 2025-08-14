import axios from 'axios';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api';
export const api = axios.create({ baseURL: API_BASE });
export async function getTasks(){ return api.get('/tasks/'); }
export async function createTask(data){ return api.post('/tasks/', data); }
export async function getCategories(){ return api.get('/categories/'); }
export async function postContext(entry){ return api.post('/context/', entry); }
export async function getContext(){ return api.get('/context/'); }
export async function aiSuggestions(payload){ return api.post('/tasks/ai/suggestions/', payload); }

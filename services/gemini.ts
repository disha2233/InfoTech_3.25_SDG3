import { api } from './api';

export const getFirstAidGuidance = async (emergencyType: string) => {
  try {
    return await api.post('/emergency/guidance', { emergencyType });
  } catch (e) {
    console.error("Failed to fetch guidance from backend", e);
    return null;
  }
};

import { apiRequest } from './api';

export async function getEntries() {
  try {
    const res = await apiRequest('/api/entries');
    return res.entries || [];
  } catch (error) {
    console.error('getEntries error:', error);
    return [];
  }
}

export async function getEntry(id) {
  try {
    const res = await apiRequest(`/api/entries/${id}`);
    return res.entry || null;
  } catch (error) {
    console.error(`getEntry(${id}) error:`, error);
    return null;
  }
}

export async function createEntry(data) {
  try {
    const res = await apiRequest('/api/entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.entry;
  } catch (error) {
    console.error('createEntry error:', error);
    throw error;
  }
}

export async function updateEntry(id, data) {
  try {
    const res = await apiRequest(`/api/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.entry;
  } catch (error) {
    console.error(`updateEntry(${id}) error:`, error);
    throw error;
  }
}

export async function deleteEntry(id) {
  try {
    const res = await apiRequest(`/api/entries/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  } catch (error) {
    console.error(`deleteEntry(${id}) error:`, error);
    throw error;
  }
}

export async function getWeeklySummary() {
  try {
    const res = await apiRequest('/api/entries/summary/weekly');
    return res;
  } catch (error) {
    console.error('getWeeklySummary error:', error);
    return null;
  }
}

export function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

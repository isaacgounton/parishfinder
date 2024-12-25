import { ref, set, get, serverTimestamp } from 'firebase/database';
import { database } from './firebase';
import type { Parish } from '../types/parish';

interface SearchHistoryItem {
  query: string;
  timestamp: number;
  userId: string;
}

export const saveParish = async (parish: Parish): Promise<void> => {
  try {
    const parishRef = ref(database, `parishes/${parish.id}`);
    const updatedParish = {
      ...parish,
      updatedAt: serverTimestamp(),
    };
    await set(parishRef, updatedParish);
  } catch (error) {
    console.error('Error saving parish:', error);
    throw new Error('Failed to save parish data');
  }
};

export const getParish = async (id: string): Promise<Parish | null> => {
  const parishRef = ref(database, `parishes/${id}`);
  const snapshot = await get(parishRef);
  return snapshot.exists() ? snapshot.val() : null;
};

export const saveSearchHistory = async (userId: string, query: string): Promise<void> => {
  const historyRef = ref(database, `searchHistory/${userId}/${Date.now()}`);
  await set(historyRef, {
    query,
    timestamp: serverTimestamp(),
    userId
  });
};

export const getSearchHistory = async (userId: string): Promise<SearchHistoryItem[]> => {
  const historyRef = ref(database, `searchHistory/${userId}`);
  const snapshot = await get(historyRef);
  
  if (!snapshot.exists()) return [];
  
  const history = snapshot.val();
  return Object.entries(history)
    .map(([key, value]) => ({
      ...(value as Omit<SearchHistoryItem, 'id'>),
      id: key
    }))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10); // Keep last 10 searches
};
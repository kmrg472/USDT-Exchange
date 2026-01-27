import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Puzzle, GameState, PuzzleMetadata } from '../types';

interface CrosswordDB extends DBSchema {
  puzzles: {
    key: string;
    value: Puzzle;
  };
  gameStates: {
    key: string;
    value: GameState;
  };
  metadata: {
    key: string;
    value: PuzzleMetadata;
  };
}

const DB_NAME = 'forkyz-crossword';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<CrosswordDB> | null = null;

async function getDB(): Promise<IDBPDatabase<CrosswordDB>> {
  if (dbInstance) return dbInstance;
  
  dbInstance = await openDB<CrosswordDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores
      if (!db.objectStoreNames.contains('puzzles')) {
        db.createObjectStore('puzzles', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('gameStates')) {
        db.createObjectStore('gameStates', { keyPath: 'puzzleId' });
      }
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'id' });
      }
    },
  });
  
  return dbInstance;
}

/**
 * Save a puzzle to IndexedDB
 */
export async function savePuzzle(puzzle: Puzzle): Promise<void> {
  const db = await getDB();
  await db.put('puzzles', puzzle);
  
  // Also save/update metadata
  const metadata: PuzzleMetadata = {
    id: puzzle.id,
    title: puzzle.title,
    author: puzzle.author,
    size: `${puzzle.width}x${puzzle.height}`,
    pubdate: puzzle.pubdate,
    completed: false,
    progress: 0
  };
  
  await db.put('metadata', metadata);
}

/**
 * Load a puzzle from IndexedDB
 */
export async function loadPuzzle(id: string): Promise<Puzzle | null> {
  const db = await getDB();
  const puzzle = await db.get('puzzles', id);
  return puzzle || null;
}

/**
 * Get all puzzle metadata
 */
export async function getAllPuzzleMetadata(): Promise<PuzzleMetadata[]> {
  const db = await getDB();
  return await db.getAll('metadata');
}

/**
 * Delete a puzzle
 */
export async function deletePuzzle(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('puzzles', id);
  await db.delete('metadata', id);
  await db.delete('gameStates', id);
}

/**
 * Save game state
 */
export async function saveGameState(state: GameState): Promise<void> {
  const db = await getDB();
  await db.put('gameStates', state);
  
  // Update metadata progress
  const metadata = await db.get('metadata', state.puzzleId);
  if (metadata) {
    const totalCells = state.grid.flat().filter(box => !box.isBlock).length;
    const filledCells = state.grid.flat().filter(box => !box.isBlock && box.response).length;
    metadata.progress = Math.round((filledCells / totalCells) * 100);
    metadata.completed = state.isComplete;
    await db.put('metadata', metadata);
  }
}

/**
 * Load game state
 */
export async function loadGameState(puzzleId: string): Promise<GameState | null> {
  const db = await getDB();
  const state = await db.get('gameStates', puzzleId);
  return state || null;
}

/**
 * Clear all data (for testing)
 */
export async function clearAllData(): Promise<void> {
  const db = await getDB();
  await db.clear('puzzles');
  await db.clear('gameStates');
  await db.clear('metadata');
}

/**
 * LocalStorage fallback for simple data
 */
export const LocalStorageService = {
  saveSettings(settings: any): void {
    localStorage.setItem('forkyz-settings', JSON.stringify(settings));
  },
  
  loadSettings(): any {
    const data = localStorage.getItem('forkyz-settings');
    return data ? JSON.parse(data) : {
      showTimer: true,
      checkOnComplete: true,
      skipFilledCells: true,
      darkMode: false
    };
  },
  
  saveCurrentPuzzleId(id: string): void {
    localStorage.setItem('forkyz-current-puzzle', id);
  },
  
  loadCurrentPuzzleId(): string | null {
    return localStorage.getItem('forkyz-current-puzzle');
  }
};

// Core types for Forkyz Crossword PWA

export enum Direction {
  ACROSS = 'across',
  DOWN = 'down'
}

export enum CellState {
  EMPTY = 'empty',
  FILLED = 'filled',
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
  REVEALED = 'revealed'
}

export interface Position {
  row: number;
  col: number;
}

export interface Box {
  row: number;
  col: number;
  solution: string | null;  // Correct answer
  response: string;          // User's answer
  isBlock: boolean;          // Black square
  clueNumber?: string;       // Number displayed in cell
  state: CellState;
  cheated: boolean;
  
  // Visual properties
  hasCircle?: boolean;
  color?: string;
  textColor?: string;
  
  // Clue associations
  acrossClueIndex?: number;
  downClueIndex?: number;
}

export interface Clue {
  number: string;
  text: string;
  direction: Direction;
  startRow: number;
  startCol: number;
  length: number;
  answer?: string;  // For checking
  cells: Position[];  // All cells in this clue
}

export interface Puzzle {
  id: string;
  title: string;
  author?: string;
  copyright?: string;
  notes?: string;
  width: number;
  height: number;
  grid: Box[][];
  acrossClues: Clue[];
  downClues: Clue[];
  pubdate?: string;
  source?: string;
}

export interface GameState {
  puzzleId: string;
  currentPosition: Position;
  currentDirection: Direction;
  grid: Box[][];
  startTime: number;
  elapsedTime: number;  // in seconds
  isPaused: boolean;
  isComplete: boolean;
  lastSaved: number;
}

export interface PuzzleMetadata {
  id: string;
  title: string;
  author?: string;
  difficulty?: string;
  size: string;
  pubdate?: string;
  completed: boolean;
  progress: number;  // 0-100
}

export enum GameView {
  BROWSER = 'browser',
  PLAY = 'play',
  CLUE_LIST = 'clue_list'
}

export interface AppState {
  currentView: GameView;
  currentPuzzle: Puzzle | null;
  gameState: GameState | null;
  puzzleList: PuzzleMetadata[];
}

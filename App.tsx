import React, { useState, useEffect, useCallback } from 'react';
import { 
  Puzzle, 
  GameState, 
  Position, 
  Direction, 
  GameView, 
  PuzzleMetadata,
  Clue,
  CellState,
  Box
} from './types';
import CrosswordGrid from './components/CrosswordGrid';
import ClueList from './components/ClueList';
import GameControls from './components/GameControls';
import PuzzleBrowser from './components/PuzzleBrowser';
import { 
  savePuzzle, 
  loadPuzzle, 
  saveGameState, 
  loadGameState,
  getAllPuzzleMetadata,
  LocalStorageService
} from './services/puzzleStorage';
import { createSamplePuzzle, parseJSONPuzzle } from './services/puzzleParser';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<GameView>(GameView.BROWSER);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [puzzleList, setPuzzleList] = useState<PuzzleMetadata[]>([]);
  const [currentClue, setCurrentClue] = useState<Clue | null>(null);
  const [highlightedCells, setHighlightedCells] = useState<Position[]>([]);
  const [settings, setSettings] = useState(LocalStorageService.loadSettings());
  
  // Load puzzle list on mount
  useEffect(() => {
    loadPuzzleList();
  }, []);
  
  // Timer effect
  useEffect(() => {
    if (!gameState || gameState.isPaused || gameState.isComplete) return;
    
    const interval = setInterval(() => {
      setGameState(prev => {
        if (!prev) return prev;
        const newState = {
          ...prev,
          elapsedTime: prev.elapsedTime + 1
        };
        // Auto-save every 10 seconds
        if (newState.elapsedTime % 10 === 0) {
          saveGameState(newState);
        }
        return newState;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameState?.isPaused, gameState?.isComplete]);
  
  // Keyboard handler
  useEffect(() => {
    if (currentView !== GameView.PLAY || !gameState) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      const { currentPosition, currentDirection, grid } = gameState;
      
      // Arrow keys
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        movePosition(-1, 0);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        movePosition(1, 0);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        movePosition(0, -1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        movePosition(0, 1);
      }
      // Tab to switch direction
      else if (e.key === 'Tab') {
        e.preventDefault();
        toggleDirection();
      }
      // Space to toggle direction
      else if (e.key === ' ') {
        e.preventDefault();
        toggleDirection();
      }
      // Backspace to delete
      else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      }
      // Letter input
      else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        e.preventDefault();
        handleLetterInput(e.key.toUpperCase());
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentView]);
  
  const loadPuzzleList = async () => {
    const list = await getAllPuzzleMetadata();
    setPuzzleList(list);
  };
  
  const startPuzzle = async (puzzleToLoad: Puzzle) => {
    // Try to load existing game state
    const existingState = await loadGameState(puzzleToLoad.id);
    
    if (existingState) {
      setGameState(existingState);
    } else {
      // Create new game state
      const newState: GameState = {
        puzzleId: puzzleToLoad.id,
        currentPosition: findFirstEmptyCell(puzzleToLoad.grid),
        currentDirection: Direction.ACROSS,
        grid: JSON.parse(JSON.stringify(puzzleToLoad.grid)), // Deep copy
        startTime: Date.now(),
        elapsedTime: 0,
        isPaused: false,
        isComplete: false,
        lastSaved: Date.now()
      };
      setGameState(newState);
    }
    
    setPuzzle(puzzleToLoad);
    setCurrentView(GameView.PLAY);
    updateCurrentClue(puzzleToLoad, existingState?.currentPosition || findFirstEmptyCell(puzzleToLoad.grid), existingState?.currentDirection || Direction.ACROSS);
  };
  
  const findFirstEmptyCell = (grid: Box[][]): Position => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (!grid[row][col].isBlock) {
          return { row, col };
        }
      }
    }
    return { row: 0, col: 0 };
  };
  
  const handleCellClick = (row: number, col: number) => {
    if (!gameState || !puzzle) return;
    
    const newState = { ...gameState };
    
    // If clicking current cell, toggle direction
    if (row === gameState.currentPosition.row && col === gameState.currentPosition.col) {
      newState.currentDirection = 
        gameState.currentDirection === Direction.ACROSS ? Direction.DOWN : Direction.ACROSS;
    } else {
      newState.currentPosition = { row, col };
    }
    
    setGameState(newState);
    updateCurrentClue(puzzle, newState.currentPosition, newState.currentDirection);
  };
  
  const updateCurrentClue = (puz: Puzzle, pos: Position, dir: Direction) => {
    const clues = dir === Direction.ACROSS ? puz.acrossClues : puz.downClues;
    const clue = clues.find(c => 
      c.cells.some(cell => cell.row === pos.row && cell.col === pos.col)
    );
    
    if (clue) {
      setCurrentClue(clue);
      setHighlightedCells(clue.cells);
    }
  };
  
  const handleLetterInput = (letter: string) => {
    if (!gameState || !puzzle) return;
    
    const { currentPosition, currentDirection, grid } = gameState;
    const newGrid = JSON.parse(JSON.stringify(grid));
    
    newGrid[currentPosition.row][currentPosition.col].response = letter;
    newGrid[currentPosition.row][currentPosition.col].state = CellState.FILLED;
    
    const newState = {
      ...gameState,
      grid: newGrid
    };
    
    setGameState(newState);
    
    // Move to next cell
    if (settings.skipFilledCells) {
      moveToNextEmptyCell(newState);
    } else {
      moveInDirection(currentDirection);
    }
  };
  
  const handleBackspace = () => {
    if (!gameState) return;
    
    const { currentPosition, grid } = gameState;
    const newGrid = JSON.parse(JSON.stringify(grid));
    
    if (newGrid[currentPosition.row][currentPosition.col].response) {
      newGrid[currentPosition.row][currentPosition.col].response = '';
      newGrid[currentPosition.row][currentPosition.col].state = CellState.EMPTY;
    } else {
      // Move back and delete
      moveToPreviousCell();
      return;
    }
    
    setGameState({
      ...gameState,
      grid: newGrid
    });
  };
  
  const movePosition = (rowDelta: number, colDelta: number) => {
    if (!gameState || !puzzle) return;
    
    let newRow = gameState.currentPosition.row + rowDelta;
    let newCol = gameState.currentPosition.col + colDelta;
    
    // Wrap around
    if (newRow < 0) newRow = puzzle.height - 1;
    if (newRow >= puzzle.height) newRow = 0;
    if (newCol < 0) newCol = puzzle.width - 1;
    if (newCol >= puzzle.width) newCol = 0;
    
    // Skip black squares
    while (gameState.grid[newRow][newCol].isBlock) {
      newRow += rowDelta;
      newCol += colDelta;
      
      if (newRow < 0) newRow = puzzle.height - 1;
      if (newRow >= puzzle.height) newRow = 0;
      if (newCol < 0) newCol = puzzle.width - 1;
      if (newCol >= puzzle.width) newCol = 0;
    }
    
    const newState = {
      ...gameState,
      currentPosition: { row: newRow, col: newCol }
    };
    
    setGameState(newState);
    updateCurrentClue(puzzle, newState.currentPosition, newState.currentDirection);
  };
  
  const moveInDirection = (direction: Direction) => {
    if (direction === Direction.ACROSS) {
      movePosition(0, 1);
    } else {
      movePosition(1, 0);
    }
  };
  
  const moveToNextEmptyCell = (state: GameState) => {
    if (!puzzle) return;
    
    const { currentPosition, currentDirection, grid } = state;
    let row = currentPosition.row;
    let col = currentPosition.col;
    
    // Move in current direction
    if (currentDirection === Direction.ACROSS) {
      col++;
    } else {
      row++;
    }
    
    // Find next empty cell in current word
    while (row < puzzle.height && col < puzzle.width) {
      if (!grid[row][col].isBlock && !grid[row][col].response) {
        setGameState({
          ...state,
          currentPosition: { row, col }
        });
        updateCurrentClue(puzzle, { row, col }, currentDirection);
        return;
      }
      
      if (currentDirection === Direction.ACROSS) {
        col++;
      } else {
        row++;
      }
    }
    
    // If no empty cell found, just move normally
    moveInDirection(currentDirection);
  };
  
  const moveToPreviousCell = () => {
    if (!gameState) return;
    
    const { currentDirection } = gameState;
    if (currentDirection === Direction.ACROSS) {
      movePosition(0, -1);
    } else {
      movePosition(-1, 0);
    }
  };
  
  const toggleDirection = () => {
    if (!gameState || !puzzle) return;
    
    const newDirection = 
      gameState.currentDirection === Direction.ACROSS ? Direction.DOWN : Direction.ACROSS;
    
    const newState = {
      ...gameState,
      currentDirection: newDirection
    };
    
    setGameState(newState);
    updateCurrentClue(puzzle, newState.currentPosition, newDirection);
  };
  
  const handleCheck = () => {
    if (!gameState || !puzzle) return;
    
    const newGrid = JSON.parse(JSON.stringify(gameState.grid));
    let hasErrors = false;
    
    for (let row = 0; row < newGrid.length; row++) {
      for (let col = 0; col < newGrid[row].length; col++) {
        const box = newGrid[row][col];
        if (!box.isBlock && box.response) {
          if (box.response === box.solution) {
            box.state = CellState.CORRECT;
          } else {
            box.state = CellState.INCORRECT;
            hasErrors = true;
          }
        }
      }
    }
    
    const newState = {
      ...gameState,
      grid: newGrid,
      isComplete: !hasErrors && isGridComplete(newGrid)
    };
    
    setGameState(newState);
    saveGameState(newState);
    
    if (newState.isComplete) {
      setTimeout(() => {
        alert('🎉 Congratulations! Puzzle completed!');
      }, 100);
    }
  };
  
  const isGridComplete = (grid: Box[][]): boolean => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (!grid[row][col].isBlock && !grid[row][col].response) {
          return false;
        }
      }
    }
    return true;
  };
  
  const handleReveal = () => {
    if (!gameState || !puzzle) return;
    if (!confirm('Reveal current cell?')) return;
    
    const { currentPosition } = gameState;
    const newGrid = JSON.parse(JSON.stringify(gameState.grid));
    
    const box = newGrid[currentPosition.row][currentPosition.col];
    if (!box.isBlock && box.solution) {
      box.response = box.solution;
      box.state = CellState.REVEALED;
      box.cheated = true;
    }
    
    setGameState({
      ...gameState,
      grid: newGrid
    });
  };
  
  const handleClear = () => {
    if (!gameState) return;
    if (!confirm('Clear current word?')) return;
    
    const newGrid = JSON.parse(JSON.stringify(gameState.grid));
    
    highlightedCells.forEach(pos => {
      newGrid[pos.row][pos.col].response = '';
      newGrid[pos.row][pos.col].state = CellState.EMPTY;
    });
    
    setGameState({
      ...gameState,
      grid: newGrid
    });
  };
  
  const handleReset = () => {
    if (!puzzle) return;
    if (!confirm('Reset entire puzzle? All progress will be lost.')) return;
    
    const newGrid = JSON.parse(JSON.stringify(puzzle.grid));
    
    setGameState({
      ...gameState!,
      grid: newGrid,
      elapsedTime: 0,
      isComplete: false
    });
  };
  
  const handlePause = () => {
    if (!gameState) return;
    
    const newState = {
      ...gameState,
      isPaused: !gameState.isPaused
    };
    
    setGameState(newState);
    saveGameState(newState);
  };
  
  const handleCreateSample = async () => {
    const samplePuzzle = createSamplePuzzle();
    await savePuzzle(samplePuzzle);
    await loadPuzzleList();
    await startPuzzle(samplePuzzle);
  };
  
  const handleSelectPuzzle = async (id: string) => {
    const loadedPuzzle = await loadPuzzle(id);
    if (loadedPuzzle) {
      await startPuzzle(loadedPuzzle);
    }
  };
  
  const handleImportPuzzle = async (file: File) => {
    try {
      const text = await file.text();
      let importedPuzzle: Puzzle;
      
      if (file.name.endsWith('.json')) {
        const json = JSON.parse(text);
        importedPuzzle = parseJSONPuzzle(json);
      } else {
        alert('Only JSON format is currently supported. .puz support coming soon!');
        return;
      }
      
      await savePuzzle(importedPuzzle);
      await loadPuzzleList();
      await startPuzzle(importedPuzzle);
    } catch (error) {
      console.error('Error importing puzzle:', error);
      alert('Failed to import puzzle. Please check the file format.');
    }
  };
  
  const handleClueClick = (clue: Clue) => {
    if (!gameState || !puzzle) return;
    
    const newState = {
      ...gameState,
      currentPosition: { row: clue.startRow, col: clue.startCol },
      currentDirection: clue.direction
    };
    
    setGameState(newState);
    setCurrentClue(clue);
    setHighlightedCells(clue.cells);
  };
  
  const handleBackToBrowser = () => {
    if (gameState) {
      saveGameState(gameState);
    }
    setCurrentView(GameView.BROWSER);
    setPuzzle(null);
    setGameState(null);
    loadPuzzleList();
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#fff',
        borderBottom: '2px solid #e5e7eb',
        padding: '16px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
          onClick={handleBackToBrowser}
          >
            <span style={{ fontSize: '2rem' }}>🧩</span>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: 0
            }}>
              Forkyz Crossword
            </h1>
          </div>
          
          {puzzle && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontWeight: '600', color: '#1f2937' }}>
                  {puzzle.title}
                </div>
                {puzzle.author && (
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    by {puzzle.author}
                  </div>
                )}
              </div>
              
              <button
                onClick={handleBackToBrowser}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#fff',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                ← Back to Puzzles
              </button>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px'
      }}>
        {currentView === GameView.BROWSER && (
          <PuzzleBrowser
            puzzles={puzzleList}
            onSelectPuzzle={handleSelectPuzzle}
            onImportPuzzle={handleImportPuzzle}
            onCreateSample={handleCreateSample}
          />
        )}
        
        {currentView === GameView.PLAY && puzzle && gameState && (
          <div>
            <GameControls
              elapsedTime={gameState.elapsedTime}
              isPaused={gameState.isPaused}
              showTimer={settings.showTimer}
              onCheck={handleCheck}
              onReveal={handleReveal}
              onClear={handleClear}
              onPause={handlePause}
              onReset={handleReset}
              onSettings={() => alert('Settings coming soon!')}
            />
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 400px',
              gap: '24px',
              alignItems: 'start'
            }}>
              <div>
                <CrosswordGrid
                  grid={gameState.grid}
                  currentPosition={gameState.currentPosition}
                  currentDirection={gameState.currentDirection}
                  onCellClick={handleCellClick}
                  highlightedCells={highlightedCells}
                />
                
                {/* Current Clue Display */}
                {currentClue && (
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '4px',
                      fontWeight: '600'
                    }}>
                      {currentClue.number} {currentClue.direction.toUpperCase()}
                    </div>
                    <div style={{
                      fontSize: '1.125rem',
                      color: '#1f2937',
                      lineHeight: '1.6'
                    }}>
                      {currentClue.text}
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{ position: 'sticky', top: '24px' }}>
                <ClueList
                  acrossClues={puzzle.acrossClues}
                  downClues={puzzle.downClues}
                  currentClue={currentClue}
                  onClueClick={handleClueClick}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

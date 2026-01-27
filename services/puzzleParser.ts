import { Puzzle, Box, Clue, Direction, CellState, Position } from '../types';

/**
 * Parse .puz file format (Across Lite binary format)
 * This is a simplified parser for the most common .puz format
 */
export function parsePuzFile(arrayBuffer: ArrayBuffer): Puzzle {
  const data = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  
  // .puz file structure (simplified)
  // Offset 0x2C: width (1 byte)
  // Offset 0x2D: height (1 byte)
  const width = data[0x2C];
  const height = data[0x2D];
  
  // Number of clues (2 bytes at 0x2E)
  const numClues = view.getUint16(0x2E, true);
  
  // Solution starts at 0x34
  const solutionStart = 0x34;
  const solutionEnd = solutionStart + (width * height);
  
  // Player state starts after solution
  const stateStart = solutionEnd;
  const stateEnd = stateStart + (width * height);
  
  // Strings section starts after state
  let stringPos = stateEnd;
  
  // Read null-terminated strings
  const readString = (start: number): { text: string; nextPos: number } => {
    let end = start;
    while (end < data.length && data[end] !== 0) end++;
    const text = new TextDecoder().decode(data.slice(start, end));
    return { text, nextPos: end + 1 };
  };
  
  const titleData = readString(stringPos);
  const title = titleData.text;
  stringPos = titleData.nextPos;
  
  const authorData = readString(stringPos);
  const author = authorData.text;
  stringPos = authorData.nextPos;
  
  const copyrightData = readString(stringPos);
  const copyright = copyrightData.text;
  stringPos = copyrightData.nextPos;
  
  // Create grid
  const grid: Box[][] = [];
  for (let row = 0; row < height; row++) {
    grid[row] = [];
    for (let col = 0; col < width; col++) {
      const idx = row * width + col;
      const solutionChar = String.fromCharCode(data[solutionStart + idx]);
      const stateChar = String.fromCharCode(data[stateStart + idx]);
      
      grid[row][col] = {
        row,
        col,
        solution: solutionChar === '.' ? null : solutionChar,
        response: stateChar === '-' || stateChar === '.' ? '' : stateChar,
        isBlock: solutionChar === '.',
        state: CellState.EMPTY,
        cheated: false
      };
    }
  }
  
  // Number the grid
  let clueNum = 1;
  const clueNumbers: Map<string, number> = new Map();
  
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (grid[row][col].isBlock) continue;
      
      const needsNumber = 
        (col === 0 || grid[row][col - 1].isBlock) || // Start of across
        (row === 0 || grid[row - 1][col].isBlock);   // Start of down
      
      if (needsNumber) {
        grid[row][col].clueNumber = clueNum.toString();
        clueNumbers.set(`${row},${col}`, clueNum);
        clueNum++;
      }
    }
  }
  
  // Parse clues
  const acrossClues: Clue[] = [];
  const downClues: Clue[] = [];
  
  for (let i = 0; i < numClues; i++) {
    const clueData = readString(stringPos);
    const clueText = clueData.text;
    stringPos = clueData.nextPos;
    
    // Determine if across or down based on grid analysis
    // This is simplified - real parser would track this better
    if (i < numClues / 2) {
      // Assume first half are across
      const clue = findClueInGrid(grid, Direction.ACROSS, clueText, acrossClues.length);
      if (clue) acrossClues.push(clue);
    } else {
      const clue = findClueInGrid(grid, Direction.DOWN, clueText, downClues.length);
      if (clue) downClues.push(clue);
    }
  }
  
  return {
    id: `puzzle-${Date.now()}`,
    title,
    author,
    copyright,
    width,
    height,
    grid,
    acrossClues,
    downClues
  };
}

/**
 * Parse JSON puzzle format
 */
export function parseJSONPuzzle(json: any): Puzzle {
  const width = json.size?.cols || json.width || 15;
  const height = json.size?.rows || json.height || 15;
  
  // Create grid
  const grid: Box[][] = [];
  const gridData = json.grid || json.puzzle || [];
  
  for (let row = 0; row < height; row++) {
    grid[row] = [];
    for (let col = 0; col < width; col++) {
      const idx = row * width + col;
      const cell = gridData[idx] || '.';
      
      grid[row][col] = {
        row,
        col,
        solution: cell === '.' ? null : cell,
        response: '',
        isBlock: cell === '.',
        state: CellState.EMPTY,
        cheated: false
      };
    }
  }
  
  // Number the grid
  numberGrid(grid, width, height);
  
  // Parse clues
  const acrossClues: Clue[] = [];
  const downClues: Clue[] = [];
  
  if (json.clues) {
    if (json.clues.across) {
      json.clues.across.forEach((clue: any, idx: number) => {
        const parsed = parseClueEntry(clue, Direction.ACROSS, grid);
        if (parsed) acrossClues.push(parsed);
      });
    }
    
    if (json.clues.down) {
      json.clues.down.forEach((clue: any, idx: number) => {
        const parsed = parseClueEntry(clue, Direction.DOWN, grid);
        if (parsed) downClues.push(parsed);
      });
    }
  }
  
  return {
    id: json.id || `puzzle-${Date.now()}`,
    title: json.title || 'Untitled Puzzle',
    author: json.author || json.creator,
    copyright: json.copyright,
    notes: json.notes || json.notepad,
    width,
    height,
    grid,
    acrossClues,
    downClues,
    pubdate: json.date || json.pubdate
  };
}

function numberGrid(grid: Box[][], width: number, height: number): void {
  let clueNum = 1;
  
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (grid[row][col].isBlock) continue;
      
      const startsAcross = col === 0 || grid[row][col - 1].isBlock;
      const startsDown = row === 0 || grid[row - 1][col].isBlock;
      
      if (startsAcross || startsDown) {
        grid[row][col].clueNumber = clueNum.toString();
        
        // Store clue indices
        if (startsAcross) {
          let c = col;
          let acrossIdx = 0;
          while (c < width && !grid[row][c].isBlock) {
            grid[row][c].acrossClueIndex = clueNum;
            c++;
          }
        }
        
        if (startsDown) {
          let r = row;
          while (r < height && !grid[r][col].isBlock) {
            grid[r][col].downClueIndex = clueNum;
            r++;
          }
        }
        
        clueNum++;
      }
    }
  }
}

function parseClueEntry(clue: any, direction: Direction, grid: Box[][]): Clue | null {
  let number: string;
  let text: string;
  
  if (typeof clue === 'string') {
    // Format: "1. Clue text"
    const match = clue.match(/^(\d+)\.\s*(.+)$/);
    if (!match) return null;
    number = match[1];
    text = match[2];
  } else {
    number = clue.number || clue.clue;
    text = clue.text || clue.clue;
  }
  
  // Find starting position in grid
  const pos = findClueStart(grid, number);
  if (!pos) return null;
  
  // Get all cells for this clue
  const cells: Position[] = [];
  let answer = '';
  
  if (direction === Direction.ACROSS) {
    let col = pos.col;
    while (col < grid[0].length && !grid[pos.row][col].isBlock) {
      cells.push({ row: pos.row, col });
      if (grid[pos.row][col].solution) {
        answer += grid[pos.row][col].solution;
      }
      col++;
    }
  } else {
    let row = pos.row;
    while (row < grid.length && !grid[row][pos.col].isBlock) {
      cells.push({ row, col: pos.col });
      if (grid[row][pos.col].solution) {
        answer += grid[row][pos.col].solution;
      }
      row++;
    }
  }
  
  return {
    number,
    text,
    direction,
    startRow: pos.row,
    startCol: pos.col,
    length: cells.length,
    answer: answer || undefined,
    cells
  };
}

function findClueStart(grid: Box[][], number: string): Position | null {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col].clueNumber === number) {
        return { row, col };
      }
    }
  }
  return null;
}

function findClueInGrid(grid: Box[][], direction: Direction, text: string, index: number): Clue | null {
  // Simplified - just create placeholder clues
  return {
    number: (index + 1).toString(),
    text,
    direction,
    startRow: 0,
    startCol: 0,
    length: 5,
    cells: []
  };
}

/**
 * Create a sample puzzle for testing
 */
export function createSamplePuzzle(): Puzzle {
  const width = 5;
  const height = 5;
  
  // Simple 5x5 grid
  const gridPattern = [
    ['C', 'A', 'T', 'S', '.'],
    ['A', '.', 'O', '.', 'S'],
    ['R', 'A', 'T', 'S', 'O'],
    ['E', '.', 'S', '.', 'Y'],
    ['.', 'D', 'O', 'G', 'S']
  ];
  
  const grid: Box[][] = [];
  for (let row = 0; row < height; row++) {
    grid[row] = [];
    for (let col = 0; col < width; col++) {
      const cell = gridPattern[row][col];
      grid[row][col] = {
        row,
        col,
        solution: cell === '.' ? null : cell,
        response: '',
        isBlock: cell === '.',
        state: CellState.EMPTY,
        cheated: false
      };
    }
  }
  
  numberGrid(grid, width, height);
  
  const acrossClues: Clue[] = [
    {
      number: '1',
      text: 'Feline pets',
      direction: Direction.ACROSS,
      startRow: 0,
      startCol: 0,
      length: 4,
      answer: 'CATS',
      cells: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 0, col: 3 }
      ]
    },
    {
      number: '5',
      text: 'Rodents',
      direction: Direction.ACROSS,
      startRow: 2,
      startCol: 0,
      length: 4,
      answer: 'RATS',
      cells: [
        { row: 2, col: 0 },
        { row: 2, col: 1 },
        { row: 2, col: 2 },
        { row: 2, col: 3 }
      ]
    },
    {
      number: '7',
      text: 'Canine pets',
      direction: Direction.ACROSS,
      startRow: 4,
      startCol: 1,
      length: 4,
      answer: 'DOGS',
      cells: [
        { row: 4, col: 1 },
        { row: 4, col: 2 },
        { row: 4, col: 3 },
        { row: 4, col: 4 }
      ]
    }
  ];
  
  const downClues: Clue[] = [
    {
      number: '1',
      text: 'Concern',
      direction: Direction.DOWN,
      startRow: 0,
      startCol: 0,
      length: 3,
      answer: 'CAR',
      cells: [
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 2, col: 0 }
      ]
    },
    {
      number: '2',
      text: 'Consumed',
      direction: Direction.DOWN,
      startRow: 0,
      startCol: 1,
      length: 2,
      answer: 'AT',
      cells: [
        { row: 0, col: 1 },
        { row: 2, col: 1 }
      ]
    },
    {
      number: '3',
      text: 'Examination',
      direction: Direction.DOWN,
      startRow: 0,
      startCol: 2,
      length: 4,
      answer: 'TEST',
      cells: [
        { row: 0, col: 2 },
        { row: 1, col: 2 },
        { row: 2, col: 2 },
        { row: 4, col: 2 }
      ]
    },
    {
      number: '4',
      text: 'Distress signal',
      direction: Direction.DOWN,
      startRow: 0,
      startCol: 4,
      length: 3,
      answer: 'SOS',
      cells: [
        { row: 1, col: 4 },
        { row: 2, col: 4 },
        { row: 4, col: 4 }
      ]
    }
  ];
  
  return {
    id: 'sample-puzzle-1',
    title: 'Sample Crossword',
    author: 'Forkyz Team',
    width,
    height,
    grid,
    acrossClues,
    downClues,
    pubdate: new Date().toISOString().split('T')[0]
  };
}

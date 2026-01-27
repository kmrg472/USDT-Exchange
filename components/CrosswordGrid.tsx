import React from 'react';
import { Box, Position, Direction, CellState } from '../types';

interface CrosswordGridProps {
  grid: Box[][];
  currentPosition: Position;
  currentDirection: Direction;
  onCellClick: (row: number, col: number) => void;
  highlightedCells: Position[];
}

const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  grid,
  currentPosition,
  currentDirection,
  onCellClick,
  highlightedCells
}) => {
  const isHighlighted = (row: number, col: number): boolean => {
    return highlightedCells.some(pos => pos.row === row && pos.col === col);
  };
  
  const isCurrent = (row: number, col: number): boolean => {
    return currentPosition.row === row && currentPosition.col === col;
  };
  
  const getCellClassName = (box: Box): string => {
    const classes = ['cell'];
    
    if (box.isBlock) {
      classes.push('cell-block');
    } else {
      if (isCurrent(box.row, box.col)) {
        classes.push('cell-current');
      } else if (isHighlighted(box.row, box.col)) {
        classes.push('cell-highlighted');
      }
      
      if (box.state === CellState.CORRECT) {
        classes.push('cell-correct');
      } else if (box.state === CellState.INCORRECT) {
        classes.push('cell-incorrect');
      } else if (box.state === CellState.REVEALED) {
        classes.push('cell-revealed');
      }
      
      if (box.cheated) {
        classes.push('cell-cheated');
      }
    }
    
    return classes.join(' ');
  };
  
  const cellSize = Math.min(40, Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.8 / Math.max(grid.length, grid[0]?.length || 1)));
  
  return (
    <div className="crossword-grid-container">
      <div 
        className="crossword-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${grid[0]?.length || 0}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${grid.length}, ${cellSize}px)`,
          gap: '1px',
          backgroundColor: '#000',
          border: '2px solid #000',
          margin: '0 auto'
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((box, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={getCellClassName(box)}
              onClick={() => !box.isBlock && onCellClick(rowIdx, colIdx)}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                position: 'relative',
                cursor: box.isBlock ? 'default' : 'pointer',
                backgroundColor: box.isBlock ? '#000' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${cellSize * 0.6}px`,
                fontWeight: 'bold',
                userSelect: 'none'
              }}
            >
              {!box.isBlock && (
                <>
                  {box.clueNumber && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '1px',
                        left: '2px',
                        fontSize: `${cellSize * 0.25}px`,
                        fontWeight: 'normal',
                        color: '#666'
                      }}
                    >
                      {box.clueNumber}
                    </span>
                  )}
                  <span style={{ color: '#000' }}>
                    {box.response || ''}
                  </span>
                  {box.hasCircle && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: `${cellSize * 0.8}px`,
                        height: `${cellSize * 0.8}px`,
                        border: '2px solid #999',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                      }}
                    />
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
      
      <style>{`
        .cell {
          transition: background-color 0.15s ease;
        }
        
        .cell-current {
          background-color: #ffd700 !important;
        }
        
        .cell-highlighted {
          background-color: #ffffcc !important;
        }
        
        .cell-correct {
          background-color: #d4edda !important;
        }
        
        .cell-incorrect {
          background-color: #f8d7da !important;
        }
        
        .cell-revealed {
          background-color: #e2e3e5 !important;
        }
        
        .cell-cheated {
          color: #dc3545 !important;
        }
        
        .cell:not(.cell-block):hover {
          background-color: #e8f4f8 !important;
        }
        
        .crossword-grid-container {
          padding: 20px;
          overflow: auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default CrosswordGrid;

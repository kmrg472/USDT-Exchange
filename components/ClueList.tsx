import React, { useEffect, useRef } from 'react';
import { Clue, Direction } from '../types';

interface ClueListProps {
  acrossClues: Clue[];
  downClues: Clue[];
  currentClue: Clue | null;
  onClueClick: (clue: Clue) => void;
}

const ClueList: React.FC<ClueListProps> = ({
  acrossClues,
  downClues,
  currentClue,
  onClueClick
}) => {
  const currentClueRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (currentClueRef.current) {
      currentClueRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [currentClue]);
  
  const renderClue = (clue: Clue) => {
    const isCurrent = currentClue?.number === clue.number && 
                      currentClue?.direction === clue.direction;
    
    return (
      <div
        key={`${clue.direction}-${clue.number}`}
        ref={isCurrent ? currentClueRef : null}
        className={`clue-item ${isCurrent ? 'clue-current' : ''}`}
        onClick={() => onClueClick(clue)}
        style={{
          padding: '12px 16px',
          cursor: 'pointer',
          borderLeft: isCurrent ? '4px solid #2563eb' : '4px solid transparent',
          backgroundColor: isCurrent ? '#eff6ff' : 'transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ 
            fontWeight: 'bold', 
            color: '#1f2937',
            minWidth: '30px'
          }}>
            {clue.number}.
          </span>
          <span style={{ 
            color: '#374151',
            flex: 1,
            lineHeight: '1.5'
          }}>
            {clue.text}
          </span>
          {clue.length && (
            <span style={{ 
              color: '#9ca3af',
              fontSize: '0.875rem',
              fontStyle: 'italic'
            }}>
              ({clue.length})
            </span>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="clue-list-container" style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <div style={{
          flex: 1,
          padding: '12px',
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#1f2937',
          backgroundColor: '#f9fafb',
          borderRight: '1px solid #e5e7eb'
        }}>
          ACROSS
        </div>
        <div style={{
          flex: 1,
          padding: '12px',
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#1f2937',
          backgroundColor: '#f9fafb'
        }}>
          DOWN
        </div>
      </div>
      
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          borderRight: '1px solid #e5e7eb'
        }}>
          {acrossClues.map(clue => renderClue(clue))}
        </div>
        
        <div style={{
          flex: 1,
          overflowY: 'auto'
        }}>
          {downClues.map(clue => renderClue(clue))}
        </div>
      </div>
      
      <style>{`
        .clue-item:hover {
          background-color: #f3f4f6 !important;
        }
        
        .clue-current:hover {
          background-color: #dbeafe !important;
        }
        
        .clue-list-container::-webkit-scrollbar {
          width: 8px;
        }
        
        .clue-list-container::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .clue-list-container::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        
        .clue-list-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default ClueList;

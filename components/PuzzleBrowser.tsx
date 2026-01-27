import React, { useState } from 'react';
import { PuzzleMetadata } from '../types';

interface PuzzleBrowserProps {
  puzzles: PuzzleMetadata[];
  onSelectPuzzle: (id: string) => void;
  onImportPuzzle: (file: File) => void;
  onCreateSample: () => void;
}

const PuzzleBrowser: React.FC<PuzzleBrowserProps> = ({
  puzzles,
  onSelectPuzzle,
  onImportPuzzle,
  onCreateSample
}) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress'>('all');
  
  const filteredPuzzles = puzzles.filter(puzzle => {
    if (filter === 'completed') return puzzle.completed;
    if (filter === 'in-progress') return !puzzle.completed && puzzle.progress > 0;
    return true;
  });
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportPuzzle(file);
    }
  };
  
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          🧩 Forkyz Crossword
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1.125rem'
        }}>
          Play crossword puzzles anywhere, anytime
        </p>
      </div>
      
      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '24px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={onCreateSample}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1d4ed8';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          📝 Try Sample Puzzle
        </button>
        
        <label
          style={{
            padding: '12px 24px',
            backgroundColor: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#047857';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          📁 Import Puzzle
          <input
            type="file"
            accept=".puz,.json,.jpz,.ipuz"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>
      
      {/* Filter Tabs */}
      {puzzles.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          justifyContent: 'center',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '8px'
        }}>
          {(['all', 'in-progress', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                backgroundColor: filter === f ? '#eff6ff' : 'transparent',
                color: filter === f ? '#2563eb' : '#6b7280',
                border: 'none',
                borderBottom: filter === f ? '2px solid #2563eb' : '2px solid transparent',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease'
              }}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
      )}
      
      {/* Puzzle List */}
      {filteredPuzzles.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: '2px dashed #d1d5db'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎯</div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            No puzzles yet
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Get started by trying a sample puzzle or importing your own
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {filteredPuzzles.map(puzzle => (
            <div
              key={puzzle.id}
              onClick={() => onSelectPuzzle(puzzle.id)}
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '12px'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: 0,
                  flex: 1
                }}>
                  {puzzle.title}
                </h3>
                {puzzle.completed && (
                  <span style={{
                    fontSize: '1.5rem'
                  }}>✅</span>
                )}
              </div>
              
              {puzzle.author && (
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  marginBottom: '8px'
                }}>
                  by {puzzle.author}
                </p>
              )}
              
              <div style={{
                display: 'flex',
                gap: '12px',
                fontSize: '0.75rem',
                color: '#9ca3af',
                marginBottom: '12px'
              }}>
                <span>📐 {puzzle.size}</span>
                {puzzle.pubdate && <span>📅 {puzzle.pubdate}</span>}
              </div>
              
              {/* Progress Bar */}
              {puzzle.progress > 0 && !puzzle.completed && (
                <div style={{
                  marginTop: '12px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    <span>Progress</span>
                    <span>{puzzle.progress}%</span>
                  </div>
                  <div style={{
                    height: '6px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${puzzle.progress}%`,
                      backgroundColor: '#2563eb',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PuzzleBrowser;

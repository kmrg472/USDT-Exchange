import React, { useState, useEffect } from 'react';

interface GameControlsProps {
  elapsedTime: number;
  isPaused: boolean;
  showTimer: boolean;
  onCheck: () => void;
  onReveal: () => void;
  onClear: () => void;
  onPause: () => void;
  onReset: () => void;
  onSettings: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  elapsedTime,
  isPaused,
  showTimer,
  onCheck,
  onReveal,
  onClear,
  onPause,
  onReset,
  onSettings
}) => {
  const [displayTime, setDisplayTime] = useState(elapsedTime);
  
  useEffect(() => {
    setDisplayTime(elapsedTime);
  }, [elapsedTime]);
  
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const Button: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    icon?: string;
  }> = ({ onClick, children, variant = 'secondary', icon }) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none'
          };
        case 'danger':
          return {
            backgroundColor: '#dc2626',
            color: '#fff',
            border: 'none'
          };
        default:
          return {
            backgroundColor: '#fff',
            color: '#374151',
            border: '1px solid #d1d5db'
          };
      }
    };
    
    return (
      <button
        onClick={onClick}
        style={{
          ...getVariantStyles(),
          padding: '8px 16px',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
        }}
      >
        {icon && <span>{icon}</span>}
        {children}
      </button>
    );
  };
  
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '16px'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Timer */}
        {showTimer && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: '#f9fafb',
            borderRadius: '6px',
            border: '1px solid #e5e7eb'
          }}>
            <span style={{ fontSize: '1.25rem' }}>⏱️</span>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: isPaused ? '#9ca3af' : '#1f2937'
            }}>
              {formatTime(displayTime)}
            </span>
            {isPaused && (
              <span style={{
                fontSize: '0.75rem',
                color: '#ef4444',
                fontWeight: '600'
              }}>
                PAUSED
              </span>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <Button onClick={onPause} icon={isPaused ? '▶️' : '⏸️'}>
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          
          <Button onClick={onCheck} variant="primary" icon="✓">
            Check
          </Button>
          
          <Button onClick={onReveal} icon="💡">
            Reveal
          </Button>
          
          <Button onClick={onClear} icon="🗑️">
            Clear
          </Button>
          
          <Button onClick={onReset} variant="danger" icon="↻">
            Reset
          </Button>
          
          <Button onClick={onSettings} icon="⚙️">
            Settings
          </Button>
        </div>
      </div>
      
      {/* Keyboard Shortcuts Help */}
      <div style={{
        marginTop: '12px',
        padding: '8px',
        backgroundColor: '#f9fafb',
        borderRadius: '4px',
        fontSize: '0.75rem',
        color: '#6b7280'
      }}>
        <strong>Shortcuts:</strong> Arrow keys to navigate • Tab to switch direction • 
        Backspace to delete • Space to toggle direction
      </div>
    </div>
  );
};

export default GameControls;

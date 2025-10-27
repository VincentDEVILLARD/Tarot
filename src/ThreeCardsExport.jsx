import React from 'react';
import Silk from './Silk';

// Props: cards (array of {img}), silkColor (string)
export default function ThreeCardsExport({ cards, silkColor }) {
  // Disposition éventail : angles -20°, 0°, +20°
  const angles = [-20, 0, 20];
  const labels = ['Past', 'Present', 'Future'];
  const size = 1080; // carré 1080x1080px
  const cardW = 320, cardH = 480; // ratio carte
  const centerX = size / 2;
  const centerY = size / 2 + 40;
  const radius = 260;
  return (
    <div style={{
      position: 'relative',
      width: size,
      height: size,
      borderRadius: 48,
      overflow: 'hidden',
      background: 'transparent',
      boxShadow: '0 8px 48px #0003',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Fond Silk */}
      <div style={{position:'absolute',inset:0,zIndex:0}}>
        <Silk color={silkColor} speed={7} scale={1} noiseIntensity={1} rotation={0} />
      </div>
      {/* Cartes en éventail */}
      {cards.map((card, idx) => {
        const angle = angles[idx];
        const rad = (angle-90) * Math.PI/180;
        // Placement en arc de cercle
        const x = centerX + radius * Math.cos(rad) - cardW/2;
        const y = centerY + radius * Math.sin(rad) - cardH/2;
        return (
          <div key={idx} style={{
            position: 'absolute',
            left: x,
            top: y,
            width: cardW,
            height: cardH,
            transform: `rotate(${angle}deg)`,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {/* Label au-dessus, aligné */}
            <div style={{
              position: 'absolute',
              top: -54,
              left: '50%',
              transform: `translateX(-50%) rotate(${-angle}deg)`,
              fontFamily: 'LEMON MILK, Arial, sans-serif',
              fontWeight: 900,
              fontSize: 36,
              letterSpacing: '0.08em',
              color: '#fff',
              background: 'rgba(0,0,0,0.10)',
              borderRadius: 18,
              padding: '8px 28px',
              boxShadow: '0 2px 12px #0002',
              textShadow: '0 2px 8px #0008',
              userSelect: 'none',
              textAlign: 'center',
              minWidth: 120,
            }}>{labels[idx]}</div>
            <img src={card.img} alt={labels[idx]} style={{
              width: cardW,
              height: cardH,
              borderRadius: 24,
              boxShadow: '0 8px 32px #0005',
              objectFit: 'cover',
              background: '#fff',
              border: '2.5px solid #fff',
              zIndex: 2,
            }} />
          </div>
        );
      })}
    </div>
  );
} 
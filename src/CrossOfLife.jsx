import { useState, useEffect } from 'react';
import TiltedCard from './TiltedCard';
import tarotMajors from './tarotMajorsData';
import { useNavigate } from 'react-router-dom';
import Silk from './Silk';
import { motion, AnimatePresence } from 'framer-motion';

const celticLabels = [
  "1. Current Situation",
  "2. Obstacle",
  "3. Subconscious",
  "4. Past Influences",
  "5. Conscious Goals",
  "6. Near Future",
  "7. Self-Perception",
  "8. Ext. Influences",
  "9. Hopes and Fears",
  "10. Outcome"
];
const celticDesc = [
  "The current situation or the heart of the matter.",
  "The main challenge or obstacle you face.",
  "Your subconscious influences, hidden feelings, or underlying factors.",
  "Past events or influences that are affecting the present.",
  "Your conscious goals, aspirations, or what you are aiming for.",
  "What is about to happen or the near future.",
  "How you see yourself or your role in the situation.",
  "External factors, people, or influences impacting the situation.",
  "Your hopes and fears regarding the outcome.",
  "The most likely result or potential outcome."
];
// Nouvelle version : plus grand, positions ajustées, hover sur 1/2
const CARD_W = 'min(16vw, 170px)';
const CARD_H = 'min(25vw, 260px)';
// 1. Fix card positions for balanced spacing between 5, 1, 3 (test values for visual balance)
const celticPositions = [
  { left: '30%', top: '50%', z: 2 }, // 1 (center)
  { left: '30%', top: '50%', z: 3, rotate: 90 }, // 2 (horizontal on 1)
  { left: '30%', top: '85%', z: 2 }, // 3 (lower)
  { left: '12%', top: '50%', z: 2 }, // 4
  { left: '30%', top: '15%', z: 2 }, // 5 (higher)
  { left: '48%', top: '50%', z: 2 }, // 6
  { left: '68%', top: '78%', z: 2 }, // 7
  { left: '84%', top: '78%', z: 2 }, // 8
  { left: '68%', top: '22%', z: 2 }, // 9
  { left: '84%', top: '22%', z: 2 }, // 10
];

export default function CelticCross() {
  const [cards, setCards] = useState([]);
  const [visibleCards, setVisibleCards] = useState(0);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [selectedCardIdx, setSelectedCardIdx] = useState(null);
  const [hovered, setHovered] = useState(null); // 0 ou 1 si survol carte 1 ou 2
  const [hoveredOverlay, setHoveredOverlay] = useState(null);
  const [silkColor, setSilkColor] = useState(() => {
    // Try to get from localStorage, fallback to default
    return localStorage.getItem('silkColor') || '#0a9bca';
  });
  const navigate = useNavigate();

  // Sync Silk color with localStorage and listen for changes
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'silkColor') {
        setSilkColor(e.newValue || '#0a9bca');
      }
    };
    window.addEventListener('storage', handleStorage);
    // Also update if color changes in this tab
    const interval = setInterval(() => {
      const color = localStorage.getItem('silkColor') || '#0a9bca';
      setSilkColor((prev) => (prev !== color ? color : prev));
    }, 500);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  function handleDraw() {
    const shuffled = tarotMajors.slice().sort(() => 0.5 - Math.random());
    setCards(shuffled.slice(0, 10));
    setVisibleCards(0);
    setTimeout(() => {
      setHasDrawn(true);
      for (let i = 1; i <= 10; i++) {
        setTimeout(() => setVisibleCards(i), 1000 * i); // 1s per card
      }
    }, 500);
  }
  function handleReload() {
    setHasDrawn(false);
    setVisibleCards(0);
    setTimeout(() => handleDraw(), 400);
  }

  // Décalage sur hover pour cartes 1 et 2
  const getCardOffset = (i) => {
    if (hovered === null) return { x: 0, y: 0 };
    if (i === 0 && hovered === 0) return { x: '-7vw', y: 0 };
    if (i === 1 && hovered === 0) return { x: '7vw', y: 0 };
    if (i === 0 && hovered === 1) return { x: '-5vw', y: 0 };
    if (i === 1 && hovered === 1) return { x: '9vw', y: 0 };
    return { x: 0, y: 0 };
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', fontFamily: "'LEMON MILK', Arial, sans-serif" }}>
      <div style={{position:'fixed',zIndex:0,top:0,left:0,width:'100vw',height:'100vh',pointerEvents:'none'}}>
        <Silk speed={7} scale={1} color={silkColor} noiseIntensity={1} rotation={0} />
      </div>
      {/* Bouton retour */}
      <button
        onClick={() => navigate("/", { replace: true })}
        aria-label="Back to home"
        style={{
          position: 'fixed',
          left: '3vw',
          top: '3vh',
          zIndex: 30,
          background: 'rgba(30,40,60,0.01)',
          border: '1.5px solid rgba(255,255,255,0.06)',
          borderRadius: '32px',
          minWidth: '54px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'none',
          cursor: 'pointer',
          transition: 'background 0.22s, box-shadow 0.22s, border 0.22s, transform 0.18s, opacity 0.22s',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          outline: 'none',
          padding: '0 16px 0 10px',
          userSelect: 'none',
          opacity: 0.32,
          gap: '7px',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'linear-gradient(90deg, #40ffaa33 0%, #4079ff33 100%)';
          e.currentTarget.style.boxShadow = '0 4px 24px #40ffaa88, 0 2px 8px #4079ff88, 0 2px 8px #0002';
          e.currentTarget.style.transform = 'translateY(-2px) scale(1.07)';
          e.currentTarget.style.border = '1.5px solid #40ffaa88';
          e.currentTarget.style.textShadow = '0 2px 12px #40ffaa88, 0 1px 0 #fff2';
          e.currentTarget.style.opacity = 1;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(30,40,60,0.01)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.border = '1.5px solid rgba(255,255,255,0.06)';
          e.currentTarget.style.textShadow = 'none';
          e.currentTarget.style.opacity = 0.32;
        }}
      >
        <img
          src="/Tarot/back.png"
          alt="Back"
          style={{ height: 32, width: 'auto', opacity: 0.82, filter: 'drop-shadow(0 1px 2px #0002)' }}
        />
        <span style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif',
          fontWeight: 400,
          fontSize: '1.08rem',
          color: 'rgba(255,255,255,0.38)',
          letterSpacing: '0.01em',
          marginLeft: '2px',
          opacity: 0.82,
          userSelect: 'none',
          transition: 'color 0.22s, text-shadow 0.22s',
          fontStyle: 'normal',
          textShadow: 'none',
        }}>
          back
        </span>
      </button>
      {/* Titre et explication */}
      {/* 2. Remove the description under the title, and 3. Make the title uppercase, LEMON MILK bold */}
      <div style={{ marginTop: '5vh', color: '#fff', fontWeight: 900, fontSize: '2.5rem', letterSpacing: '0.10em', textShadow: '0 2px 12px #0a9bca88', textAlign: 'center', zIndex: 10, position: 'relative', fontFamily: "'LEMON MILK', Arial, sans-serif", textTransform: 'uppercase' }}>
        CELTIC CROSS
      </div>
      {!hasDrawn && (
        <button
          onClick={handleDraw}
          style={{
            background: 'linear-gradient(90deg, #40ffaa33 0%, #4079ff33 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.15rem',
            border: 'none',
            borderRadius: '16px',
            padding: '18px 38px',
            margin: '2vh 0',
            boxShadow: '0 2px 8px #0002',
            cursor: 'pointer',
            transition: 'background 0.22s, box-shadow 0.22s, transform 0.18s',
            outline: 'none',
            userSelect: 'none',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            zIndex: 10,
            position: 'relative',
          }}
        >
          Start the spread
        </button>
      )}
      {/* Layout Celtic Cross */}
      {hasDrawn && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '54%',
          transform: 'translate(-50%, -50%)',
          width: 'min(99vw, 1200px)',
          height: 'min(96vh, 800px)',
          maxWidth: 1200,
          maxHeight: 800,
          minWidth: 340,
          minHeight: 340,
          zIndex: 10,
          background: 'none',
        }}>
          {[...Array(10)].map((_, i) => {
            const pos = celticPositions[i];
            const offset = getCardOffset(i);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: pos.left,
                  top: pos.top,
                  transform: `translate(-50%, -50%) translate(${offset.x},${offset.y})${pos.rotate ? ` rotate(${pos.rotate}deg)` : ''}`,
                  zIndex: i === 1 ? 30 : i === 0 ? 20 : (pos.z || 2), // card 2 always above card 1, card 1 above others
                  opacity: visibleCards > i ? 1 : 0,
                  transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: CARD_W,
                  pointerEvents: 'auto',
                }}
                onMouseEnter={() => {
                  if (i === 0 || i === 1) setHovered(i);
                  setHoveredOverlay(i);
                }}
                onMouseLeave={() => {
                  if (i === 0 || i === 1) setHovered(null);
                  setHoveredOverlay(null);
                }}
              >
                <TiltedCard
                  imageSrc={cards[i]?.img}
                  altText={cards[i]?.name}
                  captionText={cards[i]?.name}
                  containerHeight={CARD_H}
                  containerWidth={CARD_W}
                  imageHeight="100%"
                  imageWidth="100%"
                  scaleOnHover={1.2}
                  rotateAmplitude={10}
                  showMobileWarning={false}
                  showTooltip={false}
                  imageStyle={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onClick={() => setSelectedCardIdx(i)}
                  displayOverlayContent={true}
                  // 3. Overlay: solid white, rounded, black bold text, always readable, drop shadow, opacity 0.92 (1 on hover)
                  overlayContent={
                    <div
                      style={{
                        position: 'absolute',
                        left: 4,
                        right: 4,
                        top: 4,
                        minWidth: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#fff',
                        color: '#181818',
                        fontFamily: "'LEMON MILK', Arial, sans-serif",
                        fontWeight: 900,
                        fontSize: celticLabels[i].length > 22 ? '0.74rem' : '0.89rem',
                        letterSpacing: '0.04em',
                        textAlign: 'center',
                        textShadow: '0 1px 4px #fff8',
                        userSelect: 'none',
                        borderRadius: '8px',
                        padding: '0 8px',
                        opacity: hoveredOverlay === i ? 1 : 0.92,
                        pointerEvents: 'none',
                        zIndex: 10,
                        whiteSpace: celticLabels[i].length > 22 ? 'normal' : 'nowrap',
                        maxWidth: 'calc(100% - 8px)',
                        minHeight: '22px',
                        margin: '0 auto',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px #0002',
                        transition: 'opacity 0.18s, font-size 0.18s',
                        lineHeight: 1.18,
                        wordBreak: 'break-word',
                      }}
                    >
                      <span style={{width: '100%', overflow: 'hidden', display: 'block'}}>{celticLabels[i]}</span>
                    </div>
                  }
                />
              </div>
            );
          })}
        </div>
      )}
      {/* FICHE CARTE (focus) */}
      <AnimatePresence>
        {selectedCardIdx !== null && cards[selectedCardIdx] && (
          <motion.div
            key="card-focus"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200,
              background: 'rgba(10,16,24,0.25)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              pointerEvents: 'auto',
            }}
          >
            {/* Carte focus à gauche */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'visible',
              marginRight: '4vw',
              marginLeft: '2vw',
              width: 'min(32vw, 400px)',
              aspectRatio: '80/112',
              height: 'min(52vh, 600px)',
            }}>
              <TiltedCard
                imageSrc={cards[selectedCardIdx]?.img}
                altText={cards[selectedCardIdx]?.name}
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                imageStyle={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                showMobileWarning={false}
                showTooltip={false}
                displayOverlayContent={false}
                overflow="visible"
              />
            </div>
            {/* Fenêtre d'info à droite */}
            <div style={{
              flex: 1,
              maxWidth: 'min(48vw, 600px)',
              minWidth: '260px',
              background: 'rgba(30,40,60,0.25)',
              borderRadius: '22px',
              boxShadow: '0 8px 48px #0003, 0 2px 16px rgba(255,255,255,0.08)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '38px 36px 32px 32px',
              marginRight: '2vw',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              position: 'relative',
              color: '#fff',
              fontFamily: "'LEMON MILK', Arial, sans-serif",
            }}>
              <button
                onClick={() => setSelectedCardIdx(null)}
                aria-label="Close"
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 18,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: 0.7,
                  zIndex: 10,
                }}
              >
                <img
                  src="/Tarot/exit.png"
                  alt="Exit"
                  style={{ height: 20, width: 'auto', opacity: 0.82, filter: 'drop-shadow(0 1px 2px #0002)' }}
                />
              </button>
              <div style={{
                fontSize: '2.1rem',
                fontWeight: 900,
                marginBottom: '18px',
                letterSpacing: '0.04em',
                color: '#fff',
                textShadow: '0 2px 8px #0006',
              }}>{cards[selectedCardIdx]?.name}</div>
              <div style={{
                fontSize: '1.18rem',
                lineHeight: 1.6,
                color: '#e6f6ff',
                opacity: 0.92,
                fontWeight: 400,
                marginBottom: '8px',
                textShadow: '0 1px 4px #0003',
              }}>
                {cards[selectedCardIdx]?.desc}
              </div>
              <div style={{
                marginTop: 18,
                fontSize: '1.08rem',
                color: '#40ffaa',
                fontWeight: 700,
                textShadow: '0 2px 8px #40ffaa88',
              }}>
                {celticLabels[selectedCardIdx]}<br/>
                <span style={{ color: '#fff', fontWeight: 400, fontSize: '1rem', textShadow: 'none' }}>{celticDesc[selectedCardIdx]}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Bouton reload Celtic Cross */}
      {hasDrawn && (
        <button
          onClick={handleReload}
          aria-label="Recommencer le tirage"
          style={{
            position: 'fixed',
            right: '3vw',
            bottom: '3vh',
            zIndex: 130,
            background: 'rgba(30,40,60,0.10)',
            border: '1.5px solid rgba(255,255,255,0.22)',
            borderRadius: '50%',
            width: '54px',
            height: '54px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px #0002',
            cursor: 'pointer',
            transition: 'background 0.22s, box-shadow 0.22s, border 0.22s, transform 0.18s',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            outline: 'none',
            padding: 0,
            userSelect: 'none',
          }}
        >
          <img
            src="/Tarot/reload.png"
            alt="Reload"
            style={{ width: 32, height: 32, opacity: 0.62, filter: 'drop-shadow(0 1px 2px #0004)' }}
          />
        </button>
      )}
    </div>
  );
} 
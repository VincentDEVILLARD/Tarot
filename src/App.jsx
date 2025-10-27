import Silk from './Silk';
import CircularText from './CircularText';
import TiltedCard from './TiltedCard';
import tarotMajors from './tarotMajorsData';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { useCallback } from 'react';

function App() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [showCircle, setShowCircle] = useState(true);
  const [showCards, setShowCards] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [visibleCards, setVisibleCards] = useState(0);
  const [selectedCardIdx, setSelectedCardIdx] = useState(null);
  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedCarouselCard, setSelectedCarouselCard] = useState(null);
  const [carouselOpenedFromDraw, setCarouselOpenedFromDraw] = useState(false);
  const [showCoverflow, setShowCoverflow] = useState(false);
  const [coverflowIndex, setCoverflowIndex] = useState(0);
  const [selectedCoverflowCard, setSelectedCoverflowCard] = useState(null);
  const [previousScreen, setPreviousScreen] = useState(null); // 'home' or 'draw'
  const COVERFLOW_MAIN_W = 374;
  const COVERFLOW_MAIN_H = 524;
  const COVERFLOW_SIDE_W = 198;
  const COVERFLOW_SIDE_H = 277;
  const [shareFeedback, setShareFeedback] = useState(false);
  const shareTimeoutRef = useRef();
  const silkThemes = [
    { name: 'Blue', color: '#0a9bca' },
    { name: 'Violet', color: '#7B7481' },
    { name: 'Green', color: '#40ffaa' },
    { name: 'Pink', color: '#e86eb7' },
    { name: 'Gold', color: '#e6c96b' },
    { name: 'Black', color: '#222b38' },
  ];
  const [silkColor, setSilkColor] = useState(() => {
    return localStorage.getItem('silkColor') || silkThemes[0].color;
  });
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showCrossOfLife, setShowCrossOfLife] = useState(false);
  const [crossCards, setCrossCards] = useState([]);
  const [crossVisibleCards, setCrossVisibleCards] = useState(0);
  const [crossHasDrawn, setCrossHasDrawn] = useState(false);
  const shareRef = useRef();

  function handleCrossDraw() {
    const shuffled = tarotMajors.slice().sort(() => 0.5 - Math.random());
    setCrossCards(shuffled.slice(0, 10));
    setCrossVisibleCards(0);
    setTimeout(() => {
      setCrossHasDrawn(true);
      // Animation d'apparition progressive
      for (let i = 1; i <= 10; i++) {
        setTimeout(() => setCrossVisibleCards(i), 200 * i);
      }
    }, 500);
  }
  function handleCrossReload() {
    setCrossHasDrawn(false);
    setCrossVisibleCards(0);
    setTimeout(() => handleCrossDraw(), 400);
  }
  function handleBackToMain() {
    setShowCrossOfLife(false);
    setCrossHasDrawn(false);
    setCrossVisibleCards(0);
    setCrossCards([]);
  }

  const handleDraw = () => {
    const shuffled = tarotMajors.slice().sort(() => 0.5 - Math.random());
    setCards(shuffled.slice(0, 3));
    setShowCircle(false);
    setVisibleCards(0);
    setTimeout(() => {
      setShowCards(true);
      setHasDrawn(true);
      setTimeout(() => setVisibleCards(1), 1000);   // Past
      setTimeout(() => setVisibleCards(2), 2000);  // Present
      setTimeout(() => setVisibleCards(3), 3000);  // Future
    }, 700);
  };

  const handleReloadDraw = () => {
    setShowCards(false);
    setTimeout(() => {
      const shuffled = tarotMajors.slice().sort(() => 0.5 - Math.random());
      setCards(shuffled.slice(0, 3));
      setVisibleCards(0);
      setShowCards(true);
      setTimeout(() => setVisibleCards(1), 1000);
      setTimeout(() => setVisibleCards(2), 2000);
      setTimeout(() => setVisibleCards(3), 3000);
    }, 700);
  };

  const handleBackToCircle = () => {
    setShowCircle(true);
    setShowCards(false);
    setHasDrawn(false);
    setVisibleCards(0);
    setCards([]);
  };

  const getCardDescription = (card) => card ? card.desc : '';

  const mod = (n, m) => ((n % m) + m) % m;

  const arrowLeft = <img src="/Tarot/back.png" alt="Previous" style={{ width: 32, height: 32, filter: 'drop-shadow(0 1px 2px #0004)', transform: 'none' }} />;
  const arrowRight = <img src="/Tarot/back.png" alt="Next" style={{ width: 32, height: 32, filter: 'drop-shadow(0 1px 2px #0004)', transform: 'scaleX(-1)' }} />;

  const CoverflowCarousel = () => {
    const prevIdx = mod(coverflowIndex - 1, tarotMajors.length);
    const nextIdx = mod(coverflowIndex + 1, tarotMajors.length);
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        zIndex: 100,
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}>
        <button
          onClick={() => {
            setShowCoverflow(false);
            if (previousScreen === 'draw') setShowCards(true);
            if (previousScreen === 'home') setShowCircle(true);
          }}
          aria-label="Close coverflow"
          style={{
            position: 'absolute',
            top: '3vh',
            right: '3vw',
            zIndex: 110,
            background: 'rgba(30,40,60,0.10)',
            border: '1.5px solid rgba(255,255,255,0.22)',
            borderRadius: '12px',
            width: '44px',
            height: '44px',
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
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #40ffaa66 0%, #4079ff66 100%)';
            e.currentTarget.style.boxShadow = '0 4px 24px #40ffaa88, 0 2px 8px #4079ff88, 0 2px 8px #0002';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.07)';
            e.currentTarget.style.border = '1.5px solid #40ffaa88';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(30,40,60,0.10)';
            e.currentTarget.style.boxShadow = '0 2px 8px #0002';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.border = '1.5px solid rgba(255,255,255,0.22)';
          }}
        >
          <img
            src="/Tarot/exit.png"
            alt="Close"
            style={{ width: 22, height: 22, opacity: 0.82, filter: 'drop-shadow(0 1px 2px #0004)' }}
          />
        </button>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '70vh',
          gap: '3vw',
          position: 'relative',
          zIndex: 105,
        }}>
          <div
            style={{
              width: `${COVERFLOW_SIDE_W}px`,
              height: `${COVERFLOW_SIDE_H}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'opacity 0.22s, transform 0.18s',
              overflow: 'visible',
              background: 'none',
              border: 'none',
              boxShadow: 'none',
              borderRadius: 0,
              pointerEvents: 'auto',
              position: 'relative',
              opacity: 0.7,
              filter: 'blur(0.5px) grayscale(0.2)',
              transform: 'scale(0.92)',
            }}
            onClick={() => setCoverflowIndex(prevIdx)}
          >
            <img
              src={tarotMajors[prevIdx].img}
              alt={tarotMajors[prevIdx].name}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', pointerEvents: 'none' }}
            />
          </div>
          <div
            style={{
              width: `${COVERFLOW_MAIN_W}px`,
              height: `${COVERFLOW_MAIN_H}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.18s',
              zIndex: 2,
              position: 'relative',
            }}
            onClick={() => setSelectedCoverflowCard(tarotMajors[coverflowIndex])}
          >
            <TiltedCard
              imageSrc={tarotMajors[coverflowIndex].img}
              altText={tarotMajors[coverflowIndex].name}
              containerHeight="100%"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              imageStyle={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={false}
              overflow="visible"
              scaleOnHover={1.5}
            />
          </div>
          <div
            style={{
              width: `${COVERFLOW_SIDE_W}px`,
              height: `${COVERFLOW_SIDE_H}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'opacity 0.22s, transform 0.18s',
              overflow: 'visible',
              background: 'none',
              border: 'none',
              boxShadow: 'none',
              borderRadius: 0,
              pointerEvents: 'auto',
              position: 'relative',
              opacity: 0.7,
              filter: 'blur(0.5px) grayscale(0.2)',
              transform: 'scale(0.92)',
            }}
            onClick={() => setCoverflowIndex(nextIdx)}
          >
            <img
              src={tarotMajors[nextIdx].img}
              alt={tarotMajors[nextIdx].name}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', pointerEvents: 'none' }}
            />
          </div>
        </div>
        <div style={{
          marginTop: 18,
          textAlign: 'center',
          fontSize: '1.01rem',
          color: 'rgba(255,255,255,0.38)',
          letterSpacing: '0.02em',
          fontWeight: 500,
          textShadow: '0 1px 4px #0006',
          userSelect: 'none',
        }}>
          scroll with arrows ← or →
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!showCoverflow) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') setCoverflowIndex(i => mod(i - 1, tarotMajors.length));
      if (e.key === 'ArrowRight') setCoverflowIndex(i => mod(i + 1, tarotMajors.length));
      if (e.key === 'Escape') {
        setShowCoverflow(false);
        if (previousScreen === 'draw') setShowCards(true);
        if (previousScreen === 'home') setShowCircle(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showCoverflow, tarotMajors.length, previousScreen]);

  const arrowBtnBase = {
    position: 'fixed',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 110,
    background: 'transparent',
    border: 'none',
    borderRadius: '50%',
    width: 56,
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'box-shadow 0.22s, background 0.22s, transform 0.18s',
    outline: 'none',
    padding: 0,
    userSelect: 'none',
  };

  const handleShareDraw = useCallback(() => {
    if (cards.length !== 3) return;
    const node = shareRef.current;
    if (!node) return;
    html2canvas(node, { backgroundColor: null, scale: 2 }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'tirage-tarot.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      setShareFeedback(true);
      clearTimeout(shareTimeoutRef.current);
      shareTimeoutRef.current = setTimeout(() => setShareFeedback(false), 1800);
    });
  }, [cards]);

  return (
    <div style={{width:'100vw',height:'100vh',margin:0,padding:0,overflow:'hidden',position:'relative',fontFamily:"'LEMON MILK', Arial, sans-serif"}}>
      <Silk key={silkColor} speed={7} scale={1} color={silkColor} noiseIntensity={1} rotation={0} />
      {/* SÉLECTEUR DE THÈME SILK */}
      {/* CARROUSEL DES CARTES */}
      <AnimatePresence>
        {showCarousel && (
          <motion.div
            key="carousel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 40,
              background: 'rgba(10,16,24,0.15)',
              pointerEvents: 'auto',
              padding: '4vh 4vw',
            }}
          >
            {/* Bouton fermer carrousel (exit) */}
            <button
              onClick={() => {
                setShowCarousel(false);
                setCarouselOpenedFromDraw(false);
              }}
              aria-label="Fermer le carrousel"
              style={{
                position: 'fixed',
                top: '3vh',
                right: '3vw',
                zIndex: 45,
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
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #40ffaa66 0%, #4079ff66 100%)';
                e.currentTarget.style.boxShadow = '0 4px 24px #40ffaa88, 0 2px 8px #4079ff88, 0 2px 8px #0002';
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.07)';
                e.currentTarget.style.border = '1.5px solid #40ffaa88';
                e.currentTarget.style.textShadow = '0 2px 12px #40ffaa88, 0 1px 0 #fff2';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(30,40,60,0.10)';
                e.currentTarget.style.boxShadow = '0 2px 8px #0002';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.border = '1.5px solid rgba(255,255,255,0.22)';
                e.currentTarget.style.textShadow = 'none';
              }}
            >
              <img
                src="/Tarot/exit.png"
                alt="Close"
                style={{ width: 24, height: 24, opacity: 0.62, filter: 'drop-shadow(0 1px 2px #0004)' }}
              />
            </button>
            
            {/* Grille des cartes - plus grandes et centrée */}
            <div style={{
              maxHeight: '85vh',
              overflowY: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
              maxWidth: '90vw',
              padding: '20px',
              background: 'rgba(30,40,60,0.15)',
              borderRadius: '22px',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              {tarotMajors.map((card, idx) => (
                <motion.div
                  key={card.num}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.02 }}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                  onClick={() => {
                    setSelectedCarouselCard(card);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div style={{
                    width: '200px',
                    height: '280px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 6px 24px #0004',
                    background: '#222',
                  }}>
                    <img
                      src={card.img}
                      alt={card.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#fff',
                    textAlign: 'center',
                    textShadow: '0 1px 3px #0004',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {card.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* FICHE CARTE (mode focus) mutualisée */}
      <AnimatePresence>
        {(selectedCardIdx !== null && cards[selectedCardIdx]) || selectedCoverflowCard ? (
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
                imageSrc={selectedCardIdx !== null ? cards[selectedCardIdx].img : selectedCoverflowCard?.img}
                altText={selectedCardIdx !== null ? cards[selectedCardIdx].name : selectedCoverflowCard?.name}
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
              {/* Bouton croix - retour */}
              <button
                onClick={() => {
                  if (selectedCardIdx !== null) setSelectedCardIdx(null);
                  else setSelectedCoverflowCard(null);
                }}
                aria-label="Fermer la fiche"
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 18,
                  width: 36,
                  height: 36,
                  border: 'none',
                  background: 'rgba(30,40,60,0.01)',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.22s, box-shadow 0.22s, border 0.22s, transform 0.18s, opacity 0.22s',
                  border: '1.5px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  zIndex: 2,
                  opacity: 0.48,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #40ffaa33 0%, #4079ff33 100%)';
                  e.currentTarget.style.boxShadow = '0 4px 24px #40ffaa88, 0 2px 8px #4079ff88, 0 2px 8px #0002';
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.07)';
                  e.currentTarget.style.border = '1.5px solid #40ffaa88';
                  e.currentTarget.style.opacity = 1;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(30,40,60,0.01)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.border = '1.5px solid rgba(255,255,255,0.06)';
                  e.currentTarget.style.opacity = 0.48;
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
              }}>{selectedCardIdx !== null ? cards[selectedCardIdx].name : selectedCoverflowCard?.name}</div>
              <div style={{
                fontSize: '1.18rem',
                lineHeight: 1.6,
                color: '#e6f6ff',
                opacity: 0.92,
                fontWeight: 400,
                marginBottom: '8px',
                textShadow: '0 1px 4px #0003',
              }}>
                {getCardDescription(selectedCardIdx !== null ? cards[selectedCardIdx] : selectedCoverflowCard)}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {/* TIRAGE NORMAL */}
      {selectedCardIdx === null && selectedCarouselCard === null && !showCarousel && !showCoverflow && (
        <div style={{
          position:'absolute',
          top:0,
          left:0,
          width:'100vw',
          height:'100vh',
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
          zIndex:10
        }}>
         {/* Zone invisible pour la capture PNG */}
         <div ref={shareRef} style={{
           position: 'absolute',
           left: '-9999px',
           top: 0,
           width: 800,
           height: 400,
           background: 'linear-gradient(120deg, #0a9bca 0%, #40ffaa 100%)',
           borderRadius: 32,
           boxShadow: '0 8px 48px #0003',
           display: showCards && cards.length === 3 ? 'flex' : 'none',
           flexDirection: 'column',
           alignItems: 'center',
           justifyContent: 'center',
           padding: 32,
           color: '#fff',
           fontFamily: "'LEMON MILK', Arial, sans-serif",
         }}>
           <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
             {cards.map((card, idx) => (
               <div key={card.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                 <img src={card.img} alt={card.name} style={{ width: 120, height: 180, borderRadius: 16, boxShadow: '0 4px 16px #0006', marginBottom: 12, objectFit: 'cover' }} />
                 <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 4 }}>{card.name}</div>
                 <div style={{ fontSize: 14, opacity: 0.85, textAlign: 'center', maxWidth: 120 }}>{card.desc.split('.')[0]}.</div>
               </div>
             ))}
           </div>
           <div style={{ fontSize: 18, fontWeight: 700, opacity: 0.8 }}>Tarot Spread - Past / Present / Future</div>
         </div>
          <AnimatePresence>
            {showCircle && (
              <motion.div
                key="circle"
                style={{cursor:'pointer'}}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.7, ease: 'easeInOut' } }}
                transition={{ duration: 0.7 }}
                onClick={handleDraw}
              >
                <CircularText
                  text="PAST * PRESENT * FUTURE * "
                  onHover="pause"
                  spinDuration={4}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showCards && cards.length === 3 && (
              <motion.div
                key="cards-outer"
                style={{
                  height: '100vh',
                  width: '100vw',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 'auto',
                  background: 'none',
                  margin: 0,
                  padding: 0,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    width: '100%',
                    maxWidth: '1200px',
                    pointerEvents: 'auto',
                    gap: '0',
                  }}
                >
                  {['Past','Present','Future'].map((label, idx) => (
                    <div
                      key={label}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                        minWidth: 0,
                        pointerEvents: 'auto',
                      }}
                    >
                      <AnimatePresence initial={false}>
                        {visibleCards > idx && (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.7 }}
                            style={{ width: 'min(30.8vw, 374px)', height: 'calc(min(30.8vw, 374px) * 1.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <TiltedCard
                              imageSrc={cards[idx]?.img}
                              altText={cards[idx]?.name}
                              captionText={cards[idx]?.name}
                              containerHeight="100%"
                              containerWidth="100%"
                              imageHeight="100%"
                              imageWidth="100%"
                              scaleOnHover={1.5}
                              rotateAmplitude={20}
                              showMobileWarning={false}
                              showTooltip={false}
                              imageStyle={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                              style={{
                                opacity: visibleCards > idx ? 1 : 0,
                                transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)',
                                width: '100%',
                                height: '100%'
                              }}
                              onClick={() => setSelectedCardIdx(idx)}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <AnimatePresence initial={false}>
                        {visibleCards > idx && (
                          <motion.div
                            key={'label-' + idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            style={{
                              marginTop: '18px',
                              color: '#fff',
                              fontFamily: "'LEMON MILK', Arial, sans-serif",
                              fontWeight: 900,
                              fontSize: '1.15rem',
                              letterSpacing: '0.1em',
                              textAlign: 'center',
                              textShadow: '0 2px 8px #0008',
                              userSelect: 'none',
                              lineHeight: 1.1,
                              textTransform: 'uppercase',
                            }}>{label}</motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      {/* BOUTON RELOAD FLOTTANT EN BAS À DROITE */}
      {showCards && cards.length === 3 && selectedCarouselCard === null && !showCarousel && !showCoverflow && (
        <>
        <button
          onClick={handleReloadDraw}
          aria-label="Reload"
          style={{
            position: 'fixed',
            right: '3vw',
            bottom: '3vh',
            zIndex: 30,
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
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #40ffaa66 0%, #4079ff66 100%)';
            e.currentTarget.style.boxShadow = '0 4px 24px #40ffaa88, 0 2px 8px #4079ff88, 0 2px 8px #0002';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.07)';
            e.currentTarget.style.border = '1.5px solid #40ffaa88';
            e.currentTarget.style.textShadow = '0 2px 12px #40ffaa88, 0 1px 0 #fff2';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(30,40,60,0.10)';
            e.currentTarget.style.boxShadow = '0 2px 8px #0002';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.border = '1.5px solid rgba(255,255,255,0.22)';
            e.currentTarget.style.textShadow = 'none';
          }}
        >
          <img
            src="/Tarot/reload.png"
            alt="Reload"
            style={{ width: 32, height: 32, opacity: 0.62, filter: 'drop-shadow(0 1px 2px #0004)' }}
          />
        </button>
        {/* BOUTON PARTAGE */}
        <button
          onClick={handleShareDraw}
          aria-label="Partager le tirage"
          style={{
            position: 'fixed',
            right: '3vw',
            bottom: '11.5vh',
            zIndex: 30,
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
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #40ffaa66 0%, #4079ff66 100%)';
            e.currentTarget.style.boxShadow = '0 4px 24px #40ffaa88, 0 2px 8px #4079ff88, 0 2px 8px #0002';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.07)';
            e.currentTarget.style.border = '1.5px solid #40ffaa88';
            e.currentTarget.style.textShadow = '0 2px 12px #40ffaa88, 0 1px 0 #fff2';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(30,40,60,0.10)';
            e.currentTarget.style.boxShadow = '0 2px 8px #0002';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.border = '1.5px solid rgba(255,255,255,0.22)';
            e.currentTarget.style.textShadow = 'none';
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#40ffaa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        </button>
        {/* Feedback visuel de partage */}
        <AnimatePresence>
          {shareFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'fixed',
                right: '3vw',
                bottom: '19vh',
                zIndex: 40,
                background: 'linear-gradient(90deg, #40ffaa33 0%, #4079ff33 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.05rem',
                padding: '12px 22px',
                borderRadius: '18px',
                boxShadow: '0 2px 8px #0002',
                userSelect: 'none',
                pointerEvents: 'none',
                textShadow: '0 2px 8px #40ffaa88',
              }}
            >
              Tirage téléchargé !
            </motion.div>
          )}
        </AnimatePresence>
        </>
      )}
      {/* BOUTON BACK FLOTTANT EN HAUT À DROITE */}
      {showCards && cards.length === 3 && selectedCarouselCard === null && !showCarousel && !showCoverflow && (
        <button
          onClick={handleBackToCircle}
          aria-label="Back to circle"
          style={{
            position: 'fixed',
            left: '3vw',
            top: '3vh',
            zIndex: 30,
            background: 'rgba(30,40,60,0.01)', // quasi invisible
            border: '1.5px solid rgba(255,255,255,0.06)', // quasi invisible
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
      )}
      {/* LIEN INSTAGRAM DISCRET EN BAS À GAUCHE */}
      {hasDrawn && selectedCarouselCard === null && !showCarousel && !showCoverflow && (
        <a
          href="https://instagram.com/vdvld"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            left: '3vw',
            bottom: '3vh',
            zIndex: 30,
            color: 'rgba(255,255,255,0.32)',
            fontFamily: "'LEMON MILK', Arial, sans-serif",
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '0.08em',
            textDecoration: 'none',
            opacity: 0.7,
            transition: 'color 0.2s, opacity 0.2s',
            padding: '7px 16px',
            borderRadius: '16px',
            background: 'rgba(30,40,60,0.08)',
            boxShadow: '0 2px 8px #0002',
            userSelect: 'none',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            outline: 'none',
            display: 'inline-block',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#40ffaa';
            e.currentTarget.style.opacity = 1;
            e.currentTarget.style.background = 'linear-gradient(90deg, #40ffaa33 0%, #4079ff33 100%)';
            e.currentTarget.style.textShadow = '0 2px 12px #40ffaa88, 0 1px 0 #fff2';
            e.currentTarget.style.textDecoration = 'none';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.32)';
            e.currentTarget.style.opacity = 0.7;
            e.currentTarget.style.background = 'rgba(30,40,60,0.08)';
            e.currentTarget.style.textShadow = 'none';
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          @vdvld
        </a>
      )}
      {/* COVERFLOW 3D */}
      <AnimatePresence>
        {showCoverflow && !selectedCoverflowCard && (
          <motion.div key="coverflow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.32 }}>
            <CoverflowCarousel />
          </motion.div>
        )}
      </AnimatePresence>
      {/* BOUTON LIST FLOTTANT EN HAUT À DROITE */}
      {!showCoverflow && (
        <button
          onClick={() => {
            setShowCoverflow(true);
            setCoverflowIndex(0);
            if (showCards && cards.length === 3) {
              setPreviousScreen('draw');
              setShowCards(false);
            } else {
              setPreviousScreen('home');
              setShowCircle(false);
            }
          }}
          aria-label="Voir toutes les cartes"
          style={{
            position: 'fixed',
            right: '3vw',
            top: '3vh',
            zIndex: 30,
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
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #40ffaa66 0%, #4079ff66 100%)';
            e.currentTarget.style.boxShadow = '0 4px 24px #40ffaa88, 0 2px 8px #4079ff88, 0 2px 8px #0002';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.07)';
            e.currentTarget.style.border = '1.5px solid #40ffaa88';
            e.currentTarget.style.textShadow = '0 2px 12px #40ffaa88, 0 1px 0 #fff2';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(30,40,60,0.10)';
            e.currentTarget.style.boxShadow = '0 2px 8px #0002';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.border = '1.5px solid rgba(255,255,255,0.22)';
            e.currentTarget.style.textShadow = 'none';
          }}
        >
          <img
            src="/Tarot/list.png"
            alt="List"
            style={{ width: 32, height: 32, opacity: 0.62, filter: 'drop-shadow(0 1px 2px #0004)' }}
          />
        </button>
      )}
      {/* SÉLECTEUR DE THÈME SILK - déplacé sous le bouton list, plus discret */}
      {!showCoverflow && (
        <div style={{ position: 'fixed', right: '3vw', top: 'calc(3vh + 62px)', zIndex: 29 }}>
          <button
            aria-label="Changer le thème de fond"
            onClick={() => setShowThemePicker(v => !v)}
            style={{
              background: 'rgba(30,40,60,0.04)',
              border: '1.5px solid rgba(255,255,255,0.10)',
              borderRadius: '50%',
              width: '54px',
              height: '54px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'none',
              cursor: 'pointer',
              transition: 'background 0.22s, box-shadow 0.22s, border 0.22s, transform 0.18s',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              outline: 'none',
              padding: 0,
              userSelect: 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #40ffaa22 0%, #4079ff22 100%)';
              e.currentTarget.style.boxShadow = '0 2px 8px #40ffaa33';
              e.currentTarget.style.border = '1.5px solid #40ffaa33';
              e.currentTarget.style.opacity = 0.7;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(30,40,60,0.04)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.border = '1.5px solid rgba(255,255,255,0.10)';
              e.currentTarget.style.opacity = 0.38;
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#40ffaa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>
          </button>
          {showThemePicker && (
            <div style={{
              position: 'absolute',
              top: '58px',
              right: 0,
              background: 'rgba(30,40,60,0.95)',
              border: '1.5px solid rgba(255,255,255,0.18)',
              borderRadius: '18px',
              boxShadow: '0 4px 24px #0006',
              padding: '18px 22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              zIndex: 100,
              alignItems: 'center',
              minWidth: 260,
            }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.08rem', marginBottom: 8 }}>Pick a color</div>
              <GradientColorPicker
                onPick={color => {
                  setSilkColor(color);
                  localStorage.setItem('silkColor', color);
                  setShowThemePicker(false);
                }}
                height={38}
                width={220}
              />
              <div style={{marginTop: 8, fontSize: '0.98rem', color: '#fff8', fontWeight: 400, letterSpacing: '0.02em'}}>Current: <span style={{background: silkColor, borderRadius: 8, padding: '2px 12px', color: '#222', fontWeight: 700, marginLeft: 6}}>{silkColor}</span></div>
            </div>
          )}
        </div>
      )}

      {/* BOUTON ACCÈS CROIX DE VIE (navigue vers /croix) */}
      {showCards && cards.length === 3 && selectedCarouselCard === null && !showCarousel && !showCoverflow && !showCrossOfLife && (
        <button
          onClick={() => navigate('/croix')}
          aria-label="Celtic Cross spread"
          style={{
            position: 'fixed',
            left: '3vw',
            bottom: 'calc(3vh + 64px)',
            zIndex: 30,
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
          onMouseEnter={e => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #40ffaa66 0%, #4079ff66 100%)';
            e.currentTarget.style.boxShadow = '0 4px 24px #40ffaa88, 0 2px 8px #4079ff88, 0 2px 8px #0002';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.07)';
            e.currentTarget.style.border = '1.5px solid #40ffaa88';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(30,40,60,0.10)';
            e.currentTarget.style.boxShadow = '0 2px 8px #0002';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.border = '1.5px solid rgba(255,255,255,0.22)';
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#40ffaa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="2"/><rect x="11" y="3" width="2" height="18"/></svg>
        </button>
      )}

      {/* PAGE CROIX DE VIE */}
      {showCrossOfLife && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          background: 'none',
        }}>
          {/* Bouton retour */}
          <button
            onClick={handleBackToMain}
            aria-label="Retour à l'accueil"
            style={{
              position: 'fixed',
              left: '3vw',
              top: '3vh',
              zIndex: 110,
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
          {/* Titre et bouton tirage */}
          <div style={{ marginTop: '7vh', marginBottom: '2vh', color: '#fff', fontWeight: 900, fontSize: '2.1rem', letterSpacing: '0.04em', textShadow: '0 2px 8px #0006' }}>
            Celtic Cross
          </div>
          {!crossHasDrawn && (
            <button
              onClick={handleCrossDraw}
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
              }}
            >
              Start the spread
            </button>
          )}
          {/* Layout croix de vie (squelette, à améliorer) */}
          {crossHasDrawn && (
            <div style={{
              width: 'min(90vw, 900px)',
              height: 'min(80vh, 700px)',
              position: 'relative',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* Disposition croix de vie : 10 cartes, à placer selon le schéma */}
              {/* TODO: Améliorer le layout pour respecter la croix de vie */}
              {[...Array(10)].map((_, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  ...getCrossOfLifeCardPosition(i),
                  opacity: crossVisibleCards > i ? 1 : 0,
                  transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)',
                }}>
                  <TiltedCard
                    imageSrc={crossCards[i]?.img}
                    altText={crossCards[i]?.name}
                    captionText={crossCards[i]?.name}
                    containerHeight="110px"
                    containerWidth="70px"
                    imageHeight="110px"
                    imageWidth="70px"
                    scaleOnHover={1.2}
                    rotateAmplitude={10}
                    showMobileWarning={false}
                    showTooltip={true}
                    imageStyle={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          )}
          {/* Bouton reload croix de vie */}
          {crossHasDrawn && (
            <button
              onClick={handleCrossReload}
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
      )}
    </div>
  );
}

function GradientColorPicker({ onPick, width = 220, height = 38 }) {
  const canvasRef = useRef();
  const [previewColor, setPreviewColor] = useState(null);
  // Draw the gradient on mount
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, '#7be6b1'); // greenish retro
    grad.addColorStop(0.08, '#fff7c3');
    grad.addColorStop(0.18, '#ffd37a');
    grad.addColorStop(0.32, '#ffb15a');
    grad.addColorStop(0.48, '#ff6a2c');
    grad.addColorStop(0.62, '#b91c1c');
    grad.addColorStop(0.75, '#0d2323');
    grad.addColorStop(0.92, '#7B7481'); // retro violet
    grad.addColorStop(1, '#b18be6'); // violet/retro
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#fff8';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);
  }, [width, height]);
  // Handle click
  function handleClick(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvasRef.current.getContext('2d');
    const data = ctx.getImageData(x, y, 1, 1).data;
    const color = `#${[data[0], data[1], data[2]].map(v => v.toString(16).padStart(2, '0')).join('')}`;
    onPick(color);
  }
  // Handle live preview
  function handleMouseMove(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvasRef.current.getContext('2d');
    const data = ctx.getImageData(x, y, 1, 1).data;
    const color = `#${[data[0], data[1], data[2]].map(v => v.toString(16).padStart(2, '0')).join('')}`;
    setPreviewColor(color);
  }
  function handleMouseLeave() {
    setPreviewColor(null);
  }
  return (
    <div style={{ position: 'relative', width }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          borderRadius: 12,
          cursor: 'crosshair',
          boxShadow: '0 2px 12px #0006',
          margin: '0 0 8px 0',
          display: 'block',
        }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {/* Live preview swatch */}
      <div style={{
        position: 'absolute',
        top: '50%',
        right: -48,
        transform: 'translateY(-50%)',
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: previewColor || undefined,
        border: '2.5px solid #fff',
        boxShadow: '0 2px 8px #0004',
        transition: 'background 0.15s',
        display: previewColor ? 'block' : 'none',
      }} />
    </div>
  );
}

export default App; 
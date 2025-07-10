import Silk from './Silk';
import CircularText from './CircularText';
import TiltedCard from './TiltedCard';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  // Liste des 22 arcanes majeurs
  const tarotMajors = [
    { num: 0, name: 'Le Mat', adj: 'Libre', img: 'https://placehold.co/400x640/222/fff?text=Le+Mat' },
    { num: 1, name: 'Le Bateleur', adj: 'Créatif', img: 'https://placehold.co/400x640/333/fff?text=Le+Bateleur' },
    { num: 2, name: 'La Papesse', adj: 'Intuitive', img: 'https://placehold.co/400x640/444/fff?text=La+Papesse' },
    { num: 3, name: 'L’Impératrice', adj: 'Fertile', img: 'https://placehold.co/400x640/555/fff?text=L%E2%80%99Imp%C3%A9ratrice' },
    { num: 4, name: 'L’Empereur', adj: 'Stable', img: 'https://placehold.co/400x640/666/fff?text=L%E2%80%99Empereur' },
    { num: 5, name: 'Le Pape', adj: 'Sage', img: 'https://placehold.co/400x640/777/fff?text=Le+Pape' },
    { num: 6, name: 'L’Amoureux', adj: 'Passionné', img: 'https://placehold.co/400x640/888/fff?text=L%E2%80%99Amoureux' },
    { num: 7, name: 'Le Chariot', adj: 'Victorieux', img: 'https://placehold.co/400x640/999/fff?text=Le+Chariot' },
    { num: 8, name: 'La Justice', adj: 'Équitable', img: 'https://placehold.co/400x640/aaa/fff?text=La+Justice' },
    { num: 9, name: 'L’Hermite', adj: 'Réfléchi', img: 'https://placehold.co/400x640/bbb/fff?text=L%E2%80%99Hermite' },
    { num: 10, name: 'La Roue de Fortune', adj: 'Changeant', img: 'https://placehold.co/400x640/ccc/fff?text=La+Roue+de+Fortune' },
    { num: 11, name: 'La Force', adj: 'Courageux', img: 'https://placehold.co/400x640/ddd/fff?text=La+Force' },
    { num: 12, name: 'Le Pendu', adj: 'Suspendu', img: 'https://placehold.co/400x640/eee/fff?text=Le+Pendu' },
    { num: 13, name: 'L’Arcane sans nom', adj: 'Transformateur', img: 'https://placehold.co/400x640/111/fff?text=Arcane+XIII' },
    { num: 14, name: 'Tempérance', adj: 'Harmonieux', img: 'https://placehold.co/400x640/222/fff?text=Temp%C3%A9rance' },
    { num: 15, name: 'Le Diable', adj: 'Instinctif', img: 'https://placehold.co/400x640/333/fff?text=Le+Diable' },
    { num: 16, name: 'La Maison Dieu', adj: 'Brutal', img: 'https://placehold.co/400x640/444/fff?text=La+Maison+Dieu' },
    { num: 17, name: 'L’Étoile', adj: 'Inspirant', img: 'https://placehold.co/400x640/555/fff?text=L%E2%80%99%C3%89toile' },
    { num: 18, name: 'La Lune', adj: 'Mystérieux', img: 'https://placehold.co/400x640/666/fff?text=La+Lune' },
    { num: 19, name: 'Le Soleil', adj: 'Rayonnant', img: 'https://placehold.co/400x640/777/fff?text=Le+Soleil' },
    { num: 20, name: 'Le Jugement', adj: 'Révélateur', img: 'https://placehold.co/400x640/888/fff?text=Le+Jugement' },
    { num: 21, name: 'Le Monde', adj: 'Accompli', img: 'https://placehold.co/400x640/999/fff?text=Le+Monde' },
  ];
  const [cards, setCards] = useState([]);
  const [showCircle, setShowCircle] = useState(true);
  const [showCards, setShowCards] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [visibleCards, setVisibleCards] = useState(0);
  const [selectedCardIdx, setSelectedCardIdx] = useState(null);
  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedCarouselCard, setSelectedCarouselCard] = useState(null);
  const [carouselOpenedFromDraw, setCarouselOpenedFromDraw] = useState(false);
  // Coverflow 3D states
  const [showCoverflow, setShowCoverflow] = useState(false);
  const [coverflowIndex, setCoverflowIndex] = useState(0);
  const [selectedCoverflowCard, setSelectedCoverflowCard] = useState(null);
  // Pour revenir à l'état précédent après le coverflow
  const [previousScreen, setPreviousScreen] = useState(null); // 'home' | 'draw'
  // Taille des cartes coverflow (ratio 80/112)
  const COVERFLOW_MAIN_W = 340;
  const COVERFLOW_MAIN_H = 476;
  const COVERFLOW_SIDE_W = 180;
  const COVERFLOW_SIDE_H = 252;

  const handleDraw = () => {
    const shuffled = tarotMajors.slice().sort(() => 0.5 - Math.random());
    setCards(shuffled.slice(0, 3));
    setShowCircle(false);
    setVisibleCards(0);
    setTimeout(() => {
      setShowCards(true);
      setHasDrawn(true);
      // Affichage séquentiel des cartes (plus lent)
      setTimeout(() => setVisibleCards(1), 500);   // Past
      setTimeout(() => setVisibleCards(2), 1200);  // Present
      setTimeout(() => setVisibleCards(3), 2000);  // Future
    }, 700);
  };

  // Nouveau tirage (reload)
  const handleReloadDraw = () => {
    setShowCards(false);
    setTimeout(() => {
      const shuffled = tarotMajors.slice().sort(() => 0.5 - Math.random());
      setCards(shuffled.slice(0, 3));
      setVisibleCards(0);
      setShowCards(true);
      setTimeout(() => setVisibleCards(1), 500);
      setTimeout(() => setVisibleCards(2), 1200);
      setTimeout(() => setVisibleCards(3), 2000);
    }, 700);
  };

  // Handler for back button (reset to initial state)
  const handleBackToCircle = () => {
    setShowCircle(true);
    setShowCards(false);
    setHasDrawn(false);
    setVisibleCards(0);
    setCards([]);
  };

  // Placeholder descriptions for each card
  const getCardDescription = (card) =>
    card ? `La carte « ${card.name} » symbolise ${card.adj?.toLowerCase() || 'un aspect mystérieux'} de votre parcours.` : '';

  // Helper pour coverflow infini
  const mod = (n, m) => ((n % m) + m) % m;

  // Pour les flèches coverflow (icônes)
  const arrowLeft = <img src="/Tarot/back.png" alt="Précédent" style={{ width: 32, height: 32, filter: 'drop-shadow(0 1px 2px #0004)', transform: 'none' }} />;
  const arrowRight = <img src="/Tarot/back.png" alt="Suivant" style={{ width: 32, height: 32, filter: 'drop-shadow(0 1px 2px #0004)', transform: 'scaleX(-1)' }} />;

  // CoverflowCarousel simple (3 cartes visibles, infini, carte centrale = TiltedCard, ratio tarot)
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
        {/* Exit button */}
        <button
          onClick={() => {
            setShowCoverflow(false);
            if (previousScreen === 'draw') setShowCards(true);
            if (previousScreen === 'home') setShowCircle(true);
          }}
          aria-label="Fermer le coverflow"
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
        {/* Coverflow cards (3 visibles, ratio tarot) */}
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
          {/* Précédente */}
          <div
            style={{
              width: `${COVERFLOW_SIDE_W}px`,
              height: `${COVERFLOW_SIDE_H}px`,
              aspectRatio: '80/112',
              opacity: 0.7,
              filter: 'blur(0.5px) grayscale(0.2)',
              transform: 'rotateY(-18deg) scale(1)',
              borderRadius: '18px',
              boxShadow: '0 2px 12px #0006',
              background: 'rgba(30,40,60,0.10)',
              border: '1px solid rgba(255,255,255,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
              overflow: 'hidden',
            }}
            onClick={() => setCoverflowIndex(prevIdx)}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = 1;
              e.currentTarget.style.filter = 'none';
              e.currentTarget.style.transform = 'rotateY(-18deg) scale(1.08)';
              e.currentTarget.style.boxShadow = '0 6px 24px #40ffaa55, 0 2px 8px #4079ff55';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = 0.7;
              e.currentTarget.style.filter = 'blur(0.5px) grayscale(0.2)';
              e.currentTarget.style.transform = 'rotateY(-18deg) scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 12px #0006';
            }}
          >
            <img
              src={tarotMajors[prevIdx].img}
              alt={tarotMajors[prevIdx].name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
            />
          </div>
          {/* Centrale = TiltedCard géant, fond glass, ratio tarot */}
          <div style={{
            position: 'relative',
            width: `${COVERFLOW_MAIN_W}px`,
            height: `${COVERFLOW_MAIN_H}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Chevron gauche */}
            <img
              src="/Tarot/back.png"
              alt="chevron gauche"
              style={{
                position: 'absolute',
                left: '-38px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 28,
                height: 28,
                opacity: 0.18,
                pointerEvents: 'none',
                userSelect: 'none',
                filter: 'drop-shadow(0 1px 2px #0002)',
              }}
            />
            <TiltedCard
              imageSrc={tarotMajors[coverflowIndex].img}
              altText={tarotMajors[coverflowIndex].name}
              captionText={tarotMajors[coverflowIndex].name}
              containerHeight="100%"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              scaleOnHover={1.15}
              rotateAmplitude={18}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={false}
              style={{
                borderRadius: '22px',
                boxShadow: '0 4px 24px #0008',
                background: 'rgba(30,40,60,0.10)',
                border: '2px solid rgba(255,255,255,0.18)',
                cursor: 'pointer',
                margin: '0 2vw',
              }}
              onClick={() => setSelectedCoverflowCard(tarotMajors[coverflowIndex])}
            />
            {/* Chevron droite */}
            <img
              src="/Tarot/back.png"
              alt="chevron droite"
              style={{
                position: 'absolute',
                right: '-38px',
                top: '50%',
                transform: 'translateY(-50%) scaleX(-1)',
                width: 28,
                height: 28,
                opacity: 0.18,
                pointerEvents: 'none',
                userSelect: 'none',
                filter: 'drop-shadow(0 1px 2px #0002)',
              }}
            />
          </div>
          {/* Suivante */}
          <div
            style={{
              width: `${COVERFLOW_SIDE_W}px`,
              height: `${COVERFLOW_SIDE_H}px`,
              aspectRatio: '80/112',
              opacity: 0.7,
              filter: 'blur(0.5px) grayscale(0.2)',
              transform: 'rotateY(18deg) scale(1)',
              borderRadius: '18px',
              boxShadow: '0 2px 12px #0006',
              background: 'rgba(30,40,60,0.10)',
              border: '1px solid rgba(255,255,255,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
              overflow: 'hidden',
            }}
            onClick={() => setCoverflowIndex(nextIdx)}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = 1;
              e.currentTarget.style.filter = 'none';
              e.currentTarget.style.transform = 'rotateY(18deg) scale(1.08)';
              e.currentTarget.style.boxShadow = '0 6px 24px #40ffaa55, 0 2px 8px #4079ff55';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = 0.7;
              e.currentTarget.style.filter = 'blur(0.5px) grayscale(0.2)';
              e.currentTarget.style.transform = 'rotateY(18deg) scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 12px #0006';
            }}
          >
            <img
              src={tarotMajors[nextIdx].img}
              alt={tarotMajors[nextIdx].name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Coverflow: keyboard navigation
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

  // Style pour le halo/glow circulaire au hover
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

  return (
    <div style={{width:'100vw',height:'100vh',margin:0,padding:0,overflow:'hidden',position:'relative',fontFamily:"'LEMON MILK', Arial, sans-serif"}}>
      <Silk speed={7} scale={1} color="#0a9bca" noiseIntensity={1} rotation={0} />
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
      
      {/* FICHE CARTE (mode focus) - pour carrousel aussi */}
      <AnimatePresence>
        {selectedCarouselCard && (
          <motion.div
            key="carousel-card-focus"
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
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              background: 'rgba(10,16,24,0.25)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              pointerEvents: 'auto',
            }}
          >
            {/* Carte statique à gauche */}
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: '-7vw', opacity: 1 }}
              exit={{ x: 0, opacity: 0 }}
              transition={{ duration: 0.44, type: 'spring', bounce: 0.18 }}
              style={{
                width: 'min(32vw, 400px)',
                aspectRatio: '80/112',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(30,40,60,0.10)',
                borderRadius: '22px',
                boxShadow: '0 4px 32px #0003',
                marginRight: '4vw',
                marginLeft: '2vw',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src={selectedCarouselCard.img}
                alt={selectedCarouselCard.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '18px',
                  boxShadow: '0 2px 12px #0002',
                  background: '#222',
                }}
              />
            </motion.div>
            {/* Fenêtre d'info à droite */}
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 60, opacity: 0 }}
              transition={{ duration: 0.44, type: 'spring', bounce: 0.18, delay: 0.08 }}
              style={{
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
              }}
            >
              {/* Bouton croix - retour au carrousel */}
              <button
                onClick={() => setSelectedCarouselCard(null)}
                aria-label="Retour au carrousel"
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
                  alt="Back to carousel"
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
              }}>{selectedCarouselCard.name}</div>
              <div style={{
                fontSize: '1.18rem',
                lineHeight: 1.6,
                color: '#e6f6ff',
                opacity: 0.92,
                fontWeight: 400,
                marginBottom: '8px',
                textShadow: '0 1px 4px #0003',
              }}>
                {getCardDescription(selectedCarouselCard)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* FICHE CARTE (mode focus) */}
      <AnimatePresence>
        {selectedCardIdx !== null && cards[selectedCardIdx] && (
          <motion.div
            key="card-focus"
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
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              background: 'rgba(10,16,24,0.12)',
              pointerEvents: 'auto',
            }}
          >
            {/* Carte statique à gauche */}
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: '-7vw', opacity: 1 }}
              exit={{ x: 0, opacity: 0 }}
              transition={{ duration: 0.44, type: 'spring', bounce: 0.18 }}
              style={{
                width: 'min(32vw, 400px)',
                aspectRatio: '80/112',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(30,40,60,0.10)',
                borderRadius: '22px',
                boxShadow: '0 4px 32px #0003',
                marginRight: '4vw',
                marginLeft: '2vw',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src={cards[selectedCardIdx].img}
                alt={cards[selectedCardIdx].name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '18px',
                  boxShadow: '0 2px 12px #0002',
                  background: '#222',
                }}
              />
            </motion.div>
            {/* Fenêtre d'info à droite */}
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 60, opacity: 0 }}
              transition={{ duration: 0.44, type: 'spring', bounce: 0.18, delay: 0.08 }}
              style={{
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
              }}
            >
              {/* Bouton croix */}
              <button
                onClick={() => setSelectedCardIdx(null)}
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
              }}>{cards[selectedCardIdx].name}</div>
              <div style={{
                fontSize: '1.18rem',
                lineHeight: 1.6,
                color: '#e6f6ff',
                opacity: 0.92,
                fontWeight: 400,
                marginBottom: '8px',
                textShadow: '0 1px 4px #0003',
              }}>
                {getCardDescription(cards[selectedCardIdx])}
              </div>
            </motion.div>
          </motion.div>
        )}
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
                      <div style={{
                        width: 'min(30.8vw, 374px)', // +10% plus large
                        aspectRatio: '80/112', // Ratio tarot de Marseille
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
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
                            displayOverlayContent={true}
                            overlayContent={
                              <div style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                height: '100%',
                                pointerEvents: 'none',
                                paddingTop: 0,
                              }}>
                                <span style={{
                                  fontFamily: "'LEMON MILK', Arial, sans-serif",
                                  fontWeight: 900,
                                  fontSize: '1.1rem',
                                  color: '#fff',
                                  letterSpacing: '0.06em',
                                  background: 'rgba(255,255,255,0.18)',
                                  borderRadius: '12px',
                                  padding: '7px 18px',
                                  boxShadow: '0 2px 8px 0 #0001',
                                  border: '1.5px solid rgba(255,255,255,0.32)',
                                  backdropFilter: 'blur(8px)',
                                  WebkitBackdropFilter: 'blur(8px)',
                                  opacity: 0.98,
                                  textShadow: 'none',
                                }}>{cards[idx]?.num} — {cards[idx]?.name}</span>
                              </div>
                            }
                            style={{
                              opacity: visibleCards > idx ? 1 : 0,
                              transition: 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)',
                              width: '100%',
                              height: '100%'
                            }}
                            onClick={() => setSelectedCardIdx(idx)}
                          />
                      </div>
                      <div style={{
                        marginTop: '18px',
                        color: '#fff',
                        fontFamily: "'LEMON MILK', Arial, sans-serif",
                        fontWeight: 'bold',
                        fontSize: '1.15rem',
                        letterSpacing: '0.1em',
                        textAlign: 'center',
                        textShadow: '0 2px 8px #0008',
                        userSelect: 'none',
                        lineHeight: 1.1,
                      }}>{label}</div>
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
            e.currentTarget.style.background = 'rgba(30,40,60,0.10)'; // ou tu peux mettre un bleu/vert très doux si tu veux un fond plus coloré même au repos
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
      {/* FICHE CARTE depuis coverflow */}
      <AnimatePresence>
        {selectedCoverflowCard && (
          <motion.div
            key="coverflow-card-focus"
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
            {/* Carte statique à gauche */}
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: '-7vw', opacity: 1 }}
              exit={{ x: 0, opacity: 0 }}
              transition={{ duration: 0.44, type: 'spring', bounce: 0.18 }}
              style={{
                width: 'min(32vw, 400px)',
                aspectRatio: '80/112',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(30,40,60,0.10)',
                borderRadius: '22px',
                boxShadow: '0 4px 32px #0003',
                marginRight: '4vw',
                marginLeft: '2vw',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <img
                src={selectedCoverflowCard.img}
                alt={selectedCoverflowCard.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '18px',
                  boxShadow: '0 2px 12px #0002',
                  background: '#222',
                }}
              />
            </motion.div>
            {/* Fenêtre d'info à droite */}
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 60, opacity: 0 }}
              transition={{ duration: 0.44, type: 'spring', bounce: 0.18, delay: 0.08 }}
              style={{
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
              }}
            >
              {/* Bouton croix - retour au coverflow */}
              <button
                onClick={() => setSelectedCoverflowCard(null)}
                aria-label="Retour au coverflow"
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
                  alt="Back to coverflow"
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
              }}>{selectedCoverflowCard.name}</div>
              <div style={{
                fontSize: '1.18rem',
                lineHeight: 1.6,
                color: '#e6f6ff',
                opacity: 0.92,
                fontWeight: 400,
                marginBottom: '8px',
                textShadow: '0 1px 4px #0003',
              }}>
                {getCardDescription(selectedCoverflowCard)}
              </div>
            </motion.div>
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
    </div>
  );
}
export default App; 
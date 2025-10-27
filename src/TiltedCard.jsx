import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./TiltedCard.css";

// Spring config for the tilt/scale effect
const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

// Ajout d'un utilitaire pour détecter le mobile
function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(window.navigator.userAgent);
}

export default function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "100%",
  imageHeight = "300px",
  imageWidth = "300px",
  scaleOnHover = 1.2,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false,
  onClick,
  imageStyle = {},
  overflow = 'visible',
}) {
  const ref = useRef(null);
  const x = useMotionValue();
  const y = useMotionValue();
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });
  const [lastY, setLastY] = useState(0);
  const isMobile = isMobileDevice();

  function handleMouse(e) {
    if (isMobile) return; // Désactive l'effet tilt sur mobile
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;
    rotateX.set(rotationX);
    rotateY.set(rotationY);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }
  function handleMouseEnter() {
    if (isMobile) return;
    scale.set(scaleOnHover);
    opacity.set(1);
  }
  function handleMouseLeave() {
    if (isMobile) return;
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }
  // Gestion du tap sur mobile
  function handleTouchEnd(e) {
    if (onClick) onClick(e);
  }
  return (
    <figure
      ref={ref}
      className="tilted-card-figure"
      style={{
        height: containerHeight,
        width: containerWidth,
        cursor: onClick ? 'pointer' : undefined,
        overflow,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-pressed={onClick ? false : undefined}
    >
      {/* Suppression de l'alerte mobile si mobile */}
      {showMobileWarning && !isMobile && (
        <div className="tilted-card-mobile-alert">
          Not really made for mobile—try it on desktop for the full effect.
        </div>
      )}
      <motion.div
        className="tilted-card-inner"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          scale: isMobile ? 1 : scale,
        }}
      >
        <motion.img
          src={imageSrc}
          alt={altText}
          className="tilted-card-img"
          style={{
            width: imageWidth,
            height: imageHeight,
            objectFit: 'contain',
            ...imageStyle,
          }}
        />
        {displayOverlayContent && overlayContent && (
          <motion.div
            className="tilted-card-overlay"
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>
      {/* Tooltip désactivé sur mobile */}
      {showTooltip && !isMobile && (
        <motion.figcaption
          className="tilted-card-caption"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
} 
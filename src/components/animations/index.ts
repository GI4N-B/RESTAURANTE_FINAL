export const fadeInScale = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2 },
};

export const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
  transition: { duration: 0.2 },
};

export const slideDown = {
  initial: { y: -10, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -10, opacity: 0 },
  transition: { duration: 0.2 },
};

export const slideLeft = {
  initial: { x: -10, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -10, opacity: 0 },
  transition: { duration: 0.2 },
};

export const slideRight = {
  initial: { x: 10, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 10, opacity: 0 },
  transition: { duration: 0.2 },
};

export const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export const pulse = {
  animate: { scale: [1, 1.05, 1] },
  transition: { duration: 2, repeat: Infinity },
};

export const rotateCenter = {
  animate: { rotate: 360 },
  transition: { duration: 2, repeat: Infinity, ease: 'linear' },
};

export const bounce = {
  animate: { y: [0, -10, 0] },
  transition: { duration: 1, repeat: Infinity },
};

export const shimmer = {
  animate: { backgroundPosition: ['200% 0', '-200% 0'] },
  transition: { duration: 2, repeat: Infinity },
};

export const popIn = {
  initial: { scale: 0, rotate: -10 },
  animate: { scale: 1, rotate: 0 },
  exit: { scale: 0, rotate: -10 },
  transition: { type: 'spring', stiffness: 200, damping: 15 },
};

export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const checkmark = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: { type: 'spring', stiffness: 100, damping: 10 },
};

export const jiggle = {
  animate: { x: [-5, 5, -5, 0] },
  transition: { duration: 0.4 },
};

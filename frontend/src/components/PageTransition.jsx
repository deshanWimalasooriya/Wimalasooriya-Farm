import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition
 * Wrap any page component in this to get a smooth enter animation.
 * Uses the current pathname as the animation key so every route change
 * triggers a fresh transition.
 */
const pageVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.995,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.42,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.997,
    transition: {
      duration: 0.22,
      ease: 'easeIn',
    },
  },
};

const PageTransition = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <motion.div
      key={pathname}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;

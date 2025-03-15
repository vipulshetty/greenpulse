
import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
      filter: "blur(8px)"
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.15
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      filter: "blur(8px)",
      transition: {
        duration: 0.6
      }
    }
  };

  const childVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="will-change-transform min-h-screen"
    >
      <motion.div variants={childVariants}>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default PageTransition;

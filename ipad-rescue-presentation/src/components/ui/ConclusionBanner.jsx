import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from '../../animations';

export default function ConclusionBanner({ text, isAccent = false }) {
  const bgColor = isAccent 
    ? 'linear-gradient(135deg, var(--accent-100), #ff4d6d)'
    : 'linear-gradient(135deg, var(--primary-100), var(--primary-200))';

  return (
    <motion.div
      variants={itemVariants}
      className="w-full max-w-4xl mx-auto px-8 py-6 rounded-2xl text-white text-center text-2xl font-semibold shadow-lg"
      style={{ background: bgColor }}
    >
      {text}
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from '../../animations';

export default function TitleArea({ title, subtitle }) {
  return (
    <div className="text-center mb-8">
      {subtitle && (
        <motion.p 
          variants={itemVariants}
          className="text-lg mb-2"
          style={{ color: 'var(--text-200)' }}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.h1 
        variants={itemVariants}
        className="text-5xl font-bold"
        style={{ color: 'var(--text-100)' }}
      >
        {title}
      </motion.h1>
    </div>
  );
}

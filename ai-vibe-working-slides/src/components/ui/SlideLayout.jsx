import { motion } from "framer-motion";
import { containerVariants } from "../../animations";

function SlideLayout({ children, className = "" }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`relative flex h-full flex-col ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default SlideLayout;

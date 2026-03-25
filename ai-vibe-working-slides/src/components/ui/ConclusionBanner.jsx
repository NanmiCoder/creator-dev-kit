import { motion } from "framer-motion";
import { itemVariants } from "../../animations";

function ConclusionBanner({ text, align = "center" }) {
  return (
    <motion.div
      variants={itemVariants}
      className={`accent-panel w-full rounded-[28px] px-6 py-5 md:px-8 md:py-6 ${align === "center" ? "text-center" : "text-left"}`}
    >
      <p className="text-lg font-semibold tracking-[0.01em] md:text-2xl">{text}</p>
    </motion.div>
  );
}

export default ConclusionBanner;

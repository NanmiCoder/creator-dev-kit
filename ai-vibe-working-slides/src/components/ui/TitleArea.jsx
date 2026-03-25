import { motion } from "framer-motion";
import { itemVariants } from "../../animations";

function TitleArea({ eyebrow, title, subtitle, align = "left", maxWidth = "52rem" }) {
  return (
    <div
      className={`relative z-10 flex flex-col gap-4 ${align === "center" ? "items-center text-center" : "items-start text-left"}`}
      style={{ maxWidth }}
    >
      {eyebrow ? (
        <motion.div variants={itemVariants} className="eyebrow">
          {eyebrow}
        </motion.div>
      ) : null}
      <motion.h2
        variants={itemVariants}
        className="display-title text-4xl leading-none text-[var(--text-100)] md:text-6xl"
      >
        {title}
      </motion.h2>
      {subtitle ? (
        <motion.p
          variants={itemVariants}
          className="max-w-3xl text-base leading-7 text-[var(--text-200)] md:text-lg"
        >
          {subtitle}
        </motion.p>
      ) : null}
    </div>
  );
}

export default TitleArea;

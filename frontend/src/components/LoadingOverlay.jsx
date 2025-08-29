import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingOverlay = ({ loading }) => {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} // 300ms de desvanecido
          className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
        >
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;

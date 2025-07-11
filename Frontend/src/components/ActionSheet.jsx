import React from "react";
import { motion } from "framer-motion";

const ActionSheet = ({ onClose, onBlock, onReport, onRestrict, isBlocked }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-[90%] max-w-sm rounded-2xl shadow-lg overflow-hidden dark:bg-gray-900"
      >
        <button
          onClick={onBlock}
          className="w-full py-4 text-red-500 font-semibold border-b hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-800"
        >
          {isBlocked ? "Unblock" : "Block"}
        </button>
        <button
          onClick={onRestrict}
          className="w-full py-4 text-red-500 font-semibold border-b hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-800"
        >
          Restrict
        </button>
        <button
          onClick={onReport}
          className="w-full py-4 text-red-500 font-semibold border-b hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-800"
        >
          Report
        </button>
        <button
          onClick={onClose}
          className="w-full py-4 hover:bg-gray-100 text-black dark:text-white dark:hover:bg-gray-800 dark:border-gray-800"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

export default ActionSheet;

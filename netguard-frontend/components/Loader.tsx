"use client"

import { motion } from "framer-motion"

interface LoaderProps {
  text?: string
}

const Loader = ({ text = "Loading..." }: LoaderProps) => (
  <div className="flex flex-col justify-center items-center h-64">
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="w-20 h-20 border-4 border-t-cyber-cyan border-r-cyber-purple border-b-cyber-pink border-l-transparent rounded-full"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="w-10 h-10 bg-cyber-dark/80 rounded-full flex items-center justify-center"
        >
          <div className="w-5 h-5 bg-cyber-cyan rounded-full" />
        </motion.div>
      </div>
    </div>

    <div className="flex items-center space-x-2 mt-4">
      <motion.div className="loading-dot bg-cyber-cyan" />
      <motion.div className="loading-dot bg-cyber-purple" />
      <motion.div className="loading-dot bg-cyber-pink" />
    </div>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="text-cyber-gray mt-4 font-orbitron tracking-wider"
    >
      {text}
    </motion.p>
  </div>
)

export default Loader


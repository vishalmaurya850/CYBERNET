"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
            className="card-glowing relative max-w-lg w-full max-h-[90vh] overflow-auto grid-pattern"
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="border-b border-cyber-cyan/20 pb-3 mb-4">
                <h3 className="text-xl font-bold text-cyber-cyan font-orbitron">{title}</h3>
              </div>
            )}

            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-cyber-gray hover:text-cyber-pink transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mt-2">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal


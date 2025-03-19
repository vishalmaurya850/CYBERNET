"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react"

interface StatusCardProps {
  status: string
}

const StatusCard = ({ status }: StatusCardProps) => {
  const [securityLevel, setSecurityLevel] = useState({
    icon: <ShieldCheck className="h-10 w-10" />,
    color: "text-cyber-cyan",
    message: "Your network is secure",
  })

  useEffect(() => {
    if (status === "Safe") {
      setSecurityLevel({
        icon: <ShieldCheck className="h-10 w-10" />,
        color: "text-cyber-cyan",
        message: "Your network is secure",
      })
    } else if (status === "Under Attack") {
      setSecurityLevel({
        icon: <ShieldAlert className="h-10 w-10" />,
        color: "text-cyber-pink",
        message: "Security threats detected",
      })
    } else {
      // Default or unknown status
      setSecurityLevel({
        icon: <Shield className="h-10 w-10" />,
        color: "text-yellow-400",
        message: "Network status unknown",
      })
    }
  }, [status])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card-glowing h-full relative overflow-hidden"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20"></div>

      {/* Scan Line Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 w-full h-[1px] bg-cyber-cyan/30 animate-scan-line" />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-cyber-cyan mb-4 font-orbitron flex items-center">
          <Shield className="h-6 w-6 mr-2" /> Network Status
        </h2>

        <div className="flex items-center justify-between">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${securityLevel.color} flex flex-col items-center`}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              {securityLevel.icon}
            </motion.div>
            <p className={`text-4xl font-extrabold font-orbitron mt-2 ${securityLevel.color}`}>{status}</p>
          </motion.div>

          <div className="border-l border-cyber-cyan/30 h-20 mx-4" />

          <div className="flex-1">
            <p className={`font-medium ${securityLevel.color}`}>{securityLevel.message}</p>
            <div className="mt-3 bg-gray-800/50 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: status === "Safe" ? "100%" : status === "Warning" ? "60%" : "30%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full ${
                  status === "Safe" ? "bg-cyber-cyan" : status === "Warning" ? "bg-yellow-400" : "bg-cyber-pink"
                }`}
              />
            </div>
            <div className="flex justify-between text-xs mt-1 text-cyber-gray/70">
              <span>Critical</span>
              <span>Warning</span>
              <span>Safe</span>
            </div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-sm text-cyber-gray/80 mt-4 italic"
        >
          Last updated: {new Date().toLocaleTimeString()}
        </motion.p>
      </div>
    </motion.div>
  )
}

export default StatusCard


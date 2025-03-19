"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, ChevronDown, Clock, Shield, Zap } from "lucide-react"

interface AlertCardProps {
  alert: {
    _id: string
    attack_type: string
    timestamp: string
    flow: string
    severity?: "low" | "medium" | "high" | "critical"
  }
}

// Improve data handling in AlertCard component
const AlertCard = ({ alert }: AlertCardProps) => {
  const [expanded, setExpanded] = useState(false)

  // Add debugging for incoming data
  console.log("AlertCard received alert:", alert)

  // Determine severity colors
  const getSeverityDetails = () => {
    const severityMap = {
      low: { color: "text-green-400", border: "border-green-400", bg: "bg-green-400/10" },
      medium: { color: "text-yellow-400", border: "border-yellow-400", bg: "bg-yellow-400/10" },
      high: { color: "text-orange-400", border: "border-orange-400", bg: "bg-orange-400/10" },
      critical: { color: "text-cyber-pink", border: "border-cyber-pink", bg: "bg-cyber-pink/10" },
    }

    // Default to high if not specified
    const severity = alert.severity || "high"
    return severityMap[severity]
  }

  const severityDetails = getSeverityDetails()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`card cursor-pointer border-l-4 ${severityDetails.border} overflow-hidden`}
      onClick={() => setExpanded(!expanded)}
      whileHover={{ scale: 1.01, boxShadow: "0 0 15px rgba(0, 212, 255, 0.2)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${severityDetails.bg}`}>
            <AlertTriangle className={`w-5 h-5 ${severityDetails.color}`} />
          </div>

          <div>
            <h3 className={`text-xl font-semibold ${severityDetails.color} font-orbitron`}>{alert.attack_type}</h3>
            <div className="flex items-center mt-1 text-sm text-cyber-gray space-x-2">
              <Clock className="w-4 h-4" />
              <span>{new Date(alert.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-5 h-5 text-cyber-gray" />
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <div className="p-3 rounded-lg bg-cyber-darker/50 border border-cyber-cyan/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-cyber-purple" />
                  <span className="text-sm text-cyber-gray">Flow ID: </span>
                  <span className="text-sm font-medium text-cyber-cyan">{alert.flow}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-cyber-purple" />
                  <span className="text-sm text-cyber-gray">Recommendation: </span>
                  <span className="text-sm font-medium text-cyber-cyan">Block Source IP</span>
                </div>
              </div>

              <div className="mt-3 text-sm">
                <h4 className="text-cyber-purple font-medium mb-1">Attack Details:</h4>
                <p className="text-cyber-gray">
                  Suspicious network activity detected that matches known patterns of {alert.attack_type}. This could
                  indicate an attempted exploitation of vulnerabilities in your network.
                </p>
              </div>

              <div className="mt-3 flex justify-end">
                <button className="bg-cyber-darker hover:bg-cyber-cyan/20 text-cyber-cyan text-sm py-1 px-3 rounded-md transition-colors">
                  Investigate
                </button>
                <button className="bg-cyber-darker hover:bg-cyber-pink/20 text-cyber-pink text-sm py-1 px-3 rounded-md ml-2 transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default AlertCard
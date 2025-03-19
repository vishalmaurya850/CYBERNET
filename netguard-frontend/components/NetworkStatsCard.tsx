"use client"

import { motion } from "framer-motion"
import { Activity, Clock, Database } from "lucide-react"

interface NetworkStatsCardProps {
  flowsCount: number
  alertsCount: number
  lastUpdated: string
}

const NetworkStatsCard = ({ flowsCount, alertsCount, lastUpdated }: NetworkStatsCardProps) => {
  // Add debugging for incoming data
  console.log("NetworkStatsCard received data:", { flowsCount, alertsCount, lastUpdated })

  // Ensure we have valid data with fallbacks
  const safeFlowsCount = typeof flowsCount === "number" ? flowsCount : 0
  const safeAlertsCount = typeof alertsCount === "number" ? alertsCount : 0
  const safeLastUpdated = lastUpdated || new Date().toISOString()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card-glowing h-full relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-pattern opacity-20"></div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-cyber-cyan mb-4 font-orbitron flex items-center">
          <Activity className="h-6 w-6 mr-2" /> Network Stats
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-cyber-cyan/10 p-2 rounded-full mr-3">
                <Database className="h-5 w-5 text-cyber-cyan" />
              </div>
              <span className="text-cyber-gray">Recent Flows</span>
            </div>
            <span className="text-xl font-semibold text-cyber-cyan">{safeFlowsCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-cyber-pink/10 p-2 rounded-full mr-3">
                <Activity className="h-5 w-5 text-cyber-pink" />
              </div>
              <span className="text-cyber-gray">Recent Alerts</span>
            </div>
            <span className="text-xl font-semibold text-cyber-pink">{safeAlertsCount}</span>
          </div>

          <div className="pt-3 border-t border-cyber-cyan/20">
            <div className="flex items-center text-sm text-cyber-gray/70">
              <Clock className="h-4 w-4 mr-1" />
              <span>Last updated: {new Date(safeLastUpdated).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default NetworkStatsCard
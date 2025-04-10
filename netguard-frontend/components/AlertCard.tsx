"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronDown, Clock } from "lucide-react";
import type { Alert } from "../lib/api";
import type { NetworkFlow } from "../lib/api";
// import type { Flow } from "./FlowsTable";

interface AlertCardProps {
  alert: Alert & { severity?: "low" | "medium" | "high" | "critical"; flow: NetworkFlow };
}

const AlertCard = ({ alert }: AlertCardProps) => {
  const [expanded, setExpanded] = useState(false);

  // Log incoming alert for debugging
  console.log("AlertCard received alert:", alert);

  // Determine severity colors with a fallback
  const getSeverityDetails = () => {
    const severityMap = {
      low: { color: "text-green-400", border: "border-green-400", bg: "bg-green-400/10" },
      medium: { color: "text-yellow-400", border: "border-yellow-400", bg: "bg-yellow-400/10" },
      high: { color: "text-orange-400", border: "border-orange-400", bg: "bg-orange-400/10" },
      critical: { color: "text-cyber-pink", border: "border-cyber-pink", bg: "bg-cyber-pink/10" },
      undefined: { color: "text-cyber-gray", border: "border-cyber-gray", bg: "bg-cyber-darker" }, // Fallback
    };

    // Use severity if provided, otherwise infer from attack_type or default to undefined
    const severity = alert.severity || inferSeverity(alert.attack_type) || "undefined";
    return severityMap[severity] || severityMap.undefined; // Ensure fallback if severity is invalid
  };

  // Helper to infer severity from attack_type if not provided
  const inferSeverity = (attackType?: string) => {
    if (!attackType) return undefined;
    const type = attackType.toLowerCase();
    if (type.includes("ddos") || type.includes("injection")) return "critical";
    if (type.includes("brute force") || type.includes("unauthorized")) return "high";
    if (type.includes("scanning") || type.includes("suspicious")) return "medium";
    return "low";
  };

  const severityDetails = getSeverityDetails();
  const attackType = alert.attack_type || "Potential Threat"; // Fallback for missing attack_type

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
            <h3 className={`text-xl font-semibold ${severityDetails.color} font-orbitron`}>
              {attackType}
            </h3>
            <div className="flex items-center mt-1 text-sm text-cyber-gray">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(alert.timestamp).toLocaleString()}
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="text-cyber-gray hover:text-cyber-cyan transition-colors"
        >
          <ChevronDown className={`w-5 h-5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-cyber-gray"
            onClick={(e) => e.stopPropagation()}
          >
            <p>Total Bytes: {alert.flow.total_source_bytes + alert.flow.total_destination_bytes}</p>
            <p>Total Packets: {alert.flow.total_source_packets + alert.flow.total_destination_packets}</p>
            <p>Source Port: {alert.flow.source_port}</p>
            <p>Destination Port: {alert.flow.destination_port}</p>
            <p>Duration: {alert.flow.duration.toFixed(2)}s</p>
            <p>Prediction: {Number(alert.flow.prediction) === 1 ? "Attack" : "Safe"}</p>
            <p>Start Time: {new Date(alert.flow.start_datetime).toLocaleString()}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AlertCard;
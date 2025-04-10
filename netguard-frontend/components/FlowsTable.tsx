"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight, Clock, Database, Eye } from "lucide-react"
import FlowDetailsModalProps from "./FlowDetailsModal"
import type { NetworkFlow } from "../lib/api"

// Define the Flow interface
// interface Flow extends NetworkFlow {
//   // Add any additional properties or transformations if needed
// }

interface FlowsTableProps {
  flows: NetworkFlow[]
}

const FlowsTable = ({ flows }: FlowsTableProps) => {
  const mapNetworkFlowToFlow = (networkFlow: NetworkFlow) => {
    return {
      ...networkFlow,
      // Add any necessary transformations here to match the Flow interface
    }
  }
  const [selectedFlow, setSelectedFlow] = useState<NetworkFlow | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Add debugging for incoming data
  console.log("FlowsTable received flows:", flows)

  // Ensure we have valid flow objects
  const validFlows = Array.isArray(flows) ? flows.filter((flow) => flow && typeof flow === "object" && flow._id) : []

  console.log("Valid flows for table:", validFlows)

  const formatBytes = (bytes: number) => {
    if (bytes === 0 || !bytes) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleViewDetails = (flow: NetworkFlow) => {
    console.log("Viewing flow details:", flow)
    setSelectedFlow(flow)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="card-glowing overflow-hidden">
        <h2 className="text-2xl font-bold text-cyber-cyan mb-4 font-orbitron flex items-center">
          <Database className="h-6 w-6 mr-2" /> Network Flows
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-cyan/20">
                <th className="text-left py-3 px-4 text-cyber-gray font-medium">Time</th>
                <th className="text-left py-3 px-4 text-cyber-gray font-medium">Duration</th>
                <th className="text-left py-3 px-4 text-cyber-gray font-medium">App</th>
                <th className="text-left py-3 px-4 text-cyber-gray font-medium">Ports</th>
                <th className="text-left py-3 px-4 text-cyber-gray font-medium">Data Transfer</th>
                <th className="text-left py-3 px-4 text-cyber-gray font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {validFlows.map((flow, index) => (
                <motion.tr
                  key={flow._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-cyber-cyan/10 hover:bg-cyber-cyan/5"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-cyber-cyan" />
                      <span className="text-cyber-gray">{new Date(flow.start_datetime).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-cyber-gray">{flow.duration.toFixed(2)}s</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-cyber-gray">{flow.app_name || "Unknown"}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-cyber-purple">{flow.source_port}</span>
                      <span className="text-cyber-gray">→</span>
                      <span className="text-cyber-purple">{flow.destination_port}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <ArrowUpRight className="h-4 w-4 mr-1 text-cyber-cyan" />
                        <span className="text-cyber-cyan">{formatBytes(flow.total_source_bytes)}</span>
                      </div>
                      <div className="flex items-center">
                        <ArrowDownLeft className="h-4 w-4 mr-1 text-cyber-pink" />
                        <span className="text-cyber-pink">{formatBytes(flow.total_destination_bytes)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleViewDetails(flow)}
                      className="flex items-center space-x-1 text-cyber-gray hover:text-cyber-cyan transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Details</span>
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {validFlows.length === 0 && (
          <div className="text-center py-8">
        flow={selectedFlow ? <pre>{JSON.stringify(mapNetworkFlowToFlow(selectedFlow), null, 2)}</pre> : null}
          </div>
        )}
      </div>

      <FlowDetailsModalProps
        flow={selectedFlow ? mapNetworkFlowToFlow(selectedFlow) : null}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default FlowsTable

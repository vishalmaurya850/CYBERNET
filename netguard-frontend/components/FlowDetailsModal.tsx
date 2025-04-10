"use client"
import { ArrowDownLeft, ArrowUpRight, Clock, Database, Server } from "lucide-react"
import Modal from "./Modal"
import type { NetworkFlow } from "../lib/api"

interface FlowDetailsModalProps {
  flow: NetworkFlow | null
  isOpen: boolean
  onClose: () => void
}

const FlowDetailsModal = ({ flow, isOpen, onClose }: FlowDetailsModalProps) => {
  if (!flow) return null

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Network Flow Details">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-cyber-cyan/10 p-2 rounded-full mr-3">
              <Database className="h-5 w-5 text-cyber-cyan" />
            </div>
            <span className="text-cyber-gray">Flow ID</span>
          </div>
          <span className="text-cyber-cyan font-mono text-sm">{flow._id}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-cyber-darker/40 p-3 rounded-lg">
            <h4 className="text-sm text-cyber-gray/70 mb-1">Start Time</h4>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-cyber-cyan" />
              <span className="text-cyber-cyan">{new Date(flow.start_datetime).toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-cyber-darker/40 p-3 rounded-lg">
            <h4 className="text-sm text-cyber-gray/70 mb-1">End Time</h4>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-cyber-cyan" />
              <span className="text-cyber-cyan">{new Date(flow.stop_datetime).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-cyber-darker/40 p-3 rounded-lg">
          <h4 className="text-sm text-cyber-gray/70 mb-1">Application</h4>
          <div className="text-xl font-medium text-cyber-cyan">{flow.app_name || "Unknown"}</div>
        </div>

        <div className="bg-cyber-darker/40 p-3 rounded-lg">
          <h4 className="text-sm text-cyber-gray/70 mb-1">Duration</h4>
          <div className="text-xl font-medium text-cyber-cyan">{flow.duration.toFixed(2)} seconds</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-cyber-darker/40 p-3 rounded-lg">
            <h4 className="text-sm text-cyber-gray/70 mb-1">Source</h4>
            <div className="flex items-center">
              <Server className="h-4 w-4 mr-1 text-cyber-purple" />
              <span className="text-cyber-purple">
                {flow.source}:{flow.source_port}
              </span>
            </div>
          </div>

          <div className="bg-cyber-darker/40 p-3 rounded-lg">
            <h4 className="text-sm text-cyber-gray/70 mb-1">Destination</h4>
            <div className="flex items-center">
              <Server className="h-4 w-4 mr-1 text-cyber-purple" />
              <span className="text-cyber-purple">
                {flow.destination}:{flow.destination_port}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-cyber-darker/40 p-3 rounded-lg">
          <h4 className="text-sm text-cyber-gray/70 mb-1">Protocol</h4>
          <div className="text-xl font-medium text-cyber-cyan">{flow.protocol_name}</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-cyber-darker/40 p-3 rounded-lg">
            <h4 className="text-sm text-cyber-gray/70 mb-1">Source Data</h4>
            <div className="flex items-center mb-1">
              <ArrowUpRight className="h-4 w-4 mr-1 text-cyber-cyan" />
              <span className="text-cyber-cyan">{formatBytes(flow.total_source_bytes)}</span>
            </div>
            <div className="text-sm text-cyber-gray">{flow.total_source_packets} packets</div>
          </div>

          <div className="bg-cyber-darker/40 p-3 rounded-lg">
            <h4 className="text-sm text-cyber-gray/70 mb-1">Destination Data</h4>
            <div className="flex items-center mb-1">
              <ArrowDownLeft className="h-4 w-4 mr-1 text-cyber-pink" />
              <span className="text-cyber-pink">{formatBytes(flow.total_destination_bytes)}</span>
            </div>
            <div className="text-sm text-cyber-gray">{flow.total_destination_packets} packets</div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default FlowDetailsModal

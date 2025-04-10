"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { motion } from "framer-motion"
import { BarChart3, Download, RefreshCw } from "lucide-react"
import { useState } from "react"
import type { NetworkFlow } from "../lib/api"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface FlowChartProps {
  flows: NetworkFlow[]
}

const FlowChart = ({ flows }: FlowChartProps) => {
  const [chartType, setChartType] = useState<"packets" | "bytes">("packets")

  // Add debugging for incoming data
  console.log("FlowChart received flows:", flows)

  // Ensure we have valid data for the chart
  const validFlows =
    flows && Array.isArray(flows) && flows.length > 0
      ? flows.filter(
          (flow) =>
            flow &&
            typeof flow === "object" &&
            flow.start_datetime &&
            (typeof flow.total_source_packets === "number" || typeof flow.total_source_bytes === "number"),
        )
      : []

  console.log("Valid flows for chart:", validFlows)

  // Sort flows by start_datetime if needed
  const sortedFlows = [...validFlows].sort(
    (a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime(),
  )

  // Create empty chart data if no flows
  const emptyChartData = {
    labels: [],
    datasets: [
      {
        label: "Source Packets",
        data: [],
        borderColor: "#00d4ff",
        backgroundColor: "rgba(0, 212, 255, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Destination Packets",
        data: [],
        borderColor: "#9b59b6",
        backgroundColor: "rgba(155, 89, 182, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // Update the chart data to use the actual flow metrics
  const packetData =
    sortedFlows.length > 0
      ? {
          labels: sortedFlows.map((f) => new Date(f.start_datetime).toLocaleTimeString()),
          datasets: [
            {
              label: "Source Packets",
              data: sortedFlows.map((f) => f.total_source_packets || 0),
              borderColor: "#00d4ff",
              backgroundColor: "rgba(0, 212, 255, 0.2)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Destination Packets",
              data: sortedFlows.map((f) => f.total_destination_packets || 0),
              borderColor: "#9b59b6",
              backgroundColor: "rgba(155, 89, 182, 0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        }
      : emptyChartData

  const byteData =
    sortedFlows.length > 0
      ? {
          labels: sortedFlows.map((f) => new Date(f.start_datetime).toLocaleTimeString()),
          datasets: [
            {
              label: "Source Bytes",
              data: sortedFlows.map((f) => f.total_source_bytes || 0),
              borderColor: "#ff00ff",
              backgroundColor: "rgba(255, 0, 255, 0.2)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Destination Bytes",
              data: sortedFlows.map((f) => f.total_destination_bytes || 0),
              borderColor: "#00d4ff",
              backgroundColor: "rgba(0, 212, 255, 0.2)",
              fill: true,
              tension: 0.4,
            },
          ],
        }
      : emptyChartData

  console.log("Chart data prepared:", chartType === "packets" ? packetData : byteData)

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#e0e0e0",
          font: {
            family: "'Rajdhani', sans-serif",
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleFont: {
          family: "'Orbitron', sans-serif",
          size: 12,
        },
        bodyFont: {
          family: "'Rajdhani', sans-serif",
          size: 14,
        },
        borderColor: "rgba(0, 212, 255, 0.3)",
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#e0e0e0",
          font: {
            family: "'Rajdhani', sans-serif",
          },
        },
        grid: {
          color: "rgba(0, 212, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: "#e0e0e0",
          font: {
            family: "'Rajdhani', sans-serif",
          },
        },
        grid: {
          color: "rgba(0, 212, 255, 0.1)",
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 3,
        hoverRadius: 6,
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    animation: {
      duration: 1000,
    },
  }

  // Calculate average and peak values
  const calculateStats = () => {
    if (sortedFlows.length === 0) {
      return { avg: 0, peak: 0 }
    }

    if (chartType === "packets") {
      const sourcePackets = sortedFlows.map((f) => f.total_source_packets || 0)
      const destPackets = sortedFlows.map((f) => f.total_destination_packets || 0)
      const allPackets = [...sourcePackets, ...destPackets]

      const avg = Math.round(allPackets.reduce((a, b) => a + b, 0) / allPackets.length)
      const peak = Math.max(...allPackets)

      return { avg, peak }
    } else {
      const sourceBytes = sortedFlows.map((f) => f.total_source_bytes || 0)
      const destBytes = sortedFlows.map((f) => f.total_destination_bytes || 0)
      const allBytes = [...sourceBytes, ...destBytes]

      // Convert to KB/s
      const avg = Math.round((allBytes.reduce((a, b) => a + b, 0) / allBytes.length / 1024) * 10) / 10
      const peak = Math.round((Math.max(...allBytes) / 1024) * 10) / 10

      return { avg, peak }
    }
  }

  const stats = calculateStats()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card-glowing h-full relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-pattern opacity-20"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cyber-cyan font-orbitron flex items-center">
            <BarChart3 className="h-6 w-6 mr-2" />
            Network Traffic
          </h2>

          <div className="flex items-center space-x-2">
            <div className="flex bg-cyber-darker/80 rounded-lg p-1">
              <button
                onClick={() => setChartType("packets")}
                className={`px-3 py-1 text-sm rounded-md transition-all duration-300 ${
                  chartType === "packets" ? "bg-cyber-cyan/20 text-cyber-cyan" : "text-cyber-gray hover:text-cyber-cyan"
                }`}
              >
                Packets
              </button>
              <button
                onClick={() => setChartType("bytes")}
                className={`px-3 py-1 text-sm rounded-md transition-all duration-300 ${
                  chartType === "bytes" ? "bg-cyber-pink/20 text-cyber-pink" : "text-cyber-gray hover:text-cyber-pink"
                }`}
              >
                Bytes
              </button>
            </div>

            <button className="p-2 text-cyber-gray hover:text-cyber-cyan rounded-md transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>

            <button className="p-2 text-cyber-gray hover:text-cyber-cyan rounded-md transition-colors">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="h-[300px] relative">
          <Line data={chartType === "packets" ? packetData : byteData} options={options} />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-cyber-darker/40 p-3 rounded-lg">
            <p className="text-xs text-cyber-gray/70">Average Traffic</p>
            <p className="text-xl font-medium text-cyber-cyan">
              {chartType === "packets" ? `${stats.avg} pps` : `${stats.avg} KB/s`}
            </p>
          </div>
          <div className="bg-cyber-darker/40 p-3 rounded-lg">
            <p className="text-xs text-cyber-gray/70">Peak Traffic</p>
            <p className="text-xl font-medium text-cyber-pink">
              {chartType === "packets" ? `${stats.peak} pps` : `${stats.peak} KB/s`}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FlowChart
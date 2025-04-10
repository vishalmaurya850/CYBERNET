"use client"

import { useEffect, useState, useCallback } from "react"
import FlowChart from "../../components/FlowChart"
import Loader from "../../components/Loader"
import Navbar from "../../components/Navbar"
import { motion } from "framer-motion"
import { Bell, Database, Info, ShieldAlert, Clock, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import NetworkStatsCard from "../../components/NetworkStatsCard"
import { useRouter } from "next/navigation"
import api, { type NetworkFlow, type Alert, type Status } from "../../lib/api"

export default function Dashboard() {
  const [status, setStatus] = useState<Status | null>(null)
  const [flows, setFlows] = useState<NetworkFlow[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialLoad, setInitialLoad] = useState(true)
  const router = useRouter()

  // Fetch data using the centralized API utility
  const fetchData = useCallback(
    async (showLoading = false) => {
      if (showLoading) {
        setLoading(true)
      }

      try {
        // Check for token in localStorage
        const token = localStorage.getItem("token")

        if (!token) {
          console.error("No token found in localStorage")
          router.push("/login")
          return
        }

        // Use Promise.allSettled to fetch all data in parallel
        const [statusResult, flowsResult, alertsResult] = await Promise.allSettled([
          api.status.get(),
          api.flows.getAll(),
          api.alerts.getAll(),
        ])

        // Process status data
        if (statusResult.status === "fulfilled") {
          console.log("Status data received:", statusResult.value)
          setStatus(statusResult.value)
        } else {
          console.error("Status fetch failed:", statusResult.reason)
        }

        // Process flows data
        if (flowsResult.status === "fulfilled") {
          console.log("Flows data received:", flowsResult.value)
          setFlows(flowsResult.value)
        } else {
          console.error("Flows fetch failed:", flowsResult.reason)
          setFlows([])
        }

        // Process alerts data
        if (alertsResult.status === "fulfilled") {
          console.log("Alerts data received:", alertsResult.value)
          setAlerts(alertsResult.value.slice(0, 3)) // Get the 3 most recent alerts
        } else {
          console.error("Alerts fetch failed:", alertsResult.reason)
          setAlerts([])
        }

        // Clear error if at least one request succeeded
        if (
          statusResult.status === "fulfilled" ||
          flowsResult.status === "fulfilled" ||
          alertsResult.status === "fulfilled"
        ) {
          setError(null)
        }
      } catch (err) {
        console.error("Fetch Data Error:", err)

        if (showLoading) {
          setError("Failed to fetch data from the server. Please check your connection and try again.")
        }
      } finally {
        if (showLoading) {
          setLoading(false)
          setInitialLoad(false)
        }
      }
    },
    [router],
  )

  // Update the useEffect to include fetchData in the dependency array
  useEffect(() => {
    // Initial load with loading indicator
    fetchData(true)

    // Set up interval for refreshing data without loading indicator
    const interval = setInterval(() => {
      fetchData(false)
    }, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [fetchData])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  // Format bytes helper function
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <>
      <Navbar />
      <div className="pt-16">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="container py-8">
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold cyber-gradient font-orbitron mb-3">NetGuard Dashboard</h1>
            <p className="text-cyber-gray max-w-2xl mx-auto">
              Real-time network security monitoring and threat detection
            </p>
          </motion.div>

          {loading && initialLoad ? (
            <Loader text="Loading network data..." />
          ) : error && initialLoad ? (
            <div className="bg-cyber-pink/10 border border-cyber-pink rounded-lg p-4 text-center my-8">
              <ShieldAlert className="h-8 w-8 text-cyber-pink mx-auto mb-2" />
              <p className="text-cyber-pink">{error}</p>
              <button
                onClick={() => fetchData(true)}
                className="mt-3 bg-cyber-darker hover:bg-cyber-pink/20 text-cyber-pink py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <motion.div variants={itemVariants} className="">
                  <NetworkStatsCard
                    flowsCount={status?.recent_flows_count || 0}
                    alertsCount={status?.recent_alerts_count || 0}
                    lastUpdated={status?.last_updated || new Date().toISOString()}
                  />
                </motion.div>

                <motion.div variants={itemVariants} className="md:col-span-2">
                  <FlowChart flows={flows} />
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-cyber-cyan font-orbitron flex items-center">
                    <Bell className="h-6 w-6 mr-2" />
                    Recent Alerts
                  </h2>
                  <Link
                    href="/alerts"
                    className="text-cyber-gray hover:text-cyber-cyan transition-colors flex items-center"
                  >
                    View All <span className="ml-1">→</span>
                  </Link>
                </div>

                <div className="space-y-4">
                  {alerts && alerts.length > 0 ? (
                    alerts.map((alert, index) => (
                      <motion.div
                        key={alert._id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link href="/alerts">
                          <div className="card border-l-4 border-cyber-pink flex items-center justify-between hover:bg-cyber-cyan/5">
                            <div>
                              <h3 className="text-lg font-medium text-cyber-pink">{alert.attack_type}</h3>
                              <p className="text-sm text-cyber-gray">{new Date(alert.timestamp).toLocaleString()}</p>
                            </div>
                            <div className="bg-cyber-pink/10 p-2 rounded-full">
                              <ShieldAlert className="h-5 w-5 text-cyber-pink" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    <div className="card border border-dashed border-cyber-gray/30 bg-transparent flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="bg-cyber-cyan/10 p-3 rounded-full inline-block mb-3">
                          <Info className="h-6 w-6 text-cyber-cyan" />
                        </div>
                        <p className="text-cyber-gray">No alerts detected. Your network appears secure.</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-cyber-cyan font-orbitron flex items-center">
                    <Database className="h-6 w-6 mr-2" />
                    Recent Flows
                  </h2>
                  <Link
                    href="/flows"
                    className="text-cyber-gray hover:text-cyber-cyan transition-colors flex items-center"
                  >
                    View All <span className="ml-1">→</span>
                  </Link>
                </div>

                <div className="card-glowing overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-cyber-cyan/20">
                          <th className="text-left py-3 px-4 text-cyber-gray font-medium">Time</th>
                          <th className="text-left py-3 px-4 text-cyber-gray font-medium">Duration</th>
                          <th className="text-left py-3 px-4 text-cyber-gray font-medium">Ports</th>
                          <th className="text-left py-3 px-4 text-cyber-gray font-medium">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {flows && flows.length > 0 ? (
                          flows.slice(0, 5).map((flow, index) => (
                            <motion.tr
                              key={flow._id || index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-b border-cyber-cyan/10 hover:bg-cyber-cyan/5"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-cyber-cyan" />
                                  <span className="text-cyber-gray">
                                    {flow.start_datetime ? new Date(flow.start_datetime).toLocaleTimeString() : "N/A"}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-cyber-gray">
                                  {typeof flow.duration === "number" ? flow.duration.toFixed(2) : "0.00"}s
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-1">
                                  <span className="text-cyber-purple">{flow.source_port || "N/A"}</span>
                                  <span className="text-cyber-gray">→</span>
                                  <span className="text-cyber-purple">{flow.destination_port || "N/A"}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center">
                                    <ArrowUpRight className="h-4 w-4 mr-1 text-cyber-cyan" />
                                    <span className="text-cyber-cyan">{formatBytes(flow.total_source_bytes)}</span>
                                  </div>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center py-8">
                              <p className="text-cyber-gray">No network flows detected yet.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-glowing">
                  <h3 className="text-lg font-semibold text-cyber-cyan mb-3">Protected Devices</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-cyber-darker/50 rounded-lg">
                      <span className="text-cyber-gray">Main Router</span>
                      <span className="text-xs bg-cyber-cyan/20 text-cyber-cyan px-2 py-0.5 rounded">Online</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-cyber-darker/50 rounded-lg">
                      <span className="text-cyber-gray">Workstation #1</span>
                      <span className="text-xs bg-cyber-cyan/20 text-cyber-cyan px-2 py-0.5 rounded">Online</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-cyber-darker/50 rounded-lg">
                      <span className="text-cyber-gray">Server Rack</span>
                      <span className="text-xs bg-cyber-cyan/20 text-cyber-cyan px-2 py-0.5 rounded">Online</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-cyber-darker/50 rounded-lg">
                      <span className="text-cyber-gray">Cloud VM</span>
                      <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded">Warning</span>
                    </div>
                  </div>
                </div>

                <div className="card-glowing">
                  <h3 className="text-lg font-semibold text-cyber-cyan mb-3">System Health</h3>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <div className="h-16 w-16 rounded-full bg-cyber-cyan flex items-center justify-center text-lg font-bold">
                        <span className="text-cyber-dark">A+</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-cyber-gray">Security Score</div>
                        <div className="text-cyber-cyan text-lg font-medium">95/100</div>
                      </div>
                    </div>
                    <div className="bg-cyber-darker/50 p-3 rounded-lg text-sm text-cyber-gray">
                      <p>Last scan completed: {new Date().toLocaleString()}</p>
                      <div className="mt-2">
                        <button className="text-cyber-cyan text-xs hover:underline">Run System Scan →</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-glowing">
                  <h3 className="text-lg font-semibold text-cyber-cyan mb-3">API Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-cyber-gray">Connection</span>
                      <span className="text-xs bg-cyber-cyan/20 text-cyber-cyan px-2 py-0.5 rounded">Active</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="bg-cyber-cyan h-full w-[85%]"></div>
                    </div>
                    <p className="text-xs text-cyber-gray">API Response Time: 120ms</p>
                    <div className="pt-2 mt-2 border-t border-cyber-cyan/20">
                      <button
                        onClick={() => fetchData(true)}
                        className="w-full py-2 text-sm bg-cyber-darker hover:bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded-lg transition-colors"
                      >
                        Refresh Data
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </>
  )
}
"use client"

import { useEffect, useState, useCallback } from "react"
import AlertCard from "../../components/AlertCard"
import Loader from "../../components/Loader"
import Navbar from "../../components/Navbar"
import { motion } from "framer-motion"
import { AlertTriangle, Filter, RefreshCw, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import api from "../../lib/api"

// Update the interface to match the actual API response
interface Alert {
  _id: string
  attack_type: string
  timestamp: string
  flow: string
  severity?: "low" | "medium" | "high" | "critical" // Make severity optional as it might not be in the API
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [error, setError] = useState<string | null>(null)
  const [initialLoad, setInitialLoad] = useState(true)
  const router = useRouter()

  // Replace the fetchAlerts function with a useCallback version
  const fetchAlerts = useCallback(
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

        // Fetch alerts data
        console.log("Fetching alerts data...")
        const alertsData = await api.alerts.getAll()
        console.log("Alerts data received:", alertsData)

        // Determine severity based on attack type if not provided by API
        const alertsWithSeverity = alertsData.map((alert: Alert) => {
          if (!alert.severity) {
            // Assign severity based on attack type if not provided
            const attackType = alert.attack_type.toLowerCase()
            let severity: "low" | "medium" | "high" | "critical" = "medium"

            if (attackType.includes("ddos") || attackType.includes("injection")) {
              severity = "critical"
            } else if (attackType.includes("brute force") || attackType.includes("unauthorized")) {
              severity = "high"
            } else if (attackType.includes("scanning") || attackType.includes("suspicious")) {
              severity = "medium"
            } else {
              severity = "low"
            }

            return { ...alert, severity }
          }
          return alert
        })

        console.log("Processed alerts with severity:", alertsWithSeverity)
        setAlerts(alertsWithSeverity)
        setError(null)
      } catch (err) {
        console.error("Fetch Alerts Error:", err)

        if (showLoading) {
          setError("Failed to fetch alerts from the server. Please check your connection and try again.")
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

  // Update the useEffect to include fetchAlerts in the dependency array
  useEffect(() => {
    // Initial load with loading indicator
    fetchAlerts(true)

    // Set up interval for refreshing data without loading indicator
    const interval = setInterval(() => {
      fetchAlerts(false)
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchAlerts])

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.attack_type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === "all" || alert.severity === filter
    return matchesSearch && matchesFilter
  })

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

  return (
    <>
      <Navbar />
      <div className="pt-16">
        {" "}
        {/* Add padding top to account for fixed navbar */}
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="container py-8">
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold cyber-gradient font-orbitron mb-3">Security Alerts</h1>
            <p className="text-cyber-gray max-w-2xl mx-auto">
              Monitor and respond to security threats detected on your network
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <div className="card-glowing p-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-7 relative">
                  <div className="absolute inset-y-0 left-0 pt-2 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-cyber-gray" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-cyber-darker border border-cyber-cyan/20 rounded-lg text-white focus:border-cyber-cyan focus:ring focus:ring-cyber-cyan/20 focus:outline-none placeholder:text-cyber-gray/50"
                  />
                </div>

                <div className="md:col-span-3">
                  <div className="flex items-center bg-cyber-darker border border-cyber-cyan/20 rounded-lg pl-3">
                    <Filter className="h-4 w-4 text-cyber-gray" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-full bg-cyber-darker border-0 py-2 pl-2 pr-4 text-white focus:ring-0 focus:outline-none rounded-r-lg"
                    >
                      <option value="all">All Severities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <button
                    onClick={() => fetchAlerts(true)}
                    className="flex items-center justify-center space-x-2 w-full py-2 bg-cyber-darker hover:bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 rounded-lg transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {loading && initialLoad ? (
            <Loader text="Loading alerts..." />
          ) : (
            <motion.div variants={itemVariants} className="space-y-6">
              {filteredAlerts && filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert, index) => <AlertCard key={alert._id || index} alert={alert} />)
              ) : (
                <div className="card border border-dashed border-cyber-gray/30 bg-transparent p-10 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-cyber-darker flex items-center justify-center mb-4">
                    <AlertTriangle className="h-8 w-8 text-cyber-gray" />
                  </div>
                  <h3 className="text-xl font-semibold text-cyber-gray mb-2">No Alerts Found</h3>
                  <p className="text-cyber-gray/70">
                    {searchTerm || filter !== "all"
                      ? "No alerts match your current filters. Try adjusting your search criteria."
                      : error
                        ? error
                        : "Your network is secure. No security alerts have been detected."}
                  </p>
                  {(searchTerm || filter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("")
                        setFilter("all")
                      }}
                      className="mt-4 text-cyber-cyan hover:underline"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  )
}
"use client"

import { useEffect, useState, useCallback } from "react"
import Navbar from "../../components/Navbar"
import Loader from "../../components/Loader"
import FlowsTable from "../../components/FlowsTable"
import { motion } from "framer-motion"
import { RefreshCw, ShieldAlert } from 'lucide-react'
import { useRouter } from "next/navigation"
  // Update the flows page to use the centralized API utility
import api from "../../lib/api"

interface Flow {
  _id: string
  start_datetime: string
  stop_datetime: string
  duration: number
  source_port: number
  destination_port: number
  total_source_bytes: number
  total_destination_bytes: number
  total_source_packets: number
  total_destination_packets: number
  [key: string]: unknown
}

export default function Flows() {
  const [flows, setFlows] = useState<Flow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialLoad, setInitialLoad] = useState(true)
  const router = useRouter()

  // Replace the fetchFlows function with a useCallback version
  const fetchFlows = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }
    
    try {
      // Check for token in localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found in localStorage');
        router.push('/login');
        return;
      }
      
      // Fetch flows data
      console.log('Fetching flows data...');
      const flowsData = await api.flows.getAll();
      console.log('Flows data received:', flowsData);
      
      // Ensure we have valid flow objects with required properties
      const validFlows = Array.isArray(flowsData) ? flowsData.filter(flow => 
        flow && typeof flow === 'object' && flow._id
      ) : [];
      
      console.log('Valid flows after filtering:', validFlows);
      setFlows(validFlows);
      setError(null);
    } catch (err) {
      console.error('Fetch Flows Error:', err);
      
      if (showLoading) {
        setError('Failed to fetch flows from the server. Please check your connection and try again.');
      }
    } finally {
      if (showLoading) {
        setLoading(false);
        setInitialLoad(false);
      }
    }
  }, [router]);

  // Update the useEffect to include fetchFlows in the dependency array
  useEffect(() => {
    fetchFlows(true)

    const interval = setInterval(() => {
      fetchFlows(false)
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchFlows])

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
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="container py-8">
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold cyber-gradient font-orbitron mb-3">Network Flows</h1>
            <p className="text-cyber-gray max-w-2xl mx-auto">
              Monitor and analyze network traffic patterns in real-time
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6 flex justify-end">
            <button
              onClick={() => fetchFlows(true)}
              className="flex items-center space-x-2 py-2 px-4 bg-cyber-darker hover:bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Flows</span>
            </button>
          </motion.div>

          {loading && initialLoad ? (
            <Loader text="Loading network flows..." />
          ) : error && initialLoad ? (
            <div className="bg-cyber-pink/10 border border-cyber-pink rounded-lg p-4 text-center my-8">
              <ShieldAlert className="h-8 w-8 text-cyber-pink mx-auto mb-2" />
              <p className="text-cyber-pink">{error}</p>
              <button
                onClick={() => fetchFlows(true)}
                className="mt-3 bg-cyber-darker hover:bg-cyber-pink/20 text-cyber-pink py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <motion.div variants={itemVariants}>
              <FlowsTable flows={flows} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  )
}
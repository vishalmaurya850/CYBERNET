"use client"

import { useEffect, useState } from "react"
import ConfigPanel from "../../components/ConfigPanel"
import Navbar from "../../components/Navbar"
import { motion } from "framer-motion"
import Loader from "../../components/Loader"

export default function Config() {
  const [apiKey, setApiKey] = useState<string>("Not Available")
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchApiKey = async () => {
      setLoading(true)
      try {
        // In a real app, you would fetch this from your API
        // For now, use localStorage or generate a mock key
        const storedApiKey = localStorage.getItem("apiKey")

        if (storedApiKey) {
          setApiKey(storedApiKey)
        } else {
          // Generate a mock API key for demo purposes
          const mockApiKey = "NGR-API-" + Math.random().toString(36).substring(2, 15).toUpperCase()
          setApiKey(mockApiKey)

          // Store it for future use
          localStorage.setItem("apiKey", mockApiKey)
        }
      } catch (error) {
        console.error("Failed to fetch API key:", error)
        // Fallback to a demo key
        setApiKey("NGR-API-DEMO-KEY")
      } finally {
        setLoading(false)
      }
    }

    // Simulate loading time
    const timer = setTimeout(() => {
      fetchApiKey()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

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
            <h1 className="text-4xl md:text-5xl font-bold cyber-gradient font-orbitron mb-3">System Configuration</h1>
            <p className="text-cyber-gray max-w-2xl mx-auto">Configure your network security settings and API access</p>
          </motion.div>

          {loading ? (
            <Loader text="Loading configuration..." />
          ) : (
            <motion.div variants={itemVariants}>
              <ConfigPanel apiKey={apiKey} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  )
}


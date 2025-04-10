"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Copy, Lock, Network, Server, Settings } from "lucide-react"
import toast from "react-hot-toast"
import api from "../lib/api"

interface ConfigPanelProps {
  apiKey: string
}

const ConfigPanel = ({ apiKey }: ConfigPanelProps) => {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("api")
  const [loading, setLoading] = useState(false)
  interface ConfigData {
    // Define the structure of your configuration data here
    status: string;
    [key: string]: string | number | boolean | null | undefined; // Adjust based on your data structure
  }

  const [, setConfigData] = useState<ConfigData | null>(null)
  const apiKeyRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchConfigData = async () => {
      setLoading(true)
      try {
        const data = await api.status.get()
        setConfigData(data)
      } catch (error) {
        console.error("Failed to fetch config data:", error)
        toast.error("Failed to load configuration data")
      } finally {
        setLoading(false)
      }
    }

    fetchConfigData()
  }, [])

  const copyToClipboard = () => {
    if (apiKeyRef.current) {
      navigator.clipboard.writeText(apiKey)
      setCopied(true)
      toast.success("API Key copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const tabs = [
    { id: "api", label: "API Keys", icon: <Key className="w-5 h-5" /> },
    { id: "network", label: "Network", icon: <Network className="w-5 h-5" /> },
    { id: "security", label: "Security", icon: <Lock className="w-5 h-5" /> },
    { id: "advanced", label: "Advanced", icon: <Settings className="w-5 h-5" /> },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card-glowing max-w-4xl w-full mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-cyber-cyan font-orbitron flex items-center">
          <Settings className="w-6 h-6 mr-2" /> System Configuration
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-1 mb-6 border-b border-cyber-cyan/20 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-all duration-300 ${
              activeTab === tab.id
                ? "text-cyber-cyan bg-cyber-cyan/10 border-b-2 border-cyber-cyan"
                : "text-cyber-gray hover:text-cyber-cyan hover:bg-cyber-cyan/5"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-cyan"></div>
        </div>
      ) : (
        <>
          {/* API Keys Tab */}
          {activeTab === "api" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-medium text-cyber-purple mb-2">API Configuration</h3>
                  <p className="text-cyber-gray mb-4">
                    Use these credentials to connect your device to the NetGuard monitoring system.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-cyber-gray mb-1">Server Endpoint</label>
                      <div className="flex items-center bg-cyber-darker rounded-lg border border-cyber-cyan/20 p-1">
                        <div className="bg-cyber-cyan/10 p-2 rounded-l-md">
                          <Server className="w-5 h-5 text-cyber-cyan" />
                        </div>
                        <input
                          type="text"
                          value="http://127.0.0.1:8000/api"
                          readOnly
                          className="flex-1 bg-transparent border-0 focus:ring-0 text-white px-3 py-2"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText("http://127.0.0.1:8000/api")
                            toast.success("Server endpoint copied!")
                          }}
                          className="p-2 text-cyber-gray hover:text-cyber-cyan"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-cyber-gray mb-1">Your API Key</label>
                      <div className="flex items-center bg-cyber-darker rounded-lg border border-cyber-cyan/20 p-1">
                        <div className="bg-cyber-cyan/10 p-2 rounded-l-md">
                          <Key className="w-5 h-5 text-cyber-cyan" />
                        </div>
                        <input
                          ref={apiKeyRef}
                          type="text"
                          value={apiKey}
                          readOnly
                          className="flex-1 bg-transparent border-0 focus:ring-0 text-white px-3 py-2 font-mono"
                        />
                        <button onClick={copyToClipboard} className="p-2 text-cyber-gray hover:text-cyber-cyan">
                          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-cyber-darker/40 p-4 rounded-lg border border-cyber-cyan/20">
                    <h4 className="text-cyber-cyan font-medium mb-2 flex items-center">
                      <RefreshCwIcon className="w-4 h-4 mr-1" /> API Rate Limits
                    </h4>
                    <p className="text-sm text-cyber-gray">1000 requests per hour</p>
                    <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="bg-cyber-cyan h-full w-[30%]"></div>
                    </div>
                    <p className="text-xs text-cyber-gray mt-1">Current usage: 300/1000 requests</p>
                  </div>

                  <div className="bg-cyber-darker/40 p-4 rounded-lg border border-cyber-cyan/20">
                    <h4 className="text-cyber-cyan font-medium mb-2 flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" /> API Key Expiration
                    </h4>
                    <p className="text-sm text-cyber-gray">
                      Valid until: <span className="text-cyber-purple">Jan 1, 2025</span>
                    </p>
                    <button className="mt-2 text-xs bg-cyber-darker hover:bg-cyber-cyan/20 text-cyber-cyan py-1 px-2 rounded transition-colors">
                      Renew Key
                    </button>
                  </div>
                </div>

                <div className="bg-cyber-pink/10 border border-cyber-pink/30 rounded-lg p-4">
                  <h4 className="text-cyber-pink font-medium mb-2">Security Notice</h4>
                  <p className="text-sm text-cyber-gray">
                    Keep your API key secure. If compromised, generate a new key immediately by clicking &quot;Reset API
                    Key&quot;.
                  </p>
                  <div className="mt-3">
                    <button className="bg-cyber-darker hover:bg-cyber-pink/20 text-cyber-pink text-sm py-1.5 px-4 rounded transition-colors">
                      Reset API Key
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Network Tab */}
          {activeTab === "network" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-medium text-cyber-purple mb-2">Network Configuration</h3>
                  <p className="text-cyber-gray mb-4">Configure your network monitoring settings.</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-cyber-gray mb-1">Packet Capture Rate</label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        defaultValue="75"
                        className="w-full h-2 bg-cyber-darker rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
                      />
                      <div className="flex justify-between text-xs text-cyber-gray mt-1">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-cyber-gray mb-1">Sample Rate</label>
                        <select className="w-full bg-cyber-darker border border-cyber-cyan/20 rounded-lg p-2 text-white focus:border-cyber-cyan focus:ring-cyber-cyan/20">
                          <option>1:1 (All packets)</option>
                          <option>1:10 (10% of packets)</option>
                          <option>1:100 (1% of packets)</option>
                          <option>Custom...</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-cyber-gray mb-1">Protocol Filter</label>
                        <select className="w-full bg-cyber-darker border border-cyber-cyan/20 rounded-lg p-2 text-white focus:border-cyber-cyan focus:ring-cyber-cyan/20">
                          <option>All Protocols</option>
                          <option>TCP Only</option>
                          <option>UDP Only</option>
                          <option>Custom...</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        id="active-monitoring"
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 text-cyber-cyan focus:ring-cyber-cyan/30"
                      />
                      <label htmlFor="active-monitoring" className="text-sm text-cyber-gray">
                        Enable active monitoring
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button className="bg-cyber-darker hover:bg-cyber-gray/10 text-cyber-gray py-2 px-4 rounded transition-colors">
                    Cancel
                  </button>
                  <button className="cyber-button py-2">Save Changes</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other tabs would be similarly implemented */}
          {(activeTab === "security" || activeTab === "advanced") && (
            <div className="flex items-center justify-center h-64">
              <p className="text-cyber-gray text-center">This section is under development. Check back soon!</p>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}

// Missing icons components
interface IconProps {
  className?: string
}

const Key = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
  </svg>
)

const CalendarIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
)

const RefreshCwIcon = ({ className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M23 4v6h-6"></path>
    <path d="M1 20v-6h6"></path>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
)

export default ConfigPanel
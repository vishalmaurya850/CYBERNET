"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { auth } from "../lib/firebase"
import { signOut } from "firebase/auth"
import { motion } from "framer-motion"
import { useState } from "react"
import { Bell, Cog, Home, LogOut, Menu, Shield, X, Database } from "lucide-react"

const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("token")
      localStorage.removeItem("apiKey")
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Alerts", path: "/alerts", icon: <Bell className="h-5 w-5" /> },
    { name: "Flows", path: "/flows", icon: <Database className="h-5 w-5" /> },
    { name: "Config", path: "/config", icon: <Cog className="h-5 w-5" /> },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="sticky top-0 w-full bg-cyber-dark/90 backdrop-blur-md shadow-lg z-20 border-b border-cyber-cyan/20"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-cyber-cyan" />
            <span className="text-2xl font-bold cyber-gradient font-orbitron">CYBERNET</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-1 transition-all duration-300 ${
                  pathname === item.path ? "text-cyber-cyan font-medium" : "text-cyber-gray hover:text-cyber-cyan"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
                {pathname === item.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 h-0.5 w-10 bg-cyber-cyan"
                    // style={{ bottom: "-16px" }}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </Link>
            ))}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="cyber-button flex items-center space-x-1 py-2"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-cyber-gray hover:text-cyber-cyan focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-cyber-dark border-t border-cyber-cyan/20"
        >
          <div className="container mx-auto px-4 py-3 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-2 p-2 rounded-lg ${
                  pathname === item.path
                    ? "bg-cyber-cyan/10 text-cyber-cyan"
                    : "text-cyber-gray hover:bg-cyber-cyan/5 hover:text-cyber-cyan"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 w-full p-2 text-cyber-gray hover:bg-cyber-cyan/5 hover:text-cyber-pink rounded-lg"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Navbar


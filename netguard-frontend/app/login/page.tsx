"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { auth } from "../../lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react"

interface FirebaseError extends Error {
  code?: string
  response?: {
    status?: number
    data?: unknown
  }
}

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  // Development mode login bypass
  const handleDevLogin = () => {
    if (process.env.NODE_ENV === "development") {
      // Store a mock token
      const mockToken = "dev-mock-token-123"
      localStorage.setItem("token", mockToken)
      console.log("Development mode: Mock token saved to localStorage:", mockToken)
      toast.success("Logged in with development bypass!")
      router.push("/dashboard")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseToken = await userCredential.user.getIdToken()

      // Save token to localStorage
      localStorage.setItem("token", firebaseToken)
      console.log("Firebase token saved to localStorage")

      toast.success("Logged in successfully!")
      router.push("/dashboard")
    } catch (err: unknown) {
      const firebaseError = err as FirebaseError
      console.error("Login Error:", {
        message: firebaseError.message,
        status: firebaseError.response?.status,
        data: firebaseError.response?.data,
      })

      // User-friendly error messages
      if (firebaseError.code === "auth/user-not-found" || firebaseError.code === "auth/wrong-password") {
        setError("Invalid email or password. Please try again.")
      } else if (firebaseError.code === "auth/too-many-requests") {
        setError("Too many unsuccessful login attempts. Please try again later.")
      } else {
        setError(firebaseError.message || "Login failed. Please try again later.")
      }

      toast.error("Login failed")

      // For development purposes, create a fallback token if login fails
      if (process.env.NODE_ENV === "development") {
        const fallbackToken = "fallback-dev-token-123"
        localStorage.setItem("token", fallbackToken)
        console.log("Development fallback: Token saved to localStorage:", fallbackToken)
      }
    } finally {
      setLoading(false)
    }
  }

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyber-darker to-black z-0">
      <div className="absolute inset-0 grid-pattern opacity-10 z-0">

      {/* Animated Circles */}
      <motion.div
        initial={{ scale: 0.8, x: "10%", y: "20%", opacity: 0.3 }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        className="fixed w-96 h-96 rounded-full bg-cyber-cyan/20 blur-3xl z-0"
      />

      <motion.div
        initial={{ scale: 0.8, x: "-20%", y: "-10%", opacity: 0.3 }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        className="fixed w-96 h-96 rounded-full bg-cyber-purple/20 blur-3xl z-0"
      />

      {/* Logo and Title at the top */}
      <div className="relative z-10 pt-10 pb-6 text-center">
        <div className="flex items-center justify-center mb-4">
        <Shield className="h-10 w-20 text-cyber-cyan mx-auto" />
        </div>
        <h1 className="text-4xl font-bold cyber-gradient font-orbitron">CYBERNET</h1>
        <p className="text-white mt-2 text-lg">Advanced Network Security Platform</p>
      </div>

      {/* Login Form as a popup */}
      <div className="flex justify-center items-center px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="card-glowing max-w-md w-full relative z-10 p-8 bg-cyber-dark/90 backdrop-blur-lg shadow-2xl"
          style={{ maxWidth: "400px" }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl font-bold text-center cyber-gradient font-orbitron mb-2"
          >
            Login
          </motion.h2>

          <motion.p variants={itemVariants} className="text-center text-white mb-8">
            Access your secure network monitoring dashboard
          </motion.p>

          <form onSubmit={handleSubmit}>
            <motion.div variants={itemVariants} className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-cyber-cyan">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-cyber-darker border border-cyber-cyan/20 rounded-lg text-white focus:border-cyber-cyan focus:ring focus:ring-cyber-cyan/20 focus:outline-none placeholder:text-cyber-gray/50"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-cyber-cyan">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-cyber-darker border border-cyber-cyan/20 rounded-lg text-white focus:border-cyber-cyan focus:ring focus:ring-cyber-cyan/20 focus:outline-none placeholder:text-cyber-gray/50"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 text-cyber-cyan"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-cyber-pink/10 border border-cyber-pink/30 rounded-lg text-cyber-pink text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="mb-6">
              <button type="submit" disabled={loading} className="cyber-button w-full flex items-center justify-center">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-t-cyber-cyan border-r-cyber-cyan border-b-transparent border-l-transparent rounded-full"
                    />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
            </motion.div>
          </form>

          {/* <motion.div variants={itemVariants} className="mt-4 pt-4 border-t border-cyber-cyan/20">
            <button
              onClick={handleDevLogin}
              className="w-full py-2 px-4 bg-cyber-darker hover:bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded-lg transition-colors text-sm"
            >
              Development Mode: Skip Login
            </button>
            <p className="text-xs text-cyber-gray/60 mt-2">
              This button bypasses authentication and creates a development token.
            </p>
          </motion.div> */}

          <motion.p variants={itemVariants} className="text-center text-white mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-cyber-cyan hover:underline transition-colors">
              Register
            </Link>
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-6 pt-4 border-t border-cyber-cyan/20 text-center text-xs text-cyber-gray/60"
          >
            Protected by BONSOI System&apos;s Security &copy; {new Date().getFullYear()}
          </motion.div>
        </motion.div>
      </div>

      {/* Back to Home Link */}
      <div className="fixed bottom-8 left-8 z-10">
        <Link href="/" className="text-cyber-gray hover:text-cyber-cyan transition-colors flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
    </div>
    </div>
  )
}
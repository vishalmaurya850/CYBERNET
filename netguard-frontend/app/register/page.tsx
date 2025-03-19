"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { auth } from "../../lib/firebase"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, Shield, User } from "lucide-react"

interface FirebaseError extends Error {
  code?: string
}

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setLoading(true)

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile if username provided
      if (username && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: username })
      }

      toast.success("Registered successfully!")
      router.push("/dashboard")
    } catch (err: unknown) {
      const firebaseError = err as FirebaseError
      console.error("Register Error:", {
        message: firebaseError.message,
        code: firebaseError.code,
      })

      // User-friendly error messages
      if (firebaseError.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please use a different email or try logging in.")
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("Please enter a valid email address.")
      } else if (firebaseError.code === "auth/weak-password") {
        setError("Please choose a stronger password.")
      } else {
        setError(firebaseError.message || "Registration failed. Please try again later.")
      }

      toast.error("Registration failed")
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
        initial={{ scale: 0.8, x: "-20%", y: "10%", opacity: 0.3 }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        className="fixed w-96 h-96 rounded-full bg-cyber-purple/20 blur-3xl z-0"
      />

      <motion.div
        initial={{ scale: 0.8, x: "20%", y: "-10%", opacity: 0.3 }}
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        className="fixed w-96 h-96 rounded-full bg-cyber-pink/20 blur-3xl z-0"
      />

      {/* Logo and Title at the top */}
      <div className="relative z-10 pt-10 pb-6 text-center">
        <div className="flex items-center justify-center mb-4">
        <Shield className="h-10 w-20 text-cyber-cyan mx-auto" />
        </div>
        <h1 className="text-4xl font-bold cyber-gradient font-orbitron">CYBERNET</h1>
        <p className="text-white mt-2 text-lg">Advanced Network Security Platform</p>
      </div>

      {/* Register Form as a popup */}
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
            Create Account
          </motion.h2>

          <motion.p variants={itemVariants} className="text-center text-white mb-8">
            Join CYBERNET to protect your network from security threats
          </motion.p>

          <form onSubmit={handleSubmit}>
            <motion.div variants={itemVariants} className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
                Username (optional)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-cyber-cyan">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-cyber-darker border border-cyber-cyan/20 rounded-lg text-white focus:border-cyber-cyan focus:ring focus:ring-cyber-cyan/20 focus:outline-none placeholder:text-cyber-gray/50"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email <span className="text-cyber-pink">*</span>
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
                Password <span className="text-cyber-pink">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-cyber-cyan">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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
              <p className="mt-1 text-xs text-cyber-gray">Password must be at least 6 characters long</p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">
                Confirm Password <span className="text-cyber-pink">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-cyber-cyan">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-cyber-darker border border-cyber-cyan/20 rounded-lg text-white focus:border-cyber-cyan focus:ring focus:ring-cyber-cyan/20 focus:outline-none placeholder:text-cyber-gray/50"
                  required
                />
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
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Register"
                )}
              </button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="text-center text-white">
            Already have an account?{" "}
            <Link href="/login" className="text-cyber-cyan hover:underline transition-colors">
              Login
            </Link>
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-6 pt-4 border-t border-cyber-cyan/20 text-center text-xs text-cyber-gray/60"
          >
            By creating an account, you agree to BONSOI System&apos;s Terms of Service and Privacy Policy
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
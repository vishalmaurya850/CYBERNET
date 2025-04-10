"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Globe,
  Lock,
  MessageSquare,
  Shield,
  ShieldAlert,
  Zap,
} from "lucide-react"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("monthly")

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
    <div className="min-h-screen bg-cyber-darker w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 grid-pattern opacity-10"></div>
        <motion.div
          initial={{ scale: 0.8, x: "10%", y: "20%", opacity: 0.3 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          className="absolute w-96 h-96 rounded-full bg-cyber-cyan/20 blur-3xl -z-10"
        />
        <motion.div
          initial={{ scale: 0.8, x: "-20%", y: "-10%", opacity: 0.3 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
          className="absolute w-96 h-96 rounded-full bg-cyber-purple/20 blur-3xl -z-10"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-6 inline-block">
              <Shield className="h-10 w-20 text-cyber-cyan mx-auto" />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold font-orbitron mb-6 cyber-gradient"
            >
              CYBERNET
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-cyber-gray mb-8">
              Advanced network security monitoring for the modern digital landscape. Protect your infrastructure from
              threats in real-time.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cyber-button flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Get Started <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>

              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-cyber-darker border border-cyber-cyan/30 text-cyber-cyan px-6 py-3 rounded-lg transition-all duration-300 hover:bg-cyber-cyan/10 w-full sm:w-auto"
                >
                  Login
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <p className="text-cyber-gray mb-2 text-sm">Scroll to explore</p>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
            <ChevronDown className="h-6 w-6 text-cyber-cyan" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-cyber-dark relative w-full">
        <div className="absolute inset-0 grid-pattern opacity-10"></div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-orbitron mb-4 cyber-gradient">Powerful Features</h2>
            <p className="text-xl text-cyber-gray max-w-2xl mx-auto">
              CYBERNET provides comprehensive security tools to protect your network infrastructure
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldAlert className="h-10 w-10 text-cyber-cyan" />,
                title: "Real-time Threat Detection",
                description:
                  "Identify and respond to security threats as they happen with advanced AI-powered monitoring.",
              },
              {
                icon: <Zap className="h-10 w-10 text-cyber-purple" />,
                title: "Network Flow Analysis",
                description:
                  "Visualize and analyze network traffic patterns to identify anomalies and potential security breaches.",
              },
              {
                icon: <Lock className="h-10 w-10 text-cyber-pink" />,
                title: "Secure Authentication",
                description:
                  "Multi-factor authentication and role-based access control to protect your security dashboard.",
              },
              {
                icon: <Globe className="h-10 w-10 text-cyber-cyan" />,
                title: "Global Threat Intelligence",
                description: "Stay protected with continuously updated threat intelligence from around the world.",
              },
              {
                icon: <MessageSquare className="h-10 w-10 text-cyber-purple" />,
                title: "Instant Alerts",
                description: "Receive notifications via email, SMS, or push when security incidents are detected.",
              },
              {
                icon: <Shield className="h-10 w-10 text-cyber-pink" />,
                title: "Compliance Reporting",
                description: "Generate detailed security reports to meet regulatory compliance requirements.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-glowing hover:translate-y-[-5px]"
              >
                <div className="bg-cyber-darker/50 p-4 rounded-full inline-block mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-cyber-cyan mb-3 font-orbitron">{feature.title}</h3>
                <p className="text-cyber-gray">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 relative w-full">
        <div className="absolute inset-0 grid-pattern opacity-10"></div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-orbitron mb-4 cyber-gradient">Pricing Plans</h2>
            <p className="text-xl text-cyber-gray max-w-2xl mx-auto">Choose the perfect plan for your security needs</p>

            <div className="flex justify-center mt-8">
              <div className="bg-cyber-darker p-1 rounded-lg inline-flex">
                <button
                  onClick={() => setActiveTab("monthly")}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeTab === "monthly"
                      ? "bg-cyber-cyan/20 text-cyber-cyan"
                      : "text-cyber-gray hover:text-cyber-cyan"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setActiveTab("yearly")}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeTab === "yearly"
                      ? "bg-cyber-cyan/20 text-cyber-cyan"
                      : "text-cyber-gray hover:text-cyber-cyan"
                  }`}
                >
                  Yearly <span className="text-xs text-cyber-pink">Save 20%</span>
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Basic",
                price: activeTab === "monthly" ? "$29" : "$279",
                period: activeTab === "monthly" ? "/month" : "/year",
                description: "Essential security for small networks",
                features: [
                  "Up to 5 devices",
                  "Basic threat detection",
                  "Email alerts",
                  "7-day history",
                  "Standard support",
                ],
                cta: "Get Started",
                highlighted: false,
              },
              {
                name: "Professional",
                price: activeTab === "monthly" ? "$79" : "$759",
                period: activeTab === "monthly" ? "/month" : "/year",
                description: "Advanced protection for growing networks",
                features: [
                  "Up to 20 devices",
                  "Advanced threat detection",
                  "Real-time alerts",
                  "30-day history",
                  "Priority support",
                  "Compliance reporting",
                ],
                cta: "Get Started",
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: activeTab === "monthly" ? "$199" : "$1,899",
                period: activeTab === "monthly" ? "/month" : "/year",
                description: "Complete security for large organizations",
                features: [
                  "Unlimited devices",
                  "AI-powered threat detection",
                  "Custom alert channels",
                  "1-year history",
                  "24/7 dedicated support",
                  "Advanced compliance reporting",
                  "Custom integrations",
                ],
                cta: "Contact Sales",
                highlighted: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`card-glowing relative ${
                  plan.highlighted ? "border-cyber-cyan border-2 shadow-[0_0_20px_rgba(0,212,255,0.3)]" : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cyber-cyan text-cyber-darker px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold font-orbitron mb-2 text-cyber-cyan">{plan.name}</h3>
                <p className="text-cyber-gray mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-cyber-gray">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-cyber-cyan mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-cyber-gray">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                    plan.highlighted
                      ? "cyber-button"
                      : "bg-cyber-darker border border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-cyber-dark relative w-full">
        <div className="absolute inset-0 grid-pattern opacity-10"></div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "24/7", label: "Monitoring" },
              { value: "10M+", label: "Threats Blocked" },
              { value: "5,000+", label: "Customers" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold cyber-gradient font-orbitron mb-2">{stat.value}</div>
                <p className="text-cyber-gray text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative w-full">
        <div className="absolute inset-0 grid-pattern opacity-10"></div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card-glowing max-w-4xl mx-auto text-center p-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-orbitron mb-6 cyber-gradient">
              Ready to secure your network?
            </h2>
            <p className="text-xl text-cyber-gray mb-8 max-w-2xl mx-auto">
              Join thousands of organizations that trust CYBERNET for their security needs. Get started today with a
              14-day free trial.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cyber-button flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Start Free Trial <ArrowRight className="h-5 w-5" />
                </motion.button>
              </Link>

              <button className="bg-cyber-darker border border-cyber-cyan/30 text-cyber-cyan px-6 py-3 rounded-lg transition-all duration-300 hover:bg-cyber-cyan/10 w-full sm:w-auto">
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cyber-darker py-12 border-t border-cyber-cyan/20 w-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-cyber-cyan mr-2" />
                <span className="text-2xl font-bold cyber-gradient font-orbitron">CYBERNET</span>
              </div>
              <p className="text-cyber-gray mb-4">
                Advanced network security monitoring for the modern digital landscape.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                    Enterprise
                  </a>
                </li>
                <li>
                  <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                    Case Studies
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                    Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="text-cyber-gray hover:text-cyber-cyan transition-colors">
                    Legal
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-cyber-cyan/10 pt-8 mt-8 text-center text-cyber-gray text-sm w-full">
            <p>&copy; {new Date().getFullYear()} CYBERNET Security. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


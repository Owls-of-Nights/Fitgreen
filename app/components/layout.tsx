"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import LoginModal from "./login-modal"
import type React from "react" // Added import for React

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          backgroundColor: `rgba(255, 255, 255, ${Math.min(scrollY / 100, 0.9)})`,
        }}
        className="fixed w-full z-10 dark:bg-gray-900/80 backdrop-blur-sm transition-colors duration-300"
      >
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text"
          >
            FitGreen
          </Link>
          <div className="hidden md:flex space-x-4">
            <NavLink href="/fitness">Fitness</NavLink>
            <NavLink href="/sustainability">Sustainability</NavLink>
            <NavLink href="/challenges">Challenges</NavLink>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Button variant="ghost" size="icon" onClick={() => router.push("/profile")}>
                  <User className="h-5 w-5" />
                  <span className="sr-only">User profile</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setIsLoginModalOpen(true)}>
                Login
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              <motion.div initial={false} animate={{ rotate: isDarkMode ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.div>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white dark:bg-gray-900 py-2"
            >
              <NavLink href="/fitness" mobile>
                Fitness
              </NavLink>
              <NavLink href="/sustainability" mobile>
                Sustainability
              </NavLink>
              <NavLink href="/challenges" mobile>
                Challenges
              </NavLink>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      <main className="pt-16">{children}</main>
      <Footer />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  )
}

function NavLink({ href, children, mobile = false }: { href: string; children: React.ReactNode; mobile?: boolean }) {
  return (
    <Link
      href={href}
      className={`${
        mobile ? "block px-4 py-2" : ""
      } text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200`}
    >
      <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        {children}
      </motion.span>
    </Link>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8">
      <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          © 2025 FitGreen. All rights reserved.
        </motion.div>
      </div>
    </footer>
  )
}


"use client"
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearUser } from '@/features/userSlice';
import { RootState } from '@/lib/store';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter()

  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  const dispatch = useDispatch()

  const toggleTheme = () => {
    // Add transition class to document
    document.documentElement.classList.add('theme-transition')

    setTheme(theme === "dark" ? "light" : "dark")

    // Remove transition class after animation
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition')
    }, 300)
  }

  const handleSignOut = async () => {
  try {
    await signOut({ redirect: false });
    dispatch(clearUser());
    localStorage.removeItem("currentUser")
    router.push("/signin");
  } catch (err) {
    console.error("Failed to sign out", err);
  }
}

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, []);


  if (!mounted) {
    return (
      <h1>Wait a second</h1>
    )
  }



  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          <Link href="/">BlabberPost</Link>
        </h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/explore" className="hover:underline">Explore</Link>
          <Link href="/blog" className="hover:underline">My Blogs</Link>
          <Link href="/write" className="hover:underline">Write</Link>

          {/* Authenticated */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={currentUser.avatarUrl ?? ""} alt={currentUser.username ?? "User"} />
                  <AvatarFallback>{currentUser.username?.[0]}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm">
              <Link href="/signin">Sign In</Link>
            </Button>
          )}

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative overflow-hidden">
            <div className="relative w-5 h-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme === "dark" ? "moon" : "sun"}
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card p-4 space-y-4"
        >
          <Button variant="ghost" className="w-full justify-start">Explore</Button>
          <Button variant="ghost" className="w-full justify-start">My Blogs</Button>
          <Button variant="ghost" className="w-full justify-start">Write</Button>

          {currentUser ? (
            <>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button variant="outline" className="w-full" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
          )}
        </motion.div>
      )}
    </nav>
  )
}

"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Moon, Send, Sun, Twitter } from "lucide-react"
import { Link } from "react-router-dom"

export function Footer() {
  const [isDarkMode, setIsDarkMode] = React.useState(true)

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <footer className="relative border-t border-white/10 bg-black/50 text-white backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Stay Updated</h2>
            <p className="mb-6 text-white/70">
              Subscribe for the latest movies, shows, and exclusive content.
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-white text-black transition-transform hover:scale-105 hover:bg-white/90"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <Link to="/" className="block transition-colors hover:text-white text-white/70">
                Home
              </Link>
              <Link to="/search" className="block transition-colors hover:text-white text-white/70">
                Search
              </Link>
              <Link to="/faq" className="block transition-colors hover:text-white text-white/70">
                FAQ
              </Link>
              <a href="#" className="block transition-colors hover:text-white text-white/70">
                Support
              </a>
              <a href="#" className="block transition-colors hover:text-white text-white/70">
                Contact
              </a>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Studios</h3>
            <nav className="space-y-2 text-sm">
              <Link to="/studio/marvel" className="block transition-colors hover:text-white text-white/70">
                Marvel
              </Link>
              <Link to="/studio/dc" className="block transition-colors hover:text-white text-white/70">
                DC
              </Link>
              <Link to="/studio/star-wars" className="block transition-colors hover:text-white text-white/70">
                Star Wars
              </Link>
              <Link to="/studio/pixar" className="block transition-colors hover:text-white text-white/70">
                Pixar
              </Link>
              <Link to="/studio/universal" className="block transition-colors hover:text-white text-white/70">
                Universal
              </Link>
            </nav>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Moon className="h-4 w-4" />
              <Label htmlFor="dark-mode" className="sr-only">
                Toggle dark mode
              </Label>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center md:flex-row">
          <p className="text-sm text-white/70">
            © 2024 Movie Site. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="transition-colors hover:text-white text-white/70">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-white text-white/70">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-white text-white/70">
              Cookie Settings
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image'

export function TopBar() {
  return (
      <header className="sticky top-0 z-50 w-full border-b bg-brand-yellow/95 backdrop-blur supports-[backdrop-filter]:bg-brand-yellow/90 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="https://tiendasdaka.com/img/logoF.webp" alt="logo" className="h-13 w-20"/>
          </div>

          {/* Search Bar */}
          <div className="flex flex-1 items-center justify-center px-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-brand-blue/70" />
              <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 w-full bg-white/90 border-brand-blue/20 text-brand-blue placeholder:text-brand-blue/60 focus:ring-brand-blue focus:border-brand-blue"
              />
            </div>
          </div>

          {/* Action Button */}
          <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white border-0">Get Started</Button>
        </div>
        <div>

        </div>
      </header>
  )
}

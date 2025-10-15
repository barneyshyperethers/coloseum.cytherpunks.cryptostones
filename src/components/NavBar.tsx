import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = ["Home", "Market", "Data Feeds", "About"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0B0C10]/80 border-b border-[rgba(0,224,255,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl tracking-wider uppercase bg-gradient-to-r from-[#0038FF] to-[#00E0FF] bg-clip-text text-transparent">
              CryptoBlueBlocks
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="text-[#E8E9ED] hover:text-[#00E0FF] transition-colors duration-300 relative group"
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0038FF] to-[#00E0FF] group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0038FF] to-[#00E0FF] text-white hover:shadow-[0_0_20px_rgba(0,224,255,0.5)] transition-all duration-300 hover:scale-105">
              Explore Market
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#00E0FF]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-[rgba(0,224,255,0.15)] bg-[#0B0C10]/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(" ", "-")}`}
                  className="block py-2 text-[#E8E9ED] hover:text-[#00E0FF] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link}
                </a>
              ))}
              <button className="w-full mt-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0038FF] to-[#00E0FF] text-white">
                Explore Market
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

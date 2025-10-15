import { Github, FileText, Code, MessageCircle } from "lucide-react";

export function Footer() {
  const links = [
    { name: "Docs", icon: FileText, href: "#docs" },
    { name: "GitHub", icon: Github, href: "#github" },
    { name: "API", icon: Code, href: "#api" },
    { name: "Support", icon: MessageCircle, href: "#support" },
  ];

  return (
    <footer className="relative mt-20 border-t border-[rgba(0,224,255,0.15)] bg-[#0B0C10]/80 backdrop-blur-xl">
      {/* Glow effect on border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E0FF]/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="text-center md:text-left">
            <h2 className="text-xl tracking-wider uppercase bg-gradient-to-r from-[#0038FF] to-[#00E0FF] bg-clip-text text-transparent mb-2">
              CryptoBlueBlocks
            </h2>
            <p className="text-sm text-[#8B8D98]">
              Decentralized data marketplace
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className="group flex items-center gap-2 text-[#8B8D98] hover:text-[#00E0FF] transition-colors duration-300"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{link.name}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00E0FF] group-hover:w-full transition-all duration-300"></span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[rgba(0,224,255,0.1)] text-center">
          <p className="text-sm text-[#8B8D98]">
            © 2025 CryptoBlueBlocks. All rights reserved.
          </p>
        </div>
      </div>

      {/* Decorative glow elements */}
      <div className="absolute bottom-0 left-10 w-32 h-32 rounded-full bg-[#0038FF]/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-32 h-32 rounded-full bg-[#00E0FF]/10 blur-3xl pointer-events-none"></div>
    </footer>
  );
}

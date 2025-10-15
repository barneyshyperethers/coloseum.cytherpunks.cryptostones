import { Home, TrendingUp, Bot, User } from "lucide-react";
import { useState } from "react";

export function MobileNav() {
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "feeds", icon: TrendingUp, label: "Feeds" },
    { id: "agents", icon: Bot, label: "Agents" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0C10]/95 backdrop-blur-xl border-t border-[rgba(0,224,255,0.15)]">
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00E0FF]/30 to-transparent"></div>

      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-br from-[#0038FF]/20 to-[#00E0FF]/20 text-[#00E0FF]"
                  : "text-[#8B8D98]"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-all duration-300 ${
                  isActive ? "scale-110" : ""
                }`}
              />
              <span className="text-xs">{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-8 h-1 rounded-full bg-gradient-to-r from-[#0038FF] to-[#00E0FF]"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

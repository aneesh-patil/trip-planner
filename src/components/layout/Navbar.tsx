import { Link, useLocation } from "react-router-dom";
import { Compass, Bookmark, Map, Settings } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: "Explore", path: "/", icon: Compass },
    { name: "Destinations", path: "/destinations", icon: Map },
    { name: "Compare", path: "/compare", icon: Settings },
    { name: "Bucket List", path: "/favorites", icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="text-emerald-600 dark:text-emerald-400">Japan</span>
          <span className="text-slate-800 dark:text-slate-200">Weekend Planner</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-emerald-600 ${
                  isActive ? "text-emerald-600" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

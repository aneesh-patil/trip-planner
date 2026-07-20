import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";
import {
  Compass,
  Bookmark,
  Map,
  Settings,
  MapPinned,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/shared/hooks/useAuth";
import { AuthModal } from "@/shared/components/auth/AuthModal";


export default function Navbar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "Explore", path: "/", icon: Compass },
    { name: "Destinations", path: "/destinations", icon: Map },
    { name: "Full Map", path: "/map", icon: MapPinned },
    { name: "Compare", path: "/compare", icon: Settings },
    { name: "Bucket List", path: "/favorites", icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
          onClick={() => setMenuOpen(false)}
        >
          <span className="text-emerald-600 dark:text-emerald-400">Japan</span>
          <span className="text-slate-800 dark:text-slate-200">
            Weekend Planner
          </span>
        </Link>
        <div className="flex items-center gap-6">
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

          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
                  {(user.email?.[0] ?? (user.user_metadata?.full_name as string)?.[0] ?? "U").toUpperCase()}
                </div>
                <button
                  onClick={() => signOut?.()}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => setAuthOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Sign In
              </Button>
            )}
          </div>
          <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

          {/* Hamburger button — mobile only */}
          <button
            className="md:hidden p-2 text-slate-700 dark:text-slate-300 ml-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 z-40 bg-background/95 backdrop-blur-md border-b shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5" /> {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

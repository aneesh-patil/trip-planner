import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Compass,
  Bookmark,
  Map,
  Settings,
  Menu,
  X,
  LogIn,
  CheckSquare,
  User,
  Sliders,
  LogOut,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/shared/hooks/useAuth";
import { AuthModal } from "@/shared/components/auth/AuthModal";
import { ProfileModal } from "@/shared/components/profile/ProfileModal";
import { PreferencesModal } from "@/shared/components/profile/PreferencesModal";

export default function Navbar() {
  const location = useLocation();
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      const isSet = Boolean(user.user_metadata?.preferences?.preferences_set);
      if (!isSet) {
        setPreferencesOpen(true);
      }
    }
  }, [user, loading]);

  const navItems = [
    { name: "Explore", path: "/", icon: Compass },
    { name: "Destinations", path: "/destinations", icon: Map },
    { name: "Prefectures", path: "/visited-map", icon: CheckSquare },
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
          <span className="text-emerald-600 dark:text-emerald-400">Tabi</span>
          <span className="text-slate-800 dark:text-slate-200">Map</span>
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
            {loading ? (
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center justify-center p-0.5 rounded-full hover:ring-2 hover:ring-emerald-400/50 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="User menu"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {(
                      user.email?.[0] ??
                      (user.user_metadata?.full_name as string)?.[0] ??
                      "U"
                    ).toUpperCase()}
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-400 font-medium">
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {user.email ??
                          (user.user_metadata?.full_name as string) ??
                          "User"}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setProfileOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        Edit Profile
                      </button>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setPreferencesOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
                      >
                        <Sliders className="w-4 h-4 text-slate-500" />
                        Set Preferences
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut?.();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                onClick={() => setAuthOpen(true)}
                className="group bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 px-6"
              >
                <LogIn className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Sign In
              </Button>
            )}
          </div>
          <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
          <ProfileModal
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
          />
          <PreferencesModal
            isOpen={preferencesOpen}
            onClose={() => setPreferencesOpen(false)}
          />

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
        <div className="md:hidden fixed inset-x-0 top-16 z-40 bg-background/95 backdrop-blur-md border-b shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
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

            <div className="my-2 border-t border-slate-200 dark:border-slate-800" />

            {loading ? (
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin self-center my-4" />
            ) : user ? (
              <div className="flex flex-col gap-1">
                <div className="px-4 py-2 mb-1">
                  <p className="text-xs text-slate-400 font-medium">
                    Signed in as
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {user.email ??
                      (user.user_metadata?.full_name as string) ??
                      "User"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setProfileOpen(true);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <User className="w-5 h-5 text-slate-500" /> Edit Profile
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setPreferencesOpen(true);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <Sliders className="w-5 h-5 text-slate-500" /> Set Preferences
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut?.();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
                >
                  <LogOut className="w-5 h-5 text-red-500" /> Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setAuthOpen(true);
                }}
                className="flex items-center justify-center gap-2 mt-2 w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl py-3 font-bold shadow-md transition-all duration-300"
              >
                <LogIn className="w-5 h-5" /> Sign In
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

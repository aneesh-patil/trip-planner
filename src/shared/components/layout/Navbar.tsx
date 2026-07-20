import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import {
  Compass,
  Bookmark,
  Map,
  Settings,
  Share2,
  Check,
  MapPinned,
  Menu,
  X,
} from "lucide-react";
import { useTripStore } from "@/shared/hooks/useTripStore";
import { Button } from "@/shared/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useClerk,
} from "@clerk/clerk-react";

// Wrapper that only renders auth UI when ClerkProvider is present
function ClerkAuthButtons() {
  try {
    // useClerk throws if there is no ClerkProvider in the tree
    useClerk();
    return (
      <div className="hidden sm:block">
        <SignedOut>
          <SignInButton mode="modal">
            <Button
              variant="default"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    );
  } catch {
    return null;
  }
}


export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { exportData, importData } = useTripStore();
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const syncData = searchParams.get("sync");
    if (syncData) {
      const success = importData(syncData);
      if (success) {
        alert("Data successfully synced from link!");
        navigate(location.pathname, { replace: true });
      } else {
        alert("Failed to sync data. The link might be invalid.");
      }
    }
  }, [searchParams, importData, navigate, location.pathname]);

  const handleShare = () => {
    const dataStr = exportData();
    const url = new URL(window.location.href);
    url.searchParams.set("sync", dataStr);

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

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

          {/* Share Button for Syncing */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="hidden sm:flex border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
          >
            {copied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Share2 className="w-4 h-4 mr-2" />
            )}
            {copied ? "Copied Link!" : "Sync Devices"}
          </Button>

          <ClerkAuthButtons />

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

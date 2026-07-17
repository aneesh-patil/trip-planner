import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { Compass, Bookmark, Map, Settings, Share2, Check, MapPinned } from "lucide-react";
import { useTripStore } from "@/hooks/useTripStore";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { exportData, importData } = useTripStore();
  const [copied, setCopied] = useState(false);

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
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <span className="text-emerald-600 dark:text-emerald-400">Japan</span>
          <span className="text-slate-800 dark:text-slate-200">Weekend Planner</span>
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
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
            {copied ? "Copied Link!" : "Sync Devices"}
          </Button>
        </div>
      </div>
    </header>
  );
}

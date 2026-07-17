import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import destinationsData from "@/data/destinations.json";
import japanTopoJson from "@/data/japan.json";
import type { Destination } from "@/types/destination";

// TopoJSON for Japan (prefectures)
const geoUrl = japanTopoJson;

// We'll map the `nam` property (e.g., 'Tokyo To', 'Kanagawa Ken', 'Kyoto Fu') to our Regions
const prefectureToRegion: Record<string, string> = {
  "Tokyo To": "Kanto",
  "Kanagawa Ken": "Kanto",
  "Chiba Ken": "Kanto",
  "Saitama Ken": "Kanto",
  "Tochigi Ken": "Kanto",
  "Ibaraki Ken": "Kanto",
  "Gunma Ken": "Kanto",
  "Shizuoka Ken": "Chubu",
  "Nagano Ken": "Chubu",
  "Yamanashi Ken": "Chubu",
  "Aichi Ken": "Chubu",
  "Gifu Ken": "Chubu",
  "Niigata Ken": "Chubu",
  "Toyama Ken": "Chubu",
  "Ishikawa Ken": "Chubu",
  "Fukui Ken": "Chubu",
  "Kyoto Fu": "Kansai",
  "Osaka Fu": "Kansai",
  "Hyogo Ken": "Kansai",
  "Nara Ken": "Kansai",
  "Shiga Ken": "Kansai",
  "Wakayama Ken": "Kansai",
  "Mie Ken": "Kansai",
  "Hokkaido": "Hokkaido",
  // Note: we can expand this, but this covers our destinations.
};

const prefHiragana: Record<string, string> = {
  "Tokyo To": "とうきょう",
  "Kanagawa Ken": "かながわ",
  "Chiba Ken": "ちば",
  "Saitama Ken": "さいたま",
  "Tochigi Ken": "とちぎ",
  "Ibaraki Ken": "いばらき",
  "Gunma Ken": "ぐんま",
  "Shizuoka Ken": "しずおか",
  "Nagano Ken": "ながの",
  "Yamanashi Ken": "やまなし",
  "Aichi Ken": "あいち",
  "Gifu Ken": "ぎふ",
  "Niigata Ken": "にいがた",
  "Toyama Ken": "とやま",
  "Ishikawa Ken": "いしかわ",
  "Fukui Ken": "ふくい",
  "Kyoto Fu": "きょうと",
  "Osaka Fu": "おおさか",
  "Hyogo Ken": "ひょうご",
  "Nara Ken": "なら",
  "Shiga Ken": "しが",
  "Wakayama Ken": "わかやま",
  "Mie Ken": "みえ",
  "Hokkaido": "ほっかいどう",
  "Aomori Ken": "あおもり",
  "Iwate Ken": "いわて",
  "Miyagi Ken": "みやぎ",
  "Akita Ken": "あきた",
  "Yamagata Ken": "やまがた",
  "Fukushima Ken": "ふくしま",
  "Tottori Ken": "とっとり",
  "Shimane Ken": "しまね",
  "Okayama Ken": "おかやま",
  "Hiroshima Ken": "ひろしま",
  "Yamaguchi Ken": "やまぐち",
  "Tokushima Ken": "とくしま",
  "Kagawa Ken": "かがわ",
  "Ehime Ken": "えひめ",
  "Kochi Ken": "こうち",
  "Fukuoka Ken": "ふくおか",
  "Saga Ken": "さが",
  "Nagasaki Ken": "ながさき",
  "Kumamoto Ken": "くまもと",
  "Oita Ken": "おおいた",
  "Miyazaki Ken": "みやざき",
  "Kagoshima Ken": "かごしま",
  "Okinawa Ken": "おきなわ"
};

const regionColors: Record<string, { base: string; hover: string; marker: string }> = {
  "Kanto": { base: "#a7f3d0", hover: "#34d399", marker: "#059669" },      // Emerald
  "Chubu": { base: "#bfdbfe", hover: "#60a5fa", marker: "#2563eb" },      // Blue
  "Kansai": { base: "#ddd6fe", hover: "#a78bfa", marker: "#7c3aed" },     // Purple
  "Tohoku": { base: "#fde68a", hover: "#fbbf24", marker: "#d97706" },     // Amber
  "Hokkaido": { base: "#bae6fd", hover: "#38bdf8", marker: "#0284c7" },   // Sky
  "Kyushu": { base: "#ffedd5", hover: "#fb923c", marker: "#ea580c" },     // Orange
  "Default": { base: "#f1f5f9", hover: "#cbd5e1", marker: "#64748b" }     // Slate
};

export default function JapanMap() {
  const allDestinations = destinationsData as Destination[];
  const [activeRegion, setActiveRegion] = useState<string>("All");
  const [hoveredPrefecture, setHoveredPrefecture] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const regions = ["All", ...Array.from(new Set(allDestinations.map((d) => d.region)))];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-background">
      {/* Header & Controls */}
      <div className="border-b border-slate-200 dark:border-slate-800 p-4 shadow-sm z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-emerald-600" />
            Graphical Explorer
          </h1>
          <p className="text-sm text-slate-500 mt-1">Interactive vector map. Hover over regions to explore.</p>
        </div>

        {/* Legend / Filters */}
        <div className="flex flex-wrap gap-2">
          {regions.map((region) => {
            const isActive = activeRegion === region;
            const colorObj = regionColors[region] || regionColors.Default;
            
            return (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                  isActive 
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-md" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
                }`}
              >
                {region !== "All" && (
                  <span 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: colorObj.marker }}
                  />
                )}
                {region}
              </button>
            );
          })}
        </div>
      </div>

      <div 
        className="flex flex-grow overflow-hidden relative"
        onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
      >
        {/* Hover Tooltip for Prefectures */}
        {hoveredPrefecture && (
          <div 
            className="fixed z-50 pointer-events-none bg-slate-900/90 dark:bg-white/95 backdrop-blur-sm text-white dark:text-slate-900 px-3 py-2 rounded-lg shadow-xl text-center transform -translate-x-1/2 -translate-y-full mb-4 animate-in fade-in zoom-in-95 duration-150"
            style={{ 
              left: tooltipPos.x, 
              top: tooltipPos.y - 15,
              transition: 'left 50ms linear, top 50ms linear'
            }}
          >
            <div className="font-bold text-sm tracking-wide">{hoveredPrefecture.replace(" Ken", "").replace(" Fu", "").replace(" To", "")}</div>
            <div className="text-emerald-400 dark:text-emerald-600 font-medium text-xs mt-0.5">{prefHiragana[hoveredPrefecture] || hoveredPrefecture}</div>
          </div>
        )}

        {/* Left Side: Selected Destination Card */}
        {selectedDestination && (
          <div className="absolute top-4 left-4 z-20 w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden transition-all animate-in slide-in-from-left-8">
            <div className="relative h-40">
              <img src={selectedDestination.heroImage} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedDestination(null)} className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70">✕</button>
              <Badge className="absolute bottom-2 left-2 shadow-sm" style={{ backgroundColor: regionColors[selectedDestination.region]?.marker || '#000' }}>
                {selectedDestination.region}
              </Badge>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-xl mb-1 text-slate-900 dark:text-white">{selectedDestination.name}</h3>
              <div className="text-sm font-medium text-emerald-600 mb-3">★ {selectedDestination.ratings.overall}/10 • {selectedDestination.prefecture}</div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 line-clamp-3">{selectedDestination.description}</p>
              <Link to={`/destinations/${selectedDestination.id}`}>
                <Button className="w-full font-bold">View Full Guide</Button>
              </Link>
            </div>
          </div>
        )}

        {/* The Map */}
        <div className="w-full h-full bg-[#f8fafc] dark:bg-[#0f172a]">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: [137.0, 38.0], // Center of Japan
              scale: 1800, // Zoomed out a bit to fit Hokkaido and Kyushu
            }}
            width={800}
            height={800}
            style={{ width: "100%", height: "100%" }}
            className="w-full h-full outline-none"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => {
                  const prefName = geo.properties.nam; // e.g. "Tokyo To"
                  const regionName = prefectureToRegion[prefName] || "Default";
                  const colorObj = regionColors[regionName] || regionColors.Default;
                  
                  // Dim the region if we are filtering and it doesn't match
                  const isFilteredOut = activeRegion !== "All" && activeRegion !== regionName;
                  const isHovered = hoveredPrefecture === prefName;
                  
                  let fill = colorObj.base;
                  if (isFilteredOut) fill = "#e2e8f0"; // slate-200
                  else if (isHovered) fill = colorObj.hover;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHoveredPrefecture(prefName)}
                      onMouseLeave={() => setHoveredPrefecture(null)}
                      style={{
                        default: { fill, stroke: "#ffffff", strokeWidth: 0.5, outline: "none", transition: "all 250ms" },
                        hover: { fill: colorObj.hover, stroke: "#ffffff", strokeWidth: 1, outline: "none", cursor: "pointer", transition: "all 250ms" },
                        pressed: { fill: colorObj.marker, outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Plot Destinations */}
            {allDestinations.filter(d => d.coordinates).map((dest) => {
              if (activeRegion !== "All" && dest.region !== activeRegion) return null;
              
              const { lat, lng } = dest.coordinates!;
              const isSelected = selectedDestination?.id === dest.id;
              const colorObj = regionColors[dest.region] || regionColors.Default;

              return (
                <Marker 
                  key={dest.id} 
                  coordinates={[lng, lat]} 
                  onClick={() => setSelectedDestination(dest)}
                >
                  <g 
                    className="cursor-pointer transition-transform hover:scale-125 duration-300" 
                    style={{ transformOrigin: "center" }}
                    onClick={(e) => { e.stopPropagation(); setSelectedDestination(dest); }}
                  >
                    <circle 
                      cx="0" cy="0" r={isSelected ? 10 : 7} 
                      fill={colorObj.marker} stroke="#fff" strokeWidth={isSelected ? 3 : 2} 
                      className="shadow-2xl hover:brightness-110 cursor-pointer" 
                      onClick={(e) => { e.stopPropagation(); setSelectedDestination(dest); }}
                      onMouseEnter={(e) => { e.currentTarget.style.cursor = "pointer"; }}
                    />
                    {isSelected && (
                      <circle cx="0" cy="0" r="16" fill="none" stroke={colorObj.marker} strokeWidth="2" className="animate-ping opacity-50" />
                    )}
                  </g>
                </Marker>
              );
            })}
          </ComposableMap>
        </div>
      </div>
    </div>
  );
}

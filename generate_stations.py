import urllib.request
import json
import os
import pykakasi

kakasi = pykakasi.kakasi()
kakasi.setMode('J', 'a') # Japanese to ascii
kakasi.setMode('H', 'a') # Hiragana to ascii
kakasi.setMode('K', 'a') # Katakana to ascii
conv = kakasi.getConverter()

PREFECTURES = [
    "Hokkaido", "Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima",
    "Ibaraki", "Tochigi", "Gunma", "Saitama", "Chiba", "Tokyo", "Kanagawa",
    "Niigata", "Toyama", "Ishikawa", "Fukui", "Yamanashi", "Nagano", "Gifu",
    "Shizuoka", "Aichi", "Mie", "Shiga", "Kyoto", "Osaka", "Hyogo", "Nara",
    "Wakayama", "Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi",
    "Tokushima", "Kagawa", "Ehime", "Kochi", "Fukuoka", "Saga", "Nagasaki",
    "Kumamoto", "Oita", "Miyazaki", "Kagoshima", "Okinawa"
]

url = "https://raw.githubusercontent.com/adieuadieu/japan-train-data/master/data/raw-data.json"
req = urllib.request.urlopen(url)
data = json.loads(req.read())

stations_by_pref = {}

for i, pref_data in enumerate(data):
    pref_name = PREFECTURES[i]
    stations = set()
    
    if "lines" in pref_data:
        for line in pref_data["lines"]:
            if "stations" in line:
                for st in line["stations"]:
                    name_ja = st.get("name", {}).get("ja", "")
                    if name_ja:
                        romaji = conv.do(name_ja).title()
                        if not romaji.endswith(" Station") and not romaji.endswith(" station"):
                            romaji += " Station"
                        display = f"{romaji} ({name_ja}駅)"
                        stations.add(display)
                        
    stations_by_pref[pref_name] = sorted(list(stations))

os.makedirs("public/data", exist_ok=True)
with open("public/data/stations-by-prefecture.json", "w", encoding="utf-8") as f:
    json.dump(stations_by_pref, f, ensure_ascii=False)

print(f"Saved {len(stations_by_pref)} prefectures.")

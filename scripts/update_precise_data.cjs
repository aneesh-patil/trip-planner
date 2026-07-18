const fs = require('fs');

const dataMap = {
  "hakone-onsen": {
    heroImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop",
    itineraries: [
      {
        name: "Plan A: The Classic Hakone Loop",
        description: "Experience all modes of transport and the best views of Mt. Fuji.",
        steps: [
          { time: "09:00", activity: "Arrive at Hakone-Yumoto and take the scenic Tozan Mountain Railway to Gora." },
          { time: "10:30", activity: "Transfer to the Hakone Ropeway at Sounzan. Enjoy views over the volcanic Owakudani valley." },
          { time: "11:30", activity: "Eat black eggs (Kuro-tamago) boiled in the hot springs at Owakudani." },
          { time: "13:00", activity: "Take the Pirate Ship cruise across Lake Ashi to Motohakone." },
          { time: "15:00", activity: "Walk the old Cedar Avenue and visit Hakone Shrine." }
        ]
      },
      {
        name: "Plan B: Art & Relaxation",
        description: "A laid-back day focusing on world-class museums and high-end hot springs.",
        steps: [
          { time: "10:00", activity: "Explore the Hakone Open-Air Museum, featuring Picasso and massive outdoor sculptures." },
          { time: "12:30", activity: "Lunch at a traditional soba restaurant in Gora." },
          { time: "14:00", activity: "Visit the Pola Museum of Art, nestled deep in the forest." },
          { time: "16:30", activity: "Enjoy a premium day-use Onsen (hot spring) with mountain views." },
          { time: "18:30", activity: "Dinner in Hakone-Yumoto before heading back to Yokohama." }
        ]
      }
    ]
  },
  "kamakura-history": {
    heroImage: "https://images.unsplash.com/photo-1542880941-185412fb10d3?q=80&w=1000&auto=format&fit=crop",
    itineraries: [
      {
        name: "Plan A: Samurai Heritage Tour",
        description: "The classic Kamakura route focusing on the most famous shrines and the Great Buddha.",
        steps: [
          { time: "09:30", activity: "Arrive at Kamakura Station and walk up the iconic Wakamiya Oji approach." },
          { time: "10:00", activity: "Visit Tsurugaoka Hachimangu, the most important Shinto shrine in Kamakura." },
          { time: "11:30", activity: "Street food and souvenir shopping along Komachi-dori street." },
          { time: "13:30", activity: "Take the Enoden train to Hase Station. Visit the giant bronze Great Buddha." },
          { time: "15:00", activity: "Explore Hase-dera temple and its beautiful hillside gardens and ocean views." }
        ]
      },
      {
        name: "Plan B: Bamboo Groves & Ocean Breezes",
        description: "Avoid the main crowds by exploring eastern Kamakura and the nearby island of Enoshima.",
        steps: [
          { time: "10:00", activity: "Take a bus to Hokoku-ji Temple. Enjoy matcha tea in the serene bamboo grove." },
          { time: "12:00", activity: "Lunch at a quiet local cafe in the Jomyoji area." },
          { time: "14:00", activity: "Ride the Enoden train all the way to Enoshima." },
          { time: "15:30", activity: "Walk across the bridge to Enoshima Island and explore the shrine and caves." },
          { time: "18:00", activity: "Watch the sunset over Mt. Fuji from the Enoshima Sea Candle." }
        ]
      }
    ]
  },
  "kawagoe-edo": {
    heroImage: "https://images.unsplash.com/photo-1627918451151-5eeab45f65bc?q=80&w=1000&auto=format&fit=crop",
    itineraries: [
      {
        name: "Plan A: Little Edo Walk",
        description: "Experience the historic warehouse district and famous candy alley.",
        steps: [
          { time: "10:30", activity: "Arrive at Kawagoe Station and take the retro loop bus." },
          { time: "11:00", activity: "Stroll the Kurazukuri Zone (Warehouse District) and photograph the Toki no Kane (Time Bell Tower)." },
          { time: "12:30", activity: "Enjoy local sweet potato treats and traditional eel (unagi) for lunch." },
          { time: "14:00", activity: "Explore Kashiya Yokocho (Candy Alley) for retro Japanese sweets." },
          { time: "16:00", activity: "Visit Kitain Temple, featuring the only remaining buildings of the original Edo Castle." }
        ]
      },
      {
        name: "Plan B: Shrines & Culture",
        description: "A deeper dive into local traditions, focusing on the famous Hikawa Shrine.",
        steps: [
          { time: "10:00", activity: "Visit Hikawa Shrine. Walk through the tunnel of wind chimes (in summer) or ema." },
          { time: "12:00", activity: "Fish for your fortune using a small fishing rod at the shrine." },
          { time: "13:30", activity: "Lunch at a traditional Japanese restaurant near the Honmaru Goten." },
          { time: "15:00", activity: "Tour Kawagoe Castle Honmaru Goten, the former samurai lord's residence." },
          { time: "16:30", activity: "Relax at a retro coffee shop on Taisho-roman Street." }
        ]
      }
    ]
  },
  "nikko-heritage": {
    heroImage: "https://images.unsplash.com/photo-1601005128362-e611e9f1a21e?q=80&w=1000&auto=format&fit=crop",
    itineraries: [
      {
        name: "Plan A: World Heritage Sanctuaries",
        description: "A focused tour of the elaborately decorated shrines and temples.",
        steps: [
          { time: "09:30", activity: "Arrive in Nikko. Photograph the iconic red Shinkyo Bridge." },
          { time: "10:30", activity: "Explore Toshogu Shrine, the incredibly ornate mausoleum of Tokugawa Ieyasu." },
          { time: "13:00", activity: "Lunch featuring local Nikko Yuba (tofu skin) delicacies." },
          { time: "14:30", activity: "Visit Rinno-ji Temple and the quiet Futarasan Shrine." },
          { time: "16:30", activity: "Stroll along the Kanmangafuchi Abyss to see the row of stone Jizo statues." }
        ]
      },
      {
        name: "Plan B: Okunikko Nature Escape",
        description: "Skip the shrines and head higher up the mountains for waterfalls and lakes.",
        steps: [
          { time: "09:00", activity: "Take the bus up the winding Irohazaka Route to Okunikko." },
          { time: "10:30", activity: "Ride the elevator down to the base of Kegon Falls, one of Japan's top 3 waterfalls." },
          { time: "12:00", activity: "Lunch overlooking the beautiful Lake Chuzenji." },
          { time: "13:30", activity: "Hike the wooden boardwalks of the Senjogahara Marshland." },
          { time: "16:00", activity: "Soak your feet in the public footbaths at Yumoto Onsen before returning." }
        ]
      }
    ]
  },
  "yokohama-city": {
    heroImage: "https://images.unsplash.com/photo-1558204686-e4142f36d418?q=80&w=1000&auto=format&fit=crop",
    itineraries: [
      {
        name: "Plan A: Minatomirai Classics",
        description: "The ultimate waterfront date or family trip hitting all major landmarks.",
        steps: [
          { time: "11:00", activity: "Design your own custom cup noodles at the Cup Noodle Museum." },
          { time: "13:00", activity: "Lunch and shopping at the historic Red Brick Warehouse." },
          { time: "15:00", activity: "Take a ride on the Cosmo Clock 21 Ferris wheel." },
          { time: "16:30", activity: "Take the Yokohama Air Cabin ropeway across the bay." },
          { time: "18:00", activity: "Dinner in Yokohama Chinatown, the largest in Japan." }
        ]
      },
      {
        name: "Plan B: Gardens & History",
        description: "A quieter side of Yokohama, focusing on classic Japanese gardens and port history.",
        steps: [
          { time: "10:00", activity: "Explore Sankeien Garden, featuring historic buildings relocated from across Japan." },
          { time: "12:30", activity: "Lunch in the elegant Motomachi Shopping Street." },
          { time: "14:00", activity: "Stroll up to the Yamate Bluffs to see the historic Western-style diplomatic houses." },
          { time: "16:00", activity: "Walk through Yamashita Park and tour the NYK Hikawa Maru ocean liner." },
          { time: "18:30", activity: "Cocktails at a high-rise bar in the Landmark Tower." }
        ]
      }
    ]
  },
  "atami-resort": {
    heroImage: "https://images.unsplash.com/photo-1583335501997-25e17e94e503?q=80&w=1000&auto=format&fit=crop",
    itineraries: [
      {
        name: "Plan A: Seaside & Art",
        description: "A mix of ocean views and world-class museums.",
        steps: [
          { time: "10:00", activity: "Arrive in Atami. Take the bus to the spectacular MOA Museum of Art." },
          { time: "13:00", activity: "Lunch near Atami Sun Beach, enjoying fresh local seafood." },
          { time: "14:30", activity: "Take the ropeway up to Atami Castle for panoramic bay views." },
          { time: "16:00", activity: "Explore the retro shopping streets near the station and eat onsen manju." },
          { time: "17:30", activity: "Take a quick dip in a public bath before taking the Shinkansen home." }
        ]
      },
      {
        name: "Plan B: Retro Atami Vibe",
        description: "Focus on the nostalgic Showa-era atmosphere of this classic resort town.",
        steps: [
          { time: "10:30", activity: "Visit Kiunkaku, a gorgeous former ryokan loved by Japanese literary giants." },
          { time: "12:30", activity: "Eat a classic Japanese curry or omurice at a retro Kissaten (coffee shop)." },
          { time: "14:00", activity: "Visit Kinomiya Shrine to see the 2,000-year-old sacred camphor tree." },
          { time: "16:00", activity: "Stroll along the oceanfront and find a quiet day-use hot spring." },
          { time: "18:00", activity: "Dinner at a local izakaya in the old town." }
        ]
      }
    ]
  },
  "boso-peninsula": {
    heroImage: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1000&auto=format&fit=crop",
    itineraries: [
      {
        name: "Plan A: Mountain & Buddha",
        description: "A hiking and cultural adventure on Mt. Nokogiri.",
        steps: [
          { time: "09:30", activity: "Arrive at Hamakanaya and take the Mt. Nokogiri Ropeway up the mountain." },
          { time: "10:30", activity: "Hike to the Jigoku Nozoki (Hell's Peek) viewpoint." },
          { time: "12:00", activity: "Descend into the quarry to see the massive Nihon-ji Daibutsu (Great Buddha)." },
          { time: "14:00", activity: "Late lunch of fresh caught seafood near the ferry terminal." },
          { time: "15:30", activity: "Relax at the Baya-no-yu oceanfront hot spring." }
        ]
      },
      {
        name: "Plan B: Coastline Road Trip",
        description: "Best done by car. Exploring the scenic drives of Chiba.",
        steps: [
          { time: "09:00", activity: "Drive the Tokyo Bay Aqua-Line and stop at Umihotaru PA." },
          { time: "11:00", activity: "Visit Mother Farm to see the animals and flower fields." },
          { time: "13:30", activity: "Drive down to Katsuura or Kamogawa for an incredible seafood lunch." },
          { time: "15:00", activity: "Explore the Kamogawa Sea World or take a coastal drive to the lighthouse." },
          { time: "17:30", activity: "Watch the sunset over the Pacific Ocean." }
        ]
      }
    ]
  },
  "matsumoto": {
    heroImage: "https://images.unsplash.com/photo-1590559899731-a382839ce25b?q=80&w=1000&auto=format&fit=crop",
    itineraries: [
      {
        name: "Plan A: The Black Castle",
        description: "Focus on the historic samurai history of Matsumoto.",
        steps: [
          { time: "11:00", activity: "Arrive in Matsumoto. Head straight to Matsumoto Castle, one of Japan's oldest." },
          { time: "13:00", activity: "Have Shinshu Soba for lunch, a local specialty." },
          { time: "14:30", activity: "Stroll along Nakamachi-dori, known for its historic black-and-white storehouses." },
          { time: "16:00", activity: "Wander Nawate-dori (Frog Street) for quirky shops and street food." },
          { time: "17:30", activity: "Visit a local sake brewery for tasting before dinner." }
        ]
      },
      {
        name: "Plan B: Art & Alps",
        description: "A cultural day featuring famous contemporary art and mountain views.",
        steps: [
          { time: "10:30", activity: "Visit the Matsumoto City Museum of Art to see the permanent Yayoi Kusama exhibition." },
          { time: "13:00", activity: "Lunch at a trendy cafe near the museum district." },
          { time: "14:30", activity: "Take a short bus or taxi ride up to Alps Park." },
          { time: "16:00", activity: "Enjoy panoramic views of the Japan Alps and explore the nature trails." },
          { time: "18:00", activity: "Head back to town for a cozy dinner." }
        ]
      }
    ]
  },
  "harry-potter-studio": {
    heroImage: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=1000&auto=format&fit=crop",
    itineraries: [
      {
        name: "Plan A: The Ultimate Fan Experience",
        description: "A comprehensive walk-through prioritizing all major sets and photo ops.",
        steps: [
          { time: "09:30", activity: "Arrive early and enter the Great Hall." },
          { time: "11:00", activity: "Explore the Hogwarts Express and Platform 9 ¾." },
          { time: "12:30", activity: "Drink Butterbeer in the Backlot Cafe." },
          { time: "14:00", activity: "Walk through Diagon Alley and the Ministry of Magic sets." },
          { time: "16:00", activity: "Spend an hour in the massive studio gift shop." }
        ]
      },
      {
        name: "Plan B: The Filmmaker's Focus",
        description: "Take your time studying the props, costumes, and behind-the-scenes magic.",
        steps: [
          { time: "10:00", activity: "Focus heavily on the Art Department and Costume exhibits." },
          { time: "12:00", activity: "Participate in the interactive green-screen broomstick flying." },
          { time: "13:30", activity: "Lunch at the Food Hall." },
          { time: "15:00", activity: "Study the creature effects and animatronics in the Creature Shop." },
          { time: "17:00", activity: "Examine the incredibly detailed Hogwarts Castle miniature." }
        ]
      }
    ]
  },
  "karuizawa": {
    heroImage: "https://images.unsplash.com/photo-1542051812871-757500d72bc1?q=80&w=1000&auto=format&fit=crop",
    itineraries: [
      {
        name: "Plan A: The Classic Resort",
        description: "Shopping, dining, and scenic walks in the famous mountain resort.",
        steps: [
          { time: "10:00", activity: "Rent a bicycle near Karuizawa Station." },
          { time: "10:30", activity: "Cycle to Kumoba Pond (Swan Lake) for a beautiful nature walk." },
          { time: "12:00", activity: "Explore the Kyu-Karuizawa Ginza street. Eat local breads and jams." },
          { time: "14:00", activity: "Cycle to the historic Shaw Memorial Church and the deep forest." },
          { time: "16:00", activity: "Finish the day shopping at the massive Prince Shopping Plaza outlet mall." }
        ]
      },
      {
        name: "Plan B: Art & Architecture",
        description: "Discover the elegant modern architecture and waterfalls of the area.",
        steps: [
          { time: "10:00", activity: "Take a bus to the breathtaking Shiraito Falls." },
          { time: "12:00", activity: "Head to Harunire Terrace for a stylish lunch in the forest." },
          { time: "14:00", activity: "Walk to the Stone Church and the Karuizawa Kogen Church." },
          { time: "15:30", activity: "Visit the Hiroshi Senju Museum, a stunning piece of modern architecture." },
          { time: "17:30", activity: "Relax at the Tombo-no-yu hot springs." }
        ]
      }
    ]
  },
  "utsunomiya-oya": {
    heroImage: "https://images.unsplash.com/photo-1616421316438-bb2f7be625ee?q=80&w=1000&auto=format&fit=crop",
    itineraries: [
      {
        name: "Plan A: Stone & Gyoza",
        description: "The perfect mix of exploring massive underground caves and eating famous local food.",
        steps: [
          { time: "10:00", activity: "Take a bus from Utsunomiya Station to the Oya History Museum." },
          { time: "10:30", activity: "Explore the massive, atmospheric underground stone quarry." },
          { time: "12:30", activity: "Visit the nearby Oya-ji Temple and the giant Heiwa Kannon statue." },
          { time: "14:00", activity: "Head back to central Utsunomiya." },
          { time: "15:00", activity: "Go 'Gyoza Hopping' – try 3 different famous gyoza shops for a late lunch/dinner." }
        ]
      },
      {
        name: "Plan B: Scenic Cycling",
        description: "Rent a bike and explore the rural beauty surrounding the stone town.",
        steps: [
          { time: "09:30", activity: "Rent a bicycle near Utsunomiya Station." },
          { time: "11:00", activity: "Cycle through the scenic countryside towards the Oya district." },
          { time: "12:30", activity: "Lunch at a stylish cafe built into an old stone warehouse." },
          { time: "14:00", activity: "Explore the ancient cliff carvings at Oya-ji Temple." },
          { time: "16:00", activity: "Cycle back, drop off the bike, and reward yourself with gyoza." }
        ]
      }
    ]
  },
  "disneysea": {
    heroImage: "https://images.unsplash.com/photo-1505993597083-3ae4f67aa239?q=80&w=1000&auto=format&fit=crop",
    itineraries: [
      {
        name: "Plan A: The Adrenaline Rush",
        description: "Optimize your day to hit the biggest thrill rides.",
        steps: [
          { time: "08:30", activity: "Arrive at rope drop. Head straight to Journey to the Center of the Earth." },
          { time: "10:00", activity: "Ride Indiana Jones Adventure and Raging Spirits." },
          { time: "12:30", activity: "Grab a quick bite (smoked turkey leg or spicy chicken) while walking." },
          { time: "14:00", activity: "Use Premier Access for Tower of Terror or Soaring: Fantastic Flight." },
          { time: "19:30", activity: "Secure a spot for the nighttime spectacular show on the Mediterranean Harbor." }
        ]
      },
      {
        name: "Plan B: Romantic & Immersive",
        description: "A slow-paced day focusing on atmosphere, shows, and fine dining.",
        steps: [
          { time: "10:00", activity: "Arrive and take a relaxing ride on the Venetian Gondolas." },
          { time: "11:30", activity: "Watch the incredible Big Band Beat jazz show." },
          { time: "13:00", activity: "Enjoy a sit-down lunch at the Magellan's fine dining restaurant." },
          { time: "15:00", activity: "Explore the interactive Fortress Explorations and walk through Arabian Coast." },
          { time: "18:00", activity: "Ride the Transit Steamer Line at sunset for beautiful views." }
        ]
      }
    ]
  },
  "tsukuba": {
    heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
    itineraries: [
      {
        name: "Plan A: The Twin Peak Hike",
        description: "A moderately challenging hike to the summits for incredible Kanto Plain views.",
        steps: [
          { time: "09:00", activity: "Take the Tsukuba Express, then a bus to the Tsukubasan Shrine." },
          { time: "10:00", activity: "Take the Cable Car up to Miyukigahara (the plateau between peaks)." },
          { time: "11:00", activity: "Hike to the summit of Mt. Nantai, then traverse to Mt. Nyotai." },
          { time: "13:30", activity: "Enjoy a bowl of Tsukuba Udon at the mountaintop restaurant." },
          { time: "15:00", activity: "Take the Ropeway down to the Tsutsujigaoka station." }
        ]
      },
      {
        name: "Plan B: Science & Shrines",
        description: "Mix the natural beauty of the shrine with Tsukuba's famous Space Center.",
        steps: [
          { time: "10:00", activity: "Visit the JAXA Tsukuba Space Center. See the rocket displays." },
          { time: "12:30", activity: "Lunch in Tsukuba city center." },
          { time: "14:00", activity: "Take the bus to Tsukubasan Shrine and explore the ancient grounds." },
          { time: "15:30", activity: "Take the cable car up for a quick panoramic view without the hiking." },
          { time: "17:00", activity: "Relax at an onsen near the base of the mountain." }
        ]
      }
    ]
  },
  "omiya-railway": {
    heroImage: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1000&auto=format&fit=crop",
    itineraries: [
      {
        name: "Plan A: The Train Otaku",
        description: "A deep dive into the history and mechanics of Japan's legendary railway system.",
        steps: [
          { time: "10:00", activity: "Arrive at the museum and head straight to the massive Rolling Stock Station." },
          { time: "11:30", activity: "Book and experience the Steam Locomotive or Shinkansen Simulator." },
          { time: "13:00", activity: "Eat an authentic 'Ekiben' (station bento) inside a retired train car." },
          { time: "14:30", activity: "Watch the massive Railway Diorama show." },
          { time: "16:00", activity: "Explore the History Zone and learn about the evolution of the Shinkansen." }
        ]
      },
      {
        name: "Plan B: Family Fun Day",
        description: "A relaxed pace focused on interactive exhibits perfect for kids.",
        steps: [
          { time: "10:30", activity: "Arrive and immediately head to the Mini Driving Train area." },
          { time: "12:00", activity: "Lunch at the Kids Cafe, which has train-themed meals." },
          { time: "13:30", activity: "Let the kids play in the Teppaku Playroom and outdoor park." },
          { time: "15:00", activity: "Take family photos with the historic steam engines." },
          { time: "16:30", activity: "Buy exclusive train toys at the museum shop before leaving." }
        ]
      }
    ]
  },
  "joypolis": {
    heroImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop",
    itineraries: [
      {
        name: "Plan A: Thrills & Coasters",
        description: "Tackle the most intense, adrenaline-pumping rides the indoor park has to offer.",
        steps: [
          { time: "11:00", activity: "Arrive at Decks Tokyo Beach and head into Joypolis." },
          { time: "11:30", activity: "Ride the Gekion Live Coaster, a rhythm game combined with a rollercoaster." },
          { time: "13:00", activity: "Compete against friends on the Halfpipe Tokyo spinning ride." },
          { time: "14:30", activity: "Quick lunch at the Frame Cafe inside the park overlooking the bay." },
          { time: "16:00", activity: "Ride the Transformers 360-degree spinning simulator." }
        ]
      },
      {
        name: "Plan B: Horror & Virtual Reality",
        description: "Focus on the immersive walk-through attractions and cutting-edge VR.",
        steps: [
          { time: "12:00", activity: "Start with the Zero Latency VR free-roaming experience (book in advance!)." },
          { time: "14:00", activity: "Grab lunch at a restaurant in Odaiba outside the park." },
          { time: "15:30", activity: "Experience the Room of the Living Doll 3D sound horror attraction." },
          { time: "16:30", activity: "Play the interactive Phoenix Wright: Ace Attorney investigation game." },
          { time: "18:00", activity: "Watch the main stage projection mapping show before leaving." }
        ]
      }
    ]
  }
};

const dests = JSON.parse(fs.readFileSync('src/data/destinations.json', 'utf8'));

dests.forEach(d => {
  if (dataMap[d.id]) {
    d.heroImage = dataMap[d.id].heroImage;
    d.itineraries = dataMap[d.id].itineraries;
  }
});

fs.writeFileSync('src/data/destinations.json', JSON.stringify(dests, null, 2));

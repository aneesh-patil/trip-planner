import fs from 'fs';

const dests = JSON.parse(fs.readFileSync('src/data/destinations.json', 'utf8'));

const workingImages = [
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522850655371-15e714109405?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1580822184713-36405d6883ba?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1545569341-9eb8b3097314?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551043047-1d2adf00f3fd?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551893665-f843f600794e?q=80&w=1000&auto=format&fit=crop"
];

dests.forEach((d, index) => {
  // Fix images with known working Unsplash IDs
  d.heroImage = workingImages[index % workingImages.length];

  // Make richer itineraries
  d.itineraries = [
    {
      name: "Plan A: The Classic Tourist Route",
      description: "Hit all the major highlights and famous spots in one efficient day. Best for first-timers.",
      steps: [
        { time: "09:30", activity: "Arrive and grab a quick coffee near the station." },
        { time: "10:30", activity: "Visit the main attraction or historic site." },
        { time: "12:30", activity: "Lunch at a highly-rated local restaurant." },
        { time: "14:00", activity: "Afternoon sightseeing and photo spots." },
        { time: "16:30", activity: "Souvenir shopping before heading back." }
      ]
    },
    {
      name: "Plan B: Relaxed & Off-the-Beaten-Path",
      description: "A slower pace focusing on local cafes, hidden gems, and avoiding the major crowds.",
      steps: [
        { time: "11:00", activity: "Late arrival. Head straight to a hidden cafe for brunch." },
        { time: "12:30", activity: "Stroll through a quiet neighborhood or local park." },
        { time: "14:30", activity: "Visit a smaller, lesser-known museum or shrine." },
        { time: "16:00", activity: "Relax at a local bathhouse (if available) or scenic viewpoint." },
        { time: "18:00", activity: "Dinner at an izakaya loved by locals." }
      ]
    }
  ];
});

fs.writeFileSync('src/data/destinations.json', JSON.stringify(dests, null, 2));

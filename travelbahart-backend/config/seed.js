// =============================================
// TRAVELBHARAT — DATABASE SEED SCRIPT (v4 — with images[] gallery)
// Run: node config/seed.js   (or npm run seed)
// =============================================

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ─── Inline Schemas ────────────────────────────────────────
const placeSchema = new mongoose.Schema({
  id:        String,
  name:      String,
  city:      String,
  category:  { type: String, enum: ['Heritage', 'Nature', 'Religious', 'Adventure'] },
  desc:      String,
  bestTime:  String,
  entryFee:  String,
  image:     String,
  images:    [String],   // ← gallery array (primary image is always images[0])
  mapLink:   String,
  nearby:    [String],
});

const stateSchema = new mongoose.Schema({
  id:        { type: String, unique: true },
  name:      String,
  capital:   String,
  region:    String,
  tagline:   String,
  category:  String,
  emoji:     String,
  image:     String,
  heroImage: String,
  about:     String,
  bestTime:  String,
  language:  String,
  cuisine:   String,
  area:      String,
  places:    [placeSchema],
  isActive:  { type: Boolean, default: true },
}, { timestamps: true });

const adminSchema = new mongoose.Schema({
  name:     String,
  email:    { type: String, unique: true },
  password: String,
  role:     { type: String, default: 'admin' },
}, { timestamps: true });

const State = mongoose.models.State || mongoose.model('State', stateSchema);
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

// ─── States Data ───────────────────────────────────────────
const STATES_DATA = [
  {
    id: "rajasthan", name: "Rajasthan", capital: "Jaipur", region: "North India",
    tagline: "The Land of Kings — Palaces, Forts & the Golden Thar",
    category: "Heritage", emoji: "🏰",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&q=80",
    about: "Rajasthan, the 'Land of Kings', is India's largest state and a treasure trove of royal heritage. Its landscape ranges from the vast Thar Desert to lush forests, dotted with magnificent forts, opulent palaces, and vibrant bazaars.",
    bestTime: "Oct – Mar", language: "Hindi / Rajasthani", cuisine: "Dal Baati Churma", area: "342,239 km²",
    places: [
      {
        id: "r1", name: "Hawa Mahal", city: "Jaipur", category: "Heritage",
        desc: "The iconic 'Palace of Winds' with 953 windows, built in 1799 by Maharaja Sawai Pratap Singh.",
        bestTime: "Oct – Mar", entryFee: "₹50 Indian / ₹200 Foreign",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
          "https://picsum.photos/seed/hawaMahal1/800/600",
          "https://picsum.photos/seed/hawaMahal2/800/600",
          "https://picsum.photos/seed/hawaMahal3/800/600"
        ],
        mapLink: "https://maps.app.goo.gl/3XaHHCdcP3hJbfEQ8",
        nearby: ["City Palace", "Jantar Mantar", "Jal Mahal"]
      },
      {
        id: "r2", name: "Mehrangarh Fort", city: "Jodhpur", category: "Heritage",
        desc: "One of India's largest forts, rising 122 metres above the Blue City with panoramic views and a world-class museum inside.",
        bestTime: "Nov – Feb", entryFee: "₹100 Indian / ₹600 Foreign",
        image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&q=80",
          "https://picsum.photos/seed/mehrangarh1/800/600",
          "https://picsum.photos/seed/mehrangarh2/800/600"
        ],
        mapLink: "https://maps.app.goo.gl/Mehrangarh123",
        nearby: ["Jaswant Thada", "Umaid Bhawan Palace", "Rao Jodha Desert Rock Park"]
      },
      {
        id: "r3", name: "Jaisalmer Fort", city: "Jaisalmer", category: "Heritage",
        desc: "A UNESCO World Heritage Site — a golden sandstone living fort rising from the Thar Desert.",
        bestTime: "Oct – Mar", entryFee: "Free Entry",
        image: "https://images.unsplash.com/photo-1551907154-9b0c2d97e98c?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1551907154-9b0c2d97e98c?w=800&q=80",
          "https://picsum.photos/seed/jaisalmerFort1/800/600",
          "https://picsum.photos/seed/jaisalmerFort2/800/600"
        ],
        mapLink: "https://maps.app.goo.gl/JaisalmerFort123",
        nearby: ["Sam Sand Dunes", "Patwon Ki Haveli", "Gadisar Lake"]
      },
      {
        id: "r4", name: "Sam Sand Dunes", city: "Jaisalmer", category: "Adventure",
        desc: "Sweeping golden dunes where camel safaris, desert camps, and stargazing create magical evenings.",
        bestTime: "Nov – Feb", entryFee: "₹50 per person",
        image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
          "https://picsum.photos/seed/samDunes1/800/600",
          "https://picsum.photos/seed/samDunes2/800/600"
        ],
        mapLink: "https://maps.app.goo.gl/SamDunes123",
        nearby: ["Kuldhara Village", "Khaba Fort", "Tanot Mata Temple"]
      },
      {
        id: "r5", name: "Ranthambore Tiger Reserve", city: "Sawai Madhopur", category: "Nature",
        desc: "One of India's best tiger-spotting destinations, set against a dramatic 10th-century fort.",
        bestTime: "Oct – Jun", entryFee: "₹1000 – ₹5000",
        image: "https://images.unsplash.com/photo-1615824996195-f780bba7cfde?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1615824996195-f780bba7cfde?w=800&q=80",
          "https://picsum.photos/seed/ranthambore1/800/600",
          "https://picsum.photos/seed/ranthambore2/800/600"
        ],
        mapLink: "https://maps.app.goo.gl/Ranthambore123",
        nearby: ["Ranthambore Fort", "Trinetra Ganesh Temple", "Padam Lake"]
      },
      { id: "r6", name: "Pushkar Lake", city: "Pushkar", category: "Religious", desc: "One of India's five sacred dhams — the holy lake surrounded by 52 ghats and the only Brahma Temple in the world.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&q=80", images: ["https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&q=80"], mapLink: "https://maps.app.goo.gl/PushkarLake123", nearby: ["Brahma Temple", "Savitri Temple", "Camel Fair Ground"] },
      { id: "r7", name: "City Palace Jaipur", city: "Jaipur", category: "Heritage", desc: "A magnificent royal complex in the heart of Jaipur — blend of Rajput, Mughal and European architecture.", bestTime: "Oct – Mar", entryFee: "₹200 Indian / ₹700 Foreign", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80", images: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80"], mapLink: "https://maps.app.goo.gl/CityPalaceJaipur123", nearby: ["Hawa Mahal", "Jantar Mantar", "Jal Mahal"] },
      { id: "r8", name: "Amber Fort", city: "Jaipur", category: "Heritage", desc: "A majestic hilltop fort built in 1592 with stunning mirror work, elephant rides, and breathtaking views.", bestTime: "Oct – Mar", entryFee: "₹100 Indian / ₹500 Foreign", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80", images: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80"], mapLink: "https://maps.app.goo.gl/AmberFort123", nearby: ["Jaigarh Fort", "Nahargarh Fort", "Panna Meena Ka Kund"] },
      { id: "r9", name: "Udaipur City of Lakes", city: "Udaipur", category: "Heritage", desc: "The most romantic city in India — surrounded by Aravalli hills, shimmering lakes, and marble palaces.", bestTime: "Sep – Mar", entryFee: "Free (palaces extra)", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80", images: ["https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Udaipur123", nearby: ["Lake Pichola", "City Palace Udaipur", "Jagdish Temple"] },
      { id: "r10", name: "Lake Pichola", city: "Udaipur", category: "Nature", desc: "A stunning artificial lake built in 1362 with the iconic Lake Palace and Jag Mandir islands rising from its waters.", bestTime: "Aug – Mar", entryFee: "Boat Ride ₹400", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80", images: ["https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80"], mapLink: "https://maps.app.goo.gl/LakePichola123", nearby: ["City Palace Udaipur", "Bagore Ki Haveli", "Sajjangarh Monsoon Palace"] },
      { id: "r11", name: "Chittorgarh Fort", city: "Chittorgarh", category: "Heritage", desc: "India's largest fort and a UNESCO World Heritage Site — legendary seat of Mewar kingdom.", bestTime: "Oct – Mar", entryFee: "₹40 Indian / ₹600 Foreign", image: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=600&q=80", images: ["https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=600&q=80"], mapLink: "https://maps.app.goo.gl/ChittorgarhFort123", nearby: ["Vijay Stambha", "Kirti Stambha", "Meera Temple"] },
      { id: "r12", name: "Jantar Mantar", city: "Jaipur", category: "Heritage", desc: "A UNESCO World Heritage Site — the world's largest stone sundial and astronomical observatory built in 1734.", bestTime: "Oct – Mar", entryFee: "₹50 Indian / ₹200 Foreign", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80", images: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80"], mapLink: "https://maps.app.goo.gl/JantarMantar123", nearby: ["Hawa Mahal", "City Palace", "Nahargarh Fort"] }
    ]
  },
  {
    id: "kerala", name: "Kerala", capital: "Thiruvananthapuram", region: "South India",
    tagline: "God's Own Country — Backwaters, Beaches & Spice Gardens",
    category: "Nature", emoji: "🌴",
    image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1600&q=80",
    about: "Kerala, famously known as 'God's Own Country', is a paradise of emerald backwaters, lush hill stations, pristine beaches, and ancient spice plantations.",
    bestTime: "Sep – Mar", language: "Malayalam", cuisine: "Sadya / Appam", area: "38,852 km²",
    places: [
      {
        id: "k1", name: "Alleppey Backwaters", city: "Alappuzha", category: "Nature",
        desc: "A labyrinth of serene canals, lakes, and lagoons best explored on a traditional houseboat.",
        bestTime: "Sep – Mar", entryFee: "Houseboat ₹5000+/night",
        image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80",
          "https://picsum.photos/seed/alleppey1/800/600",
          "https://picsum.photos/seed/alleppey2/800/600",
          "https://picsum.photos/seed/alleppey3/800/600"
        ],
        mapLink: "https://maps.app.goo.gl/AlappuzhaBackwaters123",
        nearby: ["Vembanad Lake", "Kuttanad", "Marari Beach"]
      },
      {
        id: "k2", name: "Munnar Hill Station", city: "Munnar", category: "Nature",
        desc: "Misty tea gardens, rolling green hills, and cool mountain air at 1600 metres above sea level.",
        bestTime: "Sep – May", entryFee: "Free",
        image: "https://images.unsplash.com/photo-1601899585163-b803bfac24ef?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1601899585163-b803bfac24ef?w=800&q=80",
          "https://picsum.photos/seed/munnar1/800/600",
          "https://picsum.photos/seed/munnar2/800/600",
          "https://picsum.photos/seed/munnar3/800/600"
        ],
        mapLink: "https://maps.app.goo.gl/Munnar123",
        nearby: ["Eravikulam NP", "Mattupetty Dam", "Top Station"]
      },
      { id: "k3", name: "Periyar Tiger Reserve", city: "Thekkady", category: "Nature", desc: "A scenic reservoir surrounded by spice-scented forests with boat safaris and elephant sightings.", bestTime: "Oct – Jun", entryFee: "₹350 Indian / ₹700 Foreign", image: "https://images.unsplash.com/photo-1580918901688-4b5ed5729427?w=600&q=80", images: ["https://images.unsplash.com/photo-1580918901688-4b5ed5729427?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Periyar123", nearby: ["Spice Gardens", "Kumily Market"] },
      { id: "k4", name: "Kovalam Beach", city: "Trivandrum", category: "Adventure", desc: "A crescent-shaped beach famous for its lighthouse, Ayurvedic massages, and stunning sunsets.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/KovalamBeach123", nearby: ["Padmanabhaswamy Temple", "Vizhinjam", "Poovar"] },
      { id: "k5", name: "Wayanad Wildlife Sanctuary", city: "Wayanad", category: "Nature", desc: "Dense forests bordering Karnataka and Tamil Nadu, home to tigers, elephants, leopards, and rare birds.", bestTime: "Oct – May", entryFee: "₹200 per person", image: "https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?w=600&q=80", images: ["https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Wayanad123", nearby: ["Edakkal Caves", "Chembra Peak", "Meenmutty Falls"] },
      { id: "k6", name: "Padmanabhaswamy Temple", city: "Thiruvananthapuram", category: "Religious", desc: "One of India's wealthiest temples, dedicated to Lord Vishnu, with Dravidian architecture.", bestTime: "Oct – Mar", entryFee: "Free (Hindus only)", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80", images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Padmanabhaswamy123", nearby: ["Napier Museum", "Shangumugham Beach"] }
    ]
  },
  {
    id: "uttarakhand", name: "Uttarakhand", capital: "Dehradun", region: "North India",
    tagline: "Devbhoomi — The Land of Gods, Glaciers & Himalayan Trails",
    category: "Adventure", emoji: "🏔️",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80",
    about: "Uttarakhand, 'Devbhoomi' or Land of Gods, is nestled in the mighty Himalayas. Home to the Char Dham pilgrimage sites, Jim Corbett, and serene Himalayan valleys.",
    bestTime: "Mar – Jun, Sep – Nov", language: "Hindi / Garhwali / Kumaoni", cuisine: "Kafuli / Bhang ki Chutney", area: "53,483 km²",
    places: [
      { id: "uk1", name: "Valley of Flowers", city: "Chamoli", category: "Nature", desc: "A UNESCO World Heritage Site — a high-altitude Himalayan valley carpeted with hundreds of wild alpine flowers.", bestTime: "Jul – Sep", entryFee: "₹150 Indian / ₹600 Foreign", image: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=600&q=80", images: ["https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/ValleyOfFlowers123", nearby: ["Hemkund Sahib", "Badrinath", "Nanda Devi NP"] },
      { id: "uk2", name: "Rishikesh", city: "Rishikesh", category: "Adventure", desc: "The yoga capital of the world — white-water rafting, bungee jumping, and riverside ashrams.", bestTime: "Sep – Jun", entryFee: "Free", image: "https://images.unsplash.com/photo-1561693532-9ff59442830b?w=600&q=80", images: ["https://images.unsplash.com/photo-1561693532-9ff59442830b?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Rishikesh123", nearby: ["Laxman Jhula", "Beatles Ashram", "Neelkanth Temple"] },
      { id: "uk3", name: "Kedarnath Temple", city: "Rudraprayag", category: "Religious", desc: "One of the twelve Jyotirlingas at 3,583 metres, accessible only by a 16 km trek.", bestTime: "May – Jun, Sep – Oct", entryFee: "Free", image: "https://images.unsplash.com/photo-1574482620826-5b9c1b14d4db?w=600&q=80", images: ["https://images.unsplash.com/photo-1574482620826-5b9c1b14d4db?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Kedarnath123", nearby: ["Badrinath", "Tungnath", "Chandrashila"] },
      { id: "uk4", name: "Jim Corbett National Park", city: "Nainital", category: "Nature", desc: "India's oldest national park, established in 1936, home to the majestic Bengal tiger.", bestTime: "Nov – Jun", entryFee: "₹600 – ₹2500", image: "https://images.unsplash.com/photo-1526566661780-1a67ea3c863e?w=600&q=80", images: ["https://images.unsplash.com/photo-1526566661780-1a67ea3c863e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/JimCorbett123", nearby: ["Nainital Lake", "Bhimtal", "Corbett Falls"] },
      { id: "uk5", name: "Auli Ski Resort", city: "Chamoli", category: "Adventure", desc: "India's premier ski destination at 2519 metres with views of Nanda Devi and Mana peaks.", bestTime: "Jan – Mar", entryFee: "₹500 – ₹1500/day", image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&q=80", images: ["https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Auli123", nearby: ["Joshimath", "Gorson Bugyal", "Kwani Bugyal"] },
      { id: "uk6", name: "Haridwar Ghats", city: "Haridwar", category: "Religious", desc: "One of the seven sacred cities of Hinduism — the Ganga Aarti at Har Ki Pauri is transcendental.", bestTime: "Oct – Apr", entryFee: "Free", image: "https://images.unsplash.com/photo-1602537979395-4c0f5a7d4f7a?w=600&q=80", images: ["https://images.unsplash.com/photo-1602537979395-4c0f5a7d4f7a?w=600&q=80"], mapLink: "https://maps.app.goo.gl/HarKiPauri123", nearby: ["Chandi Devi Temple", "Mansa Devi", "Daksha Mahadev Temple"] }
    ]
  },
  {
    id: "meghalaya", name: "Meghalaya", capital: "Shillong", region: "Northeast India",
    tagline: "Abode of Clouds — Where Rain Writes Poetry",
    category: "Nature", emoji: "☁️",
    image: "https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=1600&q=80",
    about: "Meghalaya, meaning 'Abode of Clouds', is one of the wettest regions on Earth. Home to living root bridges, majestic waterfalls, and a unique matrilineal culture.",
    bestTime: "Oct – Jun", language: "Khasi / Garo / English", cuisine: "Jadoh / Dohneiiong", area: "22,429 km²",
    places: [
      { id: "mg1", name: "Living Root Bridges", city: "Cherrapunji", category: "Heritage", desc: "Centuries-old bridges woven from living tree roots by the Khasi people — a marvel of bioengineering.", bestTime: "Oct – Jun", entryFee: "₹50 per person", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80", images: ["https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80"], mapLink: "https://maps.app.goo.gl/LivingRootBridge123", nearby: ["Double Decker Bridge", "Nongriat Village", "Rainbow Falls"] },
      { id: "mg2", name: "Nohkalikai Falls", city: "Cherrapunji", category: "Nature", desc: "India's tallest plunge waterfall at 340 metres, plunging into an ethereal green pool.", bestTime: "Jun – Oct", entryFee: "₹20 per person", image: "https://images.unsplash.com/photo-1584197045060-3b5ac2e16b2e?w=600&q=80", images: ["https://images.unsplash.com/photo-1584197045060-3b5ac2e16b2e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/NohkalakaiFalls123", nearby: ["Mawsmai Cave", "Seven Sisters Falls", "Eco Park"] },
      { id: "mg3", name: "Dawki River", city: "Dawki", category: "Nature", desc: "The crystal-clear Umngot River where boats appear to float in mid-air above the transparent green water.", bestTime: "Oct – May", entryFee: "₹50 boat ride", image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&q=80", images: ["https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&q=80"], mapLink: "https://maps.app.goo.gl/DawkiRiver123", nearby: ["Shnongpdeng", "Jowai", "Bangladesh Border"] },
      { id: "mg4", name: "Shillong Peak", city: "Shillong", category: "Nature", desc: "The highest point in Meghalaya at 1965 metres with panoramic views.", bestTime: "Oct – May", entryFee: "₹10 per person", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"], mapLink: "https://maps.app.goo.gl/ShillongPeak123", nearby: ["Ward's Lake", "Cathedral", "Police Bazar"] },
      { id: "mg5", name: "Mawlynnong Village", city: "East Khasi Hills", category: "Heritage", desc: "Asia's cleanest village, known for immaculate streets, eco-tourism, and sky walk.", bestTime: "Oct – May", entryFee: "Free", image: "https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=600&q=80", images: ["https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Mawlynnong123", nearby: ["Living Root Bridge", "Bangladesh Viewpoint"] }
    ]
  },
  {
    id: "goa", name: "Goa", capital: "Panaji", region: "West India",
    tagline: "Sun, Sand & Soul — India's Beach Paradise",
    category: "Adventure", emoji: "🏖️",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&q=80",
    about: "Goa, India's smallest state, packs extraordinary variety — from golden beaches and colonial Portuguese architecture to lush spice plantations and vibrant nightlife.",
    bestTime: "Nov – Mar", language: "Konkani / English", cuisine: "Fish Curry Rice / Bebinca", area: "3,702 km²",
    places: [
      { id: "g1", name: "Basilica of Bom Jesus", city: "Old Goa", category: "Heritage", desc: "A UNESCO World Heritage Site containing the mortal remains of St. Francis Xavier.", bestTime: "Nov – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80", images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80"], mapLink: "https://maps.app.goo.gl/BomJesus123", nearby: ["Se Cathedral", "Church of St. Cajetan", "Archaeological Museum"] },
      {
        id: "g2", name: "Calangute Beach", city: "North Goa", category: "Adventure",
        desc: "The 'Queen of Beaches' — Goa's most popular stretch with water sports and shacks.",
        bestTime: "Nov – Mar", entryFee: "Free",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
          "https://picsum.photos/seed/calangute1/800/600",
          "https://picsum.photos/seed/calangute2/800/600",
          "https://picsum.photos/seed/calangute3/800/600"
        ],
        mapLink: "https://maps.app.goo.gl/CalanguteBeach123",
        nearby: ["Baga Beach", "Candolim Beach", "Aguada Fort"]
      },
      {
        id: "g3", name: "Dudhsagar Falls", city: "South Goa", category: "Nature",
        desc: "One of India's tallest waterfalls at 310 metres, cascading through the Western Ghats.",
        bestTime: "Jun – Dec", entryFee: "₹400 per vehicle",
        image: "https://images.unsplash.com/photo-1594813411611-4e24f7a9a7ef?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1594813411611-4e24f7a9a7ef?w=800&q=80",
          "https://picsum.photos/seed/dudhsagar1/800/600",
          "https://picsum.photos/seed/dudhsagar2/800/600"
        ],
        mapLink: "https://maps.app.goo.gl/Dudhsagar123",
        nearby: ["Mollem NP", "Tambdi Surla Temple"]
      },
      { id: "g4", name: "Chapora Fort", city: "Vagator", category: "Heritage", desc: "A 17th-century Portuguese fort offering dramatic views over Vagator and Anjuna beaches.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=600&q=80", images: ["https://images.unsplash.com/photo-1545128485-c400e7702796?w=600&q=80"], mapLink: "https://maps.app.goo.gl/ChaporaFort123", nearby: ["Vagator Beach", "Anjuna Flea Market"] },
      { id: "g5", name: "Palolem Beach", city: "South Goa", category: "Adventure", desc: "A crescent of paradise — calm turquoise waters, coconut palms, and the most photogenic beach in Goa.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/PalolemBeach123", nearby: ["Patnem Beach", "Agonda Beach", "Butterfly Beach"] }
    ]
  },
  {
    id: "himachal_pradesh", name: "Himachal Pradesh", capital: "Shimla", region: "North India",
    tagline: "Dev Bhoomi of the Hills — Snow Peaks & Apple Valleys",
    category: "Nature", emoji: "🍎",
    image: "https://images.unsplash.com/photo-1553408633-ad37fdf44779?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1573434069898-dc1b67cdac82?w=1600&q=80",
    about: "Himachal Pradesh enchants with apple orchards, Buddhist monasteries, ski slopes, and ancient deodar forests. From Shimla to Spiti Valley, HP offers incredible diversity.",
    bestTime: "Mar – Jun, Oct – Nov", language: "Hindi / Pahari", cuisine: "Dham / Siddu", area: "55,673 km²",
    places: [
      { id: "hp1", name: "Shimla", city: "Shimla", category: "Heritage", desc: "The former British summer capital with Mall Road, Jakhu Temple, and Colonial Ridge.", bestTime: "Apr – Jun", entryFee: "Free", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"], mapLink: "https://maps.app.goo.gl/ShimlaMallRoad123", nearby: ["Kufri", "Chail", "Naldehra Golf Course"] },
      { id: "hp2", name: "Spiti Valley", city: "Kaza", category: "Adventure", desc: "A cold desert mountain valley at 3800m — stark, ethereal and home to ancient Buddhist monasteries.", bestTime: "Jun – Oct", entryFee: "ILP required for some areas", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80", images: ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/SpitiValley123", nearby: ["Key Monastery", "Chandratal Lake", "Kibber Village"] },
      { id: "hp3", name: "Manali", city: "Manali", category: "Adventure", desc: "Gateway to the Himalayas — skiing, paragliding, the Rohtang Pass, and vibrant Old Manali.", bestTime: "Oct – Jun", entryFee: "Free", image: "https://images.unsplash.com/photo-1553408633-ad37fdf44779?w=600&q=80", images: ["https://images.unsplash.com/photo-1553408633-ad37fdf44779?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Manali123", nearby: ["Solang Valley", "Rohtang Pass", "Hadimba Temple"] },
      { id: "hp4", name: "Dharamsala / McLeod Ganj", city: "Dharamsala", category: "Religious", desc: "Home of the Dalai Lama and the Tibetan government-in-exile.", bestTime: "Mar – Jun, Oct – Nov", entryFee: "Free", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"], mapLink: "https://maps.app.goo.gl/McLeodGanj123", nearby: ["Triund Trek", "Bhagsu Waterfall", "Namgyal Monastery"] },
      { id: "hp5", name: "Kasol", city: "Kasol", category: "Adventure", desc: "The 'Mini Israel of India' — a Parvati Valley hamlet known for Israeli cafes and trekking.", bestTime: "Oct – Jun", entryFee: "Free", image: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80", images: ["https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Kasol123", nearby: ["Kheerganga Trek", "Tosh", "Malana Village"] },
      { id: "hp6", name: "Triund Trek", city: "Dharamsala", category: "Adventure", desc: "A popular beginner trek offering dramatic views of the Dhauladhar Range at 2875 metres.", bestTime: "Mar – Jun, Sep – Nov", entryFee: "Free", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80", images: ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/TriundTrek123", nearby: ["Snowline Cafe", "Indrahar Pass"] }
    ]
  },
  {
    id: "tamil_nadu", name: "Tamil Nadu", capital: "Chennai", region: "South India",
    tagline: "Temple Towers & Living Traditions — The Soul of Dravidian Culture",
    category: "Heritage", emoji: "🛕",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=1600&q=80",
    about: "Tamil Nadu is the cradle of Dravidian civilization with temples dating back over 2000 years, towering gopurams, classical Bharatanatyam, and the Blue Mountains of the Nilgiris.",
    bestTime: "Oct – Mar", language: "Tamil", cuisine: "Idli / Dosa / Chettinad Chicken", area: "130,058 km²",
    places: [
      { id: "tn1", name: "Meenakshi Temple", city: "Madurai", category: "Religious", desc: "A stunning ancient temple complex dedicated to Goddess Meenakshi with 14 ornate gopurams.", bestTime: "Oct – Mar", entryFee: "Free / Camera Fee ₹50", image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&q=80", images: ["https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&q=80"], mapLink: "https://maps.app.goo.gl/pPLsS6kKAnwD6GKx5", nearby: ["Thirumalai Nayakkar Palace", "Gandhi Museum", "Alagar Koil"] },
      { id: "tn2", name: "Brihadeeswarar Temple", city: "Thanjavur", category: "Heritage", desc: "A UNESCO World Heritage Site — a 1000-year-old Chola masterpiece with a 66m vimana.", bestTime: "Oct – Mar", entryFee: "₹40 per person", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80", images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80"], mapLink: "https://maps.app.goo.gl/BrihadeeswaraTemple123", nearby: ["Royal Palace Museum", "Saraswati Mahal Library"] },
      { id: "tn3", name: "Mahabalipuram", city: "Mahabalipuram", category: "Heritage", desc: "A UNESCO site with stunning 7th-century rock-cut temples and Shore Temple.", bestTime: "Oct – Mar", entryFee: "₹40 Indian / ₹600 Foreign", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Mahabalipuram123", nearby: ["Shore Temple", "Crocodile Bank", "Tiger Cave"] },
      { id: "tn4", name: "Ooty", city: "Ooty", category: "Nature", desc: "The Queen of Hill Stations in the Nilgiri Mountains — tea gardens, Botanical Garden, and scenic toy train.", bestTime: "Oct – Jun", entryFee: "Free (park fees vary)", image: "https://images.unsplash.com/photo-1601899585163-b803bfac24ef?w=600&q=80", images: ["https://images.unsplash.com/photo-1601899585163-b803bfac24ef?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Ooty123", nearby: ["Coonoor", "Doddabetta Peak", "Pykara Lake"] },
      { id: "tn5", name: "Rameswaram", city: "Rameswaram", category: "Religious", desc: "One of the Char Dham pilgrimage sites — the sacred Ramanathaswamy Temple on a beautiful island.", bestTime: "Oct – Apr", entryFee: "Free", image: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&q=80", images: ["https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Rameswaram123", nearby: ["Pamban Bridge", "Dhanushkodi", "Agni Teertham"] }
    ]
  },
  {
    id: "uttar_pradesh", name: "Uttar Pradesh", capital: "Lucknow", region: "North India",
    tagline: "Heart of India — Taj Mahal, Varanasi & the Gangetic Plain",
    category: "Heritage", emoji: "🕌",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=80",
    about: "Uttar Pradesh is the spiritual and historical heartland of India. Home to the Taj Mahal, the ghats of Varanasi, and the birthplace of Lord Ram in Ayodhya.",
    bestTime: "Oct – Mar", language: "Hindi / Urdu / Awadhi", cuisine: "Lucknowi Biryani / Petha / Chaat", area: "240,928 km²",
    places: [
      {
        id: "up1", name: "Taj Mahal", city: "Agra", category: "Heritage",
        desc: "A symbol of eternal love and one of the Seven Wonders of the World.",
        bestTime: "Oct – Mar", entryFee: "₹50 Indian / ₹1300 Foreign",
        image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
          "https://picsum.photos/seed/tajMahal1/800/600",
          "https://picsum.photos/seed/tajMahal2/800/600",
          "https://picsum.photos/seed/tajMahal3/800/600"
        ],
        mapLink: "https://maps.app.goo.gl/6KuGBMBVhZKVBsAZ8",
        nearby: ["Agra Fort", "Fatehpur Sikri", "Mehtab Bagh"]
      },
      {
        id: "up2", name: "Varanasi Ghats", city: "Varanasi", category: "Religious",
        desc: "The world's oldest living city — the Ganga Aarti at Dashashwamedh Ghat is one of India's most profound experiences.",
        bestTime: "Oct – Mar", entryFee: "Free",
        image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
          "https://picsum.photos/seed/varanasi1/800/600",
          "https://picsum.photos/seed/varanasi2/800/600",
          "https://picsum.photos/seed/varanasi3/800/600"
        ],
        mapLink: "https://maps.app.goo.gl/VaranasiGhats123",
        nearby: ["Kashi Vishwanath Temple", "Sarnath", "Ramnagar Fort"]
      },
      { id: "up3", name: "Agra Fort", city: "Agra", category: "Heritage", desc: "A UNESCO World Heritage Site — a magnificent Mughal fortress.", bestTime: "Oct – Mar", entryFee: "₹40 Indian / ₹550 Foreign", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80", images: ["https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80"], mapLink: "https://maps.app.goo.gl/AgraFort123", nearby: ["Taj Mahal", "Itimad-ud-Daula", "Fatehpur Sikri"] },
      { id: "up4", name: "Prayagraj Sangam", city: "Prayagraj", category: "Religious", desc: "The sacred confluence of Ganga, Yamuna, and mythical Saraswati — site of the Kumbh Mela.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&q=80", images: ["https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&q=80"], mapLink: "https://maps.app.goo.gl/PrayagrajSangam123", nearby: ["Anand Bhawan", "Allahabad Fort", "Khusro Bagh"] },
      { id: "up5", name: "Mathura & Vrindavan", city: "Mathura", category: "Religious", desc: "The birthplace of Lord Krishna — a sacred region of 5000 temples.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&q=80", images: ["https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Mathura123", nearby: ["Banke Bihari Temple", "ISKCON", "Govardhan Hill"] }
    ]
  },
  {
    id: "karnataka", name: "Karnataka", capital: "Bengaluru", region: "South India",
    tagline: "One State, Many Worlds — Ancient Empires & Coffee Hills",
    category: "Heritage", emoji: "☕",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1620766182773-dca26f28b78e?w=1600&q=80",
    about: "Karnataka is a land of remarkable contrasts — the boulder-strewn ruins of Hampi, silk and sandalwood of Mysuru, coffee estates of Coorg, and coastal beauty of the Konkan.",
    bestTime: "Oct – Mar", language: "Kannada", cuisine: "Bisi Bele Bath / Mysore Pak", area: "191,791 km²",
    places: [
      { id: "ka1", name: "Hampi", city: "Hampi", category: "Heritage", desc: "A UNESCO World Heritage Site — the surreal ruined capital of the Vijayanagara Empire.", bestTime: "Oct – Feb", entryFee: "₹40 Indian / ₹600 Foreign", image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&q=80", images: ["https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Vy3xA7VNNhP3pnPy8", nearby: ["Virupaksha Temple", "Vittala Temple", "Anjaneya Hill"] },
      { id: "ka2", name: "Mysore Palace", city: "Mysuru", category: "Heritage", desc: "One of India's most spectacular royal palaces, ablaze with thousands of lights during Dasara.", bestTime: "Oct – Mar", entryFee: "₹70 Indian / ₹200 Foreign", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80", images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80"], mapLink: "https://maps.app.goo.gl/MysorePalace123", nearby: ["Chamundi Hills", "Brindavan Gardens", "Mysore Zoo"] },
      { id: "ka3", name: "Coorg (Kodagu)", city: "Madikeri", category: "Nature", desc: "The Scotland of India — misty coffee plantations, waterfalls, and the home of the brave Kodava people.", bestTime: "Oct – Jun", entryFee: "Free", image: "https://images.unsplash.com/photo-1601899585163-b803bfac24ef?w=600&q=80", images: ["https://images.unsplash.com/photo-1601899585163-b803bfac24ef?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Coorg123", nearby: ["Abbey Falls", "Talakaveri", "Nagarhole NP"] },
      { id: "ka4", name: "Badami Cave Temples", city: "Badami", category: "Heritage", desc: "6th-century Chalukyan rock-cut temples carved into a dramatic red sandstone gorge.", bestTime: "Oct – Mar", entryFee: "₹30 Indian / ₹500 Foreign", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"], mapLink: "https://maps.app.goo.gl/BadamiCaves123", nearby: ["Pattadakal", "Aihole", "Bhutanatha Temples"] },
      { id: "ka5", name: "Gokarna Beach", city: "Gokarna", category: "Adventure", desc: "A holy temple town with pristine beaches like Om Beach and Half Moon Beach.", bestTime: "Oct – May", entryFee: "Free", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/GokarnaOmBeach123", nearby: ["Mahabaleshwar Temple", "Kudle Beach", "Om Beach"] }
    ]
  },
  {
    id: "west_bengal", name: "West Bengal", capital: "Kolkata", region: "East India",
    tagline: "City of Joy & Royal Bengal — Culture, Tigers & Tea",
    category: "Heritage", emoji: "🎨",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    about: "West Bengal is the cultural capital of India — the land of Rabindranath Tagore, Satyajit Ray, and Mother Teresa. From vibrant Kolkata to the misty Darjeeling tea gardens and UNESCO Sundarbans.",
    bestTime: "Oct – Mar", language: "Bengali", cuisine: "Hilsa Fish / Mishti Doi / Rasgulla", area: "88,752 km²",
    places: [
      { id: "wb1", name: "Victoria Memorial", city: "Kolkata", category: "Heritage", desc: "A magnificent white marble monument built for Queen Victoria, now a premier museum.", bestTime: "Oct – Mar", entryFee: "₹30 Indian / ₹500 Foreign", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"], mapLink: "https://maps.app.goo.gl/pGv75iDy5KWnEaAb7", nearby: ["Howrah Bridge", "Indian Museum", "Park Street"] },
      { id: "wb2", name: "Darjeeling Tea Gardens", city: "Darjeeling", category: "Nature", desc: "Rolling hillsides covered in emerald tea gardens with the iconic Kangchenjunga backdrop at sunrise.", bestTime: "Mar – May, Oct – Nov", entryFee: "Free (tours extra)", image: "https://images.unsplash.com/photo-1601899585163-b803bfac24ef?w=600&q=80", images: ["https://images.unsplash.com/photo-1601899585163-b803bfac24ef?w=600&q=80"], mapLink: "https://maps.app.goo.gl/DarjeelingTeaGardens123", nearby: ["Tiger Hill Sunrise", "Toy Train", "Peace Pagoda"] },
      { id: "wb3", name: "Sundarbans", city: "South 24 Parganas", category: "Nature", desc: "The world's largest mangrove delta, a UNESCO World Heritage Site and home to the Royal Bengal Tiger.", bestTime: "Nov – Feb", entryFee: "₹150 Indian / ₹1000 Foreign", image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&q=80", images: ["https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Sundarbans123", nearby: ["Sajnekhali Bird Sanctuary", "Dobanki Canopy Walk"] },
      { id: "wb4", name: "Howrah Bridge", city: "Kolkata", category: "Heritage", desc: "The iconic cantilever bridge over the Hooghly River — an engineering marvel and symbol of Kolkata.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"], mapLink: "https://maps.app.goo.gl/HowrahBridge123", nearby: ["Dakshineswar Temple", "Belur Math"] }
    ]
  },
  {
    id: "gujarat", name: "Gujarat", capital: "Gandhinagar", region: "West India",
    tagline: "Land of Gandhi & the Rann — White Desert & Sacred Pilgrims",
    category: "Heritage", emoji: "🦁",
    image: "https://images.unsplash.com/photo-1603305294695-7d20b1a2fc6a?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1603305294695-7d20b1a2fc6a?w=1600&q=80",
    about: "Gujarat is a state of superlatives — the only home of Asiatic lions at Gir, the white salt desert of the Rann of Kutch, and the birthplace of Mahatma Gandhi.",
    bestTime: "Oct – Mar", language: "Gujarati", cuisine: "Dhokla / Thepla / Dal Baati", area: "196,024 km²",
    places: [
      { id: "gj1", name: "Rann of Kutch", city: "Kutch", category: "Nature", desc: "The world's largest salt flat — a surreal white desert that transforms during the Rann Utsav festival.", bestTime: "Nov – Feb", entryFee: "Rann Utsav package ₹3000+", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80", images: ["https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80"], mapLink: "https://maps.app.goo.gl/RannOfKutch123", nearby: ["Bhuj", "Dholavira", "Mandvi Beach"] },
      { id: "gj2", name: "Gir National Park", city: "Junagadh", category: "Nature", desc: "The only wild habitat of the Asiatic lion on Earth — a thrilling safari into pristine forest.", bestTime: "Dec – Jun", entryFee: "₹75 Indian / ₹1000 Foreign + Safari", image: "https://images.unsplash.com/photo-1526566661780-1a67ea3c863e?w=600&q=80", images: ["https://images.unsplash.com/photo-1526566661780-1a67ea3c863e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/GirNP123", nearby: ["Somnath Temple", "Junagadh Fort", "Diu Island"] },
      { id: "gj3", name: "Somnath Temple", city: "Somnath", category: "Religious", desc: "The first of the twelve Jyotirlingas, rebuilt seven times, standing on the shores of the Arabian Sea.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&q=80", images: ["https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&q=80"], mapLink: "https://maps.app.goo.gl/SomnathTemple123", nearby: ["Prabhas Patan Museum", "Bhalka Tirth", "Gir Forest"] },
      { id: "gj4", name: "Rani ki Vav", city: "Patan", category: "Heritage", desc: "A UNESCO stepwell of extraordinary beauty — 7 storeys deep with over 500 principal sculptures.", bestTime: "Oct – Mar", entryFee: "₹40 Indian / ₹600 Foreign", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"], mapLink: "https://maps.app.goo.gl/RaniKiVav123", nearby: ["Patan Patola Museum", "Sahastralinga Tank"] }
    ]
  },
  {
    id: "maharashtra", name: "Maharashtra", capital: "Mumbai", region: "West India",
    tagline: "Mumbai Dreams & Ancient Caves — Gateway of India",
    category: "Heritage", emoji: "🌊",
    image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=1600&q=80",
    about: "Maharashtra is India's economic powerhouse. From the Gateway of India and Bollywood dreams of Mumbai to the ancient Ajanta & Ellora caves and Hill Stations of Mahabaleshwar.",
    bestTime: "Oct – Mar", language: "Marathi", cuisine: "Vada Pav / Puran Poli / Misal Pav", area: "307,713 km²",
    places: [
      { id: "mh1", name: "Ajanta & Ellora Caves", city: "Aurangabad", category: "Heritage", desc: "UNESCO World Heritage caves — Ajanta's 2nd century BC Buddhist frescoes and Ellora's rock sculptures.", bestTime: "Oct – Mar", entryFee: "₹40 Indian / ₹600 Foreign each", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"], mapLink: "https://maps.app.goo.gl/AjantaCaves123", nearby: ["Bibi Ka Maqbara", "Daulatabad Fort", "Grishneshwar Temple"] },
      { id: "mh2", name: "Gateway of India", city: "Mumbai", category: "Heritage", desc: "The iconic 1924 basalt arch monument overlooking the Arabian Sea — the symbol of Mumbai.", bestTime: "Nov – Feb", entryFee: "Free", image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80", images: ["https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80"], mapLink: "https://maps.app.goo.gl/GatewayOfIndia123", nearby: ["Elephanta Caves", "Colaba Causeway", "Taj Mahal Palace Hotel"] },
      { id: "mh3", name: "Lonavala & Khandala", city: "Pune", category: "Nature", desc: "Popular hill stations between Mumbai and Pune with waterfalls and scenic viewpoints.", bestTime: "Jun – Sep, Nov – Feb", entryFee: "Free", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Lonavala123", nearby: ["Rajmachi Fort", "Karla Caves", "Bhushi Dam"] },
      { id: "mh4", name: "Mahabaleshwar", city: "Satara", category: "Nature", desc: "Maharashtra's premier hill station, famous for strawberries, multiple viewpoints, and Krishna River origin.", bestTime: "Oct – Jun", entryFee: "Free", image: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=600&q=80", images: ["https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Mahabaleshwar123", nearby: ["Pratapgad Fort", "Panchgani", "Tapola"] }
    ]
  },
  {
    id: "madhya_pradesh", name: "Madhya Pradesh", capital: "Bhopal", region: "Central India",
    tagline: "Heart of Incredible India — Tigers, Temples & Rock Art",
    category: "Nature", emoji: "🐯",
    image: "https://images.unsplash.com/photo-1615824996195-f780bba7cfde?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1615824996195-f780bba7cfde?w=1600&q=80",
    about: "Madhya Pradesh sits at the geographical heart of India and is its premier tiger safari destination. Also boasts UNESCO-listed Bhimbetka, the temples of Khajuraho, and Buddhist stupa at Sanchi.",
    bestTime: "Oct – Jun", language: "Hindi", cuisine: "Dal Bafla / Bhutte ka kees / Poha Jalebi", area: "308,252 km²",
    places: [
      { id: "mp1", name: "Khajuraho Temples", city: "Khajuraho", category: "Heritage", desc: "A UNESCO World Heritage Site — stunning 10th-century Chandela temples adorned with intricate sculptures.", bestTime: "Oct – Mar", entryFee: "₹40 Indian / ₹600 Foreign", image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&q=80", images: ["https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&q=80"], mapLink: "https://maps.app.goo.gl/KhajurahoTemples123", nearby: ["Panna National Park", "Raneh Falls", "Ajaigarh Fort"] },
      { id: "mp2", name: "Bandhavgarh Tiger Reserve", city: "Umaria", category: "Nature", desc: "India's highest density of Bengal tigers — one of the best chances to spot a tiger in the wild.", bestTime: "Oct – Jun", entryFee: "₹1500 – ₹3000 + Safari", image: "https://images.unsplash.com/photo-1615824996195-f780bba7cfde?w=600&q=80", images: ["https://images.unsplash.com/photo-1615824996195-f780bba7cfde?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Bandhavgarh123", nearby: ["Bandhavgarh Fort", "Kanha NP"] },
      { id: "mp3", name: "Sanchi Stupa", city: "Sanchi", category: "Heritage", desc: "A UNESCO site — India's oldest stone structure, commissioned by Emperor Ashoka in 3rd century BC.", bestTime: "Oct – Mar", entryFee: "₹40 Indian / ₹600 Foreign", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80", images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80"], mapLink: "https://maps.app.goo.gl/SanchiStupa123", nearby: ["Udaigiri Caves", "Vidisha", "Raisen Fort"] },
      { id: "mp4", name: "Orchha", city: "Tikamgarh", category: "Heritage", desc: "A medieval town frozen in time with riverside cenotaphs, Ram Raja Temple, and Bundela palaces.", bestTime: "Oct – Mar", entryFee: "₹250 Complex", image: "https://images.unsplash.com/photo-1561693532-9ff59442830b?w=600&q=80", images: ["https://images.unsplash.com/photo-1561693532-9ff59442830b?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Orchha123", nearby: ["Jehangir Mahal", "Lakshmi Narayan Temple", "Betwa River"] }
    ]
  },
  {
    id: "punjab", name: "Punjab", capital: "Chandigarh", region: "North India",
    tagline: "Land of Five Rivers — Where Sikh Heritage Meets Golden Harvest",
    category: "Heritage", emoji: "🌾",
    image: "https://images.unsplash.com/photo-1561693532-9ff59442830b?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1561693532-9ff59442830b?w=1600&q=80",
    about: "Punjab, the 'Land of Five Rivers', is the homeland of the Sikh faith. The Golden Temple of Amritsar is the world's most visited sacred site.",
    bestTime: "Oct – Mar", language: "Punjabi / Hindi", cuisine: "Butter Chicken / Makki di Roti / Lassi", area: "50,362 km²",
    places: [
      { id: "pb1", name: "Golden Temple", city: "Amritsar", category: "Religious", desc: "Harmandir Sahib — the holiest shrine of Sikhism, sheathed in gold, reflected in the sacred Amrit Sarovar pool.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1561693532-9ff59442830b?w=600&q=80", images: ["https://images.unsplash.com/photo-1561693532-9ff59442830b?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Sq8V9i2bUc5zE9Xr5", nearby: ["Jallianwala Bagh", "Partition Museum", "Wagah Border"] },
      { id: "pb2", name: "Wagah Border Ceremony", city: "Amritsar", category: "Heritage", desc: "The electrifying evening flag lowering ceremony at the India-Pakistan border.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1574482620826-5b9c1b14d4db?w=600&q=80", images: ["https://images.unsplash.com/photo-1574482620826-5b9c1b14d4db?w=600&q=80"], mapLink: "https://maps.app.goo.gl/WagahBorder123", nearby: ["Golden Temple", "Durgiana Temple"] },
      { id: "pb3", name: "Anandpur Sahib", city: "Rupnagar", category: "Religious", desc: "The City of Divine Bliss — where Guru Gobind Singh founded the Khalsa Panth in 1699.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&q=80", images: ["https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&q=80"], mapLink: "https://maps.app.goo.gl/AnandpurSahib123", nearby: ["Virasat-e-Khalsa Museum", "Bhakra Dam", "Naina Devi"] }
    ]
  },
  {
    id: "andhra_pradesh", name: "Andhra Pradesh", capital: "Amaravati", region: "South India",
    tagline: "Rice Bowl of India — Temples, Coasts & Tirupati",
    category: "Religious", emoji: "🌶️",
    image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=1600&q=80",
    about: "Andhra Pradesh is famous for the world's richest and most-visited temple — Tirumala Tirupati. Also boasts the Buddhist heritage of Amaravati and scenic Araku Valley.",
    bestTime: "Oct – Feb", language: "Telugu", cuisine: "Pesarattu / Gongura / Biryani", area: "162,975 km²",
    places: [
      { id: "ap1", name: "Tirumala Tirupati", city: "Tirupati", category: "Religious", desc: "The world's most visited and wealthiest pilgrimage site — the abode of Lord Venkateswara.", bestTime: "Oct – Feb", entryFee: "Free (Darshan fees vary)", image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&q=80", images: ["https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Tirupati123", nearby: ["Srikalahasti Temple", "Chandragiri Fort"] },
      { id: "ap2", name: "Araku Valley", city: "Visakhapatnam", category: "Nature", desc: "A scenic tribal hill station at 900m with coffee plantations, waterfalls, and scenic toy train ride.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1601899585163-b803bfac24ef?w=600&q=80", images: ["https://images.unsplash.com/photo-1601899585163-b803bfac24ef?w=600&q=80"], mapLink: "https://maps.app.goo.gl/ArakuValley123", nearby: ["Borra Caves", "Chaparai Waterfalls", "Tribal Museum"] },
      { id: "ap3", name: "Visakhapatnam Beach", city: "Vizag", category: "Adventure", desc: "RK Beach and Rushikonda Beach with the submarine museum and one of India's prettiest beachfronts.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/VizagRKBeach123", nearby: ["INS Kurusura Museum", "Kailasagiri", "Indira Gandhi Zoo"] }
    ]
  },
  {
    id: "telangana", name: "Telangana", capital: "Hyderabad", region: "South India",
    tagline: "City of Pearls — Nizami Grandeur & Deccan Plateaus",
    category: "Heritage", emoji: "🕌",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&q=80",
    about: "Telangana is dominated by the grandeur of Hyderabad — the City of Pearls and Nizams. The state boasts the iconic Charminar, Golconda Fort, and is the Biryani capital of the world.",
    bestTime: "Oct – Mar", language: "Telugu / Urdu", cuisine: "Hyderabadi Biryani / Haleem", area: "112,077 km²",
    places: [
      { id: "tg1", name: "Charminar", city: "Hyderabad", category: "Heritage", desc: "The 1591 monument and mosque synonymous with Hyderabad — surrounded by the famous Laad Bazaar.", bestTime: "Oct – Mar", entryFee: "₹25 Indian / ₹300 Foreign", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"], mapLink: "https://maps.app.goo.gl/nnzDFuqF9MkpVeFT6", nearby: ["Golconda Fort", "Salar Jung Museum", "Mecca Masjid"] },
      { id: "tg2", name: "Golconda Fort", city: "Hyderabad", category: "Heritage", desc: "A spectacular ruined citadel with extraordinary acoustics and famous diamond mine history.", bestTime: "Oct – Mar", entryFee: "₹35 Indian / ₹500 Foreign", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"], mapLink: "https://maps.app.goo.gl/GolcondaFort123", nearby: ["Qutb Shahi Tombs", "Taramati Baradari"] },
      { id: "tg3", name: "Ramoji Film City", city: "Hyderabad", category: "Adventure", desc: "The world's largest film studio complex — a unique entertainment destination spread over 1666 acres.", bestTime: "Oct – Mar", entryFee: "₹1150 per adult", image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&q=80", images: ["https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&q=80"], mapLink: "https://maps.app.goo.gl/RamojiFilmCity123", nearby: ["Hussain Sagar Lake", "Birla Mandir"] }
    ]
  },
  {
    id: "odisha", name: "Odisha", capital: "Bhubaneswar", region: "East India",
    tagline: "Temple State & Tribal Soul — Konark, Puri & Chilika",
    category: "Heritage", emoji: "🚂",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&q=80",
    about: "Odisha is known as the 'Soul of Incredible India'. Home to the magnificent Konark Sun Temple, Jagannath Temple of Puri, Asia's largest lagoon Chilika Lake.",
    bestTime: "Oct – Feb", language: "Odia", cuisine: "Dalma / Chena Poda / Pakhala", area: "155,707 km²",
    places: [
      { id: "od1", name: "Konark Sun Temple", city: "Konark", category: "Heritage", desc: "A UNESCO masterpiece — a 13th century temple designed as a colossal chariot of the Sun God.", bestTime: "Oct – Mar", entryFee: "₹40 Indian / ₹600 Foreign", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80", images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80"], mapLink: "https://maps.app.goo.gl/KonarkSunTemple123", nearby: ["Puri Beach", "Chandrabhaga Beach", "Marine Drive"] },
      { id: "od2", name: "Puri Jagannath Temple", city: "Puri", category: "Religious", desc: "One of the Char Dham pilgrimage sites — the divine abode of Lord Jagannath.", bestTime: "Oct – Mar", entryFee: "Free (Hindus only)", image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&q=80", images: ["https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&q=80"], mapLink: "https://maps.app.goo.gl/JagannathTemple123", nearby: ["Puri Beach", "Chilika Lake", "Raghurajpur"] },
      { id: "od3", name: "Chilika Lake", city: "Puri / Ganjam", category: "Nature", desc: "Asia's largest coastal lagoon hosting a million migratory birds including flamingos and Irrawaddy dolphins.", bestTime: "Nov – Feb", entryFee: "₹100 Boat Ride", image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&q=80", images: ["https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&q=80"], mapLink: "https://maps.app.goo.gl/ChilikaLake123", nearby: ["Nalabana Bird Sanctuary", "Satapada"] }
    ]
  },
  {
    id: "bihar", name: "Bihar", capital: "Patna", region: "East India",
    tagline: "Cradle of Civilizations — Buddha, Mahavira & the Mauryas",
    category: "Heritage", emoji: "🙏",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1600&q=80",
    about: "Bihar is the birthplace of two of the world's greatest religions — Buddhism and Jainism. Home to Bodh Gaya, Nalanda, Vaishali, and Rajgir.",
    bestTime: "Oct – Mar", language: "Hindi / Bhojpuri / Maithili", cuisine: "Litti Chokha / Sattu Paratha", area: "94,163 km²",
    places: [
      { id: "bh1", name: "Bodh Gaya", city: "Gaya", category: "Religious", desc: "The most sacred site in Buddhism — where Siddhartha Gautama attained enlightenment under the Bodhi tree.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80", images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80"], mapLink: "https://maps.app.goo.gl/BodhGaya123", nearby: ["Mahabodhi Temple", "80ft Buddha Statue", "Thai Monastery"] },
      { id: "bh2", name: "Nalanda University Ruins", city: "Nalanda", category: "Heritage", desc: "The ruins of the world's first great university, established in 5th century AD, a UNESCO World Heritage Site.", bestTime: "Oct – Mar", entryFee: "₹25 Indian / ₹300 Foreign", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Nalanda123", nearby: ["Nalanda Archaeological Museum", "Rajgir", "Pawapuri"] }
    ]
  },
  {
    id: "assam", name: "Assam", capital: "Dispur", region: "Northeast India",
    tagline: "Land of Red River & Blue Hills — Rhinos, Tea & Silk",
    category: "Nature", emoji: "🦏",
    image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1600&q=80",
    about: "Assam is the gateway to Northeast India, famous for one-horned rhinos at Kaziranga, the world's largest river island Majuli, and Assam tea estates.",
    bestTime: "Nov – Apr", language: "Assamese / Bengali", cuisine: "Masor Tenga / Khar", area: "78,438 km²",
    places: [
      { id: "as1", name: "Kaziranga National Park", city: "Golaghat", category: "Nature", desc: "UNESCO World Heritage Site — home to two-thirds of the world's one-horned rhinoceros population.", bestTime: "Nov – Apr", entryFee: "₹500 Indian / ₹1000 Foreign", image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&q=80", images: ["https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Kaziranga123", nearby: ["Majuli Island", "Sibsagar", "Dibrugarh Tea Gardens"] },
      { id: "as2", name: "Majuli Island", city: "Jorhat", category: "Heritage", desc: "The world's largest river island on the Brahmaputra, seat of neo-Vaishnavite culture.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=600&q=80", images: ["https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=600&q=80"], mapLink: "https://maps.app.goo.gl/MajuliIsland123", nearby: ["Raas Mahotsav", "Auniati Satra"] },
      { id: "as3", name: "Kamakhya Temple", city: "Guwahati", category: "Religious", desc: "One of the 51 Shakti Peethas — a powerful tantric temple atop Nilachal Hill overlooking the Brahmaputra.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&q=80", images: ["https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&q=80"], mapLink: "https://maps.app.goo.gl/KamakhyaTemple123", nearby: ["Umananda Island", "Nehru Park", "Balaji Temple"] }
    ]
  },
  {
    id: "jammu_kashmir", name: "Jammu & Kashmir", capital: "Srinagar / Jammu", region: "North India",
    tagline: "Paradise on Earth — Dal Lake, Tulip Gardens & Gulmarg Snow",
    category: "Nature", emoji: "🌷",
    image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1600&q=80",
    about: "Jammu & Kashmir is rightly called Paradise on Earth. The Valley of Kashmir with its Dal Lake houseboats, Mughal gardens, tulip fields, and Gulmarg ski slopes is extraordinarily beautiful.",
    bestTime: "Apr – Oct", language: "Kashmiri / Dogri / Urdu", cuisine: "Wazwan / Rogan Josh / Dum Aloo", area: "42,241 km²",
    places: [
      { id: "jk1", name: "Dal Lake", city: "Srinagar", category: "Nature", desc: "The jewel of Kashmir — a shikara ride among floating gardens and iconic wooden houseboats.", bestTime: "Apr – Oct", entryFee: "Shikara ₹500/hour", image: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=80", images: ["https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=80"], mapLink: "https://maps.app.goo.gl/gxdELWX7rMQ3WGFJ7", nearby: ["Nishat Bagh", "Shalimar Bagh", "Shankaracharya Temple"] },
      { id: "jk2", name: "Gulmarg", city: "Baramulla", category: "Adventure", desc: "Asia's highest golf course and premier ski resort — cable car to 3979m offers Himalayan panoramas.", bestTime: "Dec – Mar (ski), May – Sep", entryFee: "Gondola ₹740 – ₹920", image: "https://images.unsplash.com/photo-1553408633-ad37fdf44779?w=600&q=80", images: ["https://images.unsplash.com/photo-1553408633-ad37fdf44779?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Gulmarg123", nearby: ["Apherwat Peak", "Alpather Lake", "Tangmarg"] },
      { id: "jk3", name: "Pahalgam", city: "Anantnag", category: "Nature", desc: "Valley of Shepherds — the base for the sacred Amarnath Yatra pilgrimage, with lush meadows.", bestTime: "Apr – Nov", entryFee: "Free", image: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=600&q=80", images: ["https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Pahalgam123", nearby: ["Betaab Valley", "Chandanwari", "Aru Valley"] }
    ]
  },
  {
    id: "ladakh", name: "Ladakh", capital: "Leh", region: "North India",
    tagline: "The Land of High Passes — Moonscapes, Monasteries & Pangong",
    category: "Adventure", emoji: "🏔️",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&q=80",
    about: "Ladakh offers stark lunar landscapes, ancient Tibetan Buddhist monasteries, pristine blue lakes, and the world-famous Leh-Manali Highway.",
    bestTime: "Jun – Sep", language: "Ladakhi / Hindi", cuisine: "Thukpa / Skyu / Butter Tea", area: "59,146 km²",
    places: [
      {
        id: "ld1", name: "Pangong Lake", city: "Leh", category: "Nature",
        desc: "The world's highest saltwater lake at 4350m — changing hues of blue and turquoise set against barren Himalayas.",
        bestTime: "Jun – Sep", entryFee: "₹400 per person (Permit)",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
          "https://picsum.photos/seed/pangong1/800/600",
          "https://picsum.photos/seed/pangong2/800/600",
          "https://picsum.photos/seed/pangong3/800/600"
        ],
        mapLink: "https://maps.app.goo.gl/uBwNHpFkBXvRXSPn9",
        nearby: ["Chang La Pass", "Spangmik Village", "Lukung"]
      },
      { id: "ld2", name: "Nubra Valley", city: "Leh", category: "Adventure", desc: "A cold desert valley with sand dunes, double-humped Bactrian camels, and the historic Silk Route.", bestTime: "Jun – Sep", entryFee: "Permit required", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80", images: ["https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80"], mapLink: "https://maps.app.goo.gl/NubraValley123", nearby: ["Diskit Monastery", "Hunder Sand Dunes", "Siachen Base Camp"] },
      { id: "ld3", name: "Thiksey Monastery", city: "Leh", category: "Heritage", desc: "A spectacular 12-storey whitewashed monastery resembling the Potala Palace in Lhasa.", bestTime: "Jun – Sep", entryFee: "₹30 per person", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"], mapLink: "https://maps.app.goo.gl/ThikseyMonastery123", nearby: ["Hemis Monastery", "Shey Palace", "Stok Palace"] },
      { id: "ld4", name: "Magnetic Hill", city: "Leh", category: "Adventure", desc: "A famous gravity hill where vehicles appear to roll uphill — a fascinating optical illusion.", bestTime: "Jun – Sep", entryFee: "Free", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80", images: ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/MagneticHill123", nearby: ["Gurudwara Pathar Sahib", "Indus-Zanskar Sangam"] }
    ]
  },
  {
    id: "sikkim", name: "Sikkim", capital: "Gangtok", region: "Northeast India",
    tagline: "Himalayan Jewel — Monasteries, Yaks & Kangchenjunga",
    category: "Nature", emoji: "🌺",
    image: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=1600&q=80",
    about: "Sikkim is India's least populous and most pristine state — home to Kangchenjunga and ancient monasteries.",
    bestTime: "Mar – May, Oct – Dec", language: "Nepali / Sikkimese / Lepcha", cuisine: "Thukpa / Momos / Sel Roti", area: "7,096 km²",
    places: [
      { id: "sk1", name: "Tsomgo Lake", city: "Gangtok", category: "Nature", desc: "A sacred glacial lake at 3753m, also called Changu Lake, surrounded by mountains.", bestTime: "Oct – May", entryFee: "Permit required + ₹50 entry", image: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=600&q=80", images: ["https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/TsomgoLake123", nearby: ["Baba Harbhajan Singh Temple", "Nathula Pass"] },
      { id: "sk2", name: "Rumtek Monastery", city: "Gangtok", category: "Religious", desc: "One of the most important Kagyu monasteries in the world, with sacred relics.", bestTime: "Mar – May, Oct – Dec", entryFee: "Free", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"], mapLink: "https://maps.app.goo.gl/RumtekMonastery123", nearby: ["Gangtok MG Marg", "Phodong Monastery"] },
      { id: "sk3", name: "Yumthang Valley", city: "Lachung", category: "Nature", desc: "The Valley of Flowers of Sikkim — a stunning high-altitude valley with hot springs and rhododendrons.", bestTime: "Apr – May, Oct – Nov", entryFee: "Permit required", image: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=600&q=80", images: ["https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/YumthangValley123", nearby: ["Lachung Village", "Zero Point"] }
    ]
  },
  {
    id: "arunachal_pradesh", name: "Arunachal Pradesh", capital: "Itanagar", region: "Northeast India",
    tagline: "Land of the Dawn-Lit Mountains — Tribes, Monasteries & Mighty Rivers",
    category: "Adventure", emoji: "🌅",
    image: "https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=1600&q=80",
    about: "Arunachal Pradesh is India's easternmost state — home to over 26 major tribes, ancient Buddhist monasteries, and pristine Himalayan landscapes.",
    bestTime: "Oct – Apr", language: "Nyishi / Adi / Bengali", cuisine: "Apong (rice beer) / Bamboo Shoot Curry", area: "83,743 km²",
    places: [
      { id: "ar1", name: "Tawang Monastery", city: "Tawang", category: "Religious", desc: "India's largest Buddhist monastery at 3048m — a 17th-century Gelugpa monastery with golden Buddha statues.", bestTime: "Mar – Oct", entryFee: "Free", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"], mapLink: "https://maps.app.goo.gl/TawangMonastery123", nearby: ["Sela Pass", "Madhuri Lake", "Namdapha NP"] },
      { id: "ar2", name: "Ziro Valley", city: "Lower Subansiri", category: "Heritage", desc: "A UNESCO tentative site and home of the Apatani tribe with unique paddy-cum-fish cultivation.", bestTime: "Sep – Oct", entryFee: "ILP required", image: "https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=600&q=80", images: ["https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=600&q=80"], mapLink: "https://maps.app.goo.gl/ZiroValley123", nearby: ["Ziro Music Festival", "Talley Valley WS"] }
    ]
  },
  {
    id: "nagaland", name: "Nagaland", capital: "Kohima", region: "Northeast India",
    tagline: "Land of Festivals — Warrior Tribes & Hornbill Pride",
    category: "Heritage", emoji: "🦅",
    image: "https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=1600&q=80",
    about: "Nagaland is home to 16 major tribes each with distinct traditions. The Hornbill Festival in December is India's most vibrant cultural spectacle.",
    bestTime: "Oct – May", language: "Nagamese / English / Tribal", cuisine: "Smoked Pork / Bamboo Shoot / Axone", area: "16,579 km²",
    places: [
      { id: "ng1", name: "Hornbill Festival", city: "Kisama", category: "Heritage", desc: "The Festival of Festivals — ten days of inter-tribal cultural performances and Naga warrior displays.", bestTime: "Dec 1–10", entryFee: "₹100 Indian / ₹200 Foreign", image: "https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=600&q=80", images: ["https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=600&q=80"], mapLink: "https://maps.app.goo.gl/HornbillFestival123", nearby: ["Kohima War Cemetery", "Dzukou Valley"] },
      { id: "ng2", name: "Kohima War Cemetery", city: "Kohima", category: "Heritage", desc: "A poignant WWII cemetery where Allied forces stopped the Japanese advance in 1944.", bestTime: "Oct – May", entryFee: "Free", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"], mapLink: "https://maps.app.goo.gl/KohimaCemetery123", nearby: ["Hornbill Festival Site", "Dzukou Valley Trek"] }
    ]
  },
  {
    id: "manipur", name: "Manipur", capital: "Imphal", region: "Northeast India",
    tagline: "Jewel of India — Loktak Lake & Classical Dance",
    category: "Nature", emoji: "💎",
    image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1600&q=80",
    about: "Manipur, the 'Jewel of India', is famous for Loktak Lake — the only floating lake in the world. Also the birthplace of Polo and classical Manipuri dance.",
    bestTime: "Oct – Apr", language: "Meitei / Bengali", cuisine: "Eromba / Singju / Nga-Thongba", area: "22,327 km²",
    places: [
      { id: "mn1", name: "Loktak Lake", city: "Bishnupur", category: "Nature", desc: "The world's only floating lake with circular phumdis (floating biomass islands) and the endangered sangai deer.", bestTime: "Oct – Apr", entryFee: "₹50 per person", image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&q=80", images: ["https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&q=80"], mapLink: "https://maps.app.goo.gl/LoktakLake123", nearby: ["Sendra Island", "Keibul Lamjao NP"] }
    ]
  },
  {
    id: "mizoram", name: "Mizoram", capital: "Aizawl", region: "Northeast India",
    tagline: "Land of the Blue Mountains — Bamboo Forests & Blue Poppy",
    category: "Nature", emoji: "💙",
    image: "https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1531016417960-eb0289302eed?w=1600&q=80",
    about: "Mizoram, the Land of Blue Mountains, is a serene Himalayan state of bamboo forests, terraced fields, and one of India's most literate societies.",
    bestTime: "Oct – Mar", language: "Mizo / English", cuisine: "Bai / Sawhchiar / Mizo Vawksa", area: "21,087 km²",
    places: [
      { id: "mz1", name: "Vantawng Falls", city: "Serchhip", category: "Nature", desc: "Mizoram's highest waterfall at 229 metres, cascading through dense sub-tropical forest.", bestTime: "Jun – Sep", entryFee: "Free", image: "https://images.unsplash.com/photo-1584197045060-3b5ac2e16b2e?w=600&q=80", images: ["https://images.unsplash.com/photo-1584197045060-3b5ac2e16b2e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/VantawngFalls123", nearby: ["Reiek Heritage Village", "Aizawl Museum"] }
    ]
  },
  {
    id: "tripura", name: "Tripura", capital: "Agartala", region: "Northeast India",
    tagline: "Royal Bengal Heritage — Palaces, Lakes & Bamboo Culture",
    category: "Heritage", emoji: "👑",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    about: "Tripura is a small but historically rich state surrounded by Bangladesh on three sides, with beautiful palaces and the sacred Tripura Sundari Temple.",
    bestTime: "Oct – Mar", language: "Bengali / Kokborok", cuisine: "Mui Borok / Gudok / Wahan Mosdeng", area: "10,486 km²",
    places: [
      { id: "tr1", name: "Ujjayanta Palace", city: "Agartala", category: "Heritage", desc: "A magnificent 1901 royal palace with Mughal and European architectural elements, now a state museum.", bestTime: "Oct – Mar", entryFee: "₹10 Indian / ₹100 Foreign", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"], mapLink: "https://maps.app.goo.gl/UjjayantaPalace123", nearby: ["Tripura Sundari Temple", "Neermahal Palace"] }
    ]
  },
  {
    id: "jharkhand", name: "Jharkhand", capital: "Ranchi", region: "East India",
    tagline: "Land of Forests — Tribal Heritage & Waterfalls",
    category: "Nature", emoji: "🌿",
    image: "https://images.unsplash.com/photo-1584197045060-3b5ac2e16b2e?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1584197045060-3b5ac2e16b2e?w=1600&q=80",
    about: "Jharkhand is a land of dense forests, tribal cultures, and spectacular waterfalls.",
    bestTime: "Oct – Mar", language: "Hindi / Santali / Ho", cuisine: "Dhuska / Rugra / Pitha", area: "79,716 km²",
    places: [
      { id: "jh1", name: "Hundru Falls", city: "Ranchi", category: "Nature", desc: "A spectacular 98-metre waterfall on the Subarnarekha River — Jharkhand's highest waterfall.", bestTime: "Oct – Mar", entryFee: "₹20 per person", image: "https://images.unsplash.com/photo-1584197045060-3b5ac2e16b2e?w=600&q=80", images: ["https://images.unsplash.com/photo-1584197045060-3b5ac2e16b2e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/HundruFalls123", nearby: ["Jonha Falls", "Dassam Falls", "Betla NP"] },
      { id: "jh2", name: "Deoghar Temple", city: "Deoghar", category: "Religious", desc: "The Baidyanath Jyotirlinga — one of the twelve sacred Jyotirlingas, a major Shravani Mela pilgrimage destination.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&q=80", images: ["https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600&q=80"], mapLink: "https://maps.app.goo.gl/DeogharTemple123", nearby: ["Tapovan", "Nandan Pahar", "Satsang Ashram"] }
    ]
  },
  {
    id: "chhattisgarh", name: "Chhattisgarh", capital: "Raipur", region: "Central India",
    tagline: "Rice Bowl of Central India — Waterfalls, Caves & Tribal Villages",
    category: "Nature", emoji: "🌊",
    image: "https://images.unsplash.com/photo-1584197045060-3b5ac2e16b2e?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1584197045060-3b5ac2e16b2e?w=1600&q=80",
    about: "Chhattisgarh is an emerging destination known for India's widest waterfall Chitrakote, the Kanger Valley caves, and rich Gondi tribal culture.",
    bestTime: "Oct – Mar", language: "Hindi / Chhattisgarhi", cuisine: "Chila / Faraa / Bafauri", area: "135,192 km²",
    places: [
      { id: "cg1", name: "Chitrakote Falls", city: "Bastar", category: "Nature", desc: "India's widest waterfall — the 'Niagara of India' at 300 metres wide on the Indravati River.", bestTime: "Oct – Feb", entryFee: "Free", image: "https://images.unsplash.com/photo-1584197045060-3b5ac2e16b2e?w=600&q=80", images: ["https://images.unsplash.com/photo-1584197045060-3b5ac2e16b2e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/ChitrakateFalls123", nearby: ["Tirathgarh Falls", "Kanger Valley NP", "Kutumsar Caves"] }
    ]
  },
  {
    id: "haryana", name: "Haryana", capital: "Chandigarh", region: "North India",
    tagline: "Land of the Mahabharata — Kurukshetra, Surajkund & Rural Fiesta",
    category: "Heritage", emoji: "⚔️",
    image: "https://images.unsplash.com/photo-1561693532-9ff59442830b?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1561693532-9ff59442830b?w=1600&q=80",
    about: "Haryana is the land where the epic Mahabharata war was fought at Kurukshetra.",
    bestTime: "Oct – Mar", language: "Hindi / Haryanvi", cuisine: "Kadhi Pakora / Bajra Khichdi / Churma", area: "44,212 km²",
    places: [
      { id: "hy1", name: "Kurukshetra", city: "Kurukshetra", category: "Religious", desc: "The sacred battlefield of the Mahabharata — Brahma Sarovar is one of India's holiest sites.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80", images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Kurukshetra123", nearby: ["Jyotisar Tirth", "Sheikh Chilli's Tomb", "Kurukshetra Museum"] },
      { id: "hy2", name: "Surajkund", city: "Faridabad", category: "Heritage", desc: "A 10th-century sun-shaped reservoir and venue of the world-famous annual International Crafts Mela.", bestTime: "Feb (Mela)", entryFee: "₹120 during Mela", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80", images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Surajkund123", nearby: ["Badkhal Lake", "Aravalli Golf Club"] }
    ]
  },
  {
    id: "chandigarh", name: "Chandigarh", capital: "Chandigarh", region: "North India",
    tagline: "The City Beautiful — Le Corbusier's Modernist Masterpiece",
    category: "Heritage", emoji: "🏛️",
    image: "https://images.unsplash.com/photo-1553408633-ad37fdf44779?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1553408633-ad37fdf44779?w=1600&q=80",
    about: "Chandigarh is India's first planned city, designed by the legendary Swiss-French architect Le Corbusier.",
    bestTime: "Oct – Mar", language: "Hindi / Punjabi", cuisine: "Chole Bhature / Lassi / Butter Chicken", area: "114 km²",
    places: [
      { id: "chd1", name: "Rock Garden", city: "Chandigarh", category: "Heritage", desc: "A unique 40-acre sculpture garden made entirely from industrial waste by Nek Chand — an outsider art wonder.", bestTime: "Oct – Mar", entryFee: "₹50 Indian / ₹100 Foreign", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"], mapLink: "https://maps.app.goo.gl/ChandigarhRockGarden123", nearby: ["Rose Garden", "Sukhna Lake", "Capitol Complex"] },
      { id: "chd2", name: "Sukhna Lake", city: "Chandigarh", category: "Nature", desc: "A man-made reservoir at the foothills of the Shivaliks — perfect for morning walks, boating, and birdwatching.", bestTime: "Oct – Mar", entryFee: "Free (boating extra)", image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&q=80", images: ["https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&q=80"], mapLink: "https://maps.app.goo.gl/SukhnaLake123", nearby: ["Rock Garden", "Fun Republic Mall"] }
    ]
  },
  {
    id: "puducherry", name: "Puducherry", capital: "Puducherry", region: "South India",
    tagline: "Bonjour India — French Quarters, Ashrams & Tranquil Shores",
    category: "Heritage", emoji: "🇫🇷",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
    about: "Puducherry (Pondicherry) is a Union Territory with a distinct French colonial ambience.",
    bestTime: "Oct – Mar", language: "Tamil / French / English", cuisine: "Creole Cuisine / Dosas / Seafood", area: "479 km²",
    places: [
      { id: "pu1", name: "French Quarter", city: "Puducherry", category: "Heritage", desc: "Cobblestone streets lined with French colonial mansions, boutiques, cafes, and the iconic War Memorial.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/PondicherryFrenchQuarter123", nearby: ["Sri Aurobindo Ashram", "Promenade Beach", "Auroville"] },
      { id: "pu2", name: "Auroville", city: "Viluppuram", category: "Religious", desc: "A unique experimental universal township and home of the Matrimandir — a futuristic golden sphere for meditation.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80", images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80"], mapLink: "https://maps.app.goo.gl/Auroville123", nearby: ["French Quarter", "Paradise Beach"] }
    ]
  },
  {
    id: "andaman", name: "Andaman & Nicobar", capital: "Port Blair", region: "Union Territory",
    tagline: "Emerald Islands — Pristine Reefs, Turquoise Waters & Cellular Jail",
    category: "Adventure", emoji: "🏝️",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
    about: "The Andaman & Nicobar Islands are India's tropical paradise — crystal-clear waters, pristine coral reefs, dense forests, and the historic Cellular Jail.",
    bestTime: "Oct – May", language: "Hindi / Bengali / Tamil", cuisine: "Seafood / Fish Curry / Coconut dishes", area: "8,249 km²",
    places: [
      { id: "an1", name: "Radhanagar Beach", city: "Havelock Island", category: "Adventure", desc: "One of Asia's best beaches — pristine white sand and turquoise waters perfect for swimming and snorkelling.", bestTime: "Oct – May", entryFee: "Free", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/RadhanagarBeach123", nearby: ["Elephant Beach", "Neil Island", "Vijaynagar Beach"] },
      { id: "an2", name: "Cellular Jail", city: "Port Blair", category: "Heritage", desc: "The historic colonial prison where Indian freedom fighters were imprisoned — now a national memorial.", bestTime: "Oct – May", entryFee: "₹30 Indian / ₹100 Foreign", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80", images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80"], mapLink: "https://maps.app.goo.gl/CellularJail123", nearby: ["Ross Island", "Corbyn's Cove", "Anthropological Museum"] }
    ]
  },
  {
    id: "lakshadweep", name: "Lakshadweep", capital: "Kavaratti", region: "Union Territory",
    tagline: "Coral Paradise — Untouched Lagoons & Marine Wonders",
    category: "Nature", emoji: "🪸",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
    about: "Lakshadweep is India's smallest Union Territory — a chain of 36 coral islands in the Arabian Sea.",
    bestTime: "Oct – May", language: "Malayalam", cuisine: "Fish Curry / Tuna dishes / Coconut rice", area: "32 km²",
    places: [
      { id: "lk1", name: "Agatti Island", city: "Agatti", category: "Adventure", desc: "The gateway island of Lakshadweep with stunning coral reefs, turquoise lagoons, and world-class snorkelling.", bestTime: "Oct – May", entryFee: "Entry Permit required", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"], mapLink: "https://maps.app.goo.gl/AgattiIsland123", nearby: ["Bangaram Island", "Kavaratti", "Kadmat Island"] }
    ]
  },
  {
    id: "delhi", name: "Delhi (NCT)", capital: "New Delhi", region: "Union Territory",
    tagline: "Capital of Millennia — Mughal Grandeur & Modern India",
    category: "Heritage", emoji: "🏛️",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
    heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=80",
    about: "Delhi, India's capital, is a city of astonishing contrasts — where 12th-century qutbs stand beside ultramodern metro stations.",
    bestTime: "Oct – Mar", language: "Hindi / Urdu / Punjabi", cuisine: "Chole Bhature / Paranthas / Delhi Chaat", area: "1,484 km²",
    places: [
      { id: "dl1", name: "Red Fort", city: "Old Delhi", category: "Heritage", desc: "The iconic UNESCO-listed Mughal fortress built by Emperor Shah Jahan, the symbol of India's Independence.", bestTime: "Oct – Mar", entryFee: "₹35 Indian / ₹500 Foreign", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80", images: ["https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80"], mapLink: "https://maps.app.goo.gl/DelhiRedFort123", nearby: ["Jama Masjid", "Chandni Chowk", "Raj Ghat"] },
      { id: "dl2", name: "Qutub Minar", city: "South Delhi", category: "Heritage", desc: "A UNESCO World Heritage Site — the world's tallest brick minaret at 72.5 metres, built in 1193.", bestTime: "Oct – Mar", entryFee: "₹35 Indian / ₹550 Foreign", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80", images: ["https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80"], mapLink: "https://maps.app.goo.gl/QutubMinar123", nearby: ["Mehrauli Village", "Jamali Kamali", "Garden of Five Senses"] },
      { id: "dl3", name: "India Gate", city: "New Delhi", category: "Heritage", desc: "A war memorial and the iconic heart of Lutyens' Delhi — a beloved national symbol.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80", images: ["https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80"], mapLink: "https://maps.app.goo.gl/IndiaGate123", nearby: ["Rashtrapati Bhavan", "National Museum", "Rajpath"] },
      { id: "dl4", name: "Lotus Temple", city: "South Delhi", category: "Religious", desc: "An architectural masterpiece shaped like a lotus flower — a Bahá'í House of Worship open to all faiths.", bestTime: "Oct – Mar", entryFee: "Free", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80", images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80"], mapLink: "https://maps.app.goo.gl/LotusTempleDelhi123", nearby: ["ISKCON Delhi", "Tughlaqabad Fort"] }
    ]
  }
];

// ─── Admin Credentials ─────────────────────────────────────
const ADMIN_USER = {
  name:     'TravelBharat Admin',
  email:    'admin@travelbharat.in',
  password: 'Admin@2025',
};

// ─── Seed Function ─────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    await State.deleteMany({});
    await Admin.deleteMany({});
    console.log('🗑️  Cleared existing States and Admin data');

    await State.insertMany(STATES_DATA);
    console.log(`🌍 Inserted ${STATES_DATA.length} states`);

    const totalPlaces = STATES_DATA.reduce((sum, s) => sum + s.places.length, 0);
    console.log(`📍 Total destinations seeded: ${totalPlaces}`);

    const placesWithMapLink  = STATES_DATA.reduce((sum, s) => sum + s.places.filter(p => p.mapLink).length, 0);
    const placesWithGallery  = STATES_DATA.reduce((sum, s) => sum + s.places.filter(p => p.images && p.images.length > 1).length, 0);
    console.log(`🗺️  Places with map links:   ${placesWithMapLink}`);
    console.log(`🖼️  Places with gallery:     ${placesWithGallery}`);

    const hashedPassword = await bcrypt.hash(ADMIN_USER.password, 12);
    await Admin.create({ ...ADMIN_USER, password: hashedPassword });
    console.log(`👤 Admin created → ${ADMIN_USER.email} / ${ADMIN_USER.password}`);

    console.log('\n✅ Database seeded successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
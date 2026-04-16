const itinerary = [
  {
    day: 1, date: "Tue 28 Jul", location: "Sanur", stay: "Resort",
    hotel: "Hyatt Regency Bali / Andaz Bali", tag: "arrival",
    activities: [
      { time: "11:05 AM", desc: "Land at Denpasar (DPS) — private transfer to Sanur (~35 min)" },
      { time: "1:00 PM", desc: "Check in — request cot & early check-in. Hire nanny (~80k IDR/hr) to help settle" },
      { time: "3:00 PM", desc: "Stroll along Sanur's calm reef-protected beach & promenade (stroller-friendly)" },
      { time: "6:00 PM", desc: "Early dinner at Soul on the Beach — casual, beachside, baby-friendly" },
      { time: "8:00 PM", desc: "Early bedtime for everyone 😴" },
    ],
    tip: "Sanur's shallow, calm water is the safest beach in Bali for infants. No big waves."
  },
  {
    day: 2, date: "Wed 29 Jul", location: "Sanur", stay: "Resort",
    hotel: "Hyatt Regency Bali / Andaz Bali", tag: "explore",
    activities: [
      { time: "7:00 AM", desc: "Breakfast at Byrdhouse café (opens 6:30 AM) — playground on site" },
      { time: "9:00 AM", desc: "Rent bicycles with child seats — ride the 5km beachfront path" },
      { time: "11:00 AM", desc: "Lunch at Shotgun Social — huge tree playground, kids' movies" },
      { time: "1:00 PM", desc: "Resort nap time + pool. Book nanny so parents can get a massage" },
      { time: "4:00 PM", desc: "Stand-up paddle board or family yoga on calm water" },
      { time: "7:00 PM", desc: "Dinner at Forketta (Italian) or Neyalan (onsite play space)" },
    ],
    tip: "Book nanny for afternoon — gives parents 2hrs of proper rest."
  },
  {
    day: 3, date: "Thu 30 Jul", location: "Sanur", stay: "Resort",
    hotel: "Hyatt Regency Bali / Andaz Bali", tag: "relax",
    activities: [
      { time: "7:30 AM", desc: "Breakfast at Farmors Cafe or Tootsie Restaurant — local dishes, high chairs" },
      { time: "9:30 AM", desc: "Kids club at resort (crafts, beach games) or Prama Sanur splash zone" },
      { time: "12:00 PM", desc: "Lunch at Genius Cafe — healthy bowls, vegan options, kids menu" },
      { time: "2:00 PM", desc: "Nap time. Parents: spa or cooking class while nanny watches baby" },
      { time: "4:30 PM", desc: "Artasedana Market — souvenirs, snacks, easy browse" },
      { time: "7:00 PM", desc: "Dinner at Shotgun Social or resort. Pack for tomorrow's transfer." },
    ],
    tip: "Pack tonight — transfer to Seminyak tomorrow morning."
  },
  {
    day: 4, date: "Fri 31 Jul", location: "Seminyak", stay: "Hotel/Villa",
    hotel: "Courtyard by Marriott Seminyak / Enclosed Private Villa", tag: "transfer",
    activities: [
      { time: "9:00 AM", desc: "Check out Sanur. Private car to Seminyak (~40 min)" },
      { time: "11:00 AM", desc: "Check in. If villa: ensure enclosed living room + AC for baby" },
      { time: "1:00 PM", desc: "Lunch at Sisterfields — best burgers & salads in Seminyak" },
      { time: "3:00 PM", desc: "Relax at Mano Beach House — plunge pool, cabanas, all-day menu" },
      { time: "6:00 PM", desc: "Sunset at La Plancha, Double Six Beach — bean bags, kids play in sand" },
      { time: "8:00 PM", desc: "Dinner at La Plancha or back to hotel" },
    ],
    tip: "Villas in Seminyak: check for mosquito-proof enclosed areas — important for baby."
  },
  {
    day: 5, date: "Sat 1 Aug", location: "Seminyak", stay: "Hotel/Villa",
    hotel: "Courtyard by Marriott Seminyak / Enclosed Private Villa", tag: "fun",
    activities: [
      { time: "8:00 AM", desc: "Breakfast at hotel or Sisterfields" },
      { time: "9:30 AM", desc: "Waterbom Bali (Kuta) — go early, baby-friendly shallow pools, slides" },
      { time: "1:00 PM", desc: "Lunch at Wacko Burger Cafe or Happy Chappy (Chinese)" },
      { time: "3:00 PM", desc: "Rest at villa/hotel. Book nanny for 2hrs — parents shop or get massages" },
      { time: "5:00 PM", desc: "Ku De Ta beach club — kids pool, kids menu, Sunday crafts & face painting" },
      { time: "7:30 PM", desc: "Dinner at Made's Warung — traditional Balinese food + cultural dance show" },
    ],
    tip: "Waterbom opens at 9 AM — go early to beat crowds and midday heat."
  },
  {
    day: 6, date: "Sun 2 Aug", location: "Sidemen", stay: "Villa",
    hotel: "Wapa di Ume Sidemen / Samanvaya Luxury Resort", tag: "transfer",
    activities: [
      { time: "8:30 AM", desc: "Depart Seminyak by private car to Sidemen (~90 min scenic drive)" },
      { time: "10:30 AM", desc: "Check in at Wapa di Ume — luxury tents with king beds & private pool" },
      { time: "12:00 PM", desc: "Lunch at Sleeping Gajah restaurant — pancakes, avo eggs, great coffee" },
      { time: "2:00 PM", desc: "Complimentary afternoon tea on the terrace — savoury & sweet treats" },
      { time: "3:30 PM", desc: "Baby explores playground, watch village life from terrace" },
      { time: "7:00 PM", desc: "Dinner at Sleeping Gajah or Asri Dining at Samanvaya (stunning views)" },
    ],
    tip: "Sidemen is the hidden gem of Bali — cooler, quieter, and incredibly scenic. Perfect reset."
  },
  {
    day: 7, date: "Mon 3 Aug", location: "Sidemen", stay: "Villa",
    hotel: "Wapa di Ume Sidemen / Samanvaya Luxury Resort", tag: "nature",
    activities: [
      { time: "7:00 AM", desc: "Early guided walk through rice fields or along the river" },
      { time: "8:00 AM", desc: "Breakfast at Sleeping Gajah" },
      { time: "9:00 AM", desc: "Complimentary yoga class in the pavilion overlooking the valley" },
      { time: "10:30 AM", desc: "Kids activity: make canang sari offerings or visit honeybee farm & coffee plantation" },
      { time: "1:00 PM", desc: "Lunch at resort. Nap time." },
      { time: "3:30 PM", desc: "Infinity pool + cocktails. Parents: spa treatment while nanny watches baby" },
      { time: "7:00 PM", desc: "Dinner at resort. Stargaze from the terrace." },
    ],
    tip: "Nanny hire available through resort — great for spa time this afternoon."
  },
  {
    day: 8, date: "Tue 4 Aug", location: "Ubud", stay: "Resort/Villa",
    hotel: "Purist Villas / Alaya Resort Ubud / Kayon Jungle Resort", tag: "transfer",
    activities: [
      { time: "9:00 AM", desc: "Drive to Ubud (~1 hour). Check in — Purist Villas has portacots & private pools" },
      { time: "12:00 PM", desc: "Lunch at Maha Restaurant — floor seating, garden, resident bunnies for kids" },
      { time: "2:30 PM", desc: "Rest at villa. Hire private driver for Ubud (ride-shares restricted here)" },
      { time: "4:30 PM", desc: "Explore Ubud Market — souvenirs, textiles, easy browse" },
      { time: "7:00 PM", desc: "Evening performance at Ubud Palace — colourful costumes, music, kids love it" },
    ],
    tip: "Ubud's cooler elevation makes it much more comfortable for baby than coastal areas."
  },
  {
    day: 9, date: "Wed 5 Aug", location: "Ubud", stay: "Resort/Villa",
    hotel: "Purist Villas / Alaya Resort Ubud / Kayon Jungle Resort", tag: "temples",
    activities: [
      { time: "7:00 AM", desc: "Depart early to Tegallalang Rice Terraces (~20 min north) — go before crowds & heat" },
      { time: "9:00 AM", desc: "Coffee plantation stop with valley views" },
      { time: "10:30 AM", desc: "Return to Ubud. Lunch + nap." },
      { time: "2:30 PM", desc: "Goa Gajah (Elephant Cave) — carved cave walls, short visit. Use carrier for steps." },
      { time: "4:30 PM", desc: "Tirta Empul temple — holy spring pools, wear sarong, start at left pool" },
      { time: "7:00 PM", desc: "Dinner at Maha or Jalan Hanoman restaurants. Option: nanny for romantic dinner." },
    ],
    tip: "Use a baby carrier at rice terraces and temples — paths are narrow and uneven."
  },
  {
    day: 10, date: "Thu 6 Aug", location: "Ubud + Kintamani", stay: "Resort/Villa",
    hotel: "Purist Villas / Alaya Resort Ubud / Kayon Jungle Resort", tag: "daytrip",
    activities: [
      { time: "8:00 AM", desc: "Breakfast at villa" },
      { time: "9:00 AM", desc: "DAY TRIP: Drive to Kintamani (~1 hr) — Mount Batur volcano & lake views" },
      { time: "11:00 AM", desc: "Lunch at a café with volcano view — bring layers, it's cooler up here" },
      { time: "1:00 PM", desc: "Return to Ubud. Rest + nap." },
      { time: "3:30 PM", desc: "Alternative: Tegenungan Waterfall (early visit, homemade ice cream at stalls)" },
      { time: "6:00 PM", desc: "Casual dinner at Maha or Sage. Pack for Nusa Dua transfer tomorrow." },
    ],
    tip: "Kintamani is a half-day trip from Ubud — no need to stay. Bring a light jacket for baby."
  },
  {
    day: 11, date: "Fri 7 Aug", location: "Nusa Dua", stay: "Resort",
    hotel: "Grand Hyatt Bali", tag: "beach",
    activities: [
      { time: "9:00 AM", desc: "Drive to Nusa Dua (~1–1.5 hrs). Check into Grand Hyatt Bali." },
      { time: "11:00 AM", desc: "Explore resort: 5 pools including slides & shallow toddler lagoon" },
      { time: "1:00 PM", desc: "Lunch at resort. Rooms have built-in daybeds — perfect for naps." },
      { time: "3:00 PM", desc: "Oceania Kids Club — Balinese mask-making, kite flying, crafts (small hourly fee)" },
      { time: "6:00 PM", desc: "Pasar Senggol night market inside resort — food stalls + live Kecak fire dance" },
      { time: "8:00 PM", desc: "Dinner at Watercourt (Indonesian) or Salsa Verde (Italian) inside resort" },
    ],
    tip: "Grand Hyatt has 700m of calm white-sand beach — safest swimming beach in Bali for babies."
  },
  {
    day: 12, date: "Sat 8 Aug", location: "Nusa Dua → AYANA", stay: "Resort",
    hotel: "AYANA Resort Bali / RIMBA by AYANA", tag: "transfer",
    activities: [
      { time: "8:00 AM", desc: "Breakfast at Grand Hyatt. Morning at the beach — hire a cabana." },
      { time: "11:00 AM", desc: "700m calm beach: swimming, playground, volleyball, giant chess" },
      { time: "1:00 PM", desc: "Lunch at resort. Check out mid-afternoon." },
      { time: "3:00 PM", desc: "Transfer to AYANA Resort Jimbaran (~30 min). Check in." },
      { time: "4:30 PM", desc: "AYANA Kids Club: crafts, traditional games, petting zoo (lambs, piglets, rabbits)" },
      { time: "6:00 PM", desc: "Rock Bar sunset — arrive early for seating. Cocktails + mocktails + snacks for baby" },
      { time: "8:00 PM", desc: "Dinner: seafood BBQ at Jimbaran Bay or AYANA's Dava restaurant" },
    ],
    tip: "Rock Bar is AYANA's highlight — arrive by 5:30 PM to secure a spot for sunset."
  },
  {
    day: 13, date: "Sun 9 Aug", location: "AYANA → Home", stay: "Resort",
    hotel: "AYANA Resort Bali", tag: "departure",
    activities: [
      { time: "8:00 AM", desc: "Final breakfast at AYANA. Morning at the children's pool (twists & slides)" },
      { time: "10:00 AM", desc: "Adults: golf or tennis while baby enjoys kids club or babysitter" },
      { time: "12:00 PM", desc: "Lunch at resort. Request late checkout or day room." },
      { time: "2:00 PM", desc: "Optional: AYANA driver to Uluwatu Temple (~30 min) — watch for monkeys!" },
      { time: "5:00 PM", desc: "Early dinner at Damar Terrace — kids love the satay" },
      { time: "7:00 PM", desc: "Leave AYANA for airport (~20 min drive)" },
      { time: "10:05 PM", desc: "Garuda Indonesia GA718 departs — Bali to Melbourne. Arrive 5:30 AM (+1)" },
    ],
    tip: "Request bassinet seat at airport check-in. Baby likely sleeps the whole flight home."
  },
];

export default itinerary;

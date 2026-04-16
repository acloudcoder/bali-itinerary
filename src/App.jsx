import { useState } from 'react'
import itinerary from './data'

const tagColor = {
  arrival: '#2e7d32', explore: '#1565c0', relax: '#6a1b9a',
  transfer: '#e65100', fun: '#c62828', nature: '#388e3c',
  temples: '#4527a0', daytrip: '#00838f', beach: '#0277bd', departure: '#37474f',
}

const hotels = [
  { area: 'Sanur (Days 1–3)', hotel: 'Hyatt Regency Bali / Andaz Bali', color: '#1b5e20',
    features: ['Kids club & beachfront pools', 'Calm shallow beach — safest for infants', 'Stroller-friendly promenade', 'Room service & cot available'] },
  { area: 'Seminyak (Days 4–5)', hotel: 'Courtyard by Marriott / Private Villa', color: '#1565c0',
    features: ['Kids pool & proximity to restaurants', 'Villa: enclosed living room + AC', 'Close to Waterbom & beach clubs', 'Nanny services available'] },
  { area: 'Sidemen (Days 6–7)', hotel: 'Wapa di Ume Sidemen', color: '#e65100',
    features: ['Luxury tents with private pool', 'Complimentary afternoon tea', 'Kids activities: offerings & farm tour', 'Yoga pavilion with valley views'] },
  { area: 'Ubud (Days 8–10)', hotel: 'Purist Villas / Alaya Resort', color: '#4527a0',
    features: ['Portacots & private pools (Purist)', 'Cooler elevation — comfortable for baby', 'Mosquito-netted cots available', 'Private driver recommended'] },
  { area: 'Nusa Dua (Day 11)', hotel: 'Grand Hyatt Bali', color: '#00695c',
    features: ['5 pools incl. toddler lagoon & slides', '700m calm white-sand beach', 'Oceania Kids Club (crafts, games)', 'Pasar Senggol night market on-site'] },
  { area: 'Jimbaran (Days 12–13)', hotel: 'AYANA Resort / RIMBA by AYANA', color: '#37474f',
    features: ['Kids club: crafts & petting zoo', 'Rock Bar — best sunset in Bali', 'Babysitting services available', '20 min from airport — perfect exit'] },
]

const tips = [
  { icon: '🚗', title: 'Transport', items: ['Hire private car + driver for whole trip', 'Safer than scooter with infant', 'Ask for car seat (confirm ahead)', 'GrabCar as backup in Seminyak/Sanur'] },
  { icon: '👩‍🍼', title: 'Nanny Services', items: ['~80,000 IDR/hr + transport fees', "Book through resort or Berta's agency", 'Many trained in CPR & swimming', 'Great for spa time, dinners, nap cover'] },
  { icon: '☀️', title: 'Daily Rhythm', items: ['Sightseeing: early morning only', 'Midday: resort pool + nap', 'Outings again after 4 PM', 'Max 2–3 activities per day'] },
  { icon: '🍛', title: 'Indian Food', items: ["Queen's Tandoor (Seminyak)", 'Gateway of India (Kuta/Seminyak)', 'Indian Delites (Ubud)', 'Ganesha Ek Sanskriti (multiple)'] },
  { icon: '🛒', title: 'Baby Essentials', items: ['Bintang Supermarket (Seminyak)', 'Pepito Market (everywhere)', 'Always use bottled/boiled water', 'Carry mosquito repellent + sun hat'] },
  { icon: '✈️', title: 'Flight Tips', items: ['Request bassinet seat at check-in', 'GA719: MEL→DPS 07:00–11:05', 'GA718: DPS→MEL 22:05–05:30', 'Baby likely sleeps on return flight'] },
]

export default function App() {
  const [active, setActive] = useState(null)

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: '#f5f5f5', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1a6b4a,#2e9e6e)', color: 'white', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>🌴</div>
        <h1 style={{ margin: '8px 0 4px', fontSize: 28 }}>Bali Family Itinerary</h1>
        <p style={{ opacity: 0.9, margin: 0 }}>28 July – 9 August 2025 · Travelling with an Infant</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
          {['✈️ Garuda Indonesia – Direct', '👶 Infant-Friendly', '🚗 Private Driver', '👩‍🍼 Nanny Options', '💰 AUD 1,351 for 3'].map(b => (
            <span key={b} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 20, padding: '5px 12px', fontSize: 13 }}>{b}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', padding: '24px 20px', maxWidth: 900, margin: '0 auto' }}>
        {[['📅','Total','13 Nights'],['📍','Locations','6 Areas'],['🏨','Stay','Resort + Villa'],['🗺️','Day Trip','Kintamani'],['👩‍🍼','Nanny','~80k IDR/hr']].map(([icon,label,value]) => (
          <div key={label} style={{ background: 'white', borderRadius: 12, padding: '16px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', minWidth: 120 }}>
            <div style={{ fontSize: 28 }}>{icon}</div>
            <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a6b4a' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Route */}
      <div style={{ maxWidth: 900, margin: '0 auto 32px', padding: '0 20px' }}>
        <h2 style={{ color: '#1a6b4a', borderLeft: '4px solid #2e9e6e', paddingLeft: 12, marginBottom: 16 }}>🗺️ Route Overview</h2>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          {['Sanur','Seminyak','Sidemen','Ubud','Kintamani (day trip)','Nusa Dua','AYANA Jimbaran'].map((loc, i, arr) => (
            <span key={loc} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ background: loc.includes('day trip') ? '#e3f2fd' : '#e8f5e9', color: loc.includes('day trip') ? '#1565c0' : '#1b5e20', border: `1px solid ${loc.includes('day trip') ? '#90caf9' : '#a5d6a7'}`, borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600 }}>{loc}</span>
              {i < arr.length - 1 && <span style={{ color: '#aaa', fontSize: 18 }}>→</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Day Cards */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 40px' }}>
        <h2 style={{ color: '#1a6b4a', borderLeft: '4px solid #2e9e6e', paddingLeft: 12, marginBottom: 16 }}>📋 Day-by-Day Plan</h2>
        {itinerary.map(day => (
          <div key={day.day} style={{ background: 'white', borderRadius: 14, marginBottom: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <div onClick={() => setActive(active === day.day ? null : day.day)}
              style={{ background: `linear-gradient(90deg,${tagColor[day.tag] || '#1a6b4a'},#2e9e6e)`, color: 'white', padding: '14px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 26, fontWeight: 800, opacity: 0.9 }}>Day {day.day}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{day.date} · {day.location}</div>
                  <div style={{ fontSize: 12, opacity: 0.85 }}>
                    <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 10, padding: '2px 8px', marginRight: 8 }}>{day.stay}</span>
                    {day.hotel}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 18 }}>{active === day.day ? '▲' : '▼'}</span>
            </div>
            {active === day.day && (
              <div style={{ padding: '16px 20px' }}>
                {day.activities.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, padding: '8px 0', borderBottom: i < day.activities.length - 1 ? '1px dashed #eee' : 'none' }}>
                    <span style={{ minWidth: 85, fontSize: 12, fontWeight: 700, color: '#2e9e6e', paddingTop: 2 }}>{a.time}</span>
                    <span style={{ fontSize: 14, lineHeight: 1.5, color: '#444' }}>{a.desc}</span>
                  </div>
                ))}
                <div style={{ background: '#f0faf5', borderLeft: '3px solid #2e9e6e', borderRadius: 6, padding: '10px 14px', marginTop: 12, fontSize: 13, color: '#2d6a4f' }}>
                  💡 <strong>Tip:</strong> {day.tip}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hotels */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 40px' }}>
        <h2 style={{ color: '#1a6b4a', borderLeft: '4px solid #2e9e6e', paddingLeft: 12, marginBottom: 16 }}>🏨 Hotel Recommendations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {hotels.map(h => (
            <div key={h.area} style={{ background: 'white', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `4px solid ${h.color}` }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{h.area}</div>
              <div style={{ fontWeight: 700, color: h.color, marginBottom: 10, fontSize: 15 }}>{h.hotel}</div>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {h.features.map(f => <li key={f} style={{ fontSize: 13, lineHeight: 1.8, color: '#555' }}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 40px' }}>
        <h2 style={{ color: '#1a6b4a', borderLeft: '4px solid #2e9e6e', paddingLeft: 12, marginBottom: 16 }}>💡 Essential Travel Tips</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {tips.map(t => (
            <div key={t.title} style={{ background: 'white', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h4 style={{ margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}><span>{t.icon}</span>{t.title}</h4>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {t.items.map(item => <li key={item} style={{ fontSize: 13, lineHeight: 1.9, color: '#555' }}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ background: '#1a6b4a', color: 'rgba(255,255,255,0.8)', textAlign: 'center', padding: 20, fontSize: 13 }}>
        🌴 Bali Family Itinerary 2025 · Have an amazing trip! ✈️
      </footer>
    </div>
  )
}

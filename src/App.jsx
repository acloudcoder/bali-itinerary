import { useState, useEffect } from 'react'
import itinerary from './data'

// Color per location/venue
const venueColor = {
  'Sanur':          { bg: '#e8f5e9', border: '#2e7d32', text: '#1b5e20', header: '#2e7d32' },
  'Seminyak':       { bg: '#fff8e1', border: '#f57f17', text: '#e65100', header: '#f57f17' },
  'Sidemen':        { bg: '#fce4ec', border: '#c62828', text: '#b71c1c', header: '#c62828' },
  'Ubud':           { bg: '#ede7f6', border: '#4527a0', text: '#311b92', header: '#4527a0' },
  'Ubud + Kintamani': { bg: '#e0f2f1', border: '#00695c', text: '#004d40', header: '#00695c' },
  'Nusa Dua':       { bg: '#e3f2fd', border: '#1565c0', text: '#0d47a1', header: '#1565c0' },
  'Nusa Dua → AYANA': { bg: '#f3e5f5', border: '#6a1b9a', text: '#4a148c', header: '#6a1b9a' },
  'AYANA → Home':   { bg: '#eceff1', border: '#37474f', text: '#263238', header: '#37474f' },
}

const getVenue = (location) => venueColor[location] || { bg: '#f5f5f5', border: '#9e9e9e', text: '#424242', header: '#757575' }

// GitHub Gist config — stores notes as a single gist
const GIST_FILENAME = 'bali-itinerary-notes.json'
const GH_TOKEN_KEY = 'bali_gh_token'
const GIST_ID_KEY = 'bali_gist_id'

async function loadNotesFromGist(token, gistId) {
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github+json' }
  })
  if (!res.ok) throw new Error('Failed to load')
  const data = await res.json()
  return JSON.parse(data.files[GIST_FILENAME]?.content || '{}')
}

async function saveNotesToGist(token, gistId, notes) {
  const body = { files: { [GIST_FILENAME]: { content: JSON.stringify(notes, null, 2) } } }
  if (gistId) {
    await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH', headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    return gistId
  } else {
    const res = await fetch('https://api.github.com/gists', {
      method: 'POST', headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, description: 'Bali Itinerary Notes', public: false })
    })
    const data = await res.json()
    return data.id
  }
}

const hotels = [
  { area: 'Sanur (Days 1–3)', hotel: 'Hyatt Regency Bali / Andaz Bali', color: '#2e7d32',
    features: ['Kids club & beachfront pools', 'Calm shallow beach — safest for infants', 'Stroller-friendly promenade', 'Room service & cot available'] },
  { area: 'Seminyak (Days 4–5)', hotel: 'Courtyard by Marriott / Private Villa', color: '#f57f17',
    features: ['Kids pool & proximity to restaurants', 'Villa: enclosed living room + AC', 'Close to Waterbom & beach clubs', 'Nanny services available'] },
  { area: 'Sidemen (Days 6–7)', hotel: 'Wapa di Ume Sidemen', color: '#c62828',
    features: ['Luxury tents with private pool', 'Complimentary afternoon tea', 'Kids activities: offerings & farm tour', 'Yoga pavilion with valley views'] },
  { area: 'Ubud (Days 8–10)', hotel: 'Purist Villas / Alaya Resort', color: '#4527a0',
    features: ['Portacots & private pools (Purist)', 'Cooler elevation — comfortable for baby', 'Mosquito-netted cots available', 'Private driver recommended'] },
  { area: 'Nusa Dua (Day 11)', hotel: 'Grand Hyatt Bali', color: '#1565c0',
    features: ['5 pools incl. toddler lagoon & slides', '700m calm white-sand beach', 'Oceania Kids Club (crafts, games)', 'Pasar Senggol night market on-site'] },
  { area: 'Jimbaran (Days 12–13)', hotel: 'AYANA Resort / RIMBA by AYANA', color: '#6a1b9a',
    features: ['Kids club: crafts & petting zoo', 'Rock Bar — best sunset in Bali', 'Babysitting services available', '20 min from airport — perfect exit'] },
]

const tipsList = [
  { icon: '🚗', title: 'Transport', items: ['Hire private car + driver for whole trip', 'Safer than scooter with infant', 'Ask for car seat (confirm ahead)', 'GrabCar as backup in Seminyak/Sanur'] },
  { icon: '👩‍🍼', title: 'Nanny Services', items: ['~80,000 IDR/hr + transport fees', "Book through resort or Berta's agency", 'Many trained in CPR & swimming', 'Great for spa time, dinners, nap cover'] },
  { icon: '☀️', title: 'Daily Rhythm', items: ['Sightseeing: early morning only', 'Midday: resort pool + nap', 'Outings again after 4 PM', 'Max 2–3 activities per day'] },
  { icon: '🍛', title: 'Indian Food', items: ["Queen's Tandoor (Seminyak)", 'Gateway of India (Kuta/Seminyak)', 'Indian Delites (Ubud)', 'Ganesha Ek Sanskriti (multiple)'] },
  { icon: '🛒', title: 'Baby Essentials', items: ['Bintang Supermarket (Seminyak)', 'Pepito Market (everywhere)', 'Always use bottled/boiled water', 'Carry mosquito repellent + sun hat'] },
  { icon: '✈️', title: 'Flight Tips', items: ['Request bassinet seat at check-in', 'GA719: MEL→DPS 07:00–11:05', 'GA718: DPS→MEL 22:05–05:30', 'Baby likely sleeps on return flight'] },
]

export default function App() {
  const [active, setActive] = useState(null)
  const [notes, setNotes] = useState({})
  const [editingDay, setEditingDay] = useState(null)
  const [draftNote, setDraftNote] = useState('')
  const [token, setToken] = useState(() => localStorage.getItem(GH_TOKEN_KEY) || '')
  const [gistId, setGistId] = useState(() => localStorage.getItem(GIST_ID_KEY) || '')
  const [saveStatus, setSaveStatus] = useState({}) // { [day]: 'saving'|'saved'|'error' }
  const [showTokenInput, setShowTokenInput] = useState(false)

  // Load notes from gist on mount if token exists
  useEffect(() => {
    if (token && gistId) {
      loadNotesFromGist(token, gistId)
        .then(setNotes)
        .catch(() => {})
    }
  }, [])

  const handleSaveNote = async (day) => {
    const updated = { ...notes, [day]: draftNote }
    setNotes(updated)
    setEditingDay(null)

    if (!token) { setShowTokenInput(true); return }

    setSaveStatus(s => ({ ...s, [day]: 'saving' }))
    try {
      const newGistId = await saveNotesToGist(token, gistId, updated)
      if (newGistId !== gistId) {
        setGistId(newGistId)
        localStorage.setItem(GIST_ID_KEY, newGistId)
      }
      setSaveStatus(s => ({ ...s, [day]: 'saved' }))
      setTimeout(() => setSaveStatus(s => ({ ...s, [day]: null })), 2000)
    } catch {
      setSaveStatus(s => ({ ...s, [day]: 'error' }))
    }
  }

  const handleTokenSave = async (t) => {
    setToken(t)
    localStorage.setItem(GH_TOKEN_KEY, t)
    setShowTokenInput(false)
    // retry saving all notes
    if (Object.keys(notes).length > 0) {
      try {
        const newGistId = await saveNotesToGist(t, gistId, notes)
        if (newGistId !== gistId) {
          setGistId(newGistId)
          localStorage.setItem(GIST_ID_KEY, newGistId)
        }
      } catch {}
    }
  }

  return (
    <div style={{ fontFamily: "'Segoe UI',sans-serif", background: '#f5f5f5', minHeight: '100vh' }}>

      {/* Token modal */}
      {showTokenInput && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 14, padding: 28, maxWidth: 420, width: '90%' }}>
            <h3 style={{ margin: '0 0 8px' }}>🔑 GitHub Token for Notes</h3>
            <p style={{ fontSize: 13, color: '#666', margin: '0 0 16px' }}>
              Enter a GitHub personal access token with <strong>gist</strong> scope to save notes to a private Gist.
              <br /><a href="https://github.com/settings/tokens/new?scopes=gist" target="_blank" rel="noreferrer" style={{ color: '#1a6b4a' }}>Create one here →</a>
            </p>
            <input
              autoFocus
              type="password"
              placeholder="ghp_..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }}
              onKeyDown={e => e.key === 'Enter' && handleTokenSave(e.target.value)}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 14, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowTokenInput(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={e => handleTokenSave(e.target.closest('div').previousSibling.value)}
                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#1a6b4a', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Save Token</button>
            </div>
          </div>
        </div>
      )}

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

      {/* Venue Legend */}
      <div style={{ maxWidth: 900, margin: '24px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#888', marginRight: 4 }}>Venues:</span>
          {Object.entries(venueColor).filter(([k]) => !k.includes('→')).map(([loc, c]) => (
            <span key={loc} style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>{loc}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', padding: '20px 20px', maxWidth: 900, margin: '0 auto' }}>
        {[['📅','Total','13 Nights'],['📍','Locations','6 Areas'],['🏨','Stay','Resort + Villa'],['🗺️','Day Trip','Kintamani'],['👩‍🍼','Nanny','~80k IDR/hr']].map(([icon,label,value]) => (
          <div key={label} style={{ background: 'white', borderRadius: 12, padding: '14px 20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', minWidth: 110 }}>
            <div style={{ fontSize: 26 }}>{icon}</div>
            <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a6b4a' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Route */}
      <div style={{ maxWidth: 900, margin: '0 auto 24px', padding: '0 20px' }}>
        <h2 style={{ color: '#1a6b4a', borderLeft: '4px solid #2e9e6e', paddingLeft: 12, marginBottom: 14 }}>🗺️ Route Overview</h2>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
          {['Sanur','Seminyak','Sidemen','Ubud','Kintamani (day trip)','Nusa Dua','AYANA Jimbaran'].map((loc, i, arr) => {
            const key = loc.replace(' (day trip)','')
            const c = venueColor[key] || { bg: '#e0f2f1', border: '#00695c', text: '#004d40' }
            return (
              <span key={loc} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600 }}>{loc}</span>
                {i < arr.length - 1 && <span style={{ color: '#aaa', fontSize: 18 }}>→</span>}
              </span>
            )
          })}
        </div>
      </div>

      {/* Day Cards */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 40px' }}>
        <h2 style={{ color: '#1a6b4a', borderLeft: '4px solid #2e9e6e', paddingLeft: 12, marginBottom: 16 }}>📋 Day-by-Day Plan</h2>
        {itinerary.map(day => {
          const vc = getVenue(day.location)
          const isOpen = active === day.day
          const isEditing = editingDay === day.day
          const status = saveStatus[day.day]

          return (
            <div key={day.day} style={{ background: 'white', borderRadius: 14, marginBottom: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflow: 'hidden', border: `2px solid ${vc.border}` }}>
              {/* Header — color coded by venue */}
              <div onClick={() => setActive(isOpen ? null : day.day)}
                style={{ background: vc.header, color: 'white', padding: '14px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {notes[day.day] && <span style={{ fontSize: 16 }} title="Has notes">📝</span>}
                  <span style={{ fontSize: 18 }}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {isOpen && (
                <div style={{ padding: '16px 20px', background: vc.bg }}>
                  {/* Activities */}
                  {day.activities.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, padding: '8px 0', borderBottom: i < day.activities.length - 1 ? `1px dashed ${vc.border}40` : 'none' }}>
                      <span style={{ minWidth: 85, fontSize: 12, fontWeight: 700, color: vc.header, paddingTop: 2 }}>{a.time}</span>
                      <span style={{ fontSize: 14, lineHeight: 1.5, color: '#444' }}>{a.desc}</span>
                    </div>
                  ))}

                  {/* Tip */}
                  <div style={{ background: 'white', borderLeft: `3px solid ${vc.border}`, borderRadius: 6, padding: '10px 14px', marginTop: 12, fontSize: 13, color: vc.text }}>
                    💡 <strong>Tip:</strong> {day.tip}
                  </div>

                  {/* Notes section */}
                  <div style={{ marginTop: 14, background: 'white', borderRadius: 10, padding: 14, border: `1px solid ${vc.border}40` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: vc.text }}>📝 My Notes</span>
                      {!isEditing && (
                        <button onClick={() => { setEditingDay(day.day); setDraftNote(notes[day.day] || '') }}
                          style={{ fontSize: 12, padding: '4px 12px', borderRadius: 8, border: `1px solid ${vc.border}`, background: 'white', color: vc.text, cursor: 'pointer' }}>
                          {notes[day.day] ? 'Edit' : '+ Add Note'}
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div>
                        <textarea
                          autoFocus
                          value={draftNote}
                          onChange={e => setDraftNote(e.target.value)}
                          placeholder="Add your notes, bookings, reminders..."
                          style={{ width: '100%', minHeight: 80, padding: '8px 10px', borderRadius: 8, border: `1px solid ${vc.border}`, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
                          <button onClick={() => setEditingDay(null)}
                            style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
                          <button onClick={() => handleSaveNote(day.day)}
                            style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: vc.header, color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                            💾 Save to GitHub
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, color: notes[day.day] ? '#333' : '#aaa', whiteSpace: 'pre-wrap', minHeight: 20 }}>
                        {notes[day.day] || 'No notes yet. Click + Add Note.'}
                      </div>
                    )}

                    {status && (
                      <div style={{ marginTop: 8, fontSize: 12, color: status === 'saved' ? '#2e7d32' : status === 'error' ? '#c62828' : '#888' }}>
                        {status === 'saving' ? '⏳ Saving to GitHub...' : status === 'saved' ? '✅ Saved to GitHub Gist' : '❌ Save failed — check token'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
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
          {tipsList.map(t => (
            <div key={t.title} style={{ background: 'white', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h4 style={{ margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}><span>{t.icon}</span>{t.title}</h4>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {t.items.map(item => <li key={item} style={{ fontSize: 13, lineHeight: 1.9, color: '#555' }}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Token settings */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 40px', textAlign: 'center' }}>
        <button onClick={() => setShowTokenInput(true)}
          style={{ fontSize: 12, padding: '6px 16px', borderRadius: 8, border: '1px solid #ddd', background: 'white', color: '#888', cursor: 'pointer' }}>
          {token ? '🔑 Update GitHub Token' : '🔑 Set GitHub Token for Notes'}
        </button>
      </div>

      <footer style={{ background: '#1a6b4a', color: 'rgba(255,255,255,0.8)', textAlign: 'center', padding: 20, fontSize: 13 }}>
        🌴 Bali Family Itinerary 2025 · Have an amazing trip! ✈️
      </footer>
    </div>
  )
}

import { useState, useEffect } from 'react'
import itinerary from './data'

const venue = {
  'Sanur':               { bg: 'linear-gradient(135deg,#1b5e20,#388e3c)', light: '#e8f5e9', border: '#2e7d32', accent: '#1b5e20', emoji: '🏖️' },
  'Seminyak':            { bg: 'linear-gradient(135deg,#e65100,#f57f17)', light: '#fff8e1', border: '#f57f17', accent: '#e65100', emoji: '🌅' },
  'Sidemen':             { bg: 'linear-gradient(135deg,#880e4f,#c2185b)', light: '#fce4ec', border: '#c2185b', accent: '#880e4f', emoji: '🌿' },
  'Ubud':                { bg: 'linear-gradient(135deg,#311b92,#512da8)', light: '#ede7f6', border: '#512da8', accent: '#311b92', emoji: '🕌' },
  'Ubud + Kintamani':    { bg: 'linear-gradient(135deg,#004d40,#00796b)', light: '#e0f2f1', border: '#00796b', accent: '#004d40', emoji: '🌋' },
  'Nusa Dua':            { bg: 'linear-gradient(135deg,#0d47a1,#1976d2)', light: '#e3f2fd', border: '#1976d2', accent: '#0d47a1', emoji: '🏝️' },
  'Nusa Dua → AYANA':    { bg: 'linear-gradient(135deg,#4a148c,#7b1fa2)', light: '#f3e5f5', border: '#7b1fa2', accent: '#4a148c', emoji: '✨' },
  'AYANA → Home':        { bg: 'linear-gradient(135deg,#263238,#455a64)', light: '#eceff1', border: '#455a64', accent: '#263238', emoji: '✈️' },
}
const getV = l => venue[l] || { bg: 'linear-gradient(135deg,#37474f,#546e7a)', light: '#f5f5f5', border: '#90a4ae', accent: '#37474f', emoji: '📍' }

const GIST_FILE = 'bali-itinerary-notes.json'
const TOKEN_KEY = 'bali_gh_token'
const GIST_KEY  = 'bali_gist_id'

async function gistLoad(token, id) {
  const r = await fetch(`https://api.github.com/gists/${id}`, { headers: { Authorization: `token ${token}` } })
  if (!r.ok) throw new Error()
  const d = await r.json()
  return JSON.parse(d.files[GIST_FILE]?.content || '{}')
}
async function gistSave(token, id, notes) {
  const body = { files: { [GIST_FILE]: { content: JSON.stringify(notes, null, 2) } } }
  if (id) {
    await fetch(`https://api.github.com/gists/${id}`, { method: 'PATCH', headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    return id
  }
  const r = await fetch('https://api.github.com/gists', { method: 'POST', headers: { Authorization: `token ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, description: 'Bali Itinerary Notes', public: false }) })
  return (await r.json()).id
}

export default function App() {
  const [active, setActive]       = useState(null)
  const [notes, setNotes]         = useState({})
  const [editing, setEditing]     = useState(null)
  const [draft, setDraft]         = useState('')
  const [token, setToken]         = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [gistId, setGistId]       = useState(() => localStorage.getItem(GIST_KEY) || '')
  const [status, setStatus]       = useState({})
  const [showToken, setShowToken] = useState(false)
  const [tokenInput, setTokenInput] = useState('')

  useEffect(() => {
    if (token && gistId) gistLoad(token, gistId).then(setNotes).catch(() => {})
  }, [])

  const saveNote = async (day) => {
    const updated = { ...notes, [day]: draft }
    setNotes(updated)
    setEditing(null)
    if (!token) { setShowToken(true); return }
    setStatus(s => ({ ...s, [day]: 'saving' }))
    try {
      const newId = await gistSave(token, gistId, updated)
      if (newId !== gistId) { setGistId(newId); localStorage.setItem(GIST_KEY, newId) }
      setStatus(s => ({ ...s, [day]: 'saved' }))
      setTimeout(() => setStatus(s => ({ ...s, [day]: null })), 2500)
    } catch { setStatus(s => ({ ...s, [day]: 'error' })) }
  }

  const saveToken = async () => {
    const t = tokenInput.trim()
    setToken(t); localStorage.setItem(TOKEN_KEY, t); setShowToken(false)
    if (Object.keys(notes).length) {
      try { const id = await gistSave(t, gistId, notes); if (id !== gistId) { setGistId(id); localStorage.setItem(GIST_KEY, id) } } catch {}
    }
  }

  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>

      {/* Token Modal */}
      {showToken && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 16, padding: 32, maxWidth: 420, width: '90%' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔑</div>
            <h3 style={{ margin: '0 0 8px', fontSize: 20 }}>GitHub Token</h3>
            <p style={{ fontSize: 13, color: '#aaa', margin: '0 0 20px', lineHeight: 1.6 }}>
              Enter a token with <strong style={{ color: '#fff' }}>gist</strong> scope to save notes to a private GitHub Gist.{' '}
              <a href="https://github.com/settings/tokens/new?scopes=gist" target="_blank" rel="noreferrer" style={{ color: '#4ade80' }}>Create one →</a>
            </p>
            <input value={tokenInput} onChange={e => setTokenInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveToken()}
              type="password" placeholder="ghp_..."
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #444', background: '#111', color: '#fff', fontSize: 14, boxSizing: 'border-box', outline: 'none' }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowToken(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #444', background: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
              <button onClick={saveToken} style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#1b5e20,#4ade80)', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>Save Token</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '80px 20px 60px', textAlign: 'center',
        background: 'linear-gradient(180deg,#0d2818 0%,#0a3d1f 40%,#0a0a0a 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(46,158,110,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 64, marginBottom: 16, filter: 'drop-shadow(0 0 30px rgba(74,222,128,0.5))' }}>🌴</div>
        <h1 style={{ fontSize: 'clamp(28px,6vw,52px)', fontWeight: 900, margin: '0 0 12px', letterSpacing: -1,
          background: 'linear-gradient(135deg,#4ade80,#86efac,#fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Bali Family Journey
        </h1>
        <p style={{ fontSize: 18, color: '#86efac', margin: '0 0 8px', fontWeight: 300 }}>28 July – 9 August 2025</p>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 32px' }}>Travelling with an Infant · 13 Nights · 6 Destinations</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          {['✈️ Garuda Direct', '👶 Infant-Friendly', '🚗 Private Driver', '👩‍🍼 Nanny Options', '💰 AUD 1,351'].map(b => (
            <span key={b} style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 20, padding: '6px 14px', fontSize: 13, color: '#86efac' }}>{b}</span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', padding: '32px 20px', maxWidth: 900, margin: '0 auto' }}>
        {[['📅','13 Nights','Duration'],['📍','6 Areas','Locations'],['🏨','Resort+Villa','Stay Type'],['🗺️','Kintamani','Day Trip'],['👩‍🍼','~80k IDR/hr','Nanny Rate']].map(([icon,val,label]) => (
          <div key={label} style={{ background: '#111', border: '1px solid #222', borderRadius: 14, padding: '18px 22px', textAlign: 'center', minWidth: 110 }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#4ade80', marginBottom: 2 }}>{val}</div>
            <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Route Timeline */}
      <div style={{ maxWidth: 900, margin: '0 auto 40px', padding: '0 20px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-block', width: 4, height: 24, background: '#4ade80', borderRadius: 2 }} />
          Route Overview
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          {[
            ['Sanur','🏖️'],['Seminyak','🌅'],['Sidemen','🌿'],['Ubud','🕌'],
            ['Kintamani','🌋'],['Nusa Dua','🏝️'],['AYANA','✨']
          ].map(([loc, emoji], i, arr) => {
            const v = getV(loc === 'Kintamani' ? 'Ubud + Kintamani' : loc === 'AYANA' ? 'Nusa Dua → AYANA' : loc)
            return (
              <span key={loc} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: v.bg, borderRadius: 20, padding: '8px 16px', fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                  {emoji} {loc}{loc === 'Kintamani' && <span style={{ fontSize: 10, opacity: 0.8 }}>(day trip)</span>}
                </span>
                {i < arr.length - 1 && <span style={{ color: '#374151', fontSize: 20 }}>→</span>}
              </span>
            )
          })}
        </div>
      </div>

      {/* Day Cards */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 40px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-block', width: 4, height: 24, background: '#4ade80', borderRadius: 2 }} />
          Day-by-Day Plan
        </h2>
        {itinerary.map(day => {
          const v = getV(day.location)
          const isOpen = active === day.day
          const isEditing = editing === day.day
          const st = status[day.day]
          return (
            <div key={day.day} style={{ marginBottom: 12, borderRadius: 16, overflow: 'hidden', border: '1px solid #1f1f1f', boxShadow: isOpen ? `0 8px 32px rgba(0,0,0,0.4)` : 'none', transition: 'box-shadow 0.2s' }}>
              {/* Card Header */}
              <div onClick={() => setActive(isOpen ? null : day.day)} style={{ background: v.bg, padding: '18px 22px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 12, padding: '8px 14px', textAlign: 'center', minWidth: 56 }}>
                    <div style={{ fontSize: 11, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Day</div>
                    <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{day.day}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {v.emoji} {day.location}
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>{day.date} · <span style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '2px 8px' }}>{day.stay}</span></div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 3 }}>{day.hotel}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {notes[day.day] && <span style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '4px 8px', fontSize: 13 }}>📝</span>}
                  <span style={{ fontSize: 20, opacity: 0.8 }}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Card Body */}
              {isOpen && (
                <div style={{ background: '#111', padding: '20px 22px' }}>
                  {/* Activities */}
                  <div style={{ marginBottom: 16 }}>
                    {day.activities.map((a, i) => (
                      <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: i < day.activities.length - 1 ? '1px solid #1f1f1f' : 'none' }}>
                        <span style={{ minWidth: 80, fontSize: 12, fontWeight: 700, color: '#4ade80', paddingTop: 1, flexShrink: 0 }}>{a.time}</span>
                        <span style={{ fontSize: 14, lineHeight: 1.6, color: '#d1d5db' }}>{a.desc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tip */}
                  <div style={{ background: '#0d2818', border: `1px solid ${v.border}40`, borderLeft: `3px solid ${v.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#86efac', lineHeight: 1.6 }}>
                    💡 <strong>Tip:</strong> {day.tip}
                  </div>

                  {/* Notes */}
                  <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 6 }}>📝 My Notes</span>
                      {!isEditing && (
                        <button onClick={() => { setEditing(day.day); setDraft(notes[day.day] || '') }}
                          style={{ fontSize: 12, padding: '5px 14px', borderRadius: 8, border: `1px solid ${v.border}60`, background: 'transparent', color: '#9ca3af', cursor: 'pointer', transition: 'all 0.15s' }}>
                          {notes[day.day] ? '✏️ Edit' : '+ Add Note'}
                        </button>
                      )}
                    </div>
                    {isEditing ? (
                      <div>
                        <textarea autoFocus value={draft} onChange={e => setDraft(e.target.value)}
                          placeholder="Add bookings, reminders, ideas..."
                          style={{ width: '100%', minHeight: 90, padding: '10px 12px', borderRadius: 10, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none', lineHeight: 1.6 }} />
                        <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
                          <button onClick={() => setEditing(null)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #333', background: 'transparent', color: '#9ca3af', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
                          <button onClick={() => saveNote(day.day)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: v.bg, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                            💾 Save to GitHub
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, color: notes[day.day] ? '#d1d5db' : '#4b5563', whiteSpace: 'pre-wrap', lineHeight: 1.7, minHeight: 24 }}>
                        {notes[day.day] || 'No notes yet.'}
                      </div>
                    )}
                    {st && (
                      <div style={{ marginTop: 8, fontSize: 12, color: st === 'saved' ? '#4ade80' : st === 'error' ? '#f87171' : '#9ca3af' }}>
                        {st === 'saving' ? '⏳ Saving...' : st === 'saved' ? '✅ Saved to GitHub Gist' : '❌ Failed — check token'}
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
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-block', width: 4, height: 24, background: '#4ade80', borderRadius: 2 }} />
          🏨 Hotel Recommendations
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
          {[
            { area:'Sanur (Days 1–3)', hotel:'Hyatt Regency / Andaz Bali', v:'Sanur', features:['Kids club & beachfront pools','Calm shallow beach — safest for infants','Stroller-friendly promenade','Cot & room service available'] },
            { area:'Seminyak (Days 4–5)', hotel:'Courtyard Marriott / Private Villa', v:'Seminyak', features:['Kids pool & restaurants nearby','Villa: enclosed living room + AC','Close to Waterbom & beach clubs','Nanny services available'] },
            { area:'Sidemen (Days 6–7)', hotel:'Wapa di Ume Sidemen', v:'Sidemen', features:['Luxury tents with private pool','Complimentary afternoon tea','Kids: offerings & farm tour','Yoga pavilion with valley views'] },
            { area:'Ubud (Days 8–10)', hotel:'Purist Villas / Alaya Resort', v:'Ubud', features:['Portacots & private pools','Cooler elevation — great for baby','Mosquito-netted cots','Private driver recommended'] },
            { area:'Nusa Dua (Day 11)', hotel:'Grand Hyatt Bali', v:'Nusa Dua', features:['5 pools incl. toddler lagoon','700m calm white-sand beach','Oceania Kids Club','Night market on-site'] },
            { area:'Jimbaran (Days 12–13)', hotel:'AYANA Resort / RIMBA', v:'Nusa Dua → AYANA', features:['Kids club & petting zoo','Rock Bar — best sunset in Bali','Babysitting available','20 min from airport'] },
          ].map(h => {
            const v = getV(h.v)
            return (
              <div key={h.area} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, padding: 18, borderTop: `3px solid ${v.border}` }}>
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h.area}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, background: v.bg, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{h.hotel}</div>
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                  {h.features.map(f => <li key={f} style={{ fontSize: 13, lineHeight: 1.9, color: '#9ca3af' }}>{f}</li>)}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tips */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 40px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-block', width: 4, height: 24, background: '#4ade80', borderRadius: 2 }} />
          💡 Essential Tips
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
          {[
            { icon:'🚗', title:'Transport', items:['Hire private car + driver for whole trip','Safer than scooter with infant','Ask for car seat (confirm ahead)','GrabCar as backup in Seminyak/Sanur'] },
            { icon:'👩‍🍼', title:'Nanny Services', items:['~80,000 IDR/hr + transport fees',"Book through resort or Berta's agency",'Many trained in CPR & swimming','Great for spa time, dinners, nap cover'] },
            { icon:'☀️', title:'Daily Rhythm', items:['Sightseeing: early morning only','Midday: resort pool + nap','Outings again after 4 PM','Max 2–3 activities per day'] },
            { icon:'🍛', title:'Indian Food', items:["Queen's Tandoor (Seminyak)",'Gateway of India (Kuta/Seminyak)','Indian Delites (Ubud)','Ganesha Ek Sanskriti (multiple)'] },
            { icon:'🛒', title:'Baby Essentials', items:['Bintang Supermarket (Seminyak)','Pepito Market (everywhere)','Always use bottled/boiled water','Mosquito repellent + sun hat'] },
            { icon:'✈️', title:'Flight Tips', items:['Request bassinet seat at check-in','GA719: MEL→DPS 07:00–11:05','GA718: DPS→MEL 22:05–05:30','Baby likely sleeps on return flight'] },
          ].map(t => (
            <div key={t.title} style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, padding: 18 }}>
              <h4 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: '#fff' }}>{t.icon} {t.title}</h4>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {t.items.map(item => <li key={item} style={{ fontSize: 13, lineHeight: 1.9, color: '#9ca3af' }}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Token button */}
      <div style={{ textAlign: 'center', padding: '0 20px 40px' }}>
        <button onClick={() => { setTokenInput(token); setShowToken(true) }}
          style={{ fontSize: 12, padding: '8px 20px', borderRadius: 10, border: '1px solid #333', background: 'transparent', color: '#6b7280', cursor: 'pointer' }}>
          {token ? '🔑 Update GitHub Token' : '🔑 Set GitHub Token for Notes'}
        </button>
      </div>

      <footer style={{ background: '#050505', borderTop: '1px solid #1f1f1f', color: '#4b5563', textAlign: 'center', padding: '24px 20px', fontSize: 13 }}>
        🌴 Bali Family Itinerary 2025 · Have an amazing trip ✈️
      </footer>
    </div>
  )
}

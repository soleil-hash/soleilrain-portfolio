'use client';

import { useEffect, useState, useCallback } from 'react';

const PIN = '254367';
const NAMES = ['Soleil', 'Vitali', 'Baron'];

type Status = 'free' | 'taken';
type Priority = 'available' | 'claimed';

export default function AliensPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [status, setStatus] = useState<Status>('free');
  const [priorities, setPriorities] = useState<Priority[]>(['available', 'available', 'available']);
  const [calBooked, setCalBooked] = useState(false);
  const [calEventName, setCalEventName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchState = useCallback(async () => {
    try {
      const [redisRes, calRes] = await Promise.all([
        fetch('/api/redis'),
        fetch('/api/calendar'),
      ]);
      const redis = await redisRes.json();
      const cal = await calRes.json();
      setStatus(redis.status);
      setPriorities(redis.priorities);
      setCalBooked(cal.booked);
      setCalEventName(cal.eventName);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    fetchState();
    const interval = setInterval(fetchState, 60000);
    return () => clearInterval(interval);
  }, [unlocked, fetchState]);

  const handlePin = (digit: string) => {
    const next = pinInput + digit;
    setPinInput(next);
    if (next.length === PIN.length) {
      if (next === PIN) {
        setUnlocked(true);
      } else {
        setPinError(true);
        setTimeout(() => { setPinInput(''); setPinError(false); }, 800);
      }
    }
  };

  const handleStatusToggle = async (s: Status) => {
    setStatus(s);
    await fetch('/api/redis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'status', value: s }),
    });
  };

  const handlePriority = async (i: number) => {
    const next = priorities[i] === 'available' ? 'claimed' : 'available';
    const updated = [...priorities];
    updated[i] = next;
    setPriorities(updated);
    await fetch('/api/redis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'priority', index: i, value: next }),
    });
  };

  const effectiveStatus: Status = calBooked ? 'taken' : status;

  if (!unlocked) {
    return (
      <div style={styles.pinWrap}>
        <div style={styles.scanlines} />
        <div style={styles.pinBox}>
          <div style={styles.alienGlyph}>👽</div>
          <div style={styles.pinTitle}>ALIEN VERIFICATION</div>
          <div style={styles.pinSubtitle}>ENTER ACCESS CODE</div>
          <div style={styles.pinDots}>
            {Array.from({ length: PIN.length }).map((_, i) => (
              <div key={i} style={{
                ...styles.pinDot,
                background: pinInput.length > i ? (pinError ? '#ff3c3c' : '#00ff9f') : 'transparent',
                borderColor: pinError ? '#ff3c3c' : '#00ff9f',
              }} />
            ))}
          </div>
          <div style={styles.pinGrid}>
            {[
              { d: '1', sub: '' },
              { d: '2', sub: 'ABC' },
              { d: '3', sub: 'DEF' },
              { d: '4', sub: 'GHI' },
              { d: '5', sub: 'JKL' },
              { d: '6', sub: 'MNO' },
              { d: '7', sub: 'PQRS' },
              { d: '8', sub: 'TUV' },
              { d: '9', sub: 'WXYZ' },
              { d: '', sub: '' },
              { d: '0', sub: '+' },
              { d: '⌫', sub: '' },
            ].map(({ d, sub }, i) => (
              <button
                key={i}
                style={{ ...styles.pinKey, opacity: d === '' ? 0 : 1, flexDirection: 'column', gap: 2 }}
                onClick={() => {
                  if (d === '⌫') setPinInput(p => p.slice(0, -1));
                  else if (d !== '') handlePin(d);
                }}
              >
                <span>{d}</span>
                {sub && <span style={{ fontSize: '0.45rem', letterSpacing: '0.15em', color: 'rgba(0,255,159,0.5)' }}>{sub}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.scanlines} />
      <div style={styles.ticker}>
        <span style={styles.tickerInner}>
          ◈ VEHICLE MANAGEMENT SYSTEM ONLINE ◈ ALL UNITS REPORT STATUS ◈ MAX HOLD: 8 EARTH HOURS ◈ BOOK IT OR LOSE IT ◈ THE ALIENS FLEET COMMAND ◈ STAY WEIRD. STAY TOGETHER. ◈ &nbsp;&nbsp;&nbsp;
        </span>
      </div>

      <header style={styles.header}>
        <div style={styles.alienGlyph}>👽</div>
        <h1 style={styles.h1}>The Aliens</h1>
        <div style={styles.subtitle}>// VEHICLE COMMAND CENTER //</div>
        <div style={styles.headerLine} />
      </header>

      <main style={styles.main}>
        {/* STATUS */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div style={styles.panelDot} />
            <span style={styles.panelTitle}>Vehicle Status — Live</span>
            {calBooked && <span style={{ ...styles.panelTitle, color: '#ffb700', marginLeft: 'auto' }}>◈ AUTO FROM CALENDAR</span>}
          </div>
          <div style={styles.statusDisplay}>
            <div style={{ ...styles.statusCircle, borderColor: effectiveStatus === 'free' ? '#00ff9f' : '#ff3c3c' }}>
              {effectiveStatus === 'free' ? '🛸' : '🚗'}
            </div>
            <div style={{ ...styles.statusLabel, color: effectiveStatus === 'free' ? '#00ff9f' : '#ff3c3c' }}>
              {effectiveStatus === 'free' ? 'VEHICLE FREE' : 'VEHICLE TAKEN'}
            </div>
            <div style={styles.statusDetail}>
              {calBooked
                ? <>Auto-detected from calendar.<br />{calEventName && <span style={{ color: '#00ff9f' }}>{calEventName}</span>}</>
                : effectiveStatus === 'free'
                  ? <>No active booking detected.<br />Cleared for departure.</>
                  : <>Vehicle is currently deployed.<br />Check calendar for return time.</>
              }
            </div>
            {!calBooked && (
              <div style={styles.toggle}>
                <button
                  style={{ ...styles.toggleBtn, ...(status === 'free' ? styles.toggleActiveFree : {}) }}
                  onClick={() => handleStatusToggle('free')}
                >◉ FREE</button>
                <button
                  style={{ ...styles.toggleBtn, ...(status === 'taken' ? styles.toggleActiveTaken : {}) }}
                  onClick={() => handleStatusToggle('taken')}
                >◉ TAKEN</button>
              </div>
            )}
          </div>
        </div>

        {/* PRIORITY */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div style={{ ...styles.panelDot, animationDelay: '0.3s' }} />
            <span style={styles.panelTitle}>Priority Weekend Registry</span>
          </div>
          <div style={{ padding: '1.25rem 1rem' }}>
            {NAMES.map((name, i) => (
              <div key={i} style={styles.priorityRow}>
                <span style={styles.priorityName}>{name}</span>
                <button
                  style={{ ...styles.priorityBadge, ...(priorities[i] === 'claimed' ? styles.badgeClaimed : styles.badgeAvailable) }}
                  onClick={() => handlePriority(i)}
                >
                  {priorities[i] === 'claimed' ? 'CLAIMED' : 'AVAILABLE'}
                </button>
              </div>
            ))}
            <div style={styles.priorityNote}>
              ◈ 1 priority weekend per alien<br />
              ◈ Click to toggle claimed / available<br />
              ◈ Priority overrides all other bookings
            </div>
          </div>
        </div>

        {/* RULES */}
        <div style={{ ...styles.panel, gridColumn: '1 / -1' }}>
          <div style={styles.panelHeader}>
            <div style={{ ...styles.panelDot, animationDelay: '0.6s' }} />
            <span style={styles.panelTitle}>Intergalactic Vehicle Protocols</span>
          </div>
          <div style={styles.rulesGrid}>
            {[
              ['01', 'Book it or lose it', 'If it\'s not on the calendar, you cannot claim the vehicle. Unbooked time is open territory.'],
              ['02', '8-hour maximum hold', 'No single mission can lock down the vehicle for more than 8 Earth hours.'],
              ['03', 'First booking wins', 'All scheduling conflicts are resolved by timestamp. Earliest booking takes priority.'],
              ['04', '1 priority weekend each', 'Your weekend, your vehicle. All other aliens arrange alternate transport. Use wisely.'],
              ['05', 'Label your mission', 'Include your name and destination in the booking title so the crew stays informed.'],
              ['06', 'Respect the mothership', 'Return the vehicle fueled, clean, and on time. The aliens operate as one unit.'],
            ].map(([num, title, desc]) => (
              <div key={num} style={styles.ruleItem}>
                <div style={styles.ruleNum}>{num}</div>
                <div style={styles.ruleText}><span style={{ color: '#00ff9f' }}>{title}</span> — {desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CALENDAR */}
        <div style={{ ...styles.panel, gridColumn: '1 / -1' }}>
          <div style={styles.panelHeader}>
            <div style={{ ...styles.panelDot, animationDelay: '0.9s' }} />
            <span style={styles.panelTitle}>Mission Scheduling Terminal</span>
            <span style={{ ...styles.panelTitle, marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff9f', display: 'inline-block', animation: 'blink 1s infinite' }} />
              LIVE FEED
            </span>
          </div>
          <div style={{ padding: '1rem' }}>
            <iframe
              src="https://calendar.google.com/calendar/embed?src=372756d46b05ccbb65015156a2b0a3418c8d71d02301c40c02c09196c2875c00%40group.calendar.google.com&ctz=America%2FDenver"
              style={{ width: '100%', height: 500, border: 0, filter: 'invert(1) hue-rotate(100deg) saturate(0.8)' }}
              frameBorder={0}
              scrolling="no"
            />
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        ◈ THE ALIENS VEHICLE COMMAND ◈ STAY WEIRD. STAY TOGETHER. ◈
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=VT323&display=swap');
        @keyframes blink { 0%,49%{opacity:1}50%,100%{opacity:0} }
        @keyframes marquee { 0%{transform:translateX(100%)}100%{transform:translateX(-200%)} }
        @keyframes scanLine { 0%{top:-40px}100%{top:100%} }
        @keyframes pulseGlow { 0%,100%{text-shadow:0 0 8px #00ff9f,0 0 20px #00cc7a}50%{text-shadow:0 0 20px #00ff9f,0 0 50px #00cc7a} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: { background: '#020d08', minHeight: '100vh', fontFamily: "'Share Tech Mono', monospace", color: '#00ff9f', overflowX: 'hidden', cursor: 'crosshair' },
  scanlines: { position: 'fixed', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,159,0.03) 2px,rgba(0,255,159,0.03) 4px)', pointerEvents: 'none', zIndex: 1000 },
  ticker: { borderTop: '1px solid rgba(0,255,159,0.25)', borderBottom: '1px solid rgba(0,255,159,0.25)', padding: '6px 0', overflow: 'hidden', background: 'rgba(0,255,159,0.03)', fontSize: 11, letterSpacing: '0.1em', color: '#00cc7a' },
  tickerInner: { whiteSpace: 'nowrap', animation: 'marquee 28s linear infinite', display: 'inline-block' },
  header: { padding: '2.5rem 2rem 1.5rem', textAlign: 'center', borderBottom: '1px solid rgba(0,255,159,0.25)' },
  alienGlyph: { fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem', animation: 'pulseGlow 3s ease-in-out infinite' },
  h1: { fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 'clamp(1.8rem,5vw,3.2rem)', letterSpacing: '0.15em', textTransform: 'uppercase', animation: 'pulseGlow 3s ease-in-out infinite', lineHeight: 1 },
  subtitle: { fontFamily: "'VT323', monospace", fontSize: '1.2rem', color: '#00cc7a', letterSpacing: '0.3em', marginTop: '0.5rem' },
  headerLine: { height: 1, background: 'linear-gradient(90deg,transparent,#00ff9f,transparent)', margin: '1.2rem auto 0', width: '60%', opacity: 0.5 },
  main: { maxWidth: 1100, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' },
  panel: { border: '1px solid rgba(0,255,159,0.25)', background: '#040f0a', position: 'relative', overflow: 'hidden' },
  panelHeader: { padding: '0.6rem 1rem', borderBottom: '1px solid rgba(0,255,159,0.25)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,255,159,0.04)' },
  panelDot: { width: 6, height: 6, borderRadius: '50%', background: '#00ff9f', animation: 'blink 1.5s infinite', flexShrink: 0 },
  panelTitle: { fontFamily: "'Orbitron', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00cc7a' },
  statusDisplay: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1.5rem 1rem' },
  statusCircle: { width: 80, height: 80, borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', transition: 'all 0.4s ease' },
  statusLabel: { fontFamily: "'Orbitron', monospace", fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.1em', transition: 'all 0.4s ease' },
  statusDetail: { fontSize: '0.75rem', color: '#7acca3', textAlign: 'center', letterSpacing: '0.05em', minHeight: '2rem', lineHeight: 1.6 },
  toggle: { display: 'flex', border: '1px solid rgba(0,255,159,0.25)', overflow: 'hidden', marginTop: '0.5rem' },
  toggleBtn: { flex: 1, padding: '0.5rem 1rem', background: 'transparent', border: 'none', color: '#00cc7a', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.12em', cursor: 'pointer', textTransform: 'uppercase' },
  toggleActiveFree: { background: 'rgba(0,255,159,0.12)', color: '#00ff9f' },
  toggleActiveTaken: { background: 'rgba(255,60,60,0.12)', color: '#ff3c3c' },
  priorityRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', border: '1px solid rgba(0,255,159,0.12)', background: 'rgba(0,255,159,0.02)', marginBottom: '0.6rem' },
  priorityName: { fontFamily: "'Orbitron', monospace", fontSize: '0.65rem', letterSpacing: '0.1em', flex: 1, color: '#00cc7a' },
  priorityBadge: { fontSize: '0.65rem', padding: '2px 8px', letterSpacing: '0.1em', border: '1px solid', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", background: 'transparent' },
  badgeAvailable: { borderColor: '#00ff9f', color: '#00ff9f' },
  badgeClaimed: { borderColor: 'rgba(255,60,60,0.4)', color: '#ff3c3c', background: 'rgba(255,60,60,0.06)' },
  priorityNote: { marginTop: '1rem', fontSize: '0.65rem', color: 'rgba(0,255,159,0.3)', lineHeight: 1.8, borderTop: '1px solid rgba(0,255,159,0.08)', paddingTop: '0.75rem' },
  rulesGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem', padding: '1.25rem 1rem' },
  ruleItem: { display: 'flex', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(0,255,159,0.08)', alignItems: 'flex-start' },
  ruleNum: { fontFamily: "'Orbitron', monospace", fontSize: '0.6rem', color: '#00ff9f', background: 'rgba(0,255,159,0.1)', border: '1px solid rgba(0,255,159,0.25)', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  ruleText: { fontSize: '0.78rem', lineHeight: 1.6, color: '#7acca3' },
  footer: { textAlign: 'center', padding: '1.5rem', borderTop: '1px solid rgba(0,255,159,0.25)', fontSize: '0.65rem', color: 'rgba(0,255,159,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' },
  pinWrap: { background: '#020d08', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Share Tech Mono', monospace", cursor: 'crosshair' },
  pinBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' },
  pinTitle: { fontFamily: "'Orbitron', monospace", fontSize: '1rem', fontWeight: 700, color: '#00ff9f', letterSpacing: '0.2em' },
  pinSubtitle: { fontFamily: "'VT323', monospace", fontSize: '1.1rem', color: '#00cc7a', letterSpacing: '0.3em' },
  pinDots: { display: 'flex', gap: 12 },
  pinDot: { width: 14, height: 14, borderRadius: '50%', border: '1px solid #00ff9f', transition: 'all 0.15s' },
  pinGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gap: 8 },
  pinKey: { width: 60, height: 60, background: 'transparent', border: '1px solid rgba(0,255,159,0.25)', color: '#00ff9f', fontFamily: "'Orbitron', monospace", fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Flag, Clock, Users } from 'lucide-react'
import { mockCalendarEvents } from '../mockData'
import { EmptyState } from '../ui'
import type { CalendarEvent } from '../types'

const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const EVENT_COLORS: Record<CalendarEvent['type'], { bg: string; color: string }> = {
  milestone: { bg: '#d1fae5', color: '#065f46' },
  deadline: { bg: '#fee2e2', color: '#991b1b' },
  meeting: { bg: '#dbeafe', color: '#1e40af' },
}

const EVENT_ICONS: Record<CalendarEvent['type'], typeof Flag> = {
  milestone: Flag, deadline: Clock, meeting: Users,
}

export default function Calendrier() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1))

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = lastDay.getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()

  const days: { day: number; current: boolean; date: string }[] = []
  for (let i = startOffset - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, current: false, date: `${year}-${String(month).padStart(2, '0')}-${String(prevMonthDays - i).padStart(2, '0')}` })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, current: true, date: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` })
  }
  while (days.length % 7 !== 0) {
    const nextDay = days.length - daysInMonth - startOffset + 1
    days.push({ day: nextDay, current: false, date: '' })
  }

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    mockCalendarEvents.forEach((e) => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    return map
  }, [])

  const todayStr = new Date().toISOString().slice(0, 10)
  const monthEvents = mockCalendarEvents.filter((e) => {
    const d = new Date(e.date)
    return d.getFullYear() === year && d.getMonth() === month
  })

  return (
    <div>
      <div className="sol-page-header">
        <div>
          <h1>Calendrier</h1>
          <p>Échéances, jalons et réunions de projets</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="sol-chart" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}><ChevronLeft size={18} /></button>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{MONTH_NAMES[month]} {year}</h3>
          <button className="btn btn-secondary" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}><ChevronRight size={18} /></button>
        </div>
        <div className="prj-calendar">
          {DAY_NAMES.map((d) => <div key={d} className="prj-cal-header">{d}</div>)}
          {days.map((d, i) => {
            const events = d.current ? (eventsByDate[d.date] || []) : []
            const isToday = d.date === todayStr
            return (
              <div key={i} className={`prj-cal-day ${!d.current ? 'other-month' : ''} ${isToday ? 'today' : ''}`}>
                <div className="prj-cal-day-num">{d.day}</div>
                {events.map((e) => {
                  const { bg, color } = EVENT_COLORS[e.type]
                  const Icon = EVENT_ICONS[e.type]
                  return (
                    <div key={e.id} className="prj-cal-event" style={{ background: bg, color }} title={`${e.title} - ${e.projectName}`}>
                      <Icon size={10} style={{ display: 'inline', marginRight: '2px' }} /> {e.title}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Events list for current month */}
      <div className="sol-chart">
        <h3>Événements de {MONTH_NAMES[month]} {year}</h3>
        {monthEvents.length === 0 ? <EmptyState message="Aucun événement ce mois-ci." /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {monthEvents.map((e) => {
              const { bg, color } = EVENT_COLORS[e.type]
              const Icon = EVENT_ICONS[e.type]
              return (
                <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-neutral-200)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{e.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-neutral-500)' }}>{e.projectName}</div>
                  </div>
                  <span className="sol-badge" style={{ background: bg, color }}>{e.type === 'milestone' ? 'Jalon' : e.type === 'deadline' ? 'Échéance' : 'Réunion'}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-neutral-500)' }}>{new Date(e.date).toLocaleDateString('fr-FR')}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

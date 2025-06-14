import CalendarHeader from './header/calendar-header'
import CalendarBody from './body/calendar-body'
import CalendarHeaderActions from './header/actions/calendar-header-actions'
import CalendarHeaderDate from './header/date/calendar-header-date'
import CalendarHeaderActionsMode from './header/actions/calendar-header-actions-mode'
import CalendarHeaderActionsAdd from './header/actions/calendar-header-actions-add'
import CalendarProvider from './calendar-provider'

export default function FullCalendar ({
  events,
  setEvents,
  mode,
  setMode,
  date,
  setDate,
  calendarIconIsToday = true,
  mytaskUpdate
}) {
  return (
    <CalendarProvider
      events={events}
      setEvents={setEvents}
      mode={mode}
      setMode={setMode}
      date={date}
      setDate={setDate}
      calendarIconIsToday={calendarIconIsToday}
      mytaskUpdate={mytaskUpdate}
    >
      <CalendarHeader>
        <CalendarHeaderDate />
        <CalendarHeaderActions>
          <CalendarHeaderActionsMode />
          {!mytaskUpdate && <CalendarHeaderActionsAdd />}
        </CalendarHeaderActions>
      </CalendarHeader>
      <CalendarBody />
    </CalendarProvider>
  )
}

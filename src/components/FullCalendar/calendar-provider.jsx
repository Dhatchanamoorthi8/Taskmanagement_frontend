import { CalendarContext } from './calendar-context'
import { useState } from 'react'
import CalendarNewEventDialog from './dialog/calendar-new-event-dialog'
import CalendarManageEventDialog from './dialog/calendar-manage-event-dialog'
import CalendarNewTaskDialog from './dialog/create-new-task-dialog'
import CalendarEditTaskDialog from './dialog/edit-task-dialog'
import UserTaskUpdateDialog from './dialog/user-task-update-dialog'

export default function CalendarProvider ({
  events,
  setEvents,
  mode,
  setMode,
  date,
  setDate,
  calendarIconIsToday = true,
  mytaskUpdate,
  children
}) {
  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false)
  const [manageEventDialogOpen, setManageEventDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isUserupdateTask, setisUserupdateTask] = useState(false)

  return (
    <CalendarContext.Provider
      value={{
        events,
        setEvents,
        mode,
        setMode,
        date,
        setDate,
        calendarIconIsToday,
        mytaskUpdate,
        newEventDialogOpen,
        setNewEventDialogOpen,
        manageEventDialogOpen,
        setManageEventDialogOpen,
        selectedEvent,
        setSelectedEvent,
        isUserupdateTask,
        setisUserupdateTask
      }}
    >
      <CalendarNewTaskDialog />
      <CalendarEditTaskDialog />
      <UserTaskUpdateDialog />
      {children}
    </CalendarContext.Provider>
  )
}

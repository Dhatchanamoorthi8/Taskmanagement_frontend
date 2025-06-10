'use client'
import { use, useEffect, useMemo, useState } from 'react'
import { useUser } from '@/lib/UserContext'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTable } from '@/components/data-table/data-table'
import { myallTask } from '@/services/taskService'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { mytaskColumns } from './Table/mytaskColumns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { MytaskForm } from '@/forms/taskForms/MytaskForm'
import FullCalendar from '@/components/FullCalendar/calendar'
import { Calendar1, Table2Icon } from 'lucide-react'
import CustomToggle from '@/components/CustomToggle'

export default function MyTaskPage () {
  const { user } = useUser()
  const [data, setData] = useState([])
  const [title] = useQueryState('title', parseAsString.withDefault(''))
  const [status] = useQueryState(
    'status',
    parseAsArrayOf(parseAsString).withDefault([])
  )
  const [selectedTask, setSelectedTask] = useState(null)
  const [isDrawerOpen, setDrawerOpen] = useState(false)

  const [events, setEvents] = useState([])
  const [mode, setMode] = useState('month')
  const [date, setDate] = useState(new Date())

  const [toggleValue, setToggleValue] = useState('create')

  const fetchData = async () => {
    const result = await myallTask(user.id)
    console.log(result)
    setData(result)
    const formattedEvents = result.map(task => ({
      id: task.id,
      title: task.title,
      start: task.startDate,
      end: task.endDate || undefined,
      description: task.description,
      assignedToId: task.assignedToId,
      companyId: task.companyId,
      status: task.status,
      color: task.color
    }))
    setEvents(formattedEvents)
  }
  useEffect(() => {
    if (user) fetchData()
  }, [user])

  const filteredData = useMemo(() => {
    return data.filter(project => {
      const matchesTitle =
        title === '' ||
        project.title.toLowerCase().includes(title.toLowerCase())
      const matchesStatus =
        status.length === 0 || status.includes(project.status)

      return matchesTitle && matchesStatus
    })
  }, [title, status])

  const handleEdit = task => {
    setSelectedTask(task)
    setDrawerOpen(true)
  }

  const columns = mytaskColumns(handleEdit)
  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: 'title', desc: true }],
      columnPinning: { right: ['actions'] }
    },
    getRowId: row => row.id
  })

  const toggleOptions = [
    { value: 'create', label: 'Grid View', icon: <Table2Icon /> },
    { value: 'calendar', label: 'Calendar View', icon: <Calendar1 /> }
  ]

  return (
    <>
      <div className='flex justify-end px-4 py-2'>
        <CustomToggle
          options={toggleOptions}
          value={toggleValue}
          onChange={setToggleValue}
        />
      </div>

      {toggleValue === 'create' && (
        <div className='bg-background text-foreground p-4 md:p-6'>
          <div className='data-table-container w-full p-2 md:p-4'>
            <DataTable table={table}>
              <DataTableToolbar table={table}>
                <DataTableSortList table={table} />
              </DataTableToolbar>
            </DataTable>
          </div>
        </div>
      )}

      {toggleValue === 'calendar' && (
        <div className='bg-background text-foreground p-4 md:p-6'>
          <FullCalendar
            events={events}
            setEvents={setEvents}
            mode={mode}
            setMode={setMode}
            date={date}
            setDate={setDate}
            mytaskUpdate={true}
          />
        </div>
      )}

      <Dialog
        open={isDrawerOpen}
        onOpenChange={setDrawerOpen}
        direction='right'
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Task</DialogTitle>
            <DialogDescription>Update task details</DialogDescription>
          </DialogHeader>
          <MytaskForm
            user={user}
            editData={selectedTask}
            setData={setData}
            setDrawerOpen={setDrawerOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

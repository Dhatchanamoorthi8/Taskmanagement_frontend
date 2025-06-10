import { useUser } from '@/lib/UserContext'
import { deletetask, fetchAlltask } from '@/services/taskService'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { alltaskColumns } from './Table/alltaskColumns'
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import FullCalendar from '@/components/FullCalendar/calendar'
import {
  Calendar,
  Calendar1,
  ClipboardEdit,
  Table2,
  Table2Icon
} from 'lucide-react'
import CustomToggle from '@/components/CustomToggle'
import ConfirmDialog from '@/components/ConfirmDialog'
import { toast } from 'sonner'

export default function ListAllTaskPage () {
  const [data, setData] = useState([])
  const { user } = useUser()
  const router = useRouter()
  const [title] = useQueryState('title', parseAsString.withDefault(''))
  const [status] = useQueryState(
    'status',
    parseAsArrayOf(parseAsString).withDefault([])
  )

  const [dialogData, setDialogData] = useState({
    open: false,
    id: null,
    companyId: null,
    name: ''
  })

  const [events, setEvents] = useState([])
  const [mode, setMode] = useState('month')
  const [date, setDate] = useState(new Date())

  const [toggleValue, setToggleValue] = useState('create')

  const fetchData = async () => {
    try {
      const result = await fetchAlltask(user.companyId)
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
    } catch (error) {
      console.error('Error fetching Roles:', error.message)
    }
  }

  useEffect(() => {
    if (user?.companyId) {
      fetchData()
    }
  }, [user?.companyId])

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

  const handleDelete = async () => {
    try {
      if (!dialogData.id) {
        throw new Error('Missing user ID or company ID')
      }
      await deletetask(dialogData.id)
      toast.success(`Task "${dialogData.name}" deleted successfully!`)
      fetchData()
    } catch (err) {
      toast.error(err.message || 'Something went wrong while deleting the Task')
    } finally {
      setDialogData({ open: false, id: null, companyId: null, name: '' })
    }
  }

  const currentUser = {
    role: user?.Role?.name || user?.role,
    permissions: user?.Role?.Permissions?.map(p => p.key) || []
  }

  function hasPermission (user, permission) {
    if (user.role === 'COMPANY_ADMIN') return true
    return user.permissions.includes(permission)
  }

  const canEdit = hasPermission(currentUser, 'tasks_edit')
  const canDelete = hasPermission(currentUser, 'tasks_delete')

  const columns = alltaskColumns(router, canEdit, canDelete, setDialogData)
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
          <div className='data-table-container w-full p-2 md:p-4 '>
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
            mytaskUpdate={false}
          />
        </div>
      )}

      <ConfirmDialog
        open={dialogData.open}
        onClose={() => setDialogData({ ...dialogData, open: false })}
        onConfirm={handleDelete}
        title='Delete User'
        description={`Are you sure you want to delete User "${dialogData.name}"?`}
        confirmLabel='Delete'
      />
    </>
  )
}

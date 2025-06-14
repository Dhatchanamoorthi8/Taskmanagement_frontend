import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  CheckCircle,
  CheckCircle2,
  Text,
  Timer,
  XCircle
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { format } from 'date-fns'

function dateRangeFilterFn (row, id, filterValue) {
  // filterValue is usually [startDate, endDate], both are Date or string
  const cellDate = new Date(row.getValue(id))
  const [from, to] = filterValue || []
  if (from && cellDate < new Date(from)) return false
  if (to && cellDate > new Date(to)) return false
  return true
}

export const taskDashboardColumn = () => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    size: 32,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ cell }) => <div>{cell.getValue()}</div>,
    meta: {
      label: 'Title',
      placeholder: 'Search titles...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true,
    enableSorting: true
  },

  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      const desc = row.getValue('description') || ''
      const shortDesc = desc.length > 60 ? `${desc.substring(0, 60)}...` : desc

      return (
        <HoverCard>
          <HoverCardTrigger asChild>
            <span className='cursor-default text-sm text-muted-foreground'>
              {shortDesc}
            </span>
          </HoverCardTrigger>
          <HoverCardContent className=' w-80 p-3 text-sm'>
            {desc}
          </HoverCardContent>
        </HoverCard>
      )
    }
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue()
      let Icon, colorClass
      switch (status) {
        case 'completed':
          Icon = CheckCircle2
          colorClass = 'border-green-500 text-green-600'
          break
        case 'in progress':
          Icon = Timer
          colorClass = 'border-yellow-500 text-yellow-600'
          break
        case 'not_started':
          Icon = XCircle
          colorClass = 'border-gray-400 text-red-500'
          break
        case 'not_completed':
          Icon = XCircle
          colorClass = 'border-red-500 text-red-600'
          break
        default:
          Icon = Timer
          colorClass = 'border-muted text-muted-foreground'
      }

      return (
        <Badge
          variant='outline'
          className={`capitalize flex items-center gap-1 ${colorClass}`}
        >
          <Icon className='h-4 w-4' />
          {status.replace(/_/g, ' ')}
        </Badge>
      )
    },
    meta: {
      label: 'Status',
      variant: 'multiSelect',
      options: [
        { label: 'Completed', value: 'completed', icon: CheckCircle },
        { label: 'In Progress', value: 'in progress', icon: Text },
        { label: 'Not Started', value: 'not_started', icon: XCircle },
        { label: 'Not Completed', value: 'not_completed', icon: XCircle }
      ]
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Start Date' />
    ),
    cell: ({ row }) => format(new Date(row.original.startDate), 'dd-MM-yyyy'),
    meta: {
      label: 'Created At',
      variant: 'dateRange',
      icon: Calendar
    },
    enableColumnFilter: true,
    enableSorting: true,
    filterFn: dateRangeFilterFn
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='End Date' />
    ),
    cell: ({ row }) => format(new Date(row.original.endDate), 'dd-MM-yyyy')
  },
  {
    accessorKey: 'Creator.fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Assigned By' />
    )
  }
]

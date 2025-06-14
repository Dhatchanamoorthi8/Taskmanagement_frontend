import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { format } from 'date-fns'
import {
  ArrowUpDown,
  CheckCircle,
  CheckCircle2,
  Edit,
  MoreHorizontal,
  Text,
  Timer,
  Trash2,
  XCircle
} from 'lucide-react'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'

export const alltaskColumns = (router, canEdit, canDelete, setDialogData) => [
  {
    accessorKey: 'srno',
    header: 'Sr.No',
    cell: ({ row }) => <div className='text-center'>{row.index + 1}</div>,
    enableSorting: false
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Title <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const desc = row.getValue('title') || ''
      const shortDesc = desc.length > 30 ? `${desc.substring(0, 30)}...` : desc
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
    },
    meta: {
      label: 'Title',
      placeholder: 'Search titles...',
      variant: 'text',
      icon: Text
    },
    enableSorting: true,
    enableColumnFilter: true
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      const desc = row.getValue('description') || ''
      const shortDesc = desc.length > 30 ? `${desc.substring(0, 30)}...` : desc

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
        { label: 'Not Started', value: 'yet_to_start', icon: XCircle },
        { label: 'Not Completed', value: 'not_completed', icon: XCircle }
      ]
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'assignedTo.fullName',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Assigned To <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    enableSorting: true
  },

  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => format(new Date(row.original.startDate), 'yyyy-MM-dd'),
    enableSorting: true
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => format(new Date(row.original.endDate), 'yyyy-MM-dd'),
    enableSorting: true
  },
  {
    accessorKey: 'remarks',
    header: 'Remarks',
    cell: ({ row }) => row.original.remarks || '—',
    enableSorting: false
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const task = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => {
                router.push(
                  `/dashboard/tasks/EditTask?id=${task.id}&companyId=${task.companyId}`
                )
              }}
              disabled={!canEdit}
            >
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setDialogData({
                  open: true,
                  id: task.id,
                  companyId: task.companyId,
                  name: task.title
                })
              }}
              className='text-red-600'
              disabled={!canDelete}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  RefreshCw,
  Trash2
} from 'lucide-react'

export const getcompanyColumns = [
  {
    accessorKey: 'srno',
    header: 'Sr.No',
    cell: ({ row }) => <div className='text-center'>{row.index + 1}</div>,
    enableSorting: false
  },

  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Company Name <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    enableSorting: true
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Phone Number <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    enableSorting: true
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Email <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>,
    enableSorting: true
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Address <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    enableSorting: true
  },

  {
    accessorKey: 'gstNumber',
    header: 'Gst Number'
  },
  {
    accessorKey: 'status',
    header: () => <div className='text-right'>Status</div>,
    cell: ({ row }) => {
      const status = row.getValue('status')

      return (
        <div className='text-right font-medium'>
          <Badge
            variant='outline'
            className={
              status === 'active'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }
          >
            {status}
          </Badge>
        </div>
      )
    },
    enableSorting: false
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const company = row.original

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
                // Handle edit logic here
                console.log('Edit:', company.id)
              }}
            >
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                // Handle status change logic
                console.log('Change status:', company.id)
              }}
            >
              <RefreshCw className='mr-2 h-4 w-4' />
              Change Status
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                // Handle delete logic
                console.log('Delete:', company.id)
              }}
              className='text-red-600'
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

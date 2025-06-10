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
  Edit,
  MoreHorizontal,
  RefreshCcw,
  Trash2
} from 'lucide-react'

export const getColumns = (
  router,
  canEdit,
  canDelete,
  setDialogData,
  handleChangeStatus
) => [
  {
    accessorKey: 'srno',
    header: 'Sr.No',
    cell: ({ row }) => <div className='text-center'>{row.index + 1}</div>,
    enableSorting: false
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Full Name <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ cell }) => <div>{cell.getValue()}</div>,
    meta: {
      label: 'fullName',
      placeholder: 'Search fullName...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true,
    enableSorting: true
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Phone No <ArrowUpDown className='ml-2 h-4 w-4' />
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
    enableSorting: true
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Role <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    enableSorting: true
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Created At <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return <div>{format(date, 'dd-MM-yyyy hh:mm a')}</div>
    }
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Updated At <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'))
      return <div>{format(date, 'dd-MM-yyyy hh:mm a')}</div>
    }
  },
  {
    accessorKey: 'isActive',
    header: () => <div className='text-right'>Status</div>,
    cell: ({ row }) => {
      const isActive = row.getValue('isActive')
      return (
        <div className='text-right font-medium'>
          <Badge
            variant='outline'
            className={
              isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }
          >
            {isActive ? 'Active' : 'InActive'}
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
      const user = row.original
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
                  `/dashboard/users/EditUser?id=${user.id}&companyId=${user.companyId}`
                )
              }}
              disabled={!canEdit}
            >
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                handleChangeStatus(user)
              }}
              disabled={!canEdit}
              className={user.isActive ? ' text-yellow-500' : 'text-green-500'}
            >
              <RefreshCcw className='mr-2 h-4 w-4' />
              Change {user.isActive ? 'InActive' : 'Active'}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setDialogData({
                  open: true,
                  id: user.id,
                  companyId: user.companyId,
                  name: user.fullName
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

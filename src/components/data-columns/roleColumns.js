// columns.jsx or columns.tsx
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
import { ArrowUpDown, Edit, MoreHorizontal, Trash2 } from 'lucide-react'

export const getroleColumns = (
  router,
  canEdit,
  canDelete,
  onDelete,
  setDialogData
) => [
  {
    accessorKey: 'srno',
    header: 'Sr.No',
    cell: ({ row }) => <div>{row.index + 1}</div>,
    enableSorting: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Role Name <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ cell }) => <div>{cell.getValue()}</div>,
    meta: {
      label: 'Role Name',
      placeholder: 'Search Role Name...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true,
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
      const data = row.original

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
              disabled={!canEdit}
              onClick={() => {
                router.push(
                  `/dashboard/roles/EditRole?id=${data.id}&companyId=${data.companyId}`
                )
              }}
            >
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setDialogData({
                  open: true,
                  id: data.id,
                  companyId: data.companyId,
                  name: data.name
                })
              }}
              disabled={!canDelete}
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

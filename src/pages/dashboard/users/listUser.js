'use client'
import { useUser } from '@/lib/UserContext'
import { useEffect, useMemo, useState } from 'react'
import { getColumns } from './Table/columns'
import { useRouter } from 'next/router'
import {
  deleteUser,
  fetchUserlist,
  updateactiveStatus
} from '@/services/userService'
import ConfirmDialog from '@/components/ConfirmDialog'
import { toast } from 'sonner'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { useDataTable } from '@/hooks/use-data-table'
import { parseAsString, useQueryState } from 'nuqs'

export default function ListUserPage () {
  const { user } = useUser()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [fullName] = useQueryState('fullName', parseAsString.withDefault(''))
  const [dialogData, setDialogData] = useState({
    open: false,
    id: null,
    companyId: null,
    name: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchUserlist(user.companyId)

        setData(result)
      } catch (error) {
        console.error('Error fetching Users:', error.message)
      } finally {
        setLoading(false)
      }
    }
    if (user?.companyId) {
      fetchData()
    }
  }, [user?.companyId])

  const filteredData = useMemo(() => {
    return data.filter(project => {
      const matchesTitle =
        fullName === '' ||
        project.fullName.toLowerCase().includes(fullName.toLowerCase())
      return matchesTitle
    })
  }, [fullName, data])

  const handleDelete = async () => {
    try {
      if (!dialogData.id || !dialogData.companyId) {
        throw new Error('Missing user ID or company ID')
      }
      await deleteUser(dialogData.id, dialogData.companyId)
      toast.success(`Role "${dialogData.name}" deleted successfully!`)
      const result = await fetchUserlist(user.companyId)
      setData(result)
    } catch (err) {
      toast.error(err.message || 'Something went wrong while deleting the User')
    } finally {
      setDialogData({ open: false, id: null, companyId: null, name: '' })
    }
  }

  const handleChangeStatus = async props => {
    try {
      if (!props) {
        toast.error('User Not Valid')
        return
      }
      const response = await updateactiveStatus(props.id)
      toast.success(`${response.message}`)
      const result = await fetchUserlist(user.companyId)
      setData(result)
    } catch (error) {
      console.log(error)
      toast.error(err.message || 'Something went wrong while deleting the User')
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

  const canEdit = hasPermission(currentUser, 'edit_user')
  const canDelete = hasPermission(currentUser, 'delete_user')

  const columns = getColumns(
    router,
    canEdit,
    canDelete,
    setDialogData,
    handleChangeStatus
  )

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: 'fullName', desc: true }],
      columnPinning: { right: ['actions'] }
    },
    getRowId: row => row.id
  })

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-lg'>Loading...</p>
      </div>
    )
  }

  return (
    <>
      <div className='bg-background text-foreground p-4 md:p-6'>
        <div className='data-table-container w-full p-2 md:p-4'>
          <DataTable table={table}>
            <DataTableToolbar table={table}>
              <DataTableSortList table={table} />
            </DataTableToolbar>
          </DataTable>
        </div>
      </div>
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

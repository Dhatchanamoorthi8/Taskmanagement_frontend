import { useUser } from '@/lib/UserContext'
import { deleteRole, fetchRolelist } from '@/services/roleService'
import { useEffect, useMemo, useState } from 'react'
import { getColumns } from './Table/columns'
import { useRouter } from 'next/router'
import ConfirmDialog from '@/components/ConfirmDialog'
import { toast } from 'sonner'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { parseAsString, useQueryState } from 'nuqs'
import { useDataTable } from '@/hooks/use-data-table'

export default function ListRolePage () {
  const { user } = useUser()
  const [data, setData] = useState([])
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [name] = useQueryState('name', parseAsString.withDefault(''))
  const [dialogData, setDialogData] = useState({
    open: false,
    id: null,
    companyId: null,
    name: ''
  })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchRolelist(user.companyId)
        setData(result)
      } catch (error) {
        console.error('Error fetching Roles:', error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredData = useMemo(() => {
    return data.filter(project => {
      const matchesTitle =
        name === '' || project.name.toLowerCase().includes(name.toLowerCase())
      return matchesTitle
    })
  }, [name, data])

  const currentUser = {
    role: user?.Role?.name || user?.role,
    permissions: user?.Role?.Permissions?.map(p => p.key) || []
  }

  function hasPermission (user, permission) {
    if (user.role === 'COMPANY_ADMIN') return true
    return user.permissions.includes(permission)
  }
  const handleDelete = async () => {
    try {
      if (!dialogData.id || !dialogData.companyId) {
        throw new Error('Missing role ID or company ID')
      }
      await deleteRole(dialogData.id, dialogData.companyId)
      toast.success(`Role "${dialogData.name}" deleted successfully!`)
      const result = await fetchRolelist(user.companyId)
      setData(result)
    } catch (err) {
      toast.error(err.message || 'Something went wrong while deleting the role')
    } finally {
      setDialogData({ open: false, id: null, companyId: null, name: '' })
    }
  }

  const canEdit = hasPermission(currentUser, 'edit_role')
  const canDelete = hasPermission(currentUser, 'delete_role')

  const columns = getColumns(
    router,
    canEdit,
    canDelete,
    handleDelete,
    setDialogData
  )

  const { table } = useDataTable({
    data: filteredData,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: 'name', desc: true }],
      columnPinning: { right: ['actions'] }
    },
    getRowId: row => row.id
  })

  if (loading) {
    return <div>Loading...</div>
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
        title='Delete Role'
        description={`Are you sure you want to delete role "${dialogData.name}"?`}
        confirmLabel='Delete'
      />
    </>
  )
}

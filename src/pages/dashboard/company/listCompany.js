'use client'

import { useEffect, useState } from 'react'
import { getallCompany } from '@/services/companyService'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { useDataTable } from '@/hooks/use-data-table'
import { getcompanyColumns } from '@/components/data-columns/companyColumns'

export default function ListCompanyPage () {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getallCompany()
        setData(result)
      } catch (error) {
        console.error('Error fetching companies:', error.message)
      }
    }

    fetchData()
  }, [])

  const { table } = useDataTable({
    data,
    getcompanyColumns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: 'name', desc: true }],
      columnPinning: { right: ['actions'] }
    },
    getRowId: row => row.id
  })

  return (
    <div className='bg-background text-foreground p-4 md:p-6'>
      <div className='data-table-container w-full p-2 md:p-4'>
        <DataTable table={table}>
          <DataTableToolbar table={table}>
            <DataTableSortList table={table} />
          </DataTableToolbar>
        </DataTable>
      </div>
    </div>
  )
}

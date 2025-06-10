'use client'

import { useEffect, useState } from 'react'
import { columns } from './Table/columns'
import { DataTable } from './Table/data-table'
import { getallCompany } from '@/services/companyService'

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


  return (
    <div className='flex justify-center bg-background text-foreground min-h-screen px-4 py-10 overflow-y-auto p-6'>
      <div className='flex flex-col items-center w-full max-w-4xl space-y-6'>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

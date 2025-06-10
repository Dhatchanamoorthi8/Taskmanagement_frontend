'use client'
import { AddCompanyForm } from '@/forms/companyForms/AddCompanyForm'
export default function AddCompanyPage () {
  return (
    <div className='flex justify-center bg-background text-foreground min-h-screen px-4 py-10 overflow-y-auto p-6'>
      <div className='flex flex-col items-center w-full max-w-4xl space-y-6'>
        <AddCompanyForm />
      </div>
    </div>
  )
}

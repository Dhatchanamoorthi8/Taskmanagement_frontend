import { AddUserForm } from '@/forms/userForms/AddUserForm'

export default function AddUserPage () {
  return (
    <div className='flex justify-center bg-background text-foreground  px-4 py-10 overflow-y-auto p-6'>
      <div className='flex flex-col items-center w-full max-w-4xl space-y-6'>
        <AddUserForm />
      </div>
    </div>
  )
}

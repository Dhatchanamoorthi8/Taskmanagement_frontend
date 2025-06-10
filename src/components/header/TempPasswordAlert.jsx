import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { Terminal } from 'lucide-react'
import Link from 'next/link'

export default function TempPasswordAlert () {
  return (
    <div className='sticky top-16 z-50 px-4'>
      <Alert className='border-amber-500/50 h-14 text-amber-500 dark:border-amber-500 [&>svg]:text-amber-500'>
        <Terminal />
        <AlertTitle>Reset Temporary Password</AlertTitle>
        <AlertDescription>
          You are currently using a temporary password. Please{' '}
          <Link
            href='/dashboard/settings/security'
            className='underline font-medium text-amber-700 hover:text-amber-800'
          >
            reset it now
          </Link>{' '}
          for your security.
        </AlertDescription>{' '}
      </Alert>
    </div>
  )
}

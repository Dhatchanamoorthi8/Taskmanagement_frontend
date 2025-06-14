import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default  function AccountSettingsPage () {
  return (
    <div className='flex flex-col items-center w-full px-4 md:px-6'>
      <div className='w-full max-w-3xl'>
        <Card className='w-full'>
          <CardContent className='space-y-8 py-6 px-4 sm:px-6'>
            {/* Profile Info */}
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>Full Name</Label>
                <Input value='Moorthi' disabled type='text' />
              </div>

              <div className='space-y-2'>
                <Label>Email</Label>
                <Input value='moorthi@example.com' disabled type='email' />
              </div>
            </div>

            {/* Password Reset Section */}
            <div className='space-y-4 pt-6 border-t border-border'>
              <h3 className='text-lg font-semibold'>Reset Password</h3>

              <div className='space-y-2'>
                <Label htmlFor='current-password'>Current Password</Label>
                <Input
                  id='current-password'
                  type='password'
                  placeholder='Enter current password'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='new-password'>New Password</Label>
                <Input
                  id='new-password'
                  type='password'
                  placeholder='Enter new password'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='confirm-password'>Confirm New Password</Label>
                <Input
                  id='confirm-password'
                  type='password'
                  placeholder='Confirm new password'
                />
              </div>

              <Button className='w-full sm:w-fit mt-4'>Update Password</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { useRouter } from 'next/router'
import { SideMenu } from './Pages/SideMenu'
import { AppearanceSettings } from './Pages/AppearanceSettings'
import { ProfileSettings } from './Pages/ProfileSettings'
import { AccountSettings } from './Pages/AccountSettings'

export default function SettingsPage () {
  const router = useRouter()
  const section = router.query.section

  if (!router.isReady) return null
  const renderContent = () => {
    switch (section) {
      case 'appearance':
        return <AppearanceSettings />
      case 'profile':
        return <ProfileSettings />

      case 'account':
        return <AccountSettings />

      default:
        return <p className='text-muted-foreground'>Please select a section.</p>
    }
  }

  return (
    <div className='min-h-screen bg-background text-foreground p-6 flex gap-8'>
      <SideMenu />
      <div className='flex-1'>
        <h1 className='text-3xl font-bold mb-6'>Settings</h1>
        {/* <p className='mb-8 text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p> */}
        {renderContent()}
      </div>
    </div>
  )
}

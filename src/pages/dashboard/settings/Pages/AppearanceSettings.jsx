import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { Check } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function AppearanceSettingsPage () {
  const { theme, setTheme } = useTheme()

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' }
  ]

  const fontOptions = ['inter', 'sans', 'serif']

  return (
    <div className='w-full px-4 md:px-6 py-6 flex justify-center'>
      <div className='w-full max-w-full'>
        <Card className='w-full'>
          <CardContent className='space-y-8 py-6 px-4 sm:px-6'>
            {/* Font Selector */}
            <div className='space-y-2'>
              <Label>Font</Label>
              <Select>
                <SelectTrigger className='w-full sm:w-60'>
                  <SelectValue placeholder='Inter' />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map(font => (
                    <SelectItem key={font} value={font}>
                      {font.charAt(0).toUpperCase() + font.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className='text-sm text-muted-foreground'>
                Set the font you want to use in the dashboard.
              </p>
            </div>

            {/* Theme Selector */}
            <div className='space-y-2'>
              <Label>Theme</Label>
              <p className='text-sm text-muted-foreground'>
                Select the theme for the dashboard.
              </p>

              <RadioGroup.Root
                defaultValue='light'
                className='flex flex-wrap gap-4 mt-2'
                value={theme}
                onValueChange={value => setTheme(value)}
              >
                {themeOptions.map(option => (
                  <RadioGroup.Item
                    key={option.value}
                    value={option.value}
                    className='relative cursor-pointer border rounded-xl p-4 w-full sm:w-36 flex flex-col items-center justify-center data-[state=checked]:ring-2 data-[state=checked]:ring-primary data-[state=checked]:border-primary transition'
                  >
                    <div
                      className={`w-20 h-3 rounded mb-1 ${
                        option.value === 'light'
                          ? 'bg-gray-200'
                          : 'bg-slate-600'
                      }`}
                    />
                    <div
                      className={`w-20 h-3 rounded mb-1 ${
                        option.value === 'light'
                          ? 'bg-gray-200'
                          : 'bg-slate-600'
                      }`}
                    />
                    <div
                      className={`w-20 h-3 rounded ${
                        option.value === 'light'
                          ? 'bg-gray-200'
                          : 'bg-slate-600'
                      }`}
                    />
                    <span className='mt-2 text-xs'>{option.label}</span>
                    <div className='absolute top-2 right-2'>
                      <Check className='w-4 h-4 text-primary opacity-0 data-[state=checked]:opacity-100' />
                    </div>
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            </div>

            {/* Update button */}
            <div className='pt-2'>
              <Button className='w-full sm:w-fit'>Update preferences</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

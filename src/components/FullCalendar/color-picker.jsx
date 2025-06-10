import * as React from 'react'
import { colorOptions } from './calendar-tailwind-classes'
import { cn } from '@/lib/utils'

export function ColorPicker ({ field }) {
  return (
    <div className='flex items-center gap-2'>

      {colorOptions.map(color => (
        <div
          key={color.value}
          onClick={() => field.onChange(color.value)}
          title={color.label}
          className={cn(
            'w-6 h-6 rounded-full cursor-pointer border-2',
            `bg-${color.value}-500`,
            field.value === color.value && 'ring-2 ring-offset-2 ring-black'
          )}
        />
      ))}
    </div>
  )
}

// import * as React from 'react'
// import { Input } from '../ui/input'

// export function ColorPicker ({ field }) {
//   return (
//     <div className='grid w-full items-center gap-1.5'>
//       <div className='relative flex items-center gap-2'>
//         <Input
//           type='text'
//           className='h-8 pl-8'
//           value={field.value}
//           onChange={e => field.onChange(e.target.value)}
//         />
//         <div className='absolute top-2 left-2 z-10'>
//           <Input
//             type='color'
//             className={'relative w-4 h-4 border-8 p-0 z-50 cursor-pointer'}
//             value={field.value}
//             onChange={e => field.onChange(e.target.value)}
//             style={{
//               backgroundColor: field.value
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function CustomToggle ({
  options = [], // Array of { value: string, label?: string, icon?: ReactNode }
  value,
  onChange
}) {
  return (
    <LayoutGroup>
      <ToggleGroup
        className='flex gap-0 -space-x-px rounded-sm border overflow-hidden shadow-sm shadow-black/5 rtl:space-x-reverse'
        type='single'
        variant='outline'
        value={value}
        onValueChange={v => {
          if (v) onChange?.(v)
        }}
      >
        {options.map(option => {
          const isSelected = value === option.value
          return (
            <motion.div
              key={option.value}
              layout
              className='flex-1 flex divide-x'
              animate={{ flex: isSelected ? 1.6 : 1 }}
              transition={{
                flex: {
                  type: 'spring',
                  stiffness: 200,
                  damping: 30
                }
              }}    
            >
              <ToggleGroupItem
                value={option.value}
                className={cn(
                  'w-full rounded-none shadow-none focus-visible:z-10 text-base flex items-center justify-center gap-2 relative border-none',
                  isSelected && 'z-10'
                )}
              >
                <motion.div
                  layout
                  className='flex items-center justify-center gap-2 py-2 px-3'
                  initial={false}
                  animate={{
                    scale: isSelected ? 1 : 0.95
                  }}
                  transition={{
                    scale: {
                      type: 'spring',
                      stiffness: 400,
                      damping: 30
                    },
                    layout: {
                      type: 'spring',
                      stiffness: 400,
                      damping: 30
                    }
                  }}
                >
                  {option.icon && (
                    <motion.div
                      layout='position'
                      initial={false}
                      animate={{
                        scale: isSelected ? 0.9 : 1
                      }}
                      transition={{
                        scale: {
                          type: 'spring',
                          stiffness: 400,
                          damping: 30
                        }
                      }}
                    >
                      {option.icon}
                    </motion.div>
                  )}

                  <AnimatePresence mode='popLayout'>
                    {isSelected && option.label && (
                      <motion.p
                        layout='position'
                        key={`text-${option.value}`}
                        className='font-medium origin-left whitespace-nowrap'
                        initial={{
                          opacity: 0,
                          x: -2,
                          scale: 0.95
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          scale: 1,
                          transition: {
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                            opacity: { duration: 0.15 }
                          }
                        }}
                        exit={{
                          opacity: 0,
                          x: -2,
                          scale: 0.95,
                          transition: {
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                            opacity: { duration: 0.1 }
                          }
                        }}
                      >
                        {option.label}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </ToggleGroupItem>
            </motion.div>
          )
        })}
      </ToggleGroup>
    </LayoutGroup>
  )
}

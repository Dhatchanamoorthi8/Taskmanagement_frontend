'use client'
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { CalendarIcon } from 'lucide-react'

export function DateTimePicker ({ value, onChange, disabled = false, minDate }) {
  const [date, setDate] = useState(value)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (value) {
      setDate(value)
    }
  }, [value])

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)

  const handleDateSelect = selectedDate => {
    console.log(selectedDate, 'selectedDate')

    if (selectedDate) {
      const current = date || new Date()
      selectedDate.setHours(current.getHours())
      selectedDate.setMinutes(current.getMinutes())
      setDate(selectedDate)
      onChange?.(selectedDate)
    }
  }

  const handleTimeChange = (type, value) => {
    if (date) {
      const newDate = new Date(date)
      if (type === 'hour') {
        const hour = parseInt(value) % 12
        const isPM = newDate.getHours() >= 12
        newDate.setHours(hour + (isPM ? 12 : 0))
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(value))
      } else if (type === 'ampm') {
        const currentHour = newDate.getHours()
        if (value === 'AM' && currentHour >= 12) {
          newDate.setHours(currentHour - 12)
        } else if (value === 'PM' && currentHour < 12) {
          newDate.setHours(currentHour + 12)
        }
      }
      setDate(newDate)
      onChange?.(newDate)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
          disabled={disabled}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? (
            format(date, 'MM/dd/yyyy hh:mm aa')
          ) : (
            <span>MM/DD/YYYY hh:mm aa</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-auto p-0 z-[9999]'
        forceMount
        side='bottom'
        align='start'
      >
        <div className='sm:flex'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={handleDateSelect}
            disabled={disabled}
            fromDate={minDate}
          />
          <div className='flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x'>
            <ScrollArea className='w-64 sm:w-auto'>
              <div className='flex sm:flex-col p-2'>
                {hours
                  .slice()
                  .reverse()
                  .map(hour => (
                    <Button
                      key={hour}
                      size='icon'
                      variant={
                        date && date.getHours() % 12 === hour % 12
                          ? 'default'
                          : 'ghost'
                      }
                      className='sm:w-full shrink-0 aspect-square'
                      onClick={() => handleTimeChange('hour', hour.toString())}
                    >
                      {hour}
                    </Button>
                  ))}
              </div>
              <ScrollBar orientation='horizontal' className='sm:hidden' />
            </ScrollArea>
            <ScrollArea className='w-64 sm:w-auto'>
              <div className='flex sm:flex-col p-2'>
                {Array.from({ length: 12 }, (_, i) => i * 5).map(minute => (
                  <Button
                    key={minute}
                    size='icon'
                    variant={
                      date && date.getMinutes() === minute ? 'default' : 'ghost'
                    }
                    className='sm:w-full shrink-0 aspect-square'
                    onClick={() =>
                      handleTimeChange('minute', minute.toString())
                    }
                  >
                    {minute}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation='horizontal' className='sm:hidden' />
            </ScrollArea>
            <ScrollArea>
              <div className='flex sm:flex-col p-2'>
                {['AM', 'PM'].map(ampm => (
                  <Button
                    key={ampm}
                    size='icon'
                    variant={
                      date &&
                      ((ampm === 'AM' && date.getHours() < 12) ||
                        (ampm === 'PM' && date.getHours() >= 12))
                        ? 'default'
                        : 'ghost'
                    }
                    className='sm:w-full shrink-0 aspect-square'
                    onClick={() => handleTimeChange('ampm', ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { getMonth, getYear } from 'date-fns'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const YEARS = Array.from(
  { length: 100 },
  (_, i) => getYear(new Date()) - 50 + i
)

function Calendar ({
  className,
  classNames,
  showOutsideDays = true,
  monthFilter = false,
  yearFilter = false,
  ...props
}) {
  const [selectedMonth, setSelectedMonth] = React.useState(
    getMonth(props?.month || new Date())
  )
  const [selectedYear, setSelectedYear] = React.useState(
    getYear(props?.month || new Date())
  )

  const handleMonthChange = e => {
    const newMonth = parseInt(e.target.value, 10)
    setSelectedMonth(newMonth)
    props.onMonthChange?.(new Date(selectedYear, newMonth))
  }

  const handleYearChange = e => {
    const newYear = parseInt(e.target.value, 10)
    setSelectedYear(newYear)
    props.onMonthChange?.(new Date(newYear, selectedMonth))
  }

  return (
    <DayPicker
      month={new Date(selectedYear, selectedMonth)}
      onMonthChange={date => {
        setSelectedMonth(getMonth(date))
        setSelectedYear(getYear(date))
      }}
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-2',
        month: 'flex flex-col gap-4',
        caption: 'flex justify-center pt-1 relative items-center w-full',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center gap-1',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'size-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-x-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 font-normal aria-selected:opacity-100'
        ),
        day_range_start:
          'day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground',
        day_range_end:
          'day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground aria-selected:text-muted-foreground',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn('size-4', className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn('size-4', className)} {...props} />
        ),
        ...(monthFilter || yearFilter
          ? {
              Caption: () => (
                <div className='flex items-center justify-between gap-2'>
                  {monthFilter && (
                    <select
                      className='text-sm border border-input bg-background rounded-md px-2 py-1'
                      value={selectedMonth}
                      onChange={handleMonthChange}
                    >
                      {MONTHS.map((month, index) => (
                        <option key={month} value={index}>
                          {month}
                        </option>
                      ))}
                    </select>
                  )}
                  {yearFilter && (
                    <select
                      className='text-sm border border-input bg-background rounded-md px-2 py-1'
                      value={selectedYear}
                      onChange={handleYearChange}
                    >
                      {YEARS.map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )
            }
          : {})
      }}
      {...props}
    />
  )
}

export { Calendar }

import { format, isSameDay, isSameMonth } from 'date-fns'
import { cn } from '@/lib/utils'
import { motion, MotionConfig, AnimatePresence } from 'framer-motion'
import { useCalendarContext } from './calendar-context'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Separator } from '../ui/separator'
import { CheckCircle2, Timer, XCircle } from 'lucide-react'
import { Badge } from '../ui/badge'

function parseEventDates (event) {
  return {
    ...event,
    start: new Date(event.start),
    end: new Date(event.end)
  }
}

function getOverlappingEvents (currentEvent, events) {
  const current = parseEventDates(currentEvent)
  return events.map(parseEventDates).filter(event => {
    if (event.id === current.id) return false
    return (
      current.start < event.end &&
      current.end > event.start &&
      isSameDay(current.start, event.start)
    )
  })
}

function calculateEventPosition (event, allEvents) {
  const parsedEvent = parseEventDates(event)
  const overlappingEvents = getOverlappingEvents(parsedEvent, allEvents)
  const group = [parsedEvent, ...overlappingEvents].sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  )

  const position = group.findIndex(e => e.id === parsedEvent.id)
  const width = `${100 / (overlappingEvents.length + 1)}%`
  const left = `${(position * 100) / (overlappingEvents.length + 1)}%`

  const startHour = parsedEvent.start.getHours()
  const startMinutes = parsedEvent.start.getMinutes()

  let endHour = parsedEvent.end.getHours()
  let endMinutes = parsedEvent.end.getMinutes()

  if (!isSameDay(parsedEvent.start, parsedEvent.end)) {
    endHour = 23
    endMinutes = 59
  }

  const topPosition = startHour * 128 + (startMinutes / 60) * 128
  const duration = endHour * 60 + endMinutes - (startHour * 60 + startMinutes)
  const height = (duration / 60) * 128

  return {
    left,
    width,
    top: `${topPosition}px`,
    height: `${height}px`
  }
}

export default function CalendarEvent ({ event, month = false, className }) {
  const {
    events,
    setSelectedEvent,
    mytaskUpdate,
    setManageEventDialogOpen,
    date,
    setisUserupdateTask
  } = useCalendarContext()
  const parsedEvent = parseEventDates(event)
  const style = month ? {} : calculateEventPosition(parsedEvent, events)
  const isEventInCurrentMonth = isSameMonth(parsedEvent.start, date)
  const animationKey = `${event.id}-${
    isEventInCurrentMonth ? 'current' : 'adjacent'
  }`

  let status = parsedEvent?.status || 'not_started'

  let Icon, colorClass

  switch (status) {
    case 'completed':
      Icon = CheckCircle2
      colorClass = 'border-green-500 text-green-600'
      break
    case 'in progress':
      Icon = Timer
      colorClass = 'border-yellow-500 text-yellow-600'
      break
    case 'not_started':
      Icon = XCircle
      colorClass = 'border-gray-400 text-red-500'
      break
    case 'not_completed':
      Icon = XCircle
      colorClass = 'border-red-500 text-red-600'
      break
    default:
      Icon = Timer
      colorClass = 'border-muted text-muted-foreground'
  }

  const badgeStyles = {
    yet_to_start:
      'bg-gray-400/10 dark:bg-gray-400/20 text-gray-500 border-gray-500/60',
    in_progress:
      'bg-amber-600/10 dark:bg-amber-600/20 text-amber-500 border-amber-600/60',
    completed:
      'bg-emerald-600/10 dark:bg-emerald-600/20 text-emerald-500 border-emerald-600/60',
    not_completed:
      'bg-red-600/10 dark:bg-red-600/20 text-red-500 border-red-600/60'
  }
  return (
    <MotionConfig reducedMotion='user'>
      <AnimatePresence mode='wait'>
        <HoverCard>
          <HoverCardTrigger asChild>
            <motion.div
              className={cn(
                `px-3 py-1.5 rounded-md truncate cursor-pointer transition-all duration-300 
            bg-${event.color}-500/10 
            hover:bg-${event.color}-500/20 
            border border-${event.color}-500`,
                !month && 'absolute',
                className
              )}
              style={style}
              onClick={e => {
                e.stopPropagation()
                setSelectedEvent(parsedEvent)
                setManageEventDialogOpen(!mytaskUpdate)
                setisUserupdateTask(mytaskUpdate)
              }}
              initial={{
                opacity: 0,
                y: -3,
                scale: 0.98
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}
              exit={{
                opacity: 0,
                scale: 0.98,
                transition: {
                  duration: 0.15,
                  ease: 'easeOut'
                }
              }}
              transition={{
                duration: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
                opacity: {
                  duration: 0.2,
                  ease: 'linear'
                },
                layout: {
                  duration: 0.2,
                  ease: 'easeOut'
                }
              }}
              layoutId={`event-${animationKey}-${month ? 'month' : 'day'}`}
            >
              <motion.div
                className={cn(
                  `flex flex-col w-full text-${event.color}-500`,
                  month && 'flex-row items-center justify-between'
                )}
                layout='position'
              >
                <p className={cn('font-bold truncate', month && 'text-xs')}>
                  {parsedEvent.title}
                </p>

                <p className={cn('text-sm', month && 'text-xs')}>
                  <span>{format(parsedEvent.start, 'h:mm a')}</span>
                  <span className={cn('mx-1', month && 'hidden')}>-</span>
                  <span className={cn(month && 'hidden')}>
                    {format(parsedEvent.end, 'h:mm a')}
                  </span>
                </p>
              </motion.div>
            </motion.div>
          </HoverCardTrigger>
          <HoverCardContent asChild>
            <motion.div
              className='w-80 p-3 text-sm rounded-md bg-white dark:bg-zinc-900 shadow-xl'
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className='block font-semibold'>Title : {parsedEvent.title}</p>

              <Separator />
              <p className='text-muted-foreground my-1'>
                Description : {parsedEvent.description}
              </p>
              <p className='text-muted-foreground'>
                Start : {format(parsedEvent.start, 'PPP p')}
              </p>
              <p className='text-muted-foreground my-1'>
                End : {format(parsedEvent.end, 'PPP p')}
              </p>

              {status && (
                <p className='text-muted-foreground my-1 flex items-center gap-2'>
                  <span>Status:</span>
                  <Badge
                    variant='outline'
                    className={`flex items-center gap-2 text-sm font-medium shadow-none rounded-full ${badgeStyles[status]}`}
                  >
                    <Icon className='h-4 w-4' />
                    {status
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, c => c.toUpperCase())}
                  </Badge>
                </p>
              )}
            </motion.div>
          </HoverCardContent>
        </HoverCard>
      </AnimatePresence>
    </MotionConfig>
  )
}

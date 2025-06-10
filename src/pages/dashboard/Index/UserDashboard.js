import {
  CheckCircleIcon,
  ClockIcon,
  ClipboardListIcon,
  TimerIcon,
  Loader2Icon,
  XCircleIcon,
  CalendarIcon,
  PauseCircleIcon,
  RefreshCwIcon,
  AlertTriangleIcon,
  Timer,
  CircleCheck
} from 'lucide-react'
import { useUser } from '@/lib/UserContext'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
import TaskCard from '@/components/TaskCard'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { useDataTable } from '@/hooks/use-data-table'
import { UserDashboardColumn } from './Table/userColumns'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { fetchuserDashboardList } from '@/services/dashboardService'

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL)

var date = new Date(),
  y = date.getFullYear(),
  m = date.getMonth()
var firstDay = new Date(y, m, 1)
var lastDay = new Date(y, m + 1, 0)

export function UserDashboard () {
  const { user } = useUser()
  const userId = user.id
  const [date, setDate] = useState({ from: firstDay, to: lastDay })
  const [taskStats, setTaskStats] = useState(null)
  const prevStatsRef = useRef(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [TasksData, setTasksData] = useState([])

  const calculateTrend = (key, current, previous) => {
    if (previous == null || previous === 0)
      return { trend: '+0.0%', trendingUp: true }
    const diff = current - previous
    const percent = ((diff / previous) * 100).toFixed(1)
    const trendingUp = diff >= 0
    const sign = trendingUp ? '+' : ''
    return {
      trend: `${sign}${percent}%`,
      trendingUp
    }
  }

  // useEffect(() => {
  //   if (!userId) return

  //   // Re-register on reconnect
  //   socket.on('connect', () => {
  //     socket.emit('register', userId)
  //   })

  //   socket.off('taskStats')

  //   socket.emit('register', userId)
  //   socket.emit('requestTaskStats', {
  //     userId,
  //     startDate: date?.from,
  //     endDate: date?.to
  //   })

  //   const handleTaskStats = newStats => {
  //     const prev = prevStatsRef.current || {}

  //     const calculateTrend = (key, current, previous) => {
  //       const trend =
  //         current > previous ? 'up' : current < previous ? 'down' : 'same'
  //       return { trend }
  //     }

  //     const computed = {
  //       total: {
  //         count: newStats.totaltask,
  //         ...calculateTrend('total', newStats.totaltask, prev.totaltask)
  //       },
  //       yet_to_start: {
  //         count: newStats.yet_to_start,
  //         ...calculateTrend(
  //           'yet_to_start',
  //           newStats.yet_to_start,
  //           prev.yet_to_start
  //         )
  //       },
  //       in_progress: {
  //         count: newStats.in_progress,
  //         ...calculateTrend(
  //           'in_progress',
  //           newStats.in_progress,
  //           prev.in_progress
  //         )
  //       },
  //       completed: {
  //         count: newStats.completed,
  //         ...calculateTrend('completed', newStats.completed, prev.completed)
  //       },
  //       not_completed: {
  //         count: newStats.not_completed,
  //         ...calculateTrend(
  //           'not_completed',
  //           newStats.not_completed,
  //           prev.not_completed
  //         )
  //       }
  //     }

  //     setTaskStats(computed)
  //     prevStatsRef.current = newStats
  //   }

  //   socket.on('taskStats', handleTaskStats)

  //   return () => {
  //     socket.off('taskStats', handleTaskStats)
  //   }
  // }, [userId, date])

  useEffect(() => {
    if (!userId) return

    socket.on('connect', () => {
      socket.emit('register', userId)
    })

    socket.off('userTaskStats')

    socket.emit('register', userId)

    socket.emit('requestUserTaskStats', {
      userId,
      startDate: date?.from,
      endDate: date?.to
    })

    const handleUserStats = newStats => {
      const prev = prevStatsRef.current || {}
      const calculateTrend = (current, previous) => {
        return current > previous ? 'up' : current < previous ? 'down' : 'same'
      }
      const computed = {
        total: {
          count: newStats.totaltask,
          trend: calculateTrend('total', newStats.totaltask, prev.totaltask)
        },
        yet_to_start: {
          count: newStats.yet_to_start,
          trend: calculateTrend(
            'yet_to_start',
            newStats.yet_to_start,
            prev.yet_to_start
          )
        },
        in_progress: {
          count: newStats.in_progress,
          trend: calculateTrend(
            'in_progress',
            newStats.in_progress,
            prev.in_progress
          )
        },
        completed: {
          count: newStats.completed,
          trend: calculateTrend('completed', newStats.completed, prev.completed)
        },
        not_completed: {
          count: newStats.not_completed,
          trend: calculateTrend(
            'not_completed',
            newStats.not_completed,
            prev.not_completed
          )
        },
        overdue: {
          count: newStats.overdue,
          trend: calculateTrend('', newStats.overdue, prev.overdue)
        }
      }

      setTaskStats(computed)
      prevStatsRef.current = newStats
    }

    socket.on('userTaskStats', handleUserStats)

    return () => {
      socket.off('userTaskStats', handleUserStats)
    }
  }, [userId, date])

  const isAlsoAdmin =
    user?.role === 'COMPANY_ADMIN' || user?.Role?.name === 'COMPANY_ADMIN'

  const handleCardClick = async props => {
    try {
      const data = await fetchuserDashboardList(props, userId)
      setTasksData(data)
      setDialogOpen(true)
    } catch (error) {
      console.log(error)
    }
  }

  const columns = UserDashboardColumn()

  const { table } = useDataTable({
    data: TasksData || [],
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: 'title', desc: true }],
      columnPinning: { right: ['actions'] }
    },
    getRowId: row => row.id
  })

  if (!taskStats) {
    return <p className='px-4'>Loading...</p>
  }

  return (
    <>
      <div className='ms-auto px-4 lg:px-6 '>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className={cn(
                'w-full justify-start text-left font-normal',
                !date?.from && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='range'
              selected={date}
              onSelect={range => {
                setDate(range)
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className='*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6'>
        <TaskCard
          title='Total Tasks'
          value={taskStats.total.count}
          trend={taskStats.total.trend}
          isUp={taskStats.total.trendingUp}
          icon={<ClipboardListIcon className='size-4 text-blue-600' />}
          subtitle='All tasks assigned to you'
          note='Includes all statuses'
          onClick={() => handleCardClick()}
        />

        <TaskCard
          title='Yet to Start'
          value={taskStats.yet_to_start.count}
          trend={taskStats.yet_to_start.trend}
          isUp={taskStats.yet_to_start.trendingUp}
          BadgeIcon='PauseCircleIcon'
          trendColor='text-gray-500'
          icon={<PauseCircleIcon className='size-4 text-gray-500' />}
          subtitle='Tasks not started yet'
          note='Needs attention'
          onClick={() => handleCardClick('yet_to_start')}
        />

        <TaskCard
          title='In Progress'
          value={taskStats.in_progress.count}
          trend={taskStats.in_progress.trend}
          isUp={taskStats.in_progress.trendingUp}
          BadgeIcon='TimerIcon'
          trendColor='text-blue-500'
          icon={<Timer className='size-4 text-blue-500' />}
          subtitle='Tasks currently ongoing'
          note='Keep it up'
          noteColor='text-blue-500'
          onClick={() => handleCardClick('in_progress')}
        />

        <TaskCard
          title='Completed'
          value={taskStats.completed.count}
          trend={taskStats.completed.trend}
          isUp={taskStats.completed.trendingUp}
          BadgeIcon='CircleCheckIcon'
          trendColor='text-green-500'
          icon={<CircleCheck className='size-4 text-green-500' />}
          subtitle='Tasks finished successfully'
          note='Great job!'
          noteColor='text-green-500'
          onClick={() => handleCardClick('completed')}
        />

        <TaskCard
          title='Not Completed'
          value={taskStats.not_completed.count}
          trend={taskStats.not_completed.trend}
          isUp={taskStats.not_completed.trendingUp}
          BadgeIcon='AlertTriangleIcon'
          trendColor='text-yellow-600'
          icon={<AlertTriangleIcon className='size-4 text-yellow-600' />}
          subtitle='Tasks left incomplete'
          note='Needs review'
          noteColor='text-yellow-600'
          onClick={() => handleCardClick('not_completed')}
        />

        {isAlsoAdmin && (
          <TaskCard
            title='Assigned by You'
            value={taskStats.assigned.count}
            trend={taskStats.assigned.trend}
            isUp={taskStats.assigned.trendingUp}
            icon={<TimerIcon className='size-4 text-blue-500' />}
            subtitle='You created these tasks'
            note='Tracks your delegation'
          />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='max-w-screen overflow-auto lg:min-w-full lg:h-screen '>
          <div className='bg-background text-foreground p-4 md:p-6'>
            <div className='data-table-container w-full'>
              <DataTable table={table}>
                <DataTableToolbar table={table}>
                  <DataTableSortList table={table} />
                </DataTableToolbar>
              </DataTable>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

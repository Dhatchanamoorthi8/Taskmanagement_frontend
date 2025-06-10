import {
  AlertTriangleIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CheckCircleIcon,
  CircleCheck,
  ClipboardListIcon,
  ClockIcon,
  PauseCircleIcon,
  RefreshCwIcon,
  Timer,
  TrendingDownIcon,
  TrendingUpIcon,
  XCircleIcon
} from 'lucide-react'
import TaskCard from '@/components/TaskCard'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useUser } from '@/lib/UserContext'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { useDataTable } from '@/hooks/use-data-table'
import { UserDashboardColumn } from './Table/userColumns'
import { fetchadminDashboardList } from '@/services/dashboardService'

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL)

var date = new Date(),
  y = date.getFullYear(),
  m = date.getMonth()
var firstDay = new Date(y, m, 1)
var lastDay = new Date(y, m + 1, 0)

export function CompanyDashboard () {
  const { user } = useUser()
  const userId = user.id
  const companyId = user.companyId
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


  useEffect(() => {
    if (!userId || !companyId) return

    const handleAdminStats = newStats => {
      const prev = prevStatsRef.current || {}
      const calculateTrend = (current, previous) => {
        return current > previous ? 'up' : current < previous ? 'down' : 'same'
      }

      const computed = {
        total: {
          count: newStats.total,
          trend: calculateTrend(newStats.total, prev.total)
        },
        yet_to_start: {
          count: newStats.yet_to_start,
          trend: calculateTrend(newStats.yet_to_start, prev.yet_to_start)
        },
        in_progress: {
          count: newStats.in_progress,
          trend: calculateTrend(newStats.in_progress, prev.in_progress)
        },
        completed: {
          count: newStats.completed,
          trend: calculateTrend(newStats.completed, prev.completed)
        },
        not_completed: {
          count: newStats.not_completed,
          trend: calculateTrend(newStats.not_completed, prev.not_completed)
        },
        overdue: {
          count: newStats.overdue,
          trend: calculateTrend(newStats.overdue, prev.overdue)
        }
      }

      setTaskStats(computed)
      prevStatsRef.current = newStats
    }

    socket.off('adminTaskStats', handleAdminStats) 
    socket.on('adminTaskStats', handleAdminStats) 

    socket.emit('register', { userId, companyId })
    socket.emit('requestAdminTaskStats', {
      companyId,
      startDate: date?.from,
      endDate: date?.to
    })

    return () => {
      socket.off('adminTaskStats', handleAdminStats)
    }
  }, [userId, companyId, date])

  const handleCardClick = async props => {
    try {
      const data = await fetchadminDashboardList(props, companyId)

      console.log(data);
      
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
          //BadgeIcon={isIncrease ? 'TrendingUpIcon' : 'TrendingDownIcon'}
          //trendColor={badgeColor}
          icon={<ClipboardListIcon className='size-4 text-blue-600' />}
          subtitle='All tasks across departments'
          note='Compared to last period'
          noteColor=''
          onClick={() => handleCardClick()}
        />

        <TaskCard
          title='Yet to Start'
          value={taskStats.yet_to_start.count}
          trend={taskStats.yet_to_start.trend}
          BadgeIcon='PauseCircleIcon'
          trendColor='text-gray-500'
          icon={<Timer className='size-4 text-gray-500' />}
          subtitle='Pending assignment or kickoff'
          note='Check team allocation'
          noteColor='text-gray-500'
          onClick={() => handleCardClick('yet_to_start')}
        />

        <TaskCard
          title='In Progress'
          value={taskStats.in_progress.count}
          trend={taskStats.in_progress.trend}
          BadgeIcon='TimerIcon'
          trendColor='text-blue-500'
          icon={<Timer className='size-4 text-blue-500' />}
          subtitle='Actively being worked on'
          note='Monitor active efforts'
          noteColor='text-blue-500'
          onClick={() => handleCardClick('in_progress')}
        />

        <TaskCard
          title='Completed'
          value={taskStats.completed.count}
          trend={taskStats.completed.trend}
          BadgeIcon='CircleCheckIcon'
          trendColor='text-green-500'
          icon={<CircleCheck className='size-4 text-green-500' />}
          subtitle='Successfully delivered'
          note='Keep up the momentum!'
          noteColor='text-green-500'
          onClick={() => handleCardClick('completed')}
        />

        <TaskCard
          title='Not Completed'
          value={taskStats.not_completed.count}
          trend={taskStats.not_completed.trend}
          BadgeIcon='AlertTriangleIcon'
          trendColor='text-yellow-600'
          icon={<AlertTriangleIcon className='size-4 text-yellow-600' />}
          subtitle='Missed deadline or dropped'
          note='Requires follow-up'
          noteColor='text-yellow-600'
          onClick={() => handleCardClick('not_completed')}
        />

        <TaskCard
          title='Overdue Tasks'
          value={taskStats.overdue.count}
          trend={taskStats.overdue.trend}
          BadgeIcon='XCircleIcon'
          trendColor='text-red-600'
          icon={<XCircleIcon className='size-4 text-red-600' />}
          subtitle='Past due date'
          note='Immediate action needed'
          noteColor='text-red-600'
          onClick={() => handleCardClick('overdue')}
        />
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

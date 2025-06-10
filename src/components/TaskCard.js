import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { AlertCircleIcon, CheckCircleIcon } from 'lucide-react'
import * as Icons from 'lucide-react'

export default function TaskCard ({
  title,
  value,
  trend,
  BadgeIcon,
  trendColor,
  icon,
  subtitle,
  note,
  onClick,
  noteColor
}) {
  const LucideIcon = Icons[BadgeIcon] || Icons.AlertCircleIcon

  return (
    <>
      <Card className='@container/card'>
        <CardHeader className='relative'>
          <CardDescription>{title}</CardDescription>
          <CardTitle
            className='@[250px]/card:text-3xl text-2xl font-semibold tabular-nums cursor-pointer'
            onClick={onClick}
          >
            {value}
          </CardTitle>
          <div className='absolute right-4 top-4'>
            <Badge
              variant='outline'
              className={`flex gap-1 rounded-lg text-xs ${trendColor}`}
            >
              <LucideIcon className='w-4 h-4' />
              {/* {trend} */}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter
          className={`flex-col items-start gap-1 text-sm ${noteColor}`}
        >
          <div className='line-clamp-1 flex gap-2 font-medium'>
            {subtitle} {icon}
          </div>
          <div className='text-muted-foreground'>{note}</div>
        </CardFooter>
      </Card>
    </>
  )
}

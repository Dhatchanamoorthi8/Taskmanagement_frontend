// /validation/taskSchema.ts
import { z } from 'zod'

export const TaskSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(2, 'Description must be at least 2 characters'),
    startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid start date'
    }),
    endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid end date'
    }),
    assignedToId: z
      .string()
      .uuid({ message: 'Select one employee for this task' }),
    companyId: z.string().uuid({ message: 'Invalid company ID' }),
    remarks: z.string().optional(),
    createdBy: z.string().optional(),
    color: z.string().optional()
  })
  .refine(data => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End time must be after start time',
    path: ['endDate']
  })

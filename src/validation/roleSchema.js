import { z } from 'zod'

export const RoleSchema = z.object({
  roleName: z.string().min(2, 'Role name is required'),
  permissions: z.array(z.string()).min(1, 'Select at least one permission')
})

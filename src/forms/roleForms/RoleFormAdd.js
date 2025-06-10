'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RoleSchema } from '@/validation/roleSchema'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form'
import { createRole } from '@/services/roleService'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { groupedPermissions } from '@/components/permissionsGrouped'
import { useState } from 'react'
import { useUser } from '@/lib/UserContext'

export default function RoleFormAdd ({ companyId, currentUser }) {
  const { user } = useUser()

  const [loading, setLoading] = useState(false)
  const canAdd =
    currentUser?.roles === 'COMPANY_ADMIN' ||
    currentUser?.permissions?.includes('add_role')

  const form = useForm({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      roleName: '',
      permissions: []
    }
  })

  const togglePermission = value => {
    const current = form.getValues('permissions')
    const updated = current.includes(value)
      ? current.filter(p => p !== value)
      : [...current, value]
    form.setValue('permissions', updated, { shouldValidate: true })
  }

  const onSubmit = async values => {
    setLoading(true)
    try {
      const selectedPermissions = []
      for (const [group, perms] of Object.entries(groupedPermissions)) {
        perms.forEach(p => {
          if (values.permissions.includes(p.key)) {
            selectedPermissions.push({ key: p.key, label: p.label })
          }
        })
      }

      await createRole({
        name: values.roleName,
        companyId,
        permissions: selectedPermissions,
        createdBy: user.id
      })
      toast.success('Role Created Successfully', {
        description: 'You can now assign it to users.'
      })
      form.reset()
    } catch (error) {
      toast.error('Error creating role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Create Role</CardTitle>
        <CardDescription>
          Fill in the role details to create a new one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='roleName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='e.g. Manager'
                      disabled={!canAdd || loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='permissions'
              render={() => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <div className='space-y-6'>
                    {Object.entries(groupedPermissions).map(
                      ([group, perms]) => {
                        const selectedPermissions =
                          form.watch('permissions') || []
                        const allSelected = perms.every(p =>
                          selectedPermissions.includes(p.key)
                        )
                        const someSelected = perms.some(p =>
                          selectedPermissions.includes(p.key)
                        )

                        const handleSelectAll = () => {
                          const updatedPermissions = allSelected
                            ? selectedPermissions.filter(
                                p => !perms.some(perm => perm.key === p)
                              )
                            : [
                                ...new Set([
                                  ...selectedPermissions,
                                  ...perms.map(p => p.key)
                                ])
                              ]

                          form.setValue('permissions', updatedPermissions, {
                            shouldValidate: true
                          })
                        }

                        return (
                          <div key={group} className='border p-4 rounded-md'>
                            <div className='flex items-center justify-between mb-2'>
                              <h4 className='font-semibold'>{group}</h4>
                              <label className='flex items-center space-x-2'>
                                <Checkbox
                                  checked={allSelected}
                                  onCheckedChange={handleSelectAll}
                                  disabled={loading}
                                  indeterminate={someSelected && !allSelected}
                                />
                                <span className='text-sm'>Select All</span>
                              </label>
                            </div>

                            <div className='flex flex-wrap gap-4'>
                              {perms.map(({ key, label }) => (
                                <div
                                  key={key}
                                  className='flex items-center space-x-2'
                                >
                                  <Checkbox
                                    id={`perm-${key}`}
                                    checked={selectedPermissions.includes(key)}
                                    onCheckedChange={() =>
                                      togglePermission(key)
                                    }
                                    disabled={loading}
                                  />
                                  <label
                                    htmlFor={`perm-${key}`}
                                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                                  >
                                    {label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }
                    )}
                  </div>
                </FormItem>
              )}
            />

            <Button
              type='submit'
              disabled={!canAdd || loading}
              className='w-full'
            >
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {loading ? 'Creating...' : 'Create Role'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

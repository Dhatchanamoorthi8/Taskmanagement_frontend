'use client'

import { useEffect, useState } from 'react'
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
import { fetchRoleById, updateRole } from '@/services/roleService'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { groupedPermissions } from '@/components/permissionsGrouped'

export default function RoleFormEdit ({ companyId, roleId }) {
  const [loading, setLoading] = useState(true)

  const form = useForm({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      roleName: '',
      permissions: []
    }
  })

  const { isDirty } = form.formState

  useEffect(() => {
    const loadRoleData = async () => {
      try {
        const role = await fetchRoleById(roleId, companyId)
        const permissions = role.permissions || role.Permissions || []
        form.reset({
          roleName: role.name,
          permissions: permissions.map(p => p.key)
        })
      } catch (err) {
        toast.error('Failed to load role')
      } finally {
        setLoading(false)
      }
    }

    if (roleId) {
      loadRoleData()
    }
  }, [roleId, companyId, form])

  const togglePermission = value => {
    const current = form.getValues('permissions')
    const updated = current.includes(value)
      ? current.filter(p => p !== value)
      : [...current, value]
    form.setValue('permissions', updated, {
      shouldValidate: true,
      shouldDirty: true
    })
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

      await updateRole({
        roleId,
        name: values.roleName,
        permissions: selectedPermissions,
        companyId
      })
      toast.success('Role Updated Successfully')
      form.reset(values)
    } catch (error) {
      toast.error('Error updating role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Edit Role</CardTitle>
        <CardDescription>Modify role and update permissions.</CardDescription>
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
                      placeholder='e.g. Supervisor'
                      disabled={loading}
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
                            shouldValidate: true,
                            shouldDirty: true
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
              disabled={loading || !isDirty}
              className='w-full'
            >
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {loading ? 'Updating...' : 'Update Role'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

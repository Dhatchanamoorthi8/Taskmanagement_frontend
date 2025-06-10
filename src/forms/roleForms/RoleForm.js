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
import {
  createRole,
  fetchAllrole,
  fetchRoleById,
  updateRole
} from '@/services/roleService'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

const groupedPermissions = {
  Users: [
    { key: 'user_add', label: 'Add User' },
    { key: 'users_list', label: 'List User' },
    { key: 'users_edit', label: 'Edit User' },
    { key: 'user_delete', label: 'Delete User' }
  ],
  Tasks: [
    { key: 'tasks_assign', label: 'Add Task ' },
    { key: 'tasks_all', label: 'List Tasks' },
    { key: 'tasks_my', label: 'My Tasks' },
    { key: 'tasks_edit', label: 'Edit Tasks' },
    { key: 'tasks_delete', label: 'Delete Tasks' }
  ],
  Roles: [
    { key: 'add_role', label: 'Add Role' },
    { key: 'list_role', label: 'List Role' },
    { key: 'edit_role', label: 'Edit Role' },
    { key: 'delete_role', label: 'Delete Role' }
  ]
}

export default function RoleForm ({ companyId, mode, currentUser, editroleid }) {
  //const isEdit = mode === 'edit'
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [isEdit, setIsEdit] = useState(mode === 'edit')
  const isCompanyAdmin = currentUser?.roles === 'COMPANY_ADMIN'

  const canModify = isCompanyAdmin
    ? true
    : isEdit
    ? currentUser?.permissions?.includes('edit_role')
    : currentUser?.permissions?.includes('add_role')

  const form = useForm({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      roleName: '',
      permissions: []
    }
  })

  useEffect(() => {
    setLoading(true)
    const loadRoles = async () => {
      try {
        const res = await fetchAllrole({ companyId })
        setRoles(res.roles || [])
      } catch (err) {
        console.log(err)
        toast.error('Failed to load roles')
      } finally {
        setLoading(false)
      }
    }
    loadRoles()
  }, [companyId])

  useEffect(() => {
    handleRoleSelect(editroleid)
  }, [editroleid])

  const handleRoleSelect = async roleId => {
    setSelectedRoleId(roleId)
    if (!roleId) return

    try {
      setLoading(true)
      const role = await fetchRoleById(roleId, companyId)

      const permissions = role.permissions || role.Permissions || []

      form.reset({
        roleName: role.name,
        permissions: permissions.map(p => p.key)
      })
      setIsEdit(true)
    } catch (err) {
      console.log(err)
      toast.error('Failed to load role data')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async values => {
    setLoading(true)
    try {
      const selectedKeys = values.permissions // ["user_add", "users_list"]

      // Convert keys to permission objects with `key` and `label`
      const selectedPermissions = []
      for (const [group, perms] of Object.entries(groupedPermissions)) {
        perms.forEach(p => {
          if (selectedKeys.includes(p.key)) {
            selectedPermissions.push({ key: p.key, label: p.label })
          }
        })
      }

      if (isEdit) {
        await updateRole({
          roleId: selectedRoleId,
          name: values.roleName,
          permissions: selectedPermissions,
          companyId
        })
        toast.success('Role Updated Successfully', {
          description: 'You can now assign it to users.'
        })
      } else {
        await createRole({
          name: values.roleName,
          companyId,
          permissions: selectedPermissions
        })
        toast.success('Role Created Successfully', {
          description: 'You can now assign it to users.'
        })
        form.reset()
      }
    } catch (error) {
      toast.error(isEdit ? 'Error updating role' : 'Error creating role')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const togglePermission = value => {
    const current = form.getValues('permissions')
    const updated = current.includes(value)
      ? current.filter(p => p !== value)
      : [...current, value]
    form.setValue('permissions', updated, { shouldValidate: true })
  }

  return (
    <div className='flex justify-center bg-background text-foreground min-h-screen px-4 py-3 overflow-y-auto'>
      <div className='flex flex-col items-center w-full max-w-4xl'>
        <Card className='w-full'>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Role' : 'Create Role'}</CardTitle>
            <CardDescription>
              {isEdit
                ? 'Edit an existing role'
                : 'Fill in the role details to create a new one.'}
            </CardDescription>
          </CardHeader>

          <CardContent className='flex flex-col items-center space-y-6'>
            {isEdit && (
              <div className='w-full max-w-xl flex flex-col'>
                <Label className='block text-sm font-medium mb-1'>
                  Select Existing Role to Edit
                </Label>
                <Select
                  onValueChange={handleRoleSelect}
                  value={selectedRoleId}
                  disabled={loading}
                >
                  <SelectTrigger className='w-full h-10'>
                    <SelectValue placeholder='Select a role to edit (optional)' />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6 w-full max-w-xl p-6 rounded-xl shadow-md bg-muted'
              >
                <FormField
                  control={form.control}
                  name='roleName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g. Manager, Support'
                          {...field}
                          disabled={!canModify || loading}
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
                      {/* <div className='space-y-6'>
                        {Object.entries(groupedPermissions).map(
                          ([group, perms]) => (
                            <div key={group}>
                              <h4 className='font-semibold mb-2'>{group}</h4>
                              <div className='flex flex-wrap gap-4'>
                                {perms.map(({ key, label }) => (
                                  <label
                                    key={key}
                                    className='flex items-center space-x-2'
                                  >
                                    <input
                                      type='checkbox'
                                      checked={form
                                        .watch('permissions')
                                        .includes(key)}
                                      onChange={() => togglePermission(key)}
                                      disabled={loading}
                                    />
                                    <span>{label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div> */}
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
                              <div
                                key={group}
                                className='border border-gray-300 rounded-lg p-4 shadow-sm'
                              >
                                <div className='flex items-center justify-between mb-2'>
                                  <h4 className='font-semibold'>{group}</h4>
                                  <label className='flex items-center space-x-2'>
                                    <Checkbox
                                      checked={allSelected}
                                      onCheckedChange={handleSelectAll}
                                      disabled={loading}
                                      indeterminate={
                                        someSelected && !allSelected
                                      }
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
                                        checked={selectedPermissions.includes(
                                          key
                                        )}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type='submit'
                  disabled={!canModify || loading}
                  className='w-full'
                >
                  {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                  {loading
                    ? isEdit
                      ? 'Updating...'
                      : 'Creating...'
                    : isEdit
                    ? 'Update Role'
                    : 'Create Role'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

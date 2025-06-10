import {
  Building2,
  CalendarCheck,
  CalendarPlus,
  CirclePlus,
  ClipboardCheck,
  LayoutList,
  ListTodo,
  Settings,
  Settings2,
  ShieldCheck,
  ShieldPlus,
  UserRoundCog,
  UserRoundPlus
} from 'lucide-react'

export const sidebarItems = [
  {
    title: 'Company',
    url: '',
    icon: Building2,
    roles: ['SUPER_ADMIN'],
    children: [
      {
        title: 'Add Companies',
        url: '/dashboard/company/addCompany',
        icon: CirclePlus
      },
      {
        title: 'List Companies',
        url: '/dashboard/company/listCompany',
        icon: LayoutList
      }
    ]
  },
  {
    title: 'Role',
    url: '',
    icon: ShieldCheck,
    roles: ['COMPANY_ADMIN', '*'],
    permissions: ['add_role', 'list_role', 'edit_role', 'delete_role'],
    children: [
      {
        title: 'Add Role',
        url: '/dashboard/roles/addRole',
        icon: ShieldPlus,
        permissions: ['add_role']
      },
      {
        title: 'List Role',
        url: '/dashboard/roles/listRole',
        icon: LayoutList,
        permissions: ['list_role', 'delete_role']
      }
    ]
  },
  {
    title: 'Users',
    url: '',
    icon: UserRoundCog,
    roles: ['COMPANY_ADMIN', '*'],
    permissions: ['user_add', 'users_list', 'users_edit', 'user_delete'],
    children: [
      {
        title: 'Add User',
        url: '/dashboard/users/addUser',
        icon: UserRoundPlus,
        permissions: ['user_add']
      },
      {
        title: 'List User',
        url: '/dashboard/users/listUser',
        icon: LayoutList,
        permissions: ['users_list', 'users_edit', 'user_delete']
      }
    ]
  },
  {
    title: 'Tasks',
    url: '',
    icon: ClipboardCheck,
    roles: ['COMPANY_ADMIN', '*'],
    permissions: ['tasks_assign', 'tasks_my', 'tasks_all', 'tasks_delete'],
    children: [
      {
        title: 'Add Tasks',
        url: '/dashboard/tasks/addTask',
        icon: CalendarPlus,
        permissions: ['tasks_assign']
      },
      {
        title: 'List Tasks',
        url: '/dashboard/tasks/listAllTask',
        icon: LayoutList,
        permissions: ['tasks_all', 'tasks_edit', 'tasks_delete']
      },
      {
        title: 'My Tasks',
        url: '/dashboard/tasks/myTask',
        icon: ListTodo,
        permissions: ['tasks_my']
      }
    ]
  },
  // {
  //   title: 'Settings',
  //   url: '/dashboard/[section]',
  //   icon: Settings2,
  //   roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', '*']
  // }
]

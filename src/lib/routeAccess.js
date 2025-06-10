export const routePermissions = {
  '/dashboard/roles': ['add_role', 'list_role', 'edit_role', 'delete_role'],
  '/dashboard/roles/addrole': ['add_role'],
  '/dashboard/roles/listrole': ['list_role', 'delete_role'],
  '/dashboard/users': ['user_add', 'users_list', 'users_edit', 'user_delete'],
  '/dashboard/users/adduser': ['user_add'],
  '/dashboard/users/listuser': ['users_list', 'users_edit', 'user_delete'],
  '/dashboard/tasks': ['tasks_assign', 'tasks_my', 'tasks_all'],
  '/dashboard/tasks/addtask': ['tasks_assign'],
  '/dashboard/tasks/listalltask': ['tasks_all', 'tasks_edit', 'tasks_delete'],
  '/dashboard/tasks/tasks/my': ['tasks_my'],
  '/dashboard/company': [],
  '/dashboard/company/addcompany': [],
  '/dashboard/company/listcompany': []
}

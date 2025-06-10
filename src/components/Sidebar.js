'use client'

import { ArrowUpCircleIcon, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from './ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from './ui/collapsible'
import { sidebarItems } from './Sidebar-list'
export function AppSidebar ({ currentUser }) {
  const { open } = useSidebar()

  const hasAccess = (item, currentUser, parentHasRoleMatch = false) => {
    const { roles = [], permissions = [] } = currentUser

    const roleMatch =
      parentHasRoleMatch ||
      item.roles?.includes('*') ||
      item.roles?.some(r => roles.includes(r))

    if (!roleMatch) return false

    if (
      roles.includes('COMPANY_ADMIN') &&
      item.url === '/dashboard/tasks/myTask'
    ) {
      return false
    }

    if (roles.includes('COMPANY_ADMIN')) return true

    if (
      item.permissions &&
      !item.permissions.some(p => permissions.includes(p))
    ) {
      return false
    }

    return true
  }

  return (
    <Sidebar variant='inset' collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:!p-1.5'
            >
              <Link href={'/dashboard/'}>
                <ArrowUpCircleIcon className='h-5 w-5' />
                <span className='text-base font-semibold'>My App</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map(item => {
                const roleMatched =
                  item.roles?.includes('*') ||
                  item.roles?.some(r => currentUser.roles.includes(r))

                if (!hasAccess(item, currentUser)) return null

                const children = item.children?.filter(child =>
                  hasAccess(child, currentUser, roleMatched)
                )

                if (children && children.length > 0) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen={false}
                      className='group/collapsible'
                    >
                      <SidebarMenuItem>
                        {open ? (
                          <>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton tooltip={item.title}>
                                <item.icon
                                  style={{
                                    height: '20px',
                                    width: '20px'
                                  }}
                                />
                                <span className='lg:inline ml-2'>
                                  {item.title}
                                </span>
                                <ChevronRight className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90' />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {children.map(child => (
                                  <SidebarMenuSubItem key={child.title}>
                                    <SidebarMenuButton
                                      asChild
                                      tooltip={item.title}
                                    >
                                      <Link href={child.url}>
                                        <child.icon
                                          style={{
                                            height: '18px',
                                            width: '18px'
                                          }}
                                        />
                                        {child.title}
                                      </Link>
                                    </SidebarMenuButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </>
                        ) : (
                          <SidebarMenuButton asChild tooltip={item.title}>
                            <Link href={item.url}>
                              <item.icon
                                style={{
                                  height: '18px',
                                  width: '18px'
                                }}
                              />
                            </Link>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon
                          style={{
                            height: '18px',
                            width: '18px'
                          }}
                        />
                        {open && <span className='ml-2'>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}

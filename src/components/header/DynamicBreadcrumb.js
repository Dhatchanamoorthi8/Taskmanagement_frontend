'use client'

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'
import { useEffect, useState } from 'react'
import { useBreadcrumbHistory } from '@/lib/useBreadcrumbHistory'

// Beautify path segments
const getTitle = segment =>
  segment
    ?.split('/')
    .filter(Boolean)
    .pop()
    ?.replace(/([A-Z])/g, ' $1')
    ?.replace(/-/g, ' ')
    ?.replace(/^./, str => str.toUpperCase())

const DynamicBreadcrumb = () => {
  const router = useRouter()
  useBreadcrumbHistory()

  const [prevPage, setPrevPage] = useState(null)

  useEffect(() => {
    const currentPath = router.asPath.split('?')[0]

    if (currentPath === '/dashboard') {
      localStorage.removeItem('previousPage')
      localStorage.removeItem('breadcrumbClicked')
      setPrevPage(null)
    } else {
      const prev = localStorage.getItem('previousPage')
      setPrevPage(prev)
    }
  }, [router.asPath])

  useEffect(() => {
    const prev = localStorage.getItem('previousPage')
    setPrevPage(prev)
  }, [])

  const currentPath = router.asPath.split('?')[0]
  const currentTitle = getTitle(currentPath)

  const breadcrumbs = [
    {
      title: 'Dashboard',
      href: '/dashboard'
    }
  ]

  const prevPath = prevPage?.split('?')[0]

  if (
    prevPath &&
    prevPath !== currentPath &&
    prevPath !== '/dashboard' &&
    !currentPath.startsWith(prevPath)
  ) {
    breadcrumbs.push({
      title: getTitle(prevPath),
      href: prevPage
    })
  }

  if (currentPath !== '/dashboard') {
    breadcrumbs.push({
      title: currentTitle,
      href: currentPath,
      isLast: true
    })
  } else {
    breadcrumbs[0].isLast = true
  }

  const handleBreadcrumbClick = (title, href) => {
    localStorage.setItem('breadcrumbClicked', JSON.stringify({ title, href }))
  }

  return (
    <div className='flex items-center gap-2'>
      <SidebarTrigger className='-ml-1' />
      <Separator
        orientation='vertical'
        className='mx-2 data-[orientation=vertical]:h-4'
      />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map(({ title, href, isLast }) => (
            <BreadcrumbItem key={href}>
              {isLast ? (
                <BreadcrumbPage
                  onClick={() => handleBreadcrumbClick(title, href)}
                  className='cursor-pointer'
                >
                  {title}
                </BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link
                      href={href}
                      onClick={() => handleBreadcrumbClick(title, href)}
                    >
                      {title}
                    </Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

export default DynamicBreadcrumb

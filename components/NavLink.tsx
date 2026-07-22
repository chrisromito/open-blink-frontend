'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type TNavLink = Omit<React.ComponentPropsWithoutRef<typeof Link>, 'href'> & {
    href: string
    children: React.ReactNode
}


export default function NavLink({ href, children, ...props }: TNavLink) {
    const pathname = usePathname()
    const { className, ...rest } = props
    const active = pathname === href || pathname.startsWith(`${href}/`)
    const cls = (className || '') + (active ? ' text-white' : ' text-zinc-300 hover:text-white')

    return (
        <Link href={href} className={cls} {...rest}>
            {children}
        </Link>
    )
}

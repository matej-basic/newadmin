import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <div className="min-h-screen flex flex-col">
    <main className="flex-1 p-4">{children}</main>
  </div>
)

export default Layout
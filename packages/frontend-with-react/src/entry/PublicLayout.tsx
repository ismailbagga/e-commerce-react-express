import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../layout/Nav'

const PublicLayout = () => {
  return (
    <main className="">
      <Nav />
      <Outlet />
    </main>
  )
}

export default PublicLayout

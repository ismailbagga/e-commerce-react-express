import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../layout/Nav'
import { AppContextProvider } from '../contexts/AppContext'

const PublicLayout = () => {
  return (
    <AppContextProvider>
      <main className="">
        <Nav />
        <Outlet />
      </main>
    </AppContextProvider>
  )
}

export default PublicLayout

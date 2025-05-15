import React from 'react'
import Topbar from '../layout/Topbar'
import NavBar from './NavBar'

const Header = () => {
  return (
    <header className="sticky top-0 z-50">
      <Topbar/>
      <NavBar/>
    </header>
  )
}

export default Header

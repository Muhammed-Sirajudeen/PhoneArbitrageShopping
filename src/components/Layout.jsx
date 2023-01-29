import React from 'react'

function Layout() {
  return (
    <div className='navbar-container'>
        <div className='nav-text'>
            <a href='/home'>Home</a>
        </div>
        <div className='nav-text'>
            <a href='/mobilecover'>mobile cover</a>
        </div>
        <div className='nav-text'>
            <a href='/pouch'>pouch</a>
        </div>
        <div className='nav-text'>
            <a href='/orderhistory'>orderhistory</a>
        </div>
        
    </div>
  )
}

export default Layout
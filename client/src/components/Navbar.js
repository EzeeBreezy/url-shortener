import React, { useContext } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const Navbar = () => {
   const auth = useContext(AuthContext)
   const history = useHistory()
   const logoutHandler = event => {
      event.preventDefault()
      auth.logout()
      history.push('/')
   }
   return (
      <nav>
         <div className="nav-wrapper blue darken-1" style={{ padding: '0 3rem' }}>
            <span className="brand-logo">URL Shortener</span>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
               <li>
                  <NavLink to="/create">Create</NavLink>
               </li>
               <li>
                  <NavLink to="/links">Links</NavLink>
               </li>
               <li>
                  <a href="/" onClick={logoutHandler}>
                     Exit
                  </a>
               </li>
            </ul>
         </div>
      </nav>
   )
}
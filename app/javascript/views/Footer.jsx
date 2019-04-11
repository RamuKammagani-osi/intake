import React from 'react'
import {Link} from 'react-router'

const Footer = () => (
  <div aria-label= 'footer' className= 'col-12-xs text-center footer'><br/>
    <span><Link to='/pages/privacy_policy'>Privacy Policy</Link></span>
    <span> <Link to='/pages/conditions_of_use'>Conditions of use</Link></span>
  </div>
)

export default Footer

import React from 'react'
import { useRouter } from 'next/router'

export default function Sidebar() {
    const route = useRouter()

    const handleNavigation =(path)=>{
        route.push(path)
    }

  return (
    <div style={{ width: '200px', minHeight: '100vh', fontSize: '20px',background: '#f0f0f0', padding: '20px'}}>
      <h2 style={{borderBottom:'1px solid black', color: 'black'}}>Menu</h2>
      <ul>
        <li onClick={() => handleNavigation('/components/posts')} style={{listStyle: 'none', padding: '5px 0', cursor:'pointer', color: 'black'}}>Posts</li>
        <hr></hr>
        <li onClick={() => handleNavigation('/components/videopost')} style={{listStyle: 'none', padding: '5px 0', cursor:'pointer', color: 'black'}}>video Post</li>
        <hr></hr>
        <li onClick={() => handleNavigation('/page3')} style={{listStyle: 'none', padding: '5px 0', cursor:'pointer', color: 'black'}}>Page 3</li>
        <hr></hr>
      </ul>
    </div>
  )
}

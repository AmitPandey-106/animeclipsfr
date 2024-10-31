import React from 'react'
import Sidebar from './sidebar'

export default function Uploadpost({children}) {
    
  return (
    <div style={{display: 'flex'}}>
        <Sidebar/>
        <div style={{flex: 1, padding: '20px'}}>
            {children}
        </div>
    </div>
  )
}



import React, { createContext, useContext, useState } from 'react'

interface fileContextType{
  isOpen:boolean,
  setIsOpen:React.Dispatch<React.SetStateAction<boolean>>
}
export const fileContext=createContext<fileContextType>({
  isOpen:false,
  setIsOpen:()=>{},
  
})
export const usefileContext=()=>useContext(fileContext)
function BoxContextProvider({children}:{children:React.ReactNode}) {
  const [isOpen,setIsOpen]=useState(false)
  return (
  <fileContext.Provider value={{isOpen,setIsOpen}}>
    {children}
  </fileContext.Provider>
  )
}

export default BoxContextProvider
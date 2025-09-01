import React, { useMemo, useState } from 'react'
import FileContainer from './FileContainer'
import { currentUser, useFile, useSearchFiles } from 'src/hooks/useFile'
import { useSearchContext } from 'src/utils/SearchContext'
type DepartmentProps={
  name:{id:string,name:string}[]
}

function DepartmentBar() {
  const { data, error, isLoading } = useFile()
  const {data:User,isLoading:loadingUser}=currentUser()
  

  const {query,date,setDate}=useSearchContext();
  const{data:searchfiles,isLoading:searchloading}=useSearchFiles(query);


const filterfiles = useMemo(() => {
  const applyFilters = (files: any[]) => {
    return files.filter((file) => {
      const departmentMatch =
        file?.department_ids?.includes(User?.department_id)

      const dateMatch =
        !date || file?.deadline?.slice(0, 10) === date

      return departmentMatch && dateMatch
    })
  }

  if (query && !searchloading && searchfiles) {
    return applyFilters(searchfiles)
  } else if (!query && data) {
    return applyFilters(data)
  }
  return []
}, [query, searchfiles, searchloading, data, date, loadingUser])

  return (
    <div className="w-full mt-6">
      <div className="w-full flex gap-3 mt-3 ">
      </div>
          <div className='flex items-center justify-end select-none'>
        <input type="date" className='text-blue-500 ' onChange={(e)=>setDate(e.target.value)} value={date??""}/>
      </div>
      {
        query&&<h1>results for :{query}</h1>
      }
      {
        isLoading?<h1>loading</h1>:      <FileContainer files={filterfiles} />
      }

    </div>
  )
}

export default DepartmentBar

import React from 'react'
import CategoryBar from 'src/Components/CategoryBar'
import DepartmentBar from 'src/Components/departmentbar'
import FileContainer from 'src/Components/FileContainer'
import { useDepartment } from 'src/hooks/useFile'

function Department() {
  const {data,error,isLoading}=useDepartment()
  return (
       <div>
           <div className="w-full h-full pt-16 ps-1">
      <div className="">
        <h1 className="text-xl font-bold my-1 ">Department</h1>
      </div>
      <div className="w-full mt-6">
      {isLoading?<h1>loading</h1>: <DepartmentBar />}
      </div>
    </div>
    </div>
  )
}

export default Department
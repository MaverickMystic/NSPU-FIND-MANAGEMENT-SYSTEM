
import { useEffect, useMemo } from 'react';
import CategoryBar from 'src/Components/CategoryBar'
import { useCategory, useFile, useSearchFiles } from 'src/hooks/useFile';
import { useSearchContext } from 'src/utils/SearchContext';


function AllFiles() {
  const {data,error,isLoading}=useCategory()
 
  return (
      <div className="w-full h-full pt-8 ps-1 ">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold my-1 ">File explorer</h1>
        
      </div>
      {
        isLoading ? <h1>loading</h1>:<CategoryBar name={data}/>
      }
    </div>
  )
}

export default AllFiles
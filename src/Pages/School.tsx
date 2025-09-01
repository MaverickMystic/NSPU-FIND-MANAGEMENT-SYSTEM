import React, { useMemo } from 'react'
import CategoryBar from 'src/Components/CategoryBar'
import FileContainer from 'src/Components/FileContainer'
import { useFile, useSearchFiles } from 'src/hooks/useFile';
import { useSearchContext } from 'src/utils/SearchContext';

function School() {
    let {data,error,isLoading}=useFile();
     const {query,date,setDate}=useSearchContext();
     let{data:searchfiles,isLoading:searchloading}=useSearchFiles(query);

  const inbox = useMemo(() => {
    const sourceFiles = query && !searchloading ? searchfiles : !query ? data : [];

    return sourceFiles?.filter((f) => {
      const isInbox = f?.types?.toLowerCase() === 'school';
      const matchesDate = !date || f?.deadline?.slice(0, 10) === date;

      return isInbox && matchesDate;
    }) || [];
  }, [query, searchfiles, searchloading, data, date]);

  return (
    <div>
           <div className="w-full h-full pt-16 ps-1">
      <div className="">
        <h1 className="text-xl font-bold my-1 ">School</h1>
      </div>
         <div className='flex items-center justify-end'>
        <input type="date" className='text-blue-500 ' onChange={(e)=>setDate(e.target.value)} value={date??""}/>
      </div>
      <div className="w-full mt-6">
        {
          isLoading?<h1>loading</h1>: <FileContainer files={inbox}/>
        }
      </div>
    </div>
    </div>
  )
}

export default School
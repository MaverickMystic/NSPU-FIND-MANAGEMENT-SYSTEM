import React, { useMemo } from 'react'
import FileContainer from 'src/Components/FileContainer'
import { useFile, useSearchFiles } from 'src/hooks/useFile'
import { useSearchContext } from 'src/utils/SearchContext';

function Outbox() {
  const {data,error,isLoading}=useFile();
  const {query}=useSearchContext();
     const{data:searchfiles,isLoading:searchloading}=useSearchFiles(query);
     const outbox=useMemo(()=>{
      if(query&& !searchloading){
       return searchfiles?.filter((f) => f?.types?.toLowerCase() === 'outbox')
      }
      else if(!query )
       return data?.filter((f) => f?.types?.toLowerCase() === 'outbox')
      return [];
     },[query,searchfiles,searchloading,data,isLoading])
   
 
  return (

      <div>
           <div className="w-full h-full pt-16 ps-1">
      <div className="">
        <h1 className="text-xl font-bold my-1 ">Outbox</h1>
      </div>
      <div className="w-full mt-6">
        {
          isLoading?<h1>loading</h1>: <FileContainer files={outbox}/>
        }
      
      </div>
    </div>
    </div>
  )
}

export default Outbox
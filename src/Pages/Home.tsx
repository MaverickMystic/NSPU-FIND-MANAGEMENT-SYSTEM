import React, { useEffect, useMemo } from "react";
import Navbar from "src/Components/Navbar";
import { FaRegFileAlt } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import FileContainer from "src/Components/FileContainer";
import { useFile, useSearchFiles } from "src/hooks/useFile";
import { useSearchContext } from "src/utils/SearchContext";

function Home() {
   
  const {data,error,isLoading}=useFile();
    if(isLoading){
      console.log('loading');
    }
    else{
      console.log(data)
    }
    const {query}=useSearchContext();
    const {data:searchfiles,isLoading:searchLoading}=useSearchFiles(query);

    const filterfiles=useMemo(()=>{
     if(query && !searchLoading){
      return searchfiles;
     }
     else if(!query && !isLoading){
      return  data;
     }
     return []
    },[query,isLoading,searchLoading,searchfiles])
  return (
    <div className="w-full h-full ps-1 flex flex-col gap-2">
      <div className="">
        <h1 className="text-xl font-bold ">NEARLY DUES</h1>
        
      </div>
      {
        (isLoading && searchLoading)?<h1>loaidng...</h1>:<FileContainer files={filterfiles}/>
      }
      
    </div>
  );
}

export default Home;

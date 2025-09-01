import React, { createContext, useContext, useEffect, useState } from "react"

type querytype={
    query:string,
    date:string,
    setQuery:React.Dispatch<React.SetStateAction<string>>,
    setDate:React.Dispatch<React.SetStateAction<string>>
}
const SearchContext=createContext<querytype>({
    query:"",
    date:'',
    setQuery:()=>{},
    setDate:()=>{}
  
});
export const useSearchContext=()=>useContext(SearchContext);
function SearchContextProvider({children}:{children:React.ReactNode}) {
    const[query,setQuery]=useState('');
    const [date,setDate]=useState('');

 
  return (
    <SearchContext.Provider value={{query,setQuery,date,setDate}}>
        {children}
    </SearchContext.Provider>
  )
}

export default SearchContextProvider
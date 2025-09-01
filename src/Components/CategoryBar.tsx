import React, { useState, useMemo, useEffect } from 'react'
import FileContainer from './FileContainer'
import { useFile, useSearchFiles } from 'src/hooks/useFile'
import { useSearchContext } from 'src/utils/SearchContext'



type categoryProps = {
  name: { id: string, category_name: string }[]
}

function CategoryBar({ name }: categoryProps) {
  
  const { data, isLoading } = useFile()
  const categories = name
  const [filtertype, setFiltertype] = useState<string | null>(null)

  const { query ,date,setDate} = useSearchContext()
  const { data: searchfiles, isLoading: filesLoading } = useSearchFiles(query)

  
const filterfiles = useMemo(() => {
  const applyfilters = (files: any) => {
    return files.filter((file: any) => {
      const categoryMatch =
        !filtertype || file?.categoryid?.toLowerCase() === filtertype.toLowerCase();

      const dateMatch =
        !date || file?.deadline?.slice(0, 10) === date;

      return categoryMatch && dateMatch;
    });
  };

  if (query && !filesLoading && searchfiles) {
    console.log("🔍 Using query:", query);
    return applyfilters(searchfiles);
  } else if (!query && data) {
    console.log("📁 No query, showing all files");
    return applyfilters(data); 
  }
  return [];
}, [query, data, searchfiles, filtertype, filesLoading, date]);

useEffect(() => {
  console.log("🟡 query changed to:", query)
}, [query])

  return (
    <div className="w-full mt-6 select-none">
      <div className="w-full flex gap-3 mt-3 ">
        <button
          onClick={() => setFiltertype(null)}
          className={`py-1 px-3 rounded-full border shadow-sm cursor-pointer ${
            filtertype === null
              ? 'bg-blue-600  text-white '
              : 'bg-white text-black border-gray-200 hover:bg-blue-300 hover:text-black'
          }`}
        >
          View all
        </button>
        {categories.map((category, id) => (
          <button
            key={id}
            onClick={() => setFiltertype(category.id)}
            className={`py-1 px-3 rounded-full border shadow-sm cursor-pointer ${
              filtertype === category.id
         ? 'bg-blue-600  text-white '
              : 'bg-white text-black border-gray-200 hover:bg-blue-300 hover:text-black'
            }`}
          >
            {category.category_name}
          </button>
        ))}
      </div>
      <div className='flex items-center justify-end'>
        <input type="date" className='text-blue-500 ' onChange={(e)=>setDate(e.target.value)} value={date??""}/>
      </div>
      {
        isLoading || (query && filesLoading)
          ? <h1>loading</h1>
          : <FileContainer files={filterfiles ?? []} />
      }
    </div>
  )
}

export default CategoryBar

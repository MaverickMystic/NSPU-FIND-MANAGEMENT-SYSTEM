import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MetadataUpdate from "src/Components/MetadtaUpdate";

import {
  useCategory,
  useDepartment,
  useSingleCat,
  useSingleFile,
} from "src/hooks/useFile";
import supabase from "src/superbase";

function FileDetail() {
  const { id } = useParams();
  const [publicUrl, setPublicUrl] = useState("");
  const navigate = useNavigate();
  const [Updatebox, setUpdatebox] = useState(false);
  const {
    data: Filedata,
    isLoading: fileLoading,
    error: fileError,
    refetch,
  } = useSingleFile(id);

  const {
    data: Category,
    isLoading: categoryLoading,
    error: catError,
  } = useSingleCat(Filedata?.categoryid, !!Filedata?.categoryid);

  const {
    data: departments,
    isLoading: departmentLoading,
    error: deptError,
  } = useDepartment();

  const {
    data: categories,
    isLoading: CategoryLoading,
    error: CatError,
  } = useCategory();

  const [depts, setDepartments] = useState<string[]>([]);

useEffect(() => {
  if (!fileLoading && Filedata?.file_url) {
    try {
      const { data } = supabase.storage
        .from("files")
        .getPublicUrl(Filedata.file_url);

      setPublicUrl(data.publicUrl);
      
    } catch (error) {
      console.log(error);
    }
  }
}, [fileLoading, Filedata]);

  useEffect(() => {
    if (!fileLoading && !departmentLoading && Filedata && departments) {
      const deptarray = departments
        .filter((dep) => Filedata.department_ids.includes(dep.id))
        .map((dept) => dept.name);
      setDepartments(deptarray);
    }
  }, [fileLoading, departmentLoading, Filedata, departments]);

  if (fileLoading || departmentLoading || categoryLoading) {
    return <p>Loading...</p>;
  }

  if (fileError || catError || deptError) {
    return <p className="text-red-500">Something went wrong.</p>;
  }
const filePreview = () => {
  if (!Filedata || !publicUrl) return <p>No file available</p>;

  const ext = Filedata.extension.toLowerCase();

  // Previewable types
  const docTypes = ["pdf", "docx", "txt"];
  const imageTypes = ["png", "jpg", "jpeg", "gif", "webp"];
  const videoTypes = ["mp4", "webm"];
  const audioTypes = ["mp3", "wav"];

  if (docTypes.includes(ext)) {
    return (
    <>No Preview Availiable</>
    );
  }

  if (imageTypes.includes(ext)) {
    return (
      <img
        src={publicUrl}
        alt={Filedata.name}
        className="max-w-full max-h-[600px] object-contain"
      />
    );
  }

  if (videoTypes.includes(ext)) {
    return (
      <video controls className="max-w-full max-h-[600px]">
        <source src={publicUrl} type={`video/${ext}`} />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (audioTypes.includes(ext)) {
    return (
      <audio controls className="w-full">
        <source src={publicUrl} type={`audio/${ext}`} />
        Your browser does not support the audio element.
      </audio>
    );
  }

  // Fallback for unsupported types
  return (
    <div className="flex flex-col items-center gap-2 pt-6 justify-center">
      <p className="text-gray-500">Preview is not available for this file type.</p>
      <a
        href={publicUrl}
        download={Filedata.name}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Download File
      </a>
    </div>
  );
};


  return (
    <div className="w-full h-full p-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg border hover:bg-blue-200 text-sm px-4 py-1"
        >
          ← Back
        </button>

        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-bold">{Filedata.name}</h1>
          <span className="px-2 py-0.5 text-sm rounded-md">
            <>(</> {Filedata.types} <>)</>
          </span>
        </div>
        {!fileLoading && !departmentLoading && !categoryLoading ? (
          <button
            className="rounded-lg border text-black text-sm px-5 py-1 hover:bg-blue-200"
            onClick={() => setUpdatebox(true)}
          >
            Edit
          </button>
        ) : (
          <button className="rounded-lg bg-blue-500 text-white text-sm px-4 py-1 hover:bg-blue-600">
            Loading...
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm border mt-10 p-4 rounded-xl shadow">
        <p>
          <span className="font-semibold">Category:</span>{" "}
          {Category?.category_name}
        </p>
        <p>
          <span className="font-semibold">Departments:</span>{" "}
          {depts.join(", ") || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Due:</span>{" "}
          {new Date(Filedata.deadline).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Size:</span> {Filedata.size} KB
        </p>
        <p>
          <span className="font-semibold">Sender:</span> {Filedata.sender}
        </p>
        <p>
          <span className="font-semibold">Receiver:</span> {Filedata.receiver}
        </p>
      </div>
      {Updatebox && Filedata && departments && categories && (
        <MetadataUpdate
          metadata={Filedata}
          departments={departments}
          categories={categories}
          setUpdatebox={setUpdatebox}
          refetchFile={refetch}
        />
      )}
      <div className="mt-6">{filePreview()}</div>
    </div>
  );
}

export default FileDetail;

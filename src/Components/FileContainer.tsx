import React, { useState } from "react";
import FileItem from "./FileItem";
import { useFile } from "src/hooks/useFile";
import supabase from "src/superbase";

type File = {
  id: string;
  name: string;
  size: string;
  deadline: string;
  status: boolean;
  important: boolean;
  types: "inbox" | "outbox";
  visible: boolean;
  categoryid: string;
  sender: string;
  receiver: string;
  file_url: string;
  department_id: string;
  extension: string;
  created_at:string
};

type FileContainerProps = {
  files: File[];
  isimportant?: boolean;
};

const FileContainer: React.FC<FileContainerProps> = ({
  files,
  isimportant,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<
    { id: string; path: string }[]
  >([]);

  const { refetch } = useFile(); 
  
  const handledelete = async (ids: string[], filepaths: string[]) => {
    try {
      const { error: storage_error } = await supabase.storage
        .from("files")
        .remove(filepaths);

      if (storage_error) {
        alert("Deleting from storage failed");
        return;
      }

      const { error } = await supabase
        .from("filemetadata")
        .delete()
        .in("id", ids); 

      if (error) {
        alert("Deleting metadata failed");
        return;
      }

      alert("File deletion success");
      setSelectedFiles([]); 
      refetch();
    } catch (error) {
      console.error("Something went wrong", error);
      alert("Something went wrong");
    }
  };

  const handleCheckboxChange = (
    id: string,
    path: string,
    isChecked: boolean
  ) => {
    setSelectedFiles((prev) => {
      if (isChecked) {
        return [...prev, { id, path }];
      } else {
        return prev.filter((file) => file.id !== id);
      }
    });
  };

  return (
    <div className="w-full flex flex-col gap-1 mt-4 px-4">
      {selectedFiles.length > 0 && (
        <div className="block">
          <button
            onClick={() =>
              handledelete(
                selectedFiles.map((f) => f.id),
                selectedFiles.map((f) => f.path)
              )
            }
            className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          >
            Delete Selected
          </button>
        </div>
      )}

      {files.map((file, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input
            type="checkbox"
            onChange={(e) =>
              handleCheckboxChange(file.id, file.file_url, e.target.checked)
            }
          />
          <FileItem
            name={file.name}
            size={file.size}
            ext={file.extension}
            due={file.deadline}
            status={file.status}
            important={file.important}
            file_url={file.file_url}
            id={file.id}
            created_at=""
          />
        </div>
      ))}
    </div>
  );
};

export default FileContainer;

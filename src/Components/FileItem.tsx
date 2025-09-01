import React, { useState } from "react";
import { FaRegFileAlt, FaStar } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { currentUser, useFile } from "src/hooks/useFile";
import supabase from "src/superbase";
import { CiCircleCheck } from "react-icons/ci";
import { CiCircleRemove } from "react-icons/ci";

import { Link } from "react-router-dom";
type FileProps = {
  id: string;
  name: string;
  size: string;
  ext: string;
  due: string;
  status: boolean;
  file_url: string;
  created_at:string;
  important: boolean;
  hidden?: boolean;
};

const FileItem: React.FC<FileProps> = ({
  id,
  name,
  size,
  ext,
  due,
  status,
  file_url,
  important,
  hidden,
  created_at,
}) => {
  const { refetch } = useFile();
  const { data: currentuser,isLoading} = currentUser();
  const [star, setStar] = useState(important);
  const [noti, setNoti] = useState(false);
  const [done, setDone] = useState(status);
  const [showdetail,setShowdetail]=useState(true);
  const handlePreview = (filepath: string) => {
    const { data } = supabase.storage.from("files").getPublicUrl(filepath);
    if (data?.publicUrl) {
      window.open(data.publicUrl, "_blank");
    } else {
      console.error("Public URL not found");
    }
  };

  const handleNoti = async (fileId: string) => {
    if(!isLoading){
       try {
      // Check if reminder exists
      const { data: existingReminder, error: fetchError } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", currentuser.id)
        .eq("file_id", fileId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error fetching reminder:", fetchError);
        alert("Failed to fetch reminder");
        return;
      }

      if (!existingReminder) {
        // No reminder exists → create one with false
        const { error } = await supabase.from("reminders").insert({
          user_id: currentuser?.id,
          file_id: fileId,
          six_notified: false,
          tw_notified: false,
        });
        if (error) {
          console.error("Error creating reminder:", error);
          alert("Failed to create reminder");
          return;
        }
        setNoti(true);
      } else {
        // Reminder exists → toggle both fields
        const { error } = await supabase
          .from("reminders")
          .update({
            six_notified: !existingReminder.six_notified,
            tw_notified: !existingReminder.tw_notified,
          })
          .eq("id", existingReminder.id);
        if (error) {
          console.error("Error updating reminder:", error);
          alert("Failed to update reminder");
          return;
        }
        setNoti(!noti);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong");
    }
    }
   
  };

  const handleImportant = async (id: string) => {
    try {
      const updatedStar = !star;
      setStar(updatedStar);
      const { error } = await supabase
        .from("filemetadata")
        .update({ important: updatedStar })
        .eq("id", id);
      if (error) {
        alert("Can't update");
        console.log("can't update",error);
        return;
      }
      refetch();
    } catch (error) {
      alert("Something went wrong");
      console.log("smth went wrong ",error);
    }
  };
  const handleMarkDone = async (id: string) => {
    try {
      setDone(!done);

      const { error } = await supabase
        .from("filemetadata")
        .update({ status: done })
        .eq("id", id);
      if (error) {
        alert("Can't update");
        console.log(error);
        return;
      }
      refetch();
    } catch (error) {
      alert("Something went wrong");
      console.log('smth went wrong',error);
    }
  };
  if (hidden) return null;

  return (
  <div className="w-full flex justify-between items-center py-2 px-2 mb-2 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer group select-none">
  {/* Left: File icon + info */}
  <div className="flex gap-2 items-center">
    <FaStar
      className={`ml-2 text-lg hover:scale-110 transition ${
        star ? "text-yellow-300" : "text-gray-300"
      }`}
      title="Mark as important"
      onClick={() => handleImportant(id)}
    />
    <div className="flex items-center gap-3 min-w-0">
      <div
        className="p-2 bg-blue-50 rounded-md flex items-center justify-center text-blue-400 "
      >
        <FaRegFileAlt className="text-xl" />
      </div>
      <div className="flex flex-col min-w-0">
        <div className="text-sm font-medium text-black truncate">
          <Link to={`/detail/${id}`}>{name}</Link>
        </div>
        {/* <div className="text-xs text-gray-500">
          {ext.toUpperCase()} • {size}
        </div> */}
      </div>
    </div>
  </div>

{/* Right: Due and status */}
<div className="flex items-center gap-2">
  {/* Due date (default) */}
  <span className="font-semibold text-gray-700 ">
    {due.split("T")[0]}
  </span>

  {/* Mark as done (on hover) */}
  {!isLoading && currentuser.role === "admin" && (
    <div
      className={` items-center px-2 py-0.5 rounded-md cursor-pointer ${
        status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
      }`}
      onClick={() => handleMarkDone(id)}
    >
      {status ? <CiCircleCheck /> : <CiCircleRemove />}
    </div>
  )}
</div>

</div>

  );
};

export default FileItem;

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { usefileContext } from "src/boxContext";
import fileSchema from "src/Schema/file";
import supabase from "src/superbase";
import * as z from "zod";
import mime from "mime";
import { useFile } from "src/hooks/useFile";
import gsap from "gsap";

type filetype = z.infer<typeof fileSchema>;

function Newfile() {
  const boxref=useRef<HTMLDivElement>(null)
  const { refetch } = useFile();
  const [categories, setCategories] = useState<
    Array<{ id: string; category_name: string }>
  >([]);
  const [departments, setDepartments] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const {
    register,
    watch,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
  } = useForm<filetype>({ resolver: zodResolver(fileSchema) });

  const [file, setFile] = useState("");
  const { isOpen,setIsOpen } = usefileContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);


useEffect(() => {
  if (!boxref.current) return;


  gsap.set(boxref.current, { scale: 0.5, opacity: 0 });

  
  gsap.to(boxref.current, {
    scale: 1,
    opacity: 1,
    duration: 0.5,
    ease: "back.out(1.7)", 
  });
}, []);
  const selectedDepartments: string[] = (watch("department") || []) as string[];

  const handlechoosefile = async () => {
    const filepath = await window.electronAPI.openFile();
    if (filepath) {
      setFile(filepath);
      setValue("file", filepath);
    }
  };
  
  const handleupload = async (data: filetype) => {
    try {
      if (!file) {
        alert("Please choose a file first");
        return;
      }

      const fileBytes: Uint8Array = await window.electronAPI.readfile(file);
      const size = fileBytes.length;
      const filename = file.split(/[/\\]/).pop() || "";
      const extension = file.split(".").pop()?.toLowerCase() || "";

      const categoryName =
        categories.find((c) => c.id === data.category)?.category_name || "";

      const format = (str: string) =>
        str
          .trim()
          .replace(/[\s\u200B-\u200D\uFEFF]/g, "_")
          .replace(/[^a-zA-Z0-9_\-\.\/]/g, "");

      const uniqueFilename = `${Date.now()}_${filename}`;
      const realFilename = format(uniqueFilename);

      const fileBlob = new Blob([fileBytes], {
        type: mime.getType(filename) || "application/octet-stream",
      });

      const { error: uploadError } = await supabase.storage
        .from("files")
        .upload(realFilename, fileBlob, { upsert: true });

      if (uploadError) {
        alert("File upload failed: " + uploadError.message);
        return;
      }

      const {data:filedata, error: insertError } = await supabase
        .from("filemetadata")
        .insert([
          {
            name: realFilename,
            file_url: uniqueFilename,
            extension: extension,
            categoryid: data.category,
            department_ids: data.department,
            deadline: data.deadline === "" ? null : data.deadline,
            sender: data.sender,
            receiver: data.receiver,
            visible: !data.hidden,
            important: data.important,
            types: data.types,
            size: size,
          },
        ]).select();

      if (insertError) {
        alert("Failed to save file metadata: " + insertError.message);
        return;
      }

      alert("File uploaded successfully ✅");
      refetch();
      setIsOpen(false);
      
      const {data:deptUsers,error}=await supabase.from('users').select(`id,username`).in('department_id',data.department);
    
      if (deptUsers && deptUsers.length > 0) {
  for (const user of deptUsers) {
    
      await supabase.from("reminders").insert({
    file_id: filedata[0].id,
    user_id: user.id,
    one_day: false,
    two_day:false,
    three_day:false,
    four_day:false,
    five_day:false
  });
  }
  
}

    } catch (err) {
      console.error(err);
      alert("Unexpected error during upload");
    }
  };

  const onsubmit: SubmitHandler<filetype> = (data) => {
    handleupload(data);
  };

  useEffect(() => {
    async function fetchData() {
      const { data: cats, error: catErr } = await supabase
        .from("categories")
        .select("*");
      if (!catErr && cats) setCategories(cats);

      const { data: depts, error: deptErr } = await supabase
        .from("departments")
        .select("*");
      if (!deptErr && depts) setDepartments(depts);
    }
    fetchData();
  }, []);
 const handleClose=()=>{
  if(!boxref.current)return;
  gsap.to(boxref.current,{
    scale:0.5,
    opacity:0,
    duration:0.3,
    ease: "power1.out",
    onComplete: () => setIsOpen(false),
  })
 }
  return (
    <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center p-4" ref={boxref}>
      <div
        className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto
                   text-gray-800 font-sans"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            File<span className="text-indigo-600">Nerd</span>
          </h2>
          <button
            className="text-2xl text-gray-400 hover:text-red-500 transition"
            onClick={handleClose}
            aria-label="Close form"
          >
            <IoMdClose />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onsubmit)}
          className="grid grid-cols-3 gap-x-6 gap-y-3"
        >
          {/* File Picker */}
          <div className="col-span-3">
            <label
              htmlFor="file-picker"
              className="block mb-1 text-xs font-medium text-gray-700"
            >
              File
            </label>
            <button
              id="file-picker"
              type="button"
              onClick={handlechoosefile}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Choose File
            </button>
            {file && (
              <p className="mt-1 text-xs text-gray-500 break-words">{file}</p>
            )}
            <input type="hidden" {...register("file")} />
            {errors.file && (
              <p className="mt-1 text-xs text-red-500">{errors.file.message as string}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label
              htmlFor="type"
              className="block mb-1 text-xs font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="type"
              {...register("types")}
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-1.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
            >
              <option value="">Select Type</option>
              <option value="inbox">Inbox</option>
              <option value="outbox">Outbox</option>
              <option value="school">School</option>
            </select>
            {errors.types && (
              <p className="mt-1 text-xs text-red-500">
                {errors.types.message as string}
              </p>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label
              htmlFor="deadline"
              className="block mb-1 text-xs font-medium text-gray-700"
            >
              Deadline
            </label>
            <input
              id="deadline"
              type="datetime-local"
              {...register("deadline")}
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-1.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
            />
            {errors.deadline && (
              <p className="mt-1 text-xs text-red-500">
                {errors.deadline.message as string}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block mb-1 text-xs font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              {...register("category")}
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-1.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">
                {errors.category.message as string}
              </p>
            )}
          </div>

          {/* Department (Custom Dropdown) */}
          <div className="relative col-span-3">
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Departments
            </label>

            <button
              type="button"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span>
                {selectedDepartments.length > 0
                  ? selectedDepartments
                      .map((id) => departments.find((d) => d.id === id)?.name)
                      .join(", ")
                  : "Select Departments"}
              </span>
              <span className="ml-2">&#9662;</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className={`px-3 py-2 cursor-pointer hover:bg-indigo-100 ${
                      selectedDepartments.includes(dept.id)
                        ? "bg-indigo-200"
                        : ""
                    }`}
                    onClick={() => {
                      const current = selectedDepartments;
                      if (current.includes(dept.id)) {
                        setValue(
                          "department",
                          current.filter((id) => id !== dept.id)
                        );
                      } else {
                        setValue("department", [...current, dept.id]);
                      }
                      setDropdownOpen(false);
                    }}
                  >
                    {dept.name}
                  </div>
                ))}
              </div>
            )}

            {errors.department && (
              <p className="mt-1 text-xs text-red-500">
                {errors.department.message as string}
              </p>
            )}
          </div>

          {/* Sender */}
          <div>
            <label
              htmlFor="sender"
              className="block mb-1 text-xs font-medium text-gray-700"
            >
              Sender
            </label>
            <input
              id="sender"
              type="text"
              placeholder="Sender"
              {...register("sender")}
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-1.5 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
            />
          </div>

          {/* Receiver */}
          <div>
            <label
              htmlFor="receiver"
              className="block mb-1 text-xs font-medium text-gray-700"
            >
              Receiver
            </label>
            <input
              id="receiver"
              type="text"
              placeholder="Receiver"
              {...register("receiver")}
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-1.5 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
            />
          </div>

          <div></div>

          {/* Checkboxes */}
          <div className="col-span-3 flex gap-8 items-center mt-4 text-gray-700 text-sm font-medium">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("important")}
                className="accent-indigo-600 w-4 h-4"
              />
              Important
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("hidden")}
                className="accent-indigo-600 w-4 h-4"
              />
              Show to others
            </label>
          </div>

          {/* Submit */}
          <div className="col-span-3 text-right mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-8 py-2 rounded-lg font-semibold transition focus:outline-none focus:ring-4 focus:ring-indigo-400"
            >
              {isSubmitting ? "Uploading..." : "UPLOAD"} 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Newfile;

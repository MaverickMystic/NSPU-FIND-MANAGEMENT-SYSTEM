import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { IoMdClose } from "react-icons/io";
import metadtaSchema, { MetadataFormValues } from "src/Schema/update";
import supabase from "src/superbase";
import { QueryObserverResult } from "@tanstack/query-core/build/legacy";
import CustomAlert from "./CustomAlert";

type FileDetailProps = {
  metadata: any;
  departments: any[];
  categories: any[];
  setUpdatebox: React.Dispatch<React.SetStateAction<boolean>>;
  refetchFile: () => Promise<QueryObserverResult< unknown>>;
};

function MetadataUpdate({
  metadata,
  departments,
  categories,
  setUpdatebox,
  refetchFile
}: FileDetailProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>();

  useEffect(() => {
    const departmentNames = departments
      .filter((dept) => metadata.department_ids.includes(dept.id))
      .map((dept) => dept.name);
    setSelectedDepartments(departmentNames);
  }, [metadata, departments]);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MetadataFormValues>({
    resolver: zodResolver(metadtaSchema),
    defaultValues: {
      name: metadata?.name || "",
      deadline: metadata?.deadline || "",
      types: metadata?.types || "inbox",
      sender: metadata?.sender || "",
      receiver: metadata?.receiver || "",
      categoryid: metadata?.categoryid?.toString() || "",
    },
  });
   
  const onSubmit = (data: MetadataFormValues) => {
    const handleUpdate = async (data: MetadataFormValues) => {
      try {
        const departmentIds = departments
          .filter((dept) => selectedDepartments?.includes(dept.name))
          .map((dept) => dept.id);

        const { error: updateError } = await supabase
          .from("filemetadata")
          .update({
            name: data.name,
            deadline:
              data.deadline === ""
                ? null
                : new Date(data.deadline).toISOString(),
            types: data.types,
            sender: data.sender,
            receiver: data.receiver,
            categoryid:data.categoryid,
            department_ids: departmentIds,
          })
          .eq("id", metadata?.id); //

        if (updateError) {
          alert("Failed to update metadata: " + updateError.message);
          console.log(updateError.message);
          
          return;
        }
        refetchFile();
        
        setUpdatebox(false);
        
      } catch (err) {
        console.error("Unexpected update error:", err);
        alert("Unexpected error during update");
      }
    };
    handleUpdate(data);
    setUpdatebox(false);
  };
  const handleCancel = () => {
    reset();
    const departmentNames = departments
      .filter((dept) => metadata.department_ids.includes(dept.id))
      .map((dept) => dept.name);
    setSelectedDepartments(departmentNames);
    setUpdatebox(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-5">
        <h2 className="text-lg font-semibold mb-3 text-center">
          Update File Metadata
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-3 text-sm"
        >
          {/* File name */}
          <div className="col-span-2">
            <label className="block font-medium mb-1">File name</label>
            <input
              {...register("name")}
              className="w-full border rounded-md px-2 py-1.5"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message as string}</p>
            )}
          </div>

          {/* Deadline */}
          {/* Deadline */}
          <div className="col-span-2">
            <label className="block font-medium mb-1">Deadline</label>
            <input
              type="datetime-local"
              {...register("deadline")}
              className="w-full border rounded-md px-2 py-1.5"
              defaultValue={
                metadata?.deadline
                  ? new Date(metadata.deadline).toISOString().slice(0, 16)
                  : ""
              }
            />
            {errors.deadline && (
              <p className="text-red-500 text-xs">{errors.deadline.message as string}</p>
            )}
          </div>

          {/* Inbox/Outbox */}
          <div className="col-span-2">
            <label className="block font-medium mb-1">Inbox/Outbox</label>
            <select
              {...register("types")}
              className="w-full border rounded-md px-2 py-1.5"
            >
              <option value="inbox">INBOX</option>
              <option value="outbox">OUTBOX</option>
            </select>
            {errors.types && (
              <p className="text-red-500 text-xs">{errors.types.message as string}</p>
            )}
          </div>

          {/* Sender */}
          <div>
            <label className="block font-medium mb-1">Sender</label>
            <input
              {...register("sender")}
              className="w-full border rounded-md px-2 py-1.5"
            />
            {errors.sender && (
              <p className="text-red-500 text-xs">{errors.sender.message as string}</p>
            )}
          </div>

          {/* Receiver */}
          <div>
            <label className="block font-medium mb-1">Receiver</label>
            <input
              {...register("receiver")}
              className="w-full border rounded-md px-2 py-1.5"
            />
            {errors.receiver && (
              <p className="text-red-500 text-xs">{errors.receiver.message as string}</p>
            )}
          </div>

          {/* Departments */}

          <div className="col-span-2 relative">
            <label className="block font-medium mb-1">Departments</label>

            {/* Selected Departments */}
            <div className="flex flex-wrap gap-1 mb-2">
              {selectedDepartments?.map((department) => (
                <span
                  key={department}
                  className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-sm flex items-center gap-1"
                >
                  {department}
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() =>
                      setSelectedDepartments((prev) =>
                        prev?.filter((dep) => dep !== department)
                      )
                    }
                  >
                    <IoMdClose size={14} />
                  </button>
                </span>
              ))}
            </div>

            {/* Dropdown toggle */}
            <button
              type="button"
              onClick={() => setOpenDropdown((prev) => !prev)}
              className="w-full border rounded-md px-2 py-1.5 text-left"
            >
              {openDropdown ? "Close" : "Select departments"}
            </button>

            {/* Dropdown list */}
            {openDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md max-h-40 overflow-y-auto">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className={`px-2 py-1 cursor-pointer hover:bg-gray-100 ${
                      selectedDepartments?.includes(dept.name)
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedDepartments((prev) =>
                        prev?.includes(dept.name)
                          ? prev.filter((d) => d !== dept.name)
                          : [...(prev || []), dept.name]
                      );
                    }}
                  >
                    {dept.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category */}
          <div className="col-span-2">
            <label className="block font-medium mb-1">Category</label>
            <select
              {...register("categoryid")}
              className="w-full border rounded-md px-2 py-1.5"
            >
              {categories?.map((cat: any) => (
                <option value={cat.id} key={cat.id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
            {errors.categoryid && (
              <p className="text-red-500 text-xs">
                {errors.categoryid.message as string}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300"
              onClick={() => {
                handleCancel();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MetadataUpdate;


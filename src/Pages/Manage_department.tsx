import React, { useState } from "react";
import { currentUser, useDepartment } from "src/hooks/useFile";
import { VscOctoface, VscEdit, VscTrash } from "react-icons/vsc";

import { SubmitHandler, useForm } from "react-hook-form";
import supabase from "src/superbase";

type FormType = {
  name: string;
};
type EditType = {
  name: string;
  id: string;
};
function Manage_department() {
  const [editItem, setEditItem] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");
  const {refetch:userRefetch}=currentUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,

  } = useForm<FormType>();

  const { data: Department, error, isLoading, refetch } = useDepartment();

  const onSubmit: SubmitHandler<FormType> = async (data, id?) => {
  if(editMode && editId){
    try {
      const {data:editData,error} =await supabase.from('departments').update({name:data.name}).eq('id',editId);
   
      if(error){
        alert('update failed');
        return;
      }
      else{
       alert('update success');
       refetch();
       setEditId('');
       setEditMode(false);
      }
    } catch (error) {
      alert('something went wrong');
      console.log(error);
      return;
    }
  }
  else{
        const inputName = data.name?.trim().toLowerCase();
    const existingNames =
      Department?.map((dep) => dep.name?.trim().toLowerCase()) || [];

    if (existingNames.includes(inputName)) {
      alert("Department already exists!");
      return;
    }

    try {
      const { data: added_data, error } = await supabase
        .from("departments")
        .insert([{ name: data.name }]);

      if (error) {
        alert("Creation failed");
        console.error(error);
        return;
      }

      alert("Successfully added");
      reset({name:''}); 
      userRefetch();
      refetch();
    } catch (error) {
      alert("Something went wrong");
      console.error(error);
    }
  }
  };
  const handleEdit = async (name: string, id: string) => {
     setEditId(id);
     setEditMode(true);
     reset({name});
  };
  const deleteFn = async (id: string) => {
    try {
      const { error } = await supabase
        .from("departments")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Failed to delete department");
        console.error(error);
        return;
      }

      alert("Department deleted successfully");
      userRefetch();
      refetch();
    } catch (error) {
      alert("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      <div className="py-3 flex flex-col gap-1">
        <h1 className="text-xl font-bold">Departments</h1>
        <h1 className="text-gray-500 text-sm font-bold">Manage departments</h1>
      </div>

      <div className="w-full grid grid-cols-2 gap-2 mt-5">
        {/* Department list */}
        <div>
          {isLoading ? (
            <h1>Loading...</h1>
          ) : Department && Department.length > 0 ? (
            Department.map((dep) => (
              <div
                key={dep.id}
                className="my-3 p-2 border-2 rounded-md border-gray-400 flex items-center justify-between cursor-pointer"
              >
                <div className="bg-green-100 rounded-full p-2">
                  <VscOctoface className="text-green-600 text-xl" />
                </div>
                <div className="flex items-center justify-start w-full ps-2">
                  <h1 className="text-md font-bold">{dep.name}</h1>
                </div>
                <div className="flex gap-3 items-center">
                  <VscEdit
                    className="text-gray-600 text-xl"
                    onClick={()=>handleEdit(dep.name, dep.id)}
                  />
                  <VscTrash
                    className="text-gray-600 text-xl cursor-pointer"
                    onClick={() => deleteFn(dep.id)}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No departments found.</p>
          )}
        </div>

        {/* Add new department form */}
        <div className="w-full pt-2">
          <div className="w-full  items-center justify-center flex ">
            <div className="flex flex-col gap-3">
              <h1 className="font-bold">ADD NEW DEPARTMENT</h1>
              <form
                className="flex gap-2 flex-col"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col">
                  <input
                    type="text"
                    className="w-full h-10 focus:outline-blue-500 border-2 border-gray-500 rounded-md ps-3"
                    placeholder="Enter new department..."
                    {...register("name", { required: true })}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm">
                      Department name is required.
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {editMode && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      className="w-20 text-center p-1 bg-gray-300 rounded-md px-2 text-gray-700 h-10 hover:text-white hover:bg-black"
                      onClick={()=>{
                        setEditMode(false);
                        setEditId('');
                        reset({name:''});
                      }}
                      
                    >
                      Cancle
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className=" w-20 text-center p-1 bg-green-200 rounded-md px-2 text-green-700 h-10 hover:bg-green-800 hover:text-white"
                  >
                  {editMode?'Update':'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Manage_department;

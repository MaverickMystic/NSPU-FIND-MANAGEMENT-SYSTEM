import React, { useState } from "react";
import { useCategory } from "src/hooks/useFile";
import { VscPackage, VscEdit, VscTrash } from "react-icons/vsc";
import { useForm, SubmitHandler } from "react-hook-form";
import supabase from "src/superbase";

type FormType = {
  category_name: string;
};

function Manage_category() {
  const [editId, setEditId] = useState("");
  const [editMode, setEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormType>();

  const {
    data: categories,
    error,
    isLoading,
    refetch,
  } = useCategory();

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    const inputName = data.category_name.trim().toLowerCase();
    const existingNames =
      categories?.map((cat) => cat.category_name.trim().toLowerCase()) || [];

    if (!editMode && existingNames.includes(inputName)) {
      alert("Category already exists!");
      return;
    }

    if (editMode && editId) {
      try {
        const { error } = await supabase
          .from("categories")
          .update({ category_name: data.category_name })
          .eq("id", editId);

        if (error) {
          alert("Update failed");
          return;
        }

        alert("Update successful");
        refetch();
        reset({ category_name: "" });
        setEditId("");
        setEditMode(false);
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      }
    } else {
      try {
        const { error } = await supabase
          .from("categories")
          .insert([{ category_name: data.category_name }]);

        if (error) {
          alert("Failed to create category");
          return;
        }

        alert("Category created successfully");
        reset();
        refetch();
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      }
    }
  };

  const handleEdit = (name: string, id: string) => {
    setEditId(id);
    setEditMode(true);
    reset({ category_name: name });
  };

  const deleteFn = async (id: string) => {
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Failed to delete category");
        console.error(error);
        return;
      }

      alert("Category deleted");
      refetch();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="w-full">
      <div className="py-3 flex flex-col gap-1">
        <h1 className="text-xl font-bold">Categories</h1>
        <h1 className="text-gray-500 text-sm font-bold">Manage categories</h1>
      </div>

      <div className="w-full grid grid-cols-2 gap-2 mt-5">
        {/* Category list */}
        <div>
          {isLoading ? (
            <h1>Loading...</h1>
          ) : categories && categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="my-3 p-2 border-2 rounded-md border-gray-400 flex items-center justify-between cursor-pointer"
              >
                <div className="bg-green-100 rounded-full p-2">
                  <VscPackage className="text-green-600 text-xl" />
                </div>
                <div className="flex items-center justify-start w-full ps-2">
                  <h1 className="text-md font-bold">{cat.category_name}</h1>
                </div>
                <div className="flex gap-2">
                  <VscEdit
                    className="text-gray-400 cursor-pointer"
                    onClick={() => handleEdit(cat.category_name, cat.id)}
                  />
                  <VscTrash
                    className="text-gray-500 cursor-pointer"
                    onClick={() => deleteFn(cat.id)}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No categories found.</p>
          )}
        </div>

        {/* Form to add/update category */}
        <div className="w-full pt-2">
          <div className="w-full flex items-center justify-center">
            <div className="flex flex-col gap-3">
              <h1 className="font-bold">ADD NEW CATEGORY</h1>
              <form
                className="flex flex-col gap-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col">
                  <input
                    type="text"
                    className="w-full h-10 focus:outline-blue-500 border-2 border-gray-500 rounded-md ps-3"
                    placeholder="Enter new category..."
                    {...register("category_name", { required: true })}
                  />
                  {errors.category_name && (
                    <p className="text-red-400 text-sm">
                      Category name is required.
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {editMode && (
                    <button
                      type="button"
                      className="w-20 bg-gray-300 text-gray-800 rounded-md h-10 hover:bg-black hover:text-white"
                      onClick={() => {
                        setEditId("");
                        setEditMode(false);
                        reset({ category_name: "" });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-20 bg-green-200 text-green-700 rounded-md h-10 hover:bg-green-800 hover:text-white"
                  >
                    {editMode ? "Update" : "Create"}
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

export default Manage_category;

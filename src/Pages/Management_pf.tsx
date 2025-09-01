import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { currentUser } from "src/hooks/useFile";
import { passwordSchema } from "src/Schema/input";
import supabase from "src/superbase";
import * as z from "zod";
import profileImg from "../imgs/profile.jpg";
import { CiCirclePlus } from "react-icons/ci";
type passwordtype = z.infer<typeof passwordSchema>;
function Management_pf() {
  const imgRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(null);
  const { data, error, refetch, isLoading: loadingUser } = currentUser();

  const {
    register: passwordRegister,
    formState: { isLoading: loadingPassword, errors: pw_error },
    handleSubmit: passwordHandler,
    reset: password_reset,
  } = useForm<passwordtype>({
    resolver: zodResolver(passwordSchema),
  });
  const passwordChange: SubmitHandler<passwordtype> = async ({
    newpassword,
    oldpassword,
  }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: oldpassword,
    });
    if (error) {
      alert("incorrect password");
      return;
    }
    const { error: change_pw_error } = await supabase.auth.updateUser({
      password: newpassword,
    });
    if (change_pw_error) {
      alert("cant change password");
      return;
    }
    alert("password updated");
    password_reset();
    return;
  };
  const {
    register,
    formState: { isLoading, errors },
    reset,
    handleSubmit,
  } = useForm();

  useEffect(() => {
    if (data) {
      reset({
        name: data.username,
        department:
          Array.isArray(data.department) && data.department.length > 0
            ? data.department[0].name
            : "",
        phone: data.phone,
        ministry: data.Ministry,
      });
    }
  }, [data, reset]);

  const onsubmit: SubmitHandler<any> = async (formdata: any) => {
    const { error } = await supabase
      .from("users")
      .update({
        username: formdata.name,
        phone: formdata.phone,
        Ministry: formdata.ministry,
      })
      .eq("id", data.id);
    if (error) {
      alert("update failed");
      console.log(error.message);
      return;
    }
    alert("update success");
    return;
  };

  const handlefilechange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(e.target.files![0]);
  };

  const openDialog = () => {
    imgRef.current.click();
  };
  const changeAvatar = async () => {
    try {
      if (!imgRef.current.files[0]) {
        alert("no file chosen");
        return;
      }
      const file = imgRef.current.files[0];
      const ext = file.name.split(".").pop();
      const filename = `${data.id}-${Date.now()}.${ext}`;
      const filepath = `avatar/${filename}`;

      const { error } = await supabase.storage
        .from("avatar")
        .upload(filepath, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (error) {
        alert("upload failed");
        return;
      }
      const { data: publicUrlData } = await supabase.storage
        .from("avatar")
        .getPublicUrl(filepath);
      if (!publicUrlData.publicUrl) {
        alert("Could not get public URL");
        return;
      }

   
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar: publicUrlData.publicUrl })
        .eq("id", data.id);

      if (updateError) {
        alert("Failed to update profile: " + updateError.message);
        return;
      }

    alert('Avatar updated successfully!');
    setPreview(null);

    refetch(); 

    } catch (error) {
      alert("something went wrong at avatar");
      return;
    }
  };
  return (
    <div className="w-full p-6 bg-gray-300 min-h-full">
      <div className="w-full grid grid-cols-2 gap-3">
        {/* Profile card */}
        <div className="bg-white flex flex-col p-6 items-center gap-4 rounded-lg">
          {
            loadingUser ?   <img
            src={profileImg}
            alt=""
            className="rounded-full w-28 h-28  my-4"
          />
          :
            <img
            src={preview ?? data.avatar}
            alt=""
            className="rounded-full w-28 h-28  my-4"
          />
          }
    
          <div className="flex items-center justify-center w-full relative ">
            <input
              type="file"
              name=""
              className="hidden"
              ref={imgRef}
              accept="image/*"
              onChange={handlefilechange}
            />
            {preview ? (
              <div className="flex gap-1">
                <button
                  className="bg-gray-300 py-1 px-2 rounded-md"
                  onClick={() => setPreview(null)}
                >
                  {" "}
                  cancle
                </button>
                <button
                  className="bg-blue-300 py-1 px-2 rounded-md"
                  onClick={changeAvatar}
                >
                  Submit
                </button>
              </div>
            ) : (
              <CiCirclePlus
                className="text-2xl text-blue-600 absolute -top-6"
                onClick={openDialog}
              />
            )}
          </div>
          <h1 className="text-center font-semibold text-gray-600 text-base">
            Professor Maverick
          </h1>
          <p className="text-gray-500 text-sm text-center">
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam,
            distinctio doloremque? Voluptatem perferendis similique debitis
            pariatur porro, quidem repellat!"
          </p>{" "}
        </div>

        {/* Personal Info */}
        <div className="flex flex-col gap-2">
          <div className="w-full bg-white h-14 rounded-lg flex items-center gap-4 px-6 py-2 text-sm font-semibold">
            <span className="text-gray-600">Dashboard</span>
            <span className="text-blue-500">Personal Information</span>
          </div>

          {isLoading ? (
            <h1>Loading...</h1>
          ) : (
            <div className="w-full bg-white rounded-lg px-6 py-4">
              <form onSubmit={handleSubmit(onsubmit)}>
                <h1 className="text-base font-bold mb-4 text-gray-700">
                  Personal Settings
                </h1>
                <div className="flex flex-col gap-3 text-sm">
                  {/* Name */}
                  <div>
                    <label className="text-gray-700 font-medium block mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      className="border-b border-blue-400 focus:outline-none w-full h-8 text-blue-400 px-2 text-sm"
                      {...register("name")}
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="text-gray-700 font-medium block mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      className="border-b border-blue-400 focus:outline-none w-full h-8 text-gray-700 px-2 text-sm"
                      {...register("department")}
                      disabled
                      placeholder="Department not found"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-gray-700 font-medium block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="border-b border-blue-400 focus:outline-none w-full h-8 text-gray-700 px-2 text-sm"
                      {...register("phone")}
                      placeholder="09XXXXXXX"
                    />
                  </div>

                  {/* University / Ministry */}
                  <div>
                    <label className="text-gray-700 font-medium block mb-1">
                      University / Ministry
                    </label>
                    <input
                      type="text"
                      className="border-b border-blue-400 focus:outline-none w-full h-8 text-gray-700 px-2 text-sm"
                      {...register("ministry")}
                      placeholder="NSPU"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    className="px-3 py-1 bg-blue-400 text-white rounded text-sm hover:bg-blue-600"
                    type="submit"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="w-full mx-auto mt-10 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Change Password
        </h2>

        <form className="space-y-4" onSubmit={passwordHandler(passwordChange)}>
          {/* Old Password */}
          <div>
            <label
              className="block text-sm font-medium text-gray-600 mb-1"
              htmlFor="oldPassword"
            >
              Old Password
            </label>
            <input
              id="oldPassword"
              type="password"
              className="w-full border border-b-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter your old password"
              name="oldpassword"
              {...passwordRegister("oldpassword")}
            />
            <span>
              {pw_error.oldpassword ? pw_error.oldpassword.message  as string: ""}
            </span>
          </div>

          {/* New Password */}
          <div>
            <label
              className="block text-sm font-medium text-gray-600 mb-1"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              type="password"
              className="w-full border border-b-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Enter a new password"
              name="newpassword"
              {...passwordRegister("newpassword")}
            />
            <span>
              {pw_error.newpassword ? pw_error.newpassword.message as string: ""}
            </span>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="block text-sm font-medium text-gray-600 mb-1"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full border border-b-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Re-enter your new password"
              name="confirmpassword"
              {...passwordRegister("confirmpassword")}
            />
            <span>
              {pw_error.confirmpassword ? pw_error.confirmpassword.message as string : ""}
            </span>
          </div>

          <div className="pt-4 w-full justify-end flex">
            <button
              type="submit"
              className=" bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              Confirm Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Management_pf;

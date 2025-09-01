import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaFacebookF } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import signupSchema from "src/Schema/singup";
import supabase from "src/superbase";
import * as z from "zod"
type signup =z.infer<typeof signupSchema>
function SIGNUP() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<signup>(
    {
      resolver: zodResolver(signupSchema)
    }
  );
  const onsubmit: SubmitHandler<signup> = async(data) => {
    try {
      const{data:authData,error:authError}=await supabase.auth.signUp({
        email:data.email,
        password:data.password
      });
      if(authError){
        alert('Sign up failed'+authError.message);
        return;
      }

      if(!authData?.user){
        alert('User creation failed');
        return;
      }

      const {error:insertError}=await supabase.from('users').insert([
        {
          id:authData.user.id,
          username:data.name,
          email:data.email
        }
      ])
            if (insertError) {
        alert("Failed to save user profile: " + insertError.message);
        return;
      }

      alert("Signup successful! Please check your email for confirmation.");

    } catch (error) {
     alert('unexpected error occurs'+error.message);
    }
  };
  return (
    <div
      className="
        flex
        w-full h-screen
        bg-blue-100
        items-center justify-center
      "
    >
      <form onSubmit={handleSubmit(onsubmit)}>
          <div
        className="
          flex flex-col
          
          bg-white
          rounded-sm
          shadow-xl
        "
      >
        <div className="my-8 mx-6">
          <div
            className="
           
            flex
            w-full
            items-center justify-start
          "
          >
            <h1
              className="
              "
            >
              FILE
            </h1>
            <h1
              className="
              font-extrabold
            "
            >
              NERD
            </h1>
          </div>
          <div
            className="
            flex flex-col
            items-center justify-center mx-2  my-4
          "
          >
            <div className="my-3 p-1 border-b-2 border-b-black w-full">
              <input
                type="text"
                className="w-full h-5  focus:outline-none"
                placeholder="Username"
                {...register("name")}
                name="name"
              />
              {errors.name && (
                <p className="text-red-600 text-xs">{errors.name.message as string}</p>
              )}
            </div>
            <div className="my-3 p-1 border-b-2 border-b-black w-full">
              <input
                type="text"
                className="w-full h-5  focus:outline-none"
                placeholder="Email"
                {...register("email")}
                name="email"
              />
              {errors.email && (
                <p className="text-red-600 text-xs">{errors.email.message as string}</p>
              )}
            </div>
            <div className="my-3 p-1 border-b-2 border-b-black w-full">
              <input
                type="password"
                className="w-full h-5  focus:outline-none"
                placeholder="Password"
                {...register("password")}
                name="password"
              />
              {errors.password && (
                <p className="text-red-600 text-xs">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            <div className="flex mt-6 cursor-pointer">
              <div className="p-4 py-2 border-2 border-black flex items-center justify-center gap-2 hover:bg-blue-300">
                <FaFacebookF />{" "}
                <h1 className="text-xs font-bold">Sign up with facebook</h1>
              </div>

              <div className="p-4 py-2 border-2 border-black flex items-center justify-center gap-2 border-l-0 hover:bg-red-300">
                <FaGoogle />{" "}
                <h1 className="text-xs font-bold">Continue with GOOGLE</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex items-center justify-between">
          <div className="flex items-center justify-center ps-5 gap-1">
            <h1 className="text-xs text-gray-800">Already have an account?</h1>
            <Link to={"/login"} className="text-xs font-bold">
              LOGIN
            </Link>
          </div>
          <div className="px-4 py-2 bg-black ">
            <button type="submit" className={`text-md text-white`} disabled={isSubmitting}>
              SIGN UP
            </button>
          </div>
        </div>
      </div>
      </form>
    
    </div>
  );
}

export default SIGNUP;

import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaFacebookF } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import loginSchema from "src/Schema/login";
import supabase from "src/superbase";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
type loginType=z.infer<typeof loginSchema>
function Login() {
  const navigate=useNavigate();
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm<loginType>(
    {resolver: zodResolver(loginSchema)}
  );

  const onsubmit: SubmitHandler<loginType> = async (data) => {
    try {
      const {data:Authdata,error}=await supabase.auth.signInWithPassword({
        email:data.email,
        password:data.password
      })
      if(error){
        alert("login failed");
        console.log(error);
        return;
      }
      else{
        navigate('/');
      }
    } catch (error) {
      alert("something went wrong "+error);
      return;
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
                  placeholder="Email"
                  {...register('email')}
                  name="email"
                />
                
              </div>
                {errors.email&& (
                <p className="text-red-600 text-xs">{errors.email.message as string}</p>
              )}
              <div className="my-3 p-1 border-b-2 border-b-black w-full">
                <input
                  type="password"
                  className="w-full h-5  focus:outline-none"
                  placeholder="Password"
                  name="password"
                  {...register('password')}
                />
               
              </div>
                 {errors.password&& (
                <p className="text-red-600 text-xs ">{errors.password.message as string}</p>
              )}
              <div className="flex mt-6 cursor-pointer">
                <div className="p-4 py-2 border-2 border-black flex items-center justify-center gap-2 hover:bg-blue-300">
                  <FaFacebookF />{" "}
                  <h1 className="text-xs font-bold">Login with facebook</h1>
                </div>

                <div className="p-4 py-2 border-2 border-black flex items-center justify-center gap-2 border-l-0 hover:bg-red-300">
                  <FaGoogle />{" "}
                  <h1 className="text-xs font-bold">Continue with GOOGLE</h1>
                </div>
              </div>
              <div className="flex justify-between mt-6 items-center w-full p-1">
                <div className="flex gap-2">
                  {" "}
                  <input type="checkbox" name="log-in" id="" />
                  <label htmlFor="log-in" className="text-xs font-bold">
                    stay logged in
                  </label>
                </div>
                <div>
                  <Link to={"/forgetpw"} className="text-sm font-bold">
                    Forget Password?
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-between">
            <div className="flex items-center justify-center ps-5 gap-1">
              <h1 className="text-xs text-gray-800">Don't have an account?</h1>
              <Link to={"/signup"} className="text-xs font-bold">
                SIGN UP
              </Link>
            </div>
            <div  className="px-4 py-2 bg-black ">
              <button type="submit" className="text-md text-white" disabled={isSubmitting}>LOG IN</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;

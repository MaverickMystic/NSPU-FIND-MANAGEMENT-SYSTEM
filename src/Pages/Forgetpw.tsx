import React from "react";
import { Link } from "react-router-dom";

function Forgetpw() {
  return (
    <div
      className="
        flex
        w-full h-screen
        bg-blue-100
        items-center justify-center
      "
    >
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
            items-center justify-center mx-8  my-4
          "
          >
            <div className="my-3 p-1 border-b-2 border-black  w-full flex flex-col gap-8">
            <label className="text-md font-bold text-gray-700">RESET PASSWORD</label>
              <input
                type="text"
                className="w-full h-5  focus:outline-none"
                placeholder="NOoneCAREbro@gmail.com"
              />
            </div>
           
          </div>
        </div>

        <div className="w-full flex items-center justify-between">
          <div className="flex items-center justify-center ps-5 gap-1">
            <h1 className="font-bold text-sm text-gray-700">sent code to your email</h1>
          </div>
          <div className="px-4 py-2 bg-black ">
            <Link to={'/'} className="text-md text-white">SEND</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forgetpw;

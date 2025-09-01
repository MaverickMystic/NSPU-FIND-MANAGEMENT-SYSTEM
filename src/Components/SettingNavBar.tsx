import React from "react";
import { Link } from "react-router-dom";

function SettingNavBar() {
  const settings = [
    {
      name: "Profile",
      path: "/setting",
    },
    {
      name: "Change Password",
      path: "change_pw",
    },
    {
      name: "Categories",
      path: "category",
    },
    {
      name: "Departments",
      path: "department",
    },
    {
      name: "Users",
      path: "manage_users",
    },
  ];

 return(
    <div className="flex items-center gap-4 ms-4 ">
        {
            settings.map((nav,i)=>(
                <div className="hover:border-b-2 border-gray-500 h-8">
                    <Link to={nav.path} className="text-md font-bold text-gray-700">{nav.name}</Link>
                </div>
            ))
        }
    </div>
 )
}

export default SettingNavBar;

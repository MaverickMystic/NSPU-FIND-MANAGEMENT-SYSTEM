import { CgProfile } from "react-icons/cg";
import { LuFolderClosed } from "react-icons/lu";
import { GoHome } from "react-icons/go";
import { TiTags } from "react-icons/ti";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegFileLines } from "react-icons/fa6";
import { FiPlus } from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { CiInboxIn, CiInboxOut } from "react-icons/ci";
import { Link, useLocation } from "react-router-dom";
import { usefileContext } from "src/boxContext";
import { currentUser } from "src/hooks/useFile";
import { useEffect, useState } from "react";

const SideBar = () => {
  const routes = [
    { icon: <GoHome />, label: "Home", path: "/" },
    { icon: <LuFolderClosed />, label: "File", path: "/file" },
    { icon: <CiInboxIn />, label: "Inbox", path: "/inbox" },
    { icon: <CiInboxOut />, label: "Outbox", path: "/outbox" },
    { icon: <TiTags />, label: "Tags", path: "/tags" },
    { icon: <TiTags />, label: "School", path: "/school" },
    { icon: <HiOutlineOfficeBuilding />, label: "Department", path: "/department" },
    { icon: <IoSettingsOutline />, label: "Setting", path: "/setting" },
  ];

  const { isOpen, setIsOpen } = usefileContext();
  const { data, isLoading } = currentUser();
  const location = useLocation(); // <-- current route path
  const [splited_name,setSplited_name]=useState('');
  useEffect(() => {
    if (!isLoading && data) {
      if (data.role === "user") {
        routes.filter((nav) => nav.label !== "File");
      }
    }
  }, [isLoading, data]);
    useEffect(() => {
      if (data?.username) {
        const split = data.username.split(" ");
        setSplited_name(split[0]);
      }
    }, [data]);
  return (
    !isLoading && (
      <aside
        className="h-full w-[250px] bg-white border-r border-gray-200
                   shadow-lg flex flex-col p-6 select-none"
      >  

         <h1 className="text-lg font-medium text-black whitespace-nowrap select-none text-start ">
                    Welcome{" "}
                    <span className=" text-black">
                      {splited_name.toUpperCase() || ""}
                    </span>
                  </h1>
        {/* New File */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex justify-between items-center bg-blue-200 text-black
                     hover:bg-blue-100 font-semibold rounded-lg p-3 mb-10
                     shadow-sm transition duration-200 focus:outline-none
                     focus:ring-2 focus:ring-blue-400 cursor-pointer"
        >
          <FaRegFileLines className="text-xl" />
          <FiPlus className="text-xl" />
          <span className="sr-only">New File</span>
        </button>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {routes.map(({ icon, label, path }) => {
            const isActive = location.pathname === path;

            return (
              <Link key={label} to={path} className="group focus:outline-none">
                <div
                  className={`flex items-center gap-3 p-3 rounded-md transition-colors duration-200 cursor-pointer
                    ${
                      isActive
                        ? "bg-blue-500 text-white shadow-sm"
                        : "hover:bg-blue-300  text-gray-700 hover:text-black"
                    }`}
                >
                  <span
                    className={`text-lg ${
                      isActive ? "text-white" : "text-gray-600 group-hover:text-blue-600"
                    }`}
                  >
                    {icon}
                  </span>
                  <span className="font-medium tracking-wide text-sm">{label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>
    )
  );
};

export default SideBar;

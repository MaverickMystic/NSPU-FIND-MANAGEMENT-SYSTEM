import React, { useEffect, useRef, useState } from "react";
import { CiBellOn, CiSettings, CiSearch, CiLock } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { currentUser } from "src/hooks/useFile";
import { useAuthContext } from "src/utils/AuthContext";
import { useSearchContext } from "src/utils/SearchContext";
import supabase from "src/superbase";
import NotificationPanel from "./NotiPanel";
import gsap from "gsap";

function Navbar() {
  const [Noti, setNotiPanel] = useState(false);
  const { data: userdata } = currentUser();
  const { setQuery } = useSearchContext();
  const navigate = useNavigate();
  const [splited_name, setSplited_name] = useState("");
  const { setUser } = useAuthContext();
  const panelRef = useRef<HTMLDivElement>(null);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Logout failed:", error.message);
      return;
    }
    setUser(null);
    navigate("/login");
  };
useEffect(() => {
  if (!panelRef.current) return;

  // Set initial x position offscreen
  gsap.set(panelRef.current, { x: 300 });
}, []);


    useEffect(() => {
    if (!panelRef.current) return;

    if (Noti) {
      gsap.to(panelRef.current, {
        x: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to(panelRef.current, {
        x: 400, 
        duration: 0.4,
        ease: "power2.in",
      });
    }
  }, [Noti]);
  return (
    <nav className="w-full  bg-white">
       <div className=" mt-3 flex items-center font-bold justify-center">
        <h1>NSPU FILE MANAGEMENT SYSTEM</h1>
       </div>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
    
        <div className="flex items-center gap-6 flex-1 min-w-0">
         

          <div className="relative flex-1 hidden md:block mx-10 me-10">
            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg" />
            <input
              type="text"
              placeholder="Search files and folders..."
              className="w-full h-9 bg-white text-gray-700 rounded-full pl-10 pr-4 border border-blue-400 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center justify-between gap-4 text-gray-600">
          {/* Notifications */}
          <button
            title="Notifications"
            className="relative p-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition"
            onClick={() => setNotiPanel(true)}
          >
            <CiBellOn className="text-2xl" />
            {/* Badge */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <button
            title="Profile"
            onClick={logout}
            className="p-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <CgProfile className="text-xl" />
          </button>

          {/* Admin Lock */}
          {userdata?.role === "admin" && (
            <Link
              to="/hiddenfile"
              title="Hidden"
              className="p-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <CiLock className="text-xl" />
            </Link>
          )}

          {/* Settings */}
          <button
            title="Settings"
            className="p-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <CiSettings className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Notification Panel */}
<NotificationPanel
  open={Noti}
  onClose={() => setNotiPanel(false)}
  user_id={userdata?.id || ""}
  ref={panelRef}
/>


    </nav>
  );
}

export default Navbar;

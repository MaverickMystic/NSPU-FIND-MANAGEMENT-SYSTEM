import React from 'react'
import { Outlet } from 'react-router-dom'
import { usefileContext } from 'src/boxContext'
import Newfile from 'src/Components/Newfile'
import SettingNavBar from 'src/Components/SettingNavBar'
import SideBar from 'src/Components/Sidebar'

function Setting() {
  const { isOpen } = usefileContext();

  return (
    <div className="flex h-screen w-full overflow-x-hidden relative">
      {/* Sidebar */}
      <div className="overflow-y-auto">
        <SideBar />
      </div>

      {isOpen && <Newfile />}

      {/* Main Content: make this scrollable vertically */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {/* Sticky header with some top offset (like top-12) */}
        <div className="sticky top-0 left-0 z-20 bg-white border-b-2 ">
          <div className="p-6">
            <h1 className="text-lg font-bold">SETTINGS</h1>
          </div>
          <SettingNavBar />
        </div>

        {/* Main outlet content */}
        <div className="w-full px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}


export default Setting
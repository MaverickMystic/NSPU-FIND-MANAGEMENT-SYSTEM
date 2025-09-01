// App.tsx

import "./index.css";
import { createHashRouter, RouterProvider } from "react-router-dom";

// Layouts & Components
import Main from "./layouts/Main";
import Home from "./Pages/Home";
import AllFiles from "./Pages/AllFiles";
import Inbox from "./Pages/Inbox";
import Outbox from "./Pages/Outbox";
import Tags from "./Pages/Tags";
import Department from "./Pages/Department";
import Setting from "./Pages/Setting";
import Login from "./Pages/Login";
import SIGNUP from "./Pages/Signup";
import Forgetpw from "./Pages/Forgetpw";
import Hidden from "./Pages/hidden";
import Management_pf from "./Pages/Management_pf";
import Change_pw from "./Pages/Change_pw";
import Manage_category from "./Pages/Manage_category";
import Manage_department from "./Pages/Manage_department";
import ManageUsers from "./Pages/ManageUsers";
import ProtextRoute from "./utils/ProtextRoute";
import FileDetail from "./Pages/FileDetail";
import School from "./Pages/School";

const router = createHashRouter([
  {
    path: "/",
    element: (
      <ProtextRoute>
        <Main />
      </ProtextRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtextRoute>
            <Home />
          </ProtextRoute>
        ),
      },
      {
        path: "/file",
        element: (
          <ProtextRoute>
            <AllFiles />
          </ProtextRoute>
        ),
      },
      {
        path: "/inbox",
        element: (
          <ProtextRoute>
            <Inbox />
          </ProtextRoute>
        ),
      },
      {
        path: "/outbox",
        element: (
          <ProtextRoute>
            <Outbox />
          </ProtextRoute>
        ),
      },
      {
        path: "/tags",
        element: (
          <ProtextRoute>
            <Tags />
          </ProtextRoute>
        ),
      },
      {
        path: "/department",
        element: (
          <ProtextRoute>
            <Department />
          </ProtextRoute>
        ),
      },
      {
        path: "/hiddenfile",
        element: (
          <ProtextRoute>
            <Hidden />
          </ProtextRoute>
        ),
      },
      {
        path:"/detail/:id",
        element:(
        <ProtextRoute>
          <FileDetail/>
        </ProtextRoute>)
      },{
        path:"/school",
        element:(
          <ProtextRoute>
            <School/>
          </ProtextRoute>
        )
      }
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SIGNUP />,
  },
  {
    path: "/forgetpw",
    element: <Forgetpw />,
  },
  {
    path: "/setting",
    element: (
      <ProtextRoute>
        <Setting />
      </ProtextRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtextRoute>
            <Management_pf />
          </ProtextRoute>
        ),
      },
      {
        path: "change_pw",
        element: (
          <ProtextRoute>
            <Change_pw />
          </ProtextRoute>
        ),
      },
      {
        path: "category",
        element: (
          <ProtextRoute>
            <Manage_category />
          </ProtextRoute>
        ),
      },
      {
        path: "department",
        element: (
          <ProtextRoute>
            <Manage_department />
          </ProtextRoute>
        ),
      },
      {
        path: "manage_users",
        element: (
          <ProtextRoute>
            <ManageUsers />
          </ProtextRoute>
        ),
      },
    ],
  },
]);

export default function App() {
  
  return <RouterProvider router={router} />;
}

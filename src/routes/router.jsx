import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Dashboard from "../pages/Dashboard";
import ChattingPage from "../pages/ChattingPage";
import NotFound from "../pages/NotFound";
import Settings from "../pages/Settings";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/chat/:id",
        element: <ChattingPage />,
      },
    ],
  },
  {
    path: "/sign-in" ,
    element: <SignIn/>
  },
  {
    path:"/sign-up",
    element: <SignUp/>
  },
  {
    path:"/forgot-password",
    element: <ForgotPasswordPage/>
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

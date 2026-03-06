import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import RegisterLecturer from "./page/RegisterLecturer";
import LoginLecturer from "./page/LoginLecturer";
import ClassDetails from "./page/ClassDetails";
import ClassSchedule from "./page/ClassSchedule";
import PreviousClass from "./page/PreviousClass";
import Attendance from "./page/Attendance";
import SuccessPage from "./page/SuccessPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/registerLecturer",
    element: <RegisterLecturer />,
  },
  {
    path: "/loginLecturer",
    element: <LoginLecturer />,
  },
  {
    path: "/classDetails",
    element: <ClassDetails />,
  },
  {
    path: "/classSchedule",
    element: <ClassSchedule />,
  },
  {
    path: "/previousClass",
    element: <PreviousClass />,
  },
  {
    path: "/attendance",
    element: <Attendance />,
  },
  {
    path: "/success",
    element: <SuccessPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

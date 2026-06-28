/* eslint-disable no-unused-vars */
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "../Home/Home";
import AboutUs from "../Components/About_us/AboutUs";
import Advice from "../Components/Advice/Advice";
import Register from "../Context/Auth/Register/Register";
import Login from "../Context/Auth/Login/Login";
import AdminDashboard from "../Admin/Admin_dashboard/AdminDashboard";
import Manage_users from "../Admin/Manage_users/ManageUsers";
import AddHospital from "../Admin/Add hospital/AddHospital";
import ManageHospitals from "../Admin/ManageHospitals/ManageHospitals";
import HospitalDashboardLayout from "../Hospitals/HospitalDashboardLayout/HospitalDashboardLayout";
import HospitalProfile from "../Hospitals/HospitalProfile/HospitalProfile";
import HospitalHome from "../Hospitals/HospitalHome/HospitalHome";
import AdminHome from "../Admin/Admin_home/AdminHome";
import ManageDoctors from "../Hospitals/AddDoctor/ManageDoctors";
import AddDoctor from "../Hospitals/AddDoctor/AddDoctor";
import AddAssistant from "../Hospitals/ManageAssistants/AddAssistant";
import ManageAssistants from "../Hospitals/ManageAssistants/ManageAssistants";
import ManageTests from "../Hospitals/ManageTests/ManageTests";
import HospitalDetails from "../Components/HospitalsList/HospitalDetails";
import HospitalsPage from "../Components/HospitalsList/HospitalsPage";
import HospitalAdminBookings from "../Hospitals/HospitalAdminBookings/HospitalAdminBookings";
import UserDashboard from "../Users/UserDashboard/UserDashboard";
import UserHome from "../Users/UserHome/UserHome";
import UserProfile from "../Users/UserProfile/UserProfile";
import UserBookings from "../Users/UserBookings/UserBookings";
import UserQueue from "../Users/UserQueue/UserQueue";
import Queue_manage from "../Hospitals/Queu management/Queue_manage";
import DashboardLayout from "../Doctor+assistant/DashboardLayout/DashboardLayout";
import DashboardHome from "../Doctor+assistant/DashboardHome/DashboardHome";
import DoctorMyProfile from "../Doctor+assistant/Doctors/DoctorMyProfile/DoctorMyProfile";
import DoctorSchedules from "../Doctor+assistant/Doctors/DoctorSchedules/DoctorSchedules";
import DoctorLiveQueue from "../Doctor+assistant/Doctors/DoctorLiveQueue/DoctorLiveQueue";
import AssistantLayout from "../Doctor+assistant/Assistatn/AssistantLayout/AssistantLayout";
import AssistantHome from "../Doctor+assistant/Assistatn/AssistantHome/AssistantHome";
import AssistantLiveQueue from "../Doctor+assistant/Assistatn/AssistantLiveQueue/AssistantLiveQueue";
import AssistantSchedule from "../Doctor+assistant/Assistatn/AssistantSchedule/AssistantSchedule";
import AssistantMyProfile from "../Doctor+assistant/Assistatn/AssistantMyProfile/AssistantMyProfile";
import AllDoctors from "../Components/All_doctors/AllDoctors";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        index: true,
        element: <Home></Home>,
        loader: () => fetch("/hospitals.json"),
      },
      {
        path: "/about",
        element: <AboutUs></AboutUs>
      },
      {
        path: '/advice',
        element: <Advice></Advice>
      },
      {
        path: '/register',
        element: <Register></Register>
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: '/allDoctors',
        element: <AllDoctors></AllDoctors>
      },
      {
        path: "/hospitals",
        element: <HospitalsPage></HospitalsPage>
      },
      {
        path: "/hospitals/details/:id",
        element: <HospitalDetails></HospitalDetails>
      },
  
    ]

  },
  {
    path: "/admin_dashboard",
    element: <AdminDashboard></AdminDashboard>,
    children: [
      {
        index: true,
        element: <AdminHome></AdminHome>
      },
      {
        path: "manageUsers",
        element: <Manage_users />
      },
      {
        path: "addHospital",
        element: <AddHospital></AddHospital>
      },
      {
        path: "manageHospitals",
        element: <ManageHospitals></ManageHospitals>
      },
    ]
  },
  {
    path: "/hospital_admin_dashboard",
    element: <HospitalDashboardLayout></HospitalDashboardLayout>,
    children: [
      {
        index: true,
        element: <HospitalHome></HospitalHome>
      },
      {
        path: "profile",
        element: <HospitalProfile></HospitalProfile>
      },
      {
        path: "addDoctor",
        element: <AddDoctor></AddDoctor>
      },
      {
        path: "doctors",
        element: <ManageDoctors></ManageDoctors>
      },
      {
        path: "addAssistance",
        element: <AddAssistant></AddAssistant>
      },
      {
        path: "manageAssistants",
        element: <ManageAssistants></ManageAssistants>
      },
      {
        path: "manageTests",
        element: <ManageTests></ManageTests>
      },
      {
        path: "manageBookings",
        element: <HospitalAdminBookings></HospitalAdminBookings>
      },
      {
        path: "Queue_management",
        element: <Queue_manage></Queue_manage>
      }



    ]
  },
  {
    path: "/user_dashboard",
    element:<UserDashboard></UserDashboard>,
    children: [
      {
        index: true,
        element:<UserHome></UserHome>
      },
      {
        path: "profile",
        element: <UserProfile></UserProfile>
      },
      {
        path: "bookings",
        element: <UserBookings></UserBookings>
      },
      {
        path: "serial",
        element: <UserQueue></UserQueue>
      },
     



    ]
  },
  {
    path: "/dashboard",
    element:<DashboardLayout></DashboardLayout>,
    children: [
      {
        index: true,
        element:<DashboardHome></DashboardHome>
      },
      {
       path:'doctorProfile',
        element:<DoctorMyProfile></DoctorMyProfile>
      },
      {
       path:'doctorSchedules',
        element:<DoctorSchedules></DoctorSchedules>
      },
      {
       path:'doctorLiveQueue',
        element:<DoctorLiveQueue></DoctorLiveQueue>
      },
     



    ]
  },
  {
    path: "/assis_dashboard",
    element:<AssistantLayout></AssistantLayout>,
    children: [
      {
        index: true,
        element:<AssistantHome></AssistantHome>
      },
         {
       path:'assistantProfile',
        element:<AssistantMyProfile></AssistantMyProfile>
      },
      {
       path:'assistantSchedules',
      element:<AssistantSchedule></AssistantSchedule>
      },
      {
       path:'assistantLiveQueue',
        element:<AssistantLiveQueue></AssistantLiveQueue>
      },
     



    ]
  },
]);
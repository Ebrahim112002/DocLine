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
     



    ]
  },
]);
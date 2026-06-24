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


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        index: true,
        element:<Home></Home>,
       loader: () => fetch("/hospitals.json"),
      },
      {
      path: "/about",
      element:<AboutUs></AboutUs>
      },
      {
        path:'/advice',
        element:<Advice></Advice>
      },
      {
        path:'/register',
        element:<Register></Register>
      },
      {
        path:'/login',
        element:<Login></Login>
      }
    ]

  },
  {
  path: "/admin_dashboard",
  element:<AdminDashboard></AdminDashboard>, 
  children: [
    {
      path: "manageUsers",
      element: <Manage_users /> 
    },
  ]
  }
]);
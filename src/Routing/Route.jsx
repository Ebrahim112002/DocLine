
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "../Home/Home";
import AboutUs from "../Components/About_us/AboutUs";
import Advice from "../Components/Advice/Advice";


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
      }
    ]
  },
]);
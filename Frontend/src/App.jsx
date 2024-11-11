import Home from './Pages/customer/Home/Home'
import Login from './Pages/customer/Login/Login'
import Register from './Pages/customer/Register/Register'
import ModeratorDashboard from './Pages/moderator/ModeratorDashboard';
import AdminDashboard from './Pages/administrator/AdminDashboard';
import OwnerDashboard from './Pages/cams_owner/OwnerDashboard';
import About_Sarawak from './Pages/customer/About_Sarawak/about_sarawak';
import Product from './Pages/customer/Product/product';
import Cart from './Pages/customer/Cart/cart';
import Contact from './Pages/customer/Contact Us/contact_us';
import NoAccess from './Component/NoAccess/NoAccess';

//Import React router dom

import{
  createBrowserRouter,
  RouterProvider
}from 'react-router-dom'

const router = createBrowserRouter([
   {
     path: '/',
     element: <div><Home/></div>
   },

   {
     path: '/register',
     element: <div><Register/></div>
   },

   {
     path: '/login',
     element: <div><Login/></div>
   },

   //Customer

   {
    path: '/home',  
    element: <Home/>
   },

   {
    path: '/about_sarawak', 
    element: <About_Sarawak/>
   },

   {
    path: '/product', 
    element: <Product/>
   },

   {
    path: '/cart', 
    element: <Cart/>
   },

   {
    path: '/contact_us', 
    element: <Contact/>
   },

   {
     path: '/login/home',
     element: <div><Home/></div>
   },

   {
     path: '/login/about_sarawak',
     element: <div><About_Sarawak/></div>
   },

   {
     path: '/login/product',
     element: <div><Product/></div>
   },

   {
    path: '/login/cart',
    element: <div><Cart/></div>
  },
  
   {
     path: '/login/contact_us',
     element: <div><Contact/></div>
   },

    //Administrator
    {
      path: '/login/administrator_dashboard/*',
      element: <div><AdminDashboard/></div>
    },

     //Moderator
     {
      path: '/login/moderator_dashboard/*',
      element: <div><ModeratorDashboard/></div>
    },

   //Owner
    {
     path: '/login/owner_dashboard/*',
     element: <div><OwnerDashboard/></div>
   },

   // No Access
   {
    path: '/no-access',
    element: <div><NoAccess/></div>
   }
])

function App() {

  return (
  <div>
    <RouterProvider router={router}/>
  </div>
  )
}

export default App
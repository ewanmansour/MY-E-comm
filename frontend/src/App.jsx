import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collections from './pages/Collections'
import About from './pages/About'
import Product from './pages/Product'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import AiAssistant from './components/AiAssistant'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div className='min-h-screen px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collections />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      <Footer />
      <AiAssistant />
      <ToastContainer position='bottom-left' autoClose={2200} hideProgressBar />
    </div>
  )
}

export default App

import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from "./components/Navbar";
import SongGen from "./components/SongGen";
import Login from './components/Login';
import Register from './components/Register';
import Footer from './components/Footer';

export default function LimitedTextarea() {


  return (
    <div className="">
    <Navbar/>
  <Routes>
      <Route path="/" element={<SongGen/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
    </Routes>
    <Footer/>
      <ToastContainer />

    {/* <SongGen/> */}
 
    </div>
  );
}

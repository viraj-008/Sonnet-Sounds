import  { useState } from "react";
import { useSelector ,useDispatch} from "react-redux";
import { setSongStatus, } from '../slices/Songslice.js'
import { removeToken } from "../slices/AuthSlice";
import { BsMenuButtonWide } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import {  toast ,Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { motion} from "framer-motion";
import {abortController} from '../abortController/abort.js'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const token = useSelector(state => state.auth.token);
  const dispatch=useDispatch()


  return (
    <div className="flex text-center px-6  bg-gray-900 py-3  md:py-3  shadow-2xl  ">
      {/* Logo */}
      <span className="mx-auto flex justify-start items-center w-full text-white font-bold">
        <Link to={"/"}>
          <img className="h-10 md:h-14 rounded-md " src={"./images/logox.png"} alt="Logo" />
        </Link>
        <p className="text-[12px] md:text-[18px] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-red-500 to-blue-400 ml-3">
          s̴o̴n̴n̴e̴t̴-̴s̴o̴u̴n̴d̴s̴
        </p>
      </span>

      {/* Buttons */}
      <div className="hidden md:flex justify-center w-[200px]   items-center">
        {
          token ? <button onClick={
            ()=>{

              if (abortController) {
    abortController.abort(); // Abort ongoing API requests & polling
    console.log("Song generation and polling stopped.");
  }
              dispatch(setSongStatus("idle"));
              dispatch(removeToken())
            toast.success('Logout seccesfull', {
                          position: "top-right",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: false,
                          draggable: true,
                          progress: undefined,
                          theme: "dark",
                          transition: Bounce,
                        });
          }
          } className="bg-red-600 text-white px-6 py-2 rounded-lg text-md font-kanit hover:text-black transition-all transform hover:scale-105 shadow-lg">
            <Link to={"/"}>L o g o u t</Link>
          </button> :
            <button className="bg-green-600 text-white px-4  py-2 rounded-lg text-md font-kanit hover:text-black transition-all transform hover:scale-105 shadow-lg">
              <Link to={"/login"}>L o g i n</Link>
            </button>
        }
      </div>
      {/* Mobile Menu */}
      <div className="md:hidden flex justify-center items-center">
        {isOpen ?<MdClose 
          className="text-3xl text-blue-500 hover:text-gray-600 transition-transform transform hover:scale-110"
          onClick={() => setIsOpen(!isOpen)}/>
          :<BsMenuButtonWide
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl text-blue-500 hover:text-gray-600 transition-transform transform hover:scale-110"
        />}
        {isOpen && (
          <motion.div
  initial={{ opacity: 0, y: -20, scale: 0.95 }}
  animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20, scale: isOpen ? 1 : 0.95 }}
  exit={{ opacity: 0, y: -20, scale: 0.95 }}
  transition={{ duration: 0.2, ease: "easeInOut" }}
  className="absolute top-24 z-20 right-[34px] w-[80%] mx-auto max-w-[300px] 
             bg-gradient-to-b from-gray-700 to-gray-900/90 
             backdrop-blur-lg border border-gray-400 shadow-2xl
             text-white flex flex-col items-center p-5 rounded-xl"
>
            {token ? 

            <button
              onClick={() =>{ 
                   dispatch(setSongStatus("idle"));
                setIsOpen(false)
                dispatch(removeToken())
                 toast.success('Logout seccesfull', {
                          position: "top-right",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: false,
                          draggable: true,
                          progress: undefined,
                          theme: "dark",
                          transition: Bounce,
                        });
              }}
              className="w-full py-3 font-montserrat  text-lg rounded-lg font-bold bg-red-700 transition-all transform hover:scale-105 shadow-md"
            >
              <Link to={"/login"}>L o g o u t</Link>
            </button>
            :
            <button
              onClick={() => setIsOpen(false)}
              className="w-full font-montserrat py-3 text-lg font-bold bg-green-600 rounded-md  transition-all transform hover:scale-105 shadow-md"
            >
              <Link to={"/login"}>L o g i n</Link>
            </button>
            }
           
            <span onClick={() => setIsOpen(false)} className="w-full font-montserrat mt-3 py-3 text-lg font-semibold text-center bg-gray-800  rounded-lg  transition-all transform hover:scale-105 shadow-md">
            <Link to={"/"}>H o m e</Link>
            </span>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

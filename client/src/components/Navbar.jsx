import  { useState } from "react";
import { useSelector ,useDispatch} from "react-redux";
import { removeToken } from "../slices/AuthSlice";
import { BsMenuButtonWide } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import {  toast ,Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const token = useSelector(state => state.auth.token);
  const dispatch=useDispatch()

  return (
    <div className="flex text-center px-6  bg-gray-900 py-3  md:py-6  shadow-2xl  ">
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
      <div className="hidden md:flex justify-center items-center">
        {
          token ? <button onClick={()=>{dispatch(removeToken())
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
          } className="bg-red-600 text-white px-5 py-2 rounded-lg text-md font-semibold hover:text-black transition-all transform hover:scale-110 shadow-lg">
            <Link to={"/"}>Logout</Link>
          </button> :
            <button className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-md font-semibold hover:text-black transition-all transform hover:scale-110 shadow-lg">
              <Link to={"/login"}>Login</Link>
            </button>
        }
      </div>
      {/* <MdClose  onClick={() => setIsOpen(!isOpen)}/> */}
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
          <div className="absolute  top-14 z-20 right-0 w-full  backdrop-blur-sm text-white flex flex-col items-center p-4    animate-slide-in">
            {token ? 

            <button
              onClick={() =>{ 
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
              className="w-full py-3 text-lg font-bold bg-red-700 transition-all transform hover:scale-105 shadow-md"
            >
              <Link to={"/login"}>Logout</Link>
            </button>
            :
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 text-lg font-bold bg-gray-800  transition-all transform hover:scale-105 shadow-md"
            >
              <Link to={"/login"}>login</Link>
            </button>
            }
           
            <span onClick={() => setIsOpen(false)} className="w-full mt-3 py-3 text-lg font-semibold text-center bg-gray-800  rounded-lg hover:text-black transition-all transform hover:scale-105 shadow-md">
            <Link to={"/"}>Home</Link>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

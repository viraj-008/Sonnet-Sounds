import {   FaLinkedin,FaGithub ,  FaInstagram  } from "react-icons/fa";
const Footer = () => {
  return (
    <div>
       <footer className=" bg-black w-full text-center p-3 mt-12 mb-12">
              <h3 className="text-sm font-stencil text-white">
                Sonnet-Sounds | Created by vivek kumar
              </h3>
              <p className="text-sm text-gray-700 font-montserrat mt-2">
                Transforming text into futuristic AI-generated music
              </p>
              <div className="flex justify-center mt-4 space-x-6">
                <a href="https://www.instagram.com/virajshekhar63?igsh=MWkxOThyNXl4aG9hbg==" target="black" className="text-white hover:text-gray-400 transition-transform transform hover:scale-110">
                  <FaInstagram className="w-6 h-6" />
                </a>
                <a href="https://github.com/viraj-008" target="black" className="text-white hover:text-gray-600 transition-transform transform hover:scale-110">
                <FaGithub className="w-6 h-6"/>
                </a>
                <a href="https://www.linkedin.com/in/vivek-kumar-24ab832a2" target="black" className="text-white hover:text-gray-600 transition-transform transform hover:scale-110">
                  <FaLinkedin className="w-6 h-6" />
                </a>
              </div>
              <a href="#top" className="mt-6 inline-block font-anton text-gray-600 ansition-transform transform hover:scale-110">
                ⬆ Back to top
              </a>
            </footer>
        
            
    </div>
  )
}

export default Footer

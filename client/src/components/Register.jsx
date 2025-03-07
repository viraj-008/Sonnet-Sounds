import { useDispatch, useSelector } from 'react-redux';
import {setAuthStatus} from '../slices/AuthSlice.js'
import {  toast ,Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios'

export default function Register() {


  const initialValues = {
    name: "",
    email: "",
    password: "",
  };



  const validationSchema = Yup.object({
    name: Yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  })


  // const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const dispatch = useDispatch();
  const userAuthStatus = useSelector((state) => state.auth.status);
  const navigate=useNavigate()

  // const handleChange = (e) => {
  //   // setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  
  
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    dispatch(setAuthStatus("loading"));

    try {
      const res = await axios.post(
        "https://a685-2401-4900-8848-34a6-5c19-fead-36dd-5e2f.ngrok-free.app/api/user/register",
        values
      );

      if (res.data.success) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        resetForm();
        navigate("/login");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed, try again",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
    }
    
    dispatch(setAuthStatus("idle"));
    setSubmitting(false);
  };
    return (
      <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-40 rounded-full blur-[100px] top-1/3 left-1/4 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-30 rounded-full blur-[120px] bottom-1/3 right-1/4 animate-pulse"></div>

      <div className="relative w-[90%] md:w-96 p-6 md:p-10 mx-auto rounded-3xl shadow-md text-white backdrop-blur-4xl">
        <h2 className="text-center text-2xl md:text-4xl font-extrabold mb-8 text-cyan-400 tracking-widest drop-shadow-lg uppercase">
          Register
        </h2>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className="relative mb-6">
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full px-6 py-4 bg-transparent border border-gray-600 rounded-xl focus:ring-4 focus:ring-cyan-500 focus:outline-none placeholder-gray-300 text-lg transition-all duration-300 hover:border-cyan-400 shadow-lg backdrop-blur-lg"
                />
                <ErrorMessage name="name" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              <div className="relative mb-6">
                <Field
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="w-full px-6 py-4 bg-transparent border border-gray-600 rounded-xl focus:ring-4 focus:ring-cyan-500 focus:outline-none placeholder-gray-300 text-lg transition-all duration-300 hover:border-cyan-400 shadow-lg backdrop-blur-lg"
                />
                <ErrorMessage name="email" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              <div className="relative mb-8">
                <Field
                  type="password"
                  name="password"
                  placeholder="Secure Password"
                  className="w-full px-6 py-4 bg-transparent border border-gray-600 rounded-xl focus:ring-4 focus:ring-cyan-500 focus:outline-none placeholder-gray-300 text-lg transition-all duration-300 hover:border-cyan-400 shadow-lg backdrop-blur-lg"
                />
                <ErrorMessage name="password" component="div" className="text-red-400 text-sm mt-1" />
                <span className="flex my-1 px-2">
                  Already a member?
                  <p className="text-blue-600 ml-1">
                    <Link to={"/login"}>Login</Link>
                  </p>
                </span>
              </div>

              <button
                type="submit"
                disabled={userAuthStatus === "loading" || isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold tracking-wide shadow-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                {userAuthStatus === "loading" || isSubmitting ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
    );
  }
  
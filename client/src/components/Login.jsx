import { useDispatch, useSelector } from "react-redux";
import { setAuthStatus, setAuthToken } from "../slices/AuthSlice.js";
import { Link, useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function Login() {
  const dispatch = useDispatch();
  const userAuthStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    dispatch(setAuthStatus("loading"));
    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/login",
        values
      );

      dispatch(setAuthToken(res.data.token));

      if (res.data.success) {
        toast.success('Login succesfull', {
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
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed, try again", {
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
          Login
        </h2>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
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
                  Not a member?
                  <p className="text-blue-600 ml-1">
                    <Link to={"/register"}>Register</Link>
                  </p>
                </span>
              </div>

              <button
                type="submit"
                disabled={userAuthStatus === "loading" || isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold tracking-wide shadow-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                {userAuthStatus === "loading" || isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

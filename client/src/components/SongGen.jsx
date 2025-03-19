import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSongStatus, setSongUrl } from '../slices/Songslice.js'
import { RotatingLines } from 'react-loader-spinner';
import { GiMusicSpell } from "react-icons/gi";
import { MdOfflineShare } from "react-icons/md";
import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion";


const SongGen = () => {



  const [text, setText] = useState("");

  const dispatch = useDispatch();
  const songUrl = useSelector((state) => state.song.audioUrl);
  const songStatus = useSelector((state) => state.song.status);
  const token = useSelector(state => state.auth.token);

  const maxLength = 200;
  const remainingChars = maxLength - text.length;
  const handleInputChange = (e) => {
    setText(e.target.value);
  };



  // Track AbortController reference
  const handleGenerateSong = async () => {
    if (text.trim().length === 0) return;

    try {
      dispatch(setSongStatus("loading"));
      const response = await fetch(
        "https://sonnet-sounds.onrender.com/api/job/gen",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ myPrompt: text }),
        }
      );

      const data = await response.json();
      if (data.error) {
        toast.error(
          data?.error || "plz login", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        })
      }
      console.log("Initial Response:", data);


      if (!data.taskId) {
        dispatch(setSongStatus("idle"));
        toast.error(
          data.msg || "Failed to initiate song generation", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        })
        return;
      }

      const taskId = data.taskId;
      const pollInterval = 20000;
      const maxAttempts = 15;
      let attempts = 0;

      const pollForAudioUrl = async () => {

        try {
          const statusResponse = await fetch(
            `https://sonnet-sounds.onrender.com/api/job/status?taskId=${taskId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const statusData = await statusResponse.json();
          console.log("Status Response:", statusData, statusData.audioUrl);

          if (statusData.audioUrl) {
            // Audio URL is available
            toast.success(
              "🎉 Congratulations you song is ready!.", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            })
            dispatch(setSongUrl(statusData.audioUrl));
            dispatch(setSongStatus("generated"));
          } else if (attempts < maxAttempts) {
            // Retry polling
            attempts++;
            setTimeout(pollForAudioUrl, pollInterval);
          } else {
            // Max attempts reached
            dispatch(setSongStatus("idle"));
            toast.error(
              "Song generation timed out. Please try again.", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            })
          }
        } catch (error) {


          console.error("Error polling for audio URL:", error);
          dispatch(setSongStatus("idle"));
          toast.error(
            "An error occurred while fetching song status.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          })

        }
      };

      pollForAudioUrl(); // Start polling
    } catch (error) {

      console.error("Error generating song:", error);
      dispatch(setSongStatus("idle"));
      toast.error("An error occurred. Please try again.", {
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
  };



  // Run effect when token changes
  const audioList = [
    {
      name: "text-to-song",
      singer: "ai musics by viraj",
      cover: "https://images.squarespace-cdn.com/content/v1/57462f541bbee075320514a9/1624917149678-E3SDVDIKPXFEQMU76XX1/Screen+Shot+2021-06-28+at+2.51.52+PM.png?format=2500w",
      musicSrc: songUrl
    },
  ];


  return (

    <div className=" flex flex-col items-center justify-center relative overflow-hidden bg-gray-900">


      <section className="w-full bg-gray-900  px-8">
        <div className="mx-auto flex flex-col items-center lg:flex-row justify-center gap-10 py-10 max-w-[1440px] bg-no-repeat">
          <div className=" flex-col justify-center items-start gap-20 inline-flex">
            <div className="self-stretch flex-col justify-start items-start gap-5 flex">


              <motion.h1
                whileInView={{ opacity: 1, y: 0 }} // Animate when visible
                initial={{ opacity: 0, y: -50 }} // Start hidden and moved up
                transition={{ duration: 0.6, ease: "easeOut" }} // Smooth motion
                viewport={{ once: false, amount: 0.3 }} // Triggers every time when 30% visible
                className="self-stretch text-white text-5xl md:text-8xl font-bold font-stencil"
              >
                Welcome to:
                <span className="text-[#3e9d26]  font-anton"> Sonnet-Sounds</span>
              </motion.h1>

              <p className="self-stretch text-gray-300 text-xl  font-montserrat ">
                Create mesmerizing songs with the power of AI. Enter your prompt and let Sonnet Sounds generate unique melodies, lyrics, and vocals just for you..
              </p>
            </div>
            <div className="justify-start items-center gap-5 inline-flex">
              <div className="justify-start items-center gap-2.5 flex">
                <div className="relative">
                  <path
                    d="M20.7806 12.5306L14.0306 19.2806C13.8899 19.4213 13.699 19.5004 13.5 19.5004C13.301 19.5004 13.1101 19.4213 12.9694 19.2806C12.8286 19.1399 12.7496 18.949 12.7496 18.75C12.7496 18.551 12.8286 18.3601 12.9694 18.2194L18.4397 12.75H3.75C3.55109 12.75 3.36032 12.671 3.21967 12.5303C3.07902 12.3897 3 12.1989 3 12C3 11.8011 3.07902 11.6103 3.21967 11.4697C3.36032 11.329 3.55109 11.25 3.75 11.25H18.4397L12.9694 5.78061C12.8286 5.63988 12.7496 5.44901 12.7496 5.24999C12.7496 5.05097 12.8286 4.8601 12.9694 4.71936C13.1101 4.57863 13.301 4.49957 13.5 4.49957C13.699 4.49957 13.8899 4.57863 14.0306 4.71936L20.7806 11.4694C20.8504 11.539 20.9057 11.6217 20.9434 11.7128C20.9812 11.8038 21.0006 11.9014 21.0006 12C21.0006 12.0986 20.9812 12.1961 20.9434 12.2872C20.9057 12.3782 20.8504 12.461 20.7806 12.5306Z"
                    fill="white"
                  />
                </div>
              </div>
            
            </div>
          </div>
          <motion.img
            src="./images/logox.png"
            alt="logo"
            className="w-full max-w-[400px]"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: false, amount: 0.3 }}
          />
        </div>
      </section>
      <div className="text-center p-4  pb-12  rounded-2xl ">

        <h1 className="self-stretch text-white text-2xl md:text-5xl  font-anton text-center"
        >
          Create your personalized song
          <span > <br />with just a prompt! Let your heart sing! </span>
        </h1>
      </div>

      <div className="relative inline-block p-[5px]   md:w-[700px]  animate-border">
        <motion.h1
          initial={{ opacity: 0, x: 50 }} // Start off-screen to the right
          whileInView={{ opacity: 1, x: 0 }} // Slide in when visible
          transition={{ duration: 0.8, ease: "easeOut" }} // Smooth transition
          viewport={{ once: false, amount: 0.3 }} // Triggers every scroll when 30% visible
          className="self-stretch text-white text-2xl md:text-5xl font-bold font-['Roboto'] text-center"
        >
          <div id="started" className="relative flex items-center justify-center w-[200px] md:w-[300px]  my-6 h-12 mx-auto mt-10">
            <div className="absolute w-full h-[6px]  bg-cyan-400  skew-x-[-80deg]"></div>
            <h2 className="relative z-10 mb-4 font-stencil text-sm  md:text-xl flex text-gray-200 tracking-wider ">
              🎤 Start Creating Now
            </h2>
          </div>
        </motion.h1>


        <div className="relative bg-black flex flex-col mt-4 px-4 justify-center p-6 border-2 md:border-8 border-cyan-400  max-w-3xl  backdrop-blur-lg rounded-2xl shadow-2xl transition-all hover:shadow-blue-900">

          <div>
            <img className='h-16 md:h-28 mx-auto' src='./images/logox.png' />
            <p className="text-[22px] text-center font-bold md:text-[38px] text-transparent bg-clip-text text-white">
              s̴o̴n̴n̴e̴t̴-̴s̴o̴u̴n̴d̴s̴
            </p>
          </div>
          {/* Character Counter */}
          <p className="py-2 text-gray-500 mt-4 flex justify-center font-medium text-lg">
            <span> ✍️ {remainingChars} / {maxLength}</span>
          </p>

          {/* Input Textarea */}
          <textarea
            value={text}
            onChange={handleInputChange}
            maxLength={maxLength}
            placeholder="Write your song idea here..."
            className="w-full p-4 text-lg text-white placeholder-gray-500 bg-transparent border  rounded-xl resize-none focus:outline-none focus:ring-4 focus:white shadow-lg"
          />

          {/* Generate Button */}
          <button
            onClick={handleGenerateSong}
            disabled={songStatus === "loading"}
            className="md:w-[80%] w-[280px] mt-6 mx-auto text-white px-6 py-3 text-lg font-bold  bg-purple-800 rounded-xl transition-all transform shadow-xl hover:shadow-purple-500/50 hover:scale-105 flex items-center justify-center gap-3 border border-white/30"
          >
            {songStatus === "loading" ? (
              <RotatingLines strokeColor="white" strokeWidth="5" animationDuration="1.75" width="30" visible={true} />
            ) : (
              <span className="flex justify-center items-center gap-2 font-josefin">
                Generate Song . . . <GiMusicSpell className='text-green-400 text-2xl' />
              </span>
            )}
          </button>

          {/* Loading Message */}
          {songStatus === "loading" && (
            <div className="mt-4 w-[80%] text-green-400 border font-anton mx-auto text-center p-2  font-semibold rounded-xl animate-pulse  ">
              ⏳ Generating your song... Please wait (20-40 sec) 🎵
            </div>
          )}
          {songStatus === "generated" && (
            <div className="mt-10  text-center bg-blue-600 p-6 rounded-2xl shadow-xl border border-blue-500 ">
              <ReactJkMusicPlayer
                audioLists={audioList}
                theme="dark"
                mode="full"
                showThemeSwitch={false}
                showMiniModeCover={true}
                style={{ backgroundColor: "blue", borderColor: "red", color: "black" }}
              />
              <p className="mt-4 text-lg  font-josefin text-white ">
                🎉🎶 Congratulations! Your AI-generated song is ready! 🎶🔥 Enjoy the music and let the beats take over! 🚀🎧 <br />

              </p>
            </div>
          )}
        </div>
      </div>
      <section className="m-4 md:m-8 text-white">
        <div className="container mx-auto p-4 my-6 space-y-2 text-center">
          <h2 className="text-5xl font-bold font-stencil bg-gradient-to-r from-purple-200 via-teal-500 to-red-300 text-transparent bg-clip-text ">Built to Empower Every Music Creator</h2>
          <p className="text-gray-200 font-montserrat   ">Transform your ideas into AI-generated melodies!</p>
        </div>
        <div className="container mx-auto grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 dark:text-violet-600">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
            </svg>
            <h3 className="my-3 text-3xl font-josefin">Chill Vibes</h3>
            <div className="space-y-1 font-montserrat text-gray-300 leading-tight  w-[200px] text-center">
              <p>☕ A smooth lo-fi track for late-night study sessions.</p>

            </div>
          </div>
          <div className="flex flex-col items-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 dark:text-violet-600">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
            </svg>
            <h3 className="my-3 text-3xl font-josefin">Energetic Anthem</h3>
            <div className="space-y-1 font-montserrat text-gray-300  leading-tight  w-[200px] text-center">
              <p>🔥 A high-energy rock song to get you pumped up!</p>

            </div>
          </div>
          <div className="flex flex-col items-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 dark:text-violet-600">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
            </svg>
            <h3 className="my-3 text-3xl font-josefin">Romantic Ballad</h3>
            <div className="space-y-1 font-montserrat text-gray-300 leading-tight  w-[200px] text-center">
              <p>❤️ A heartfelt love song with soothing piano melodies.</p>

            </div>
          </div>
          <div className="flex flex-col items-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 dark:text-violet-600">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
            </svg>
            <h3 className="my-3 text-3xl font-josefin">Epic Soundtrack</h3>
            <div className="space-y-1 font-montserrat text-gray-300  leading-tight  w-[200px] text-center">
              <p>🎬 A cinematic orchestral piece for an adventurous journey.</p>

            </div>
          </div>
          <div className="flex flex-col items-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 dark:text-violet-600">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
            </svg>
            <h3 className="my-3 text-3xl font-josefin">Sad & Emotional</h3>
            <div className="space-y-1 font-montserrat text-gray-300  leading-tight  w-[200px] text-center">
              <p>💔 A melancholic melody for deep reflection.</p>

            </div>
          </div>
          <div className="flex flex-col items-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 dark:text-violet-600">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
            </svg>
            <h3 className="my-3 text-3xl font-josefin">Upbeat Party Hit</h3>
            <div className="space-y-1 leading-tight font-montserrat text-gray-300  w-[200px] text-center">
              <p>🎉 A dance-pop track to keep the party going!</p>

            </div>
          </div>
        </div>
      </section>


      <div className='my-20 mx-auto max-w-[1240px] md:w-[60%]'>

        <h2 className="text-4xl text-center font-bold bg-gradient-to-r from-purple-200 via-teal-500 to-red-600 text-transparent bg-clip-text mt-6 font-stencil">Share Your Creations</h2>
        <p className="text-gray-300 mt-2 text-center ml-6  mr-4 font-kanit ">
          Feel free to share your AI-generated song with the world! Post it on social media, save it for later,
          or use it as the perfect soundtrack for your next adventure.
          <MdOfflineShare className='text-cyan-600 text-2xl' />
        </p>
      </div>


    </div>


  )
}

export default SongGen

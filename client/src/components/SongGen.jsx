import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSongStatus, setSongUrl } from '../slices/Songslice.js'
import { RotatingLines } from 'react-loader-spinner';
import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import {  toast ,Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  FaHeadphones  } from "react-icons/fa";


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


  const handleGenerateSong = async () => {
    if (text.trim().length === 0) return;

    try {
      dispatch(setSongStatus("loading"));
      const response = await fetch(
        "https://992d-2401-4900-8849-c95c-19df-b66c-b3ec-fb10.ngrok-free.app/api/job/gen",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ myPrompt: text }),
        }
      );

      const data = await response.json();
      if(data.error){
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
          "Failed to initiate song generation", { 
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
            `https://992d-2401-4900-8849-c95c-19df-b66c-b3ec-fb10.ngrok-free.app/api/job/status?taskId=${taskId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true",
              },
            }
          );

          const statusData = await statusResponse.json();
          console.log("Status Response:", statusData);

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
      toast.error(
        "An error occurred. Please try again..", { 
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


  const audioList = [
    {
      name: "text-to-song",
      singer: "ai musics by viraj",
      cover: "https://th.bing.com/th/id/OIP.oqAvPQB5TFp0lM46u_QrygHaHa?rs=1&pid=ImgDetMain",
      musicSrc: songUrl 
    },
  ];


  return (

   <div className=" flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#2dd4bf]  to-[#1f2937] p-4">

  <span className=' my-8 text-cyan-800  rounded-full p-4 text-6xl  md:text-8xl'><FaHeadphones /></span>
 <h1 className="flex flex-col text-center font-extrabold text-2xl text-white md:text-2xl mb-2 p-4  items-center   rounded-md ">
 𝓦𝓮𝓵𝓬𝓸𝓶𝓮 𝓽𝓸  <span className=' text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-red-500 to-blue-600'>𝓢𝓸𝓷𝓷𝓮𝓽-𝓢𝓸𝓾𝓷𝓭𝓼!</span> 🎶
  </h1>
<div className="text-center p-4  pb-12  rounded-2xl shadow-2xl">
  

  <div className="">
    <img
      className="hidden md:block mx-auto rounded-xl shadow-2xl border-4 border-black"
      src="https://img.freepik.com/premium-photo/abstract-background-with-attractive-woman-headphones-neon-illuminated-colors-colourful-female-portrait-young-girl-enjoying-music-horizontal-illustration-banner-design-generative-ai_9209-12708.jpg"
      alt="Music Vibes"
    />
    <img
      className="rounded-lg mx-auto md:hidden shadow-2xl border-2 border-white"
      src="https://w0.peakpx.com/wallpaper/473/223/HD-wallpaper-music-beat-guy-headphone-listen-man-notes-sing-song.jpg"
      alt="Listening to Music"
    />
  </div>

  <p className="font-semibold   text-white    rounded-lg text-2xl md:text-[18px] text-center  md:text-3xl p-3 font-serif px-6 my-8 leading-relaxed">
    Create your personalized song <br/> with just a prompt! Let your heart sing! 
   
  </p>

  <div className="bg-white text-gray-900 shadow-lg rounded-xl p-4 md:w-[80%] mx-auto">
    <h2 className="text-xl md:text-2xl  text-center md:text-start font-bold text-green-900 mb-4">🎵 Why You'll Love Sonnet-Sounds? </h2>
    <ul className="space-y-2  text-sm font-bold text-gray-600  px-2">
      
      <li className="flex ">
        <span>🎙️</span> <span>Choose any mood, theme, or genre</span>
      </li>
      <li className="flex">
        🎼 <span>Generate lyrics & melody effortlessly</span>
      </li>
      <li className="flex ">
        🔥 <span>Save & share your unique creations</span>
      </li>
      <li className="flex gap-x-2">
        🚀 <span>No experience needed – just describe your idea!</span>
      </li>
    </ul>
  </div>

 
</div>


<div className="relative inline-block p-[5px] rounded-lg  md:w-[700px]  animate-border">
  <h1 className="relative text-[15px] w-[80%] mx-auto text-center bg-gradient-to-r from-green-400 to-blue-500 md:text-2xl border text-gray-300 font-bold my-12  p-5 rounded-xl ">
    🎤 Start Creating Now! 🎶
  </h1>
<div className="relative bg-black flex flex-col mt-4 px-4 justify-center p-6 border-2 md:border-8 border-cyan-400  max-w-3xl  backdrop-blur-lg rounded-2xl shadow-2xl transition-all hover:shadow-blue-900">

  <div>
     <img className='h-16 md:h-28 mx-auto' src='./images/logox.png'/>
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
    className="md:w-[80%] w-[280px] mt-6 mx-auto text-white px-6 py-3 text-lg font-bold  bg-gradient-to-r from-green-400 to-blue-500 rounded-xl transition-all transform shadow-xl hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-3 border border-white/30"
  >
    {songStatus === "loading" ? (
      <RotatingLines strokeColor="white" strokeWidth="5" animationDuration="1.75" width="30" visible={true} />
    ) : (
      <span className="flex justify-center items-center gap-2">
      🎤 Start Creating! 🎶
      </span>
    )}
  </button>

  {/* Loading Message */}
  {songStatus === "loading" && (
    <div className="mt-4 text-center p-2 font-serif font-semibold rounded-xl text-white animate-pulse bg-emerald-500/20 w-full">
      ⏳ Generating your song... Please wait (20-40 sec) 🎵
    </div>
  )}
      {songStatus === "generated" && (
        <div className="mt-10 text-center bg-blue-600 p-6 rounded-2xl shadow-xl border border-blue-500 ">
          <ReactJkMusicPlayer
            audioLists={audioList}
            theme="dark"
            mode="full"
            showThemeSwitch={false}
            showMiniModeCover={true}
            style={{ backgroundColor: "blue", borderColor: "red", color: "black" }}
          />
          <p className="mt-4 text-lg  font-semibold text-white ">
          🎉🎶 Congratulations! Your AI-generated song is ready! 🎶🔥 Enjoy the music and let the beats take over! 🚀🎧 <br/>
           <p className='text-pink-300 font-sans font-bold animate-bounce'>Tap the music Icon</p>
          </p>
        </div>
      )}
</div>
</div>


<div className="w-[95%] py-8   md:w-[90%] mx-auto  font-semibold p-2 rounded-xl shadow-lg my-10">
  <h1 className="text-1xl md:text-2xl  font-extrabold bg-gradient-to-r from-purple-200 via-teal-500 to-red-600 text-transparent bg-clip-text">🎶 Create Your Song 🎶</h1>

  <p className="mt-3 text-md text-gray-300 ml-5 ">
  Enter a prompt and let our AI generate a unique song for you! Whether you want a love ballad, 
    a motivational anthem, or a poetic story, the possibilities are endless. Describe the mood, 
    theme, or style you’d like, and watch the magic unfold. 
  </p>

  <h2 className="text-1xl md:text-2xl font-bold bg-gradient-to-r from-purple-200 via-teal-500 to-red-600 text-transparent bg-clip-text mt-6">✨ Example Prompts:</h2>
  
  <ul className="mt-3  text-start  space-y-2 text-gray-300">
    <li className='flex gap-x-3'><span>🎵</span> Write a love song for a summer night.</li>
    <li className='flex gap-x-3'><span>🔥</span> Create a song about overcoming challenges.</li>
    <li className='flex gap-x-3'><span>🚗 </span>A fun, upbeat song about a road trip.</li>
    <li className='flex gap-x-3'><span>🌌 </span>A dreamy, futuristic song about exploring space.</li>
    <li className='flex gap-x-3'><span>🎭 </span>A deep and emotional song about self-discovery.</li>
  </ul>

  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-200 via-teal-500 to-red-600 text-transparent bg-clip-text mt-6">📢 Share Your Creations</h2>
  <p className="text-gray-300 mt-2  ml-6">
  .  Feel free to share your AI-generated song with the world! Post it on social media, save it for later, 
    or use it as the perfect soundtrack for your next adventure. 
  </p>

 
</div>

    </div>
  )
}

export default SongGen

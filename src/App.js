import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactPlayer from "react-player";

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [channelName, setChannelName] = useState("");
  const [searchChannelResults, setSearchChannelResults] = useState([]);
  const [searchVideoResults, setSearchVideoResults] = useState([]);
  const [clickedVideo, setClickedVideo] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const onSubmit = async (data) => {
    try {
      const response = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${channelName}&type=channel&key=${apiKey}`
      );

      setSearchChannelResults(response.data.items);
      console.log(response.data.items);
    } catch (error) {
      console.error("Error fetching data from YouTube API:", error);
    }
  };

  const getVideos = async (result) => {
    try {
      const response = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${result.id.channelId}&order=date&maxResults=25&key=${apiKey}`
      );

      setSearchVideoResults(response.data.items);
      console.log(response.data.items);
    } catch (error) {
      console.error("Error fetching data from YouTube API:", error);
    }
  };

  const playVideo = (videoId) => {
    setClickedVideo(videoId);
    scrollToTop();
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Add smooth scrolling effect
    });
  };

  useEffect(() => {
    // Update window width on window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="flex flex-col items-center ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center p-4"
      >
        <input
          type="text"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          placeholder="type channel name"
          required
        />
        <button className=" border-solid ">enter</button>
      </form>
      <ul>
        {searchChannelResults.map((result) => (
          <li
            key={result.id.channelId}
            className="cursor-pointertransition-all ease-in-out duration-100 flex items-center justify-between"
          >
            <span
              onClick={() => getVideos(result)}
              className=" hover:bg-sky-300 "
            >
              {result.snippet.title}
            </span>
            <button
              type="button"
              class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 ml-4"
            >
              Save
            </button>
          </li>
        ))}
      </ul>

      {clickedVideo && (
        <div className=" bg-black  flex justify-center items-center">
          <div className="opacity-100 z-20">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${clickedVideo}`}
              width={windowWidth}
              playing
              controls
            />
          </div>
        </div>
      )}
      <ul>
        {searchVideoResults.map(
          (result) =>
            result.id.videoId && (
              <div
                onClick={() => playVideo(result.id.videoId)}
                className="flex flex-col items-center my-10 cursor-pointer"
              >
                <img
                  src={result.snippet.thumbnails.high.url}
                  className={`w-[${windowWidth}px]`}
                />
                <li key={result.id.videoId} className="text-center">
                  {result.snippet.title}
                </li>
              </div>
            )
        )}
      </ul>
    </div>
  );
}

export default App;

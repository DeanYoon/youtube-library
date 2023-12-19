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
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${result.id.channelId}&maxResults=25&key=${apiKey}`
      );

      setSearchVideoResults(response.data.items);
      console.log(response.data.items);
    } catch (error) {
      console.error("Error fetching data from YouTube API:", error);
    }
  };

  const playVideo = (videoId) => {
    console.log(videoId);
    setClickedVideo(videoId);
  };

  useEffect(() => {}, []);
  return (
    <div className="flex flex-col items-center">
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
            onClick={() => getVideos(result)}
            className="cursor-pointer hover:bg-sky-300 transition-all ease-in-out duration-100"
          >
            {result.snippet.title}
          </li>
        ))}
      </ul>

      {clickedVideo && (
        <div className=" bg-black w-full h-full flex justify-center items-center">
          <div className="opacity-100 z-20">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${clickedVideo}`}
              width={1000}
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
                <img src={result.snippet.thumbnails.high.url} />
                <li key={result.id.videoId}>{result.snippet.title}</li>
              </div>
            )
        )}
      </ul>
    </div>
  );
}

export default App;

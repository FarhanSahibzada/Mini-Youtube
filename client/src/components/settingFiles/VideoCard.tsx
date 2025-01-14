import { videoType } from "@/pages/Home";
import { RootState } from "@/store/Store";
import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import SettingVideoCard from "./SettingVideoCard";



function VideoCard() {
  const [video, setVideo] = useState<Array<videoType>>([])
  const backend = import.meta.env.VITE_BACKEND_URL;
  const id = useSelector((state: RootState) => state.auth.userLogin)?._id;
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!fetched && id) {
      const fetchVideo = async () => {
        try {
          const response = await axios.get(`${backend}/api/v1/videos?userId=${id}`, { withCredentials: true })
          if (response && response.data) {
            setVideo(response.data?.data?.docs)
            setFetched(true)
          }
        } catch (error) {
          console.log("cannot fetch the videos", error)
        }
      }
      fetchVideo()
    }
  }, [backend, id, fetched])

  return (
    <div className="w-full">
      {video?.map((item, index) => (
        <div key={index} className="w-full mb-3">
          <SettingVideoCard data={item} />
        </div>
      ))}
    </div>
  )
}

export default VideoCard
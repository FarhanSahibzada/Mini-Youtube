import { videoType } from "@/pages/Home"
import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Cardstackk from "../Cardstack"

export interface playlistType {
  _id: string,
  name: string,
  description: string,
  owner: string,
  videos: [videoType]
}

function Playlist() {

  const { id } = useParams()
  const [playlist, setPlaylist] = useState<Array<playlistType>>([])

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const respnse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/playlist/${id}`, { withCredentials: true })
        if (respnse && respnse.data) {
          const data = respnse.data?.data;
          setPlaylist(data)
        }
      } catch (error) {
        console.log("cannot fethed the playlist", error)
      }
    }
    fetchPlaylist()
  }, [id])


  return (
    <div className="w-full ">
      {playlist.map((item, index) => (
        <Cardstackk
          key={index}
          playlists={item}
        />
      ))}
    </div>
  )
}

export default Playlist


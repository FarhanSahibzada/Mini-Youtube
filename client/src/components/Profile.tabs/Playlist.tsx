import { videoType } from "@/pages/Home"
import axios from "axios"
import { useEffect, useState } from "react"
import Cardstackk from "../Cardstack"

export interface playlistType {
  _id: string,
  name: string,
  description: string,
  owner: string,
  videos: [videoType]
}

interface idProps {
  id : string | undefined
}

function Playlist( {id} : idProps) {

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


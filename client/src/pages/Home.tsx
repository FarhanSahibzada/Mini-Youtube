import Card from "@/components/Card";
import axios from 'axios';
import { useEffect, useState } from 'react';

export interface videoType {
  _id: string,
  thumbnail: { url: string },
  videoFile : {url : string}
  title: string,
  description: string,
  views: number,
  duration : number,
  owner : string,
  ownerDetails : {
    id: string  ,
    avatar : {url : string} ,
    username : string 
  },
}

export default function Home() {

  const [videoData, setVideoData] = useState<Array<videoType>>([])
  useEffect(() => {
    const getAllVideos = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/videos/`, { withCredentials: true })
        if (response && response.data) {
          setVideoData(response.data.data.docs)
        }
      } catch (error) {
        console.log("cannot get the video", error)
      }
    }
    getAllVideos()
  }, [])

  
  if (!videoData) {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-slate-400 to-base-300 backdrop-blur-lg bg-white/30">
      <div className="flex space-x-3 mb-6">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce delay-100"></div>
        <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  }
  return (
    <div className="px-4 py-4 w-full  mt-14 sm:mt-0 ">
      <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
        {videoData.map((dataa, index) => (
          <Card key={index} items={dataa} />
        ))}
      </div>
    </div>
  )
}

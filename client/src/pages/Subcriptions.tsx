import { useEffect, useState } from "react"
import { videoType } from "./Home"
import axios from "axios"
import Card from "@/components/Card"


export default function Subcriptions() {

    const [video, setVideo] = useState<Array<videoType>>([])

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subcriber/getSubcriber-video`, { withCredentials: true })
                if (response && response.data) {
                    const data = response.data?.data;
                    setVideo(data)
                }
            } catch (error) {
                console.log("error on fetching the videos", error)
            }
        }

        fetchVideo()
    }, [])

    return (
        <div className='w-full bg-white p-4 mt-14 sm:mt-0 '>
            <h1 className="text-base md:text-2xl font-semibold ms-1 mb-4 ">Latest</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 '>
                {video.map((data , index)=> (
                    <Card key={index} items={data} />
                ))}
            </div>
        </div>
    )
}

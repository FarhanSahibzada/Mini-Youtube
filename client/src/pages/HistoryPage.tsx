import { useEffect, useState } from "react"
import { videoType } from "./Home"
import axios from "axios"
import HistoryCard from "@/components/HistoryCard"

export default function HistoryPage() {
    const [history, setHistoryVideo] = useState<Array<videoType>>([])

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/watch-history`, { withCredentials: true })
                if (response && response.data) {
                    setHistoryVideo(response.data?.data)
                }
            } catch (error) {
                console.log("error when fetching the history videos", error)
            }
        }
        fetchVideo()
    }, [])

    const handleDelet = (id: string) => {
        setHistoryVideo((prev) =>
            prev.filter((item) => id !== item._id)
        )
    }

    return (
        <div className="w-full px-6 py-4 ">
            <h1 className="text-2xl md:4xl font-bold mb-4">Watch History</h1>
            <h3 className="font-semibold texl-xl md:text-2xl mb-4" >Latest</h3>
            <div className="flex flex-col space-y-2">
                {history.map((data, index) => (
                    <HistoryCard key={index} item={data} fun={(id : string)=> handleDelet(id)} />
                ))}
            </div>
        </div>
    )
}

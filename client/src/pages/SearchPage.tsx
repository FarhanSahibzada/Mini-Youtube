import { RootState } from "@/store/Store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { videoType } from "./Home";
import SearchCard from "@/components/SearchCard";

export default function SearchPage() {
    const { name } = useParams();
    const searches = useSelector((state: RootState) => state.auth.searchTerm)
    const [video, setVideoData] = useState<Array<videoType>>([])

    useEffect(() => {
        async function fetchvideos() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/videos?query=${searches}`
                    , { withCredentials: true }
                )
                if (response && response.data) {
                    const data = response.data?.data?.docs;
                    setVideoData(data)
                }
            } catch (error) {
                console.log("error when fetching the search videos", error)
            }

        }

        fetchvideos()
    }, [name, searches])

    return (
        <div className="w-full md:w-[80%] ">
            <div className="flex flex-col px-4 py-4 mt-16  sm:mt-2">
                {video.length > 0 ? (
                    video.map((data, index) => (
                        <SearchCard key={index} item={data} />
                    ))
                ) : (
                    <div className="flex min-h-screen justify-center items-center">
                        <h1 className="text-2xl md:text-4xl font-bold ">No Song Found</h1>
                    </div>
                )}
            </div>
        </div>
    )
}

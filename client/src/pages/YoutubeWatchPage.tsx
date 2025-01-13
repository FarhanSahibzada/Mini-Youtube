import axios from 'axios';
import {
    ThumbsUp,
    Download,
    Bell,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import moment from 'moment'

export interface videoByIdProps {
    _id: string,
    thumbnail: { url: string },
    videoFile: { url: string }
    title: string,
    description: string,
    views: number,
    duration: number,
    owner: string,
    createdAt : string,
    ownerDetails: {
        id: string,
        avatar: { url: string },
        username: string
    },
}

const YouTubeWatchPage = () => {
    const { id } = useParams()
    const [video, setVideo] = useState<videoByIdProps>()


    useEffect(() => {
        const getVideoById = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/videos/watch/${id}`, { withCredentials: true })
                if (response && response.data) {
                    setVideo(response.data.data[0])
                }
            } catch (error) {
                console.log("cannot get the please try again", error)
            }
        }

        getVideoById()
    }, [id])

    const createdAt = video?.createdAt;
    const relativeTime = moment(createdAt).fromNow();


    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1800px] mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Video Player */}
                        ${!video ? (
                            <div className="aspect-video rounded-xl overflow-hidden ">
                                <div className="flex justify-center items-center h-full space-x-3 mb-6">
                                    <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
                                    <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-video rounded-xl overflow-hidden bg-black">
                                <ReactPlayer
                                    url={video?.videoFile.url || ""}
                                    width={"100%"}
                                    height={'100%'}
                                    controls={true}
                                />
                            </div>
                        )}
                        {/* Video Info */}
                        <div className="space-y-4">
                            <h1 className="text-xl font-bold">{video?.title}</h1>

                            <div className="flex items-center justify-between flex-wrap gap-4">
                                {/* Channel Info */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src={video?.ownerDetails.avatar.url}
                                        alt="Channel Avatar"
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <h3 className="font-bold">{video?.ownerDetails.username}</h3>
                                        <p className="text-sm text-gray-400">2.5M subscribers</p>
                                    </div>
                                    <button className="bg-gray-900 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700">
                                        Subscribe
                                    </button>
                                    <Bell className="w-6 h-6 text-gray-400 cursor-pointer" />
                                </div>

                                {/* Video Actions */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-base-200 hover:bg-base-300 rounded-full">
                                        <button className="flex items-center gap-2 px-4 py-2  ">
                                            <ThumbsUp className="w-5 h-5" />
                                            <span>250K</span>
                                        </button>
                                    </div>
                                    <button className="flex items-center gap-2 bg-base-200  hover:bg-base-300  px-4 py-2  rounded-full">
                                        <Download className="w-5 h-5" />
                                        <span>Download</span>
                                    </button>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white  rounded-xl p-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <span>{video?.views} views</span>
                                    <span>•</span>
                                    <span>{relativeTime}</span>
                                </div>
                                <p className="mt-2 text-sm">
                                    {video?.description}
                                </p>
                                <button className="text-sm text-gray-400 mt-2">Show more</button>
                            </div>
                        </div>
                    </div>

                    {/* Up Next Videos */}
                    <div className="space-y-4">
                        <h1 className='font-semibold md:text-xl text-lg '>Up Next</h1>
                        {[1, 2, 3, 4, 5].map((i, index) => (
                            <div key={index} className="flex gap-2">
                                <div className="flex-shrink-0 w-40 aspect-video bg-gray-800 rounded-xl overflow-hidden">
                                    <figure>
                                        <img
                                            src={`https://images.unsplash.com/photo-${1580000000000 + i}?w=240&h=135&fit=crop`}
                                            alt="Thumbnail"
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    </figure>
                                </div>
                                <div>
                                    <h3 className="font-medium line-clamp-2">Suggested Video Title {i}</h3>
                                    <p className="text-sm text-gray-400 mt-1">Channel Name</p>
                                    <p className="text-sm text-gray-400">
                                        {i} days ago
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YouTubeWatchPage;

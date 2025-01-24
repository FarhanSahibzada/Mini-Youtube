import axios from 'axios';
import {
    Bell,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment'
import { videoType } from './Home';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/Store';

export interface videoByIdProps {
    _id: string,
    thumbnail: { url: string },
    videoFile: { url: string }
    title: string,
    description: string,
    views: number,
    duration: number,
    owner: string,
    createdAt: string,
    ownerDetails: {
        id: string,
        avatar: { url: string },
        username: string,
        isSubcribed: boolean,
        subcriberCount: number
    },
}
export interface playlistType {
    name: string,
    description: string,
    owner: string
    videos: Array<videoType>
}

const YouTubeWatchPage = () => {
    const { id } = useParams()
    const [video, setVideo] = useState<videoByIdProps>()
    const [playlistVideo, setPlaylistVideo] = useState<playlistType | null>(null)
    const [NextVideos, setNextVideos] = useState<Array<videoByIdProps>>([])
    const playlistData = useSelector((state: RootState) => state.playlist.currentPlaylist)
    const [newVideo, setNewVideo] = useState<videoByIdProps | null>(null)
    const [subcribeBtn, setSubcribeBtn] = useState<boolean>(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (playlistData) {
            setPlaylistVideo(playlistData);
        }
    }, [playlistData]);



    useEffect(() => {
        const getVideoById = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/videos/watch/${id}`, { withCredentials: true })
                if (response && response.data) {
                    const data = response.data?.data[0]
                    setVideo(response.data.data[0])
                    setSubcribeBtn(data?.ownerDetails?.isSubcribed)
                }
            } catch (error) {
                console.log("cannot get the please try again", error)
            }
        }
        getVideoById()
    }, [id])

    useEffect(() => {
        const NextVideo = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/videos/`, { withCredentials: true })
                if (response && response.data) {
                    setNextVideos(response.data.data.docs)

                }
            } catch (error) {
                console.log("can't fetch the next videos", error)
            }
        }

        NextVideo();
    }, [])

    const handleOnClick = async (item: videoByIdProps) => {
        if(item.ownerDetails.username == video?.ownerDetails.username || item.ownerDetails.username  ==  newVideo?.ownerDetails.username){
            setNewVideo(item)
        }else{
            setNewVideo(item)
            setSubcribeBtn(item.ownerDetails.isSubcribed)
        }
    }

    const handleSubcribeBtn = async (id: string) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subcriber/toggle-subcriber/${id}`, { withCredentials: true })
            const respnseData = response.data?.data;
            if (respnseData == "Subscribed successfully") {
                setSubcribeBtn(true)
            } else if (respnseData == "Unsubscribed successfully") {
                setSubcribeBtn(false)
            }
        } catch (error) {
            console.log("error on subcribe button", error)
        }
    }

    return (
        <div className="min-h-screen ">
            <div className="max-w-[1800px] mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4 bg-white">
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
                                    url={newVideo?.videoFile.url || video?.videoFile.url}
                                    width={"100%"}
                                    height={'100%'}
                                    controls={true}
                                />
                            </div>
                        )}
                        {/* Video Info */}
                        <div className="space-y-4">
                            <h1 className="text-xl font-bold">{newVideo?.title || video?.title}</h1>
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                {/* Channel Info */}
                                <div className="flex items-center gap-4">
                                    <img
                                        src={newVideo?.ownerDetails.avatar.url || video?.ownerDetails.avatar.url}
                                        alt="Channel Avatar"
                                        className="w-10 h-10 rounded-full opacity-100 hover:opacity-80 duration-100 cursor-pointer"
                                        onClick={() => navigate(`/my-profile/${newVideo?.ownerDetails.username || video?.ownerDetails.username}`)}
                                    />
                                    <div>
                                        <h3 className="font-bold opacity-100 hover:opacity-80 duration-100 cursor-pointer"
                                            onClick={() => navigate(`/my-profile/${newVideo?.ownerDetails.username || video?.ownerDetails.username}`)}
                                        >{newVideo?.ownerDetails.username || video?.ownerDetails.username} </h3>
                                        <p className="text-sm text-gray-400">{ }</p>
                                    </div>
                                    <button className={`${subcribeBtn ? "bg-base-200 text-gray-900" : "bg-gray-900 text-white"} px-4 py-2 duration-200 rounded-full font-medium opacity-100 hover:opacity-80`}
                                        onClick={() => handleSubcribeBtn(newVideo?.owner || video?.owner || "")}
                                    >
                                        {subcribeBtn ? "Subcribed" : "Subcribe"}
                                    </button>
                                    <Bell className="w-6 h-6 text-gray-400 cursor-pointer" />
                                </div>

                                {/* Video Actions */}
                                {/* <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-base-200 hover:bg-base-300 rounded-full">
                                        <button className="flex items-center gap-2 px-4 py-2  ">
                                            <ThumbsUp className="w-5 h-5" />
                                            <span>250K</span>
                                        </button>
                                    </div>
                                </div> */}
                            </div>

                            {/* Description */}
                            <div className="bg-white  rounded-xl p-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <span>{video?.views} views</span>
                                    <span>•</span>
                                    <span>{moment(video?.createdAt).fromNow()}</span>
                                </div>
                                <p className="mt-2 text-sm">
                                    {video?.description}
                                </p>
                                <button className="text-sm text-gray-400 mt-2">Show more</button>
                            </div>
                        </div>
                    </div>

                    {/* Up Next Videos AND fOR YOU */}
                    <div className="space-y-4">
                        <div className='flex justify-between'>
                            <h1 className='font-semibold md:text-xl text-lg '>Up Next</h1>
                        </div>
                        {playlistVideo && (
                            <>
                                <h1 className='font-semibold text-sm sm:text-base text-neutral-500'>{playlistVideo.name}-Playlist</h1>
                                {playlistVideo?.videos?.map((item, index) => (
                                    <div key={index} className="flex gap-2 hover:scale-[1.1] duration-200 cursor-pointer  "
                                        onClick={() => handleOnClick(item)}>
                                        <div className="flex-shrink-0 w-40 aspect-video bg-gray-800 rounded-xl overflow-hidden">
                                            <figure>
                                                <img
                                                    src={item.thumbnail.url}
                                                    alt="Thumbnail"
                                                    className="w-full h-full object-cover rounded-xl "
                                                />
                                            </figure>
                                        </div>
                                        <div>
                                            <h3 className="font-medium line-clamp-2 ">{item.title}</h3>
                                            <p className="text-sm text-gray-400 mt-1">{video?.ownerDetails.username}</p>
                                            <p className="text-sm text-gray-400">
                                                {moment(item.createdAt).fromNow()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                        <h1 className='font-semibold text-sm sm:text-base text-neutral-500'>For You</h1>
                        {NextVideos?.map((item, index) => (
                            <div key={index} className="flex gap-2 hover:scale-[1.1] duration-200 cursor-pointer hover:bg-base-200" onClick={() => handleOnClick(item)}>
                                <div className="flex-shrink-0 w-40 aspect-video bg-gray-800 rounded-xl overflow-hidden">
                                    <figure>
                                        <img
                                            src={item.thumbnail.url}
                                            alt="Thumbnail"
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                    </figure>
                                </div>
                                <div>
                                    <h3 className="font-medium line-clamp-2">{item.title}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{item.ownerDetails.username}</p>
                                    <p className="text-sm text-gray-400">
                                        {moment(item.createdAt).fromNow()}
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

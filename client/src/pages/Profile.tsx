import Home from '@/components/Profile.tabs/Home';
import Playlist from '@/components/Profile.tabs/Playlist';
import Videos from '@/components/Profile.tabs/Videos';
import { Bell, UserCheck2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { videoType } from './Home';
import axios from 'axios';
import { useParams } from 'react-router-dom';


export interface userProfileType {
    _id: string,
    username: string,
    subcriberCount: number,
    isSubcribed: boolean,
    avatar: { url: string },
    coverImage: { url: string },
    email: string,
}

export default function Profile() {
    const [currentTab, setCurrentTab] = useState('Home');
    const tabs = ['Home', 'Videos', 'Playlist'];
    const [userProfile, setUserProfile] = useState<userProfileType>()
    const [videoList, setVideoList] = useState<Array<videoType>>([])
    const [subcribeBtn, setSubcribeBtn] = useState<boolean>(false)
    const { username } = useParams()


    useEffect(() => {
        const getuserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/channel/${username}`, { withCredentials: true })
                if (response && response.data) {
                    const data = response.data?.data;
                    setUserProfile(data)
                    setSubcribeBtn(data?.isSubcribed)
                }
            } catch (error) {
                console.log("cannot get the Please try again ", error)
                alert("Refresh the Page")
            }
        }
        getuserData()
    }, [username])


    useEffect(() => {
        if (userProfile?._id) {
            const getVideos = async () => {

                try {
                    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/videos?userId=${userProfile?._id}`, { withCredentials: true })
                    if (response && response.data) {
                        setVideoList(response.data.data?.docs)
                    }
                } catch (error) {
                    console.log("cannot get the Please try again ", error)
                    alert("Refresh the Page")
                }
            }
            getVideos()
        }
    }, [userProfile])



    const RenderTab = () => {
        switch (currentTab) {
            case 'Home':
                return <Home data={videoList} />;
            case 'Videos':
                return <Videos data={videoList} />;
            case 'Playlist':
                return <Playlist id={userProfile?._id || ""} />;
            default:
                return <div>No content available</div>;
        }
    }

    const handleSubcribedBtn = async (id: string) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/subcriber/toggle-subcriber/${id}`, { withCredentials: true })
            const respnseData = response.data?.data;
            if (respnseData == "Subscribed successfully") {
                setSubcribeBtn(true)
            } else if (respnseData == "Unsubscribed successfully") {
                setSubcribeBtn(false)
            }
        } catch (error) {
            console.log("subcribed btn error ", error)
        }
    }

    return (
        <div className="w-full">
            {/* Banner */}
            <div className="w-full h-[200px] bg-gradient-to-r from-gray-400 to-gray-900">
                {userProfile?.coverImage?.url && (
                    <img src={userProfile?.coverImage.url} alt="" className='w-full h-full object-cover' />
                )}
            </div>

            {/* Profile Info Section */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full overflow-hidden -mt-8 ring-8 ring-white">
                        <img
                            src={userProfile?.avatar.url || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"}
                            alt="Channel Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Channel Info */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{userProfile?.username.charAt(0).toUpperCase()}{userProfile?.username.slice(1)}</h1>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <span className="font-medium">{userProfile?.email}</span>
                            <span>•</span>
                            <span>{userProfile?.subcriberCount} subscribers</span>
                            <span>•</span>
                            <span>{videoList.length} Videos</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 items-center">
                        <button className={`flex items-center gap-2  px-4 py-2 ${subcribeBtn ? "bg-slate-200 text-black" : "bg-black text-white"}
                         duration-250 rounded-full opacity-100 hover:opacity-80`}
                            onClick={() => handleSubcribedBtn(userProfile?._id || "")}
                        >
                            {subcribeBtn ? (
                                <>
                                    <Bell size={20} />
                                    <span>Subscribed</span>

                                </>
                            ) : (
                                <>
                                    <UserCheck2 size={20} />
                                    <span>Subscribe</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4">
                    <nav className="flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${tab === currentTab
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                                    }`}
                                onClick={() => setCurrentTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Render Selected Tab */}
            <div className="max-w-6xl mx-auto px-4 py-4">{RenderTab()}</div>
        </div>
    );
}


import Home from '@/components/Profile.tabs/Home';
import Playlist from '@/components/Profile.tabs/Playlist';
import Videos from '@/components/Profile.tabs/Videos';
import { RootState } from '@/store/Store';
import { Bell, UserCheck2 } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function Profile() {
    const [currentTab, setCurrentTab] = useState('Home');
    const tabs = ['Home', 'Videos', 'Playlist'];

    const RenderTab = () => {
        switch (currentTab) {
            case 'Home':
                return <Home />;
            case 'Videos':
                return <Videos />;
            case 'Playlist':
                return <Playlist />;
            default:
                return <div>No content available</div>;
        }
    };
    const userData = useSelector((state : RootState) => state.auth.userLogin)
  
    return (
        <div className="w-full">
            {/* Banner */}
            <div className="w-full h-[200px] bg-gradient-to-r from-gray-400 to-gray-900">
                {userData?.coverimage && (
                    <img src={userData?.coverimage} alt="" className='w-full h-full object-cover' />
                )}
            </div>

            {/* Profile Info Section */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full overflow-hidden -mt-8 ring-8 ring-white">
                        <img
                            src= {userData?.avatar ||"https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"}
                            alt="Channel Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Channel Info */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{userData?.username}</h1>
                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <span className="font-medium">{userData?.email}</span>
                            <span>•</span>
                            <span>1.2M subscribers</span>
                            <span>•</span>
                            <span>420 videos</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            Creating awesome tech content since 2015. New videos every week!
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 items-center">
                        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">
                            <UserCheck2 size={20} />
                            <span>Subscribe</span>
                        </button>
                        <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200">
                            <Bell size={20} />
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
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    tab === currentTab
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

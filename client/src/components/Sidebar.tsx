import { Home,  Clock,  PlaySquare, Menu, User } from 'lucide-react';
import { useState } from 'react';

const menuItems = [
    { icon: Home, label: 'Home' },
    { icon: PlaySquare, label: 'Subscriptions' },
    { icon: Clock, label: 'History' },
    { icon: User, label: 'You'},
];

export default function Sidebar() {
    const [showBar, setShowBar] = useState(false)

    return (

        <div>
            <div className='h-14 bg-white ps-4 hidden sm:inline-block pt-2' onClick={() => setShowBar(!showBar)}>
            <button className="p-2  hover:bg-gray-100 rounded-full" >
                <Menu size={24} />
            </button>
            </div>
            <aside className={`${!showBar ? "sm:w-52 " : "sm:w-0"} w-[100%]   rounded-lg bg-white duration-200  overflow-y-auto overflow-hidden `}>
                <div className="py-2 flex sm:block"  >
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            className="w-full flex items-center gap-6 px-6 py-3 hover:bg-gray-100"
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </aside>
        </div>
    );
}
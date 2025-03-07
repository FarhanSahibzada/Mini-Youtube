import { Search, Video, } from 'lucide-react';
import { Dropdown } from './ProfileDropdown';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem
} from './ui/dropdown-menu';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { setSearchTerm } from '@/store/Userslice';


export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [search, Setsearch] = useState<string>('')

  const handleSearch = () => {
    if (search.length > 0) {
      dispatch(setSearchTerm(search))
      navigate(`search_query/${search.trim()}`)
    }
  }
  function handleSearchh (e : React.KeyboardEvent<HTMLInputElement>){
    
    if(e.key == 'Enter'){
      dispatch(setSearchTerm(search))
      navigate(`search_query/${search.trim()}`)
    }
  }

  return (
    <nav className="bg-white z-50  relative">
      <div className="flex items-center justify-between w-[100%] h-14 px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 hover:bg-base-200 px-4 py-2 rounded-xl " onClick={() => navigate('/Home')}>
            <Video className="text-red-600" size={20} />
            <span className="text-base sm:text-xl font-semibold">YouTube</span>
          </div>
        </div>
        <div className="flex-1 max-w-2xl mx-4 absolute top-16 left-1/2 transform -translate-x-1/2 sm:translate-x-0 sm:top-0 sm:static">
          <div className="flex">
            <input
              type="text"
              placeholder="Search"
              className="min-w-[70%] px-4 py-2 border border-gray-300 rounded-l-full focus:border-blue-500 focus:outline-none"
              value={search}
              onKeyDown={handleSearchh}
              onChange={(e) => Setsearch(e.target.value)}
            />
            <button onClick={handleSearch}
              className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200">
              <Search size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Video size={24} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuContent className='w-40 rounded-xl'>
              <DropdownMenuItem className='rounded-xl' onClick={() => navigate('/upload-video')}>Upload Video</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="p-2 hover:bg-gray-100 rounded-full ">
            <Dropdown />
          </button>
        </div>
      </div>
    </nav>

  );
}
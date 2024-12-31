import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RootState } from "@/store/Store"
import { logout } from "@/store/Userslice"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

export function Dropdown() {
    const dispatch = useDispatch()
    const activeUser = useSelector((state: RootState) => state.auth.userLogin)
    const navigate = useNavigate()

    const handleLogoutbtn = async () => {
        try {
            const userLogout = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/logout`,
                {},
                { withCredentials: true }
            )
            if (userLogout.status == 200) {
                dispatch(logout())
                navigate('/sign-in')
            } else {
                console.log("can't logout user")
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="w-12 h-12 rounded-full  ">
                    <img src={activeUser?.avatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop'}
                        alt="" className='w-full h-full object-cover rounded-full' />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 rounded-xl">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <Link to={'/my-profile'}>
                        <DropdownMenuItem >
                            Profile
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                        Settings
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogoutbtn}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
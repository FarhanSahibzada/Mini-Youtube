import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "./components/Navber"
import Sidebar from "./components/Sidebar"
import { useDispatch, } from "react-redux"
import axios, { AxiosError } from "axios"
import { userLogin } from "./store/Userslice"

function App() {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const getuser = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/current-user`, { withCredentials: true })
        if (response && response.data) {

          const user = response.data.data;
          dispatch(userLogin(user));
          navigate("/Home");
        } else {
          console.warn("No user found, redirecting to sign-in...");
          navigate("/sign-in");
        }
      } catch (error: unknown) {
        console.error("Error in front-end can't get user:");
        if (error instanceof AxiosError) {
          if (error.response?.status == 401) {
            navigate('/sign-in')
          }
        }
      } finally {
        setLoading(false); // Reset loading state in both success and error cases
      }
    }
    getuser()
  }, [dispatch, navigate])

  return !loading ? (
    <div className='flex gap-1 flex-col-reverse sm:flex-row  overflow-hidden bg-white'>
      <div>
        <Sidebar />
      </div>
      <div className='w-full'>
        <Navbar />
        <Outlet />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-slate-400 to-base-300 backdrop-blur-lg bg-white/30">
      <div className="flex space-x-3 mb-6">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce delay-100"></div>
        <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  )
}

export default App
import { useCallback, useEffect, useState } from "react"
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

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/users/current-user`, {
        withCredentials: true,
      });
      if (response && response.data) {
        dispatch(userLogin(response.data?.data));
        navigate("/Home");

      }
    } catch (error) {
      console.log("Error fetching current user:", error);
      throw error;
    }
  }, [dispatch, navigate, BACKEND_URL]);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/users/refresh-token`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.log("Error refreshing token:", error);
      throw error;
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      try {
        await fetchUser();
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404 || error.response?.status === 401) {
            console.log("Access token expired. Attempting to refresh token...");
            try {
              const isRefreshed = await refreshAccessToken();
              if (isRefreshed) {
                await fetchUser();
              }
            } catch (refreshError) {
              console.log("No user found. Please login.", refreshError);
              navigate("/sign-in");
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };
    getUserData();
  }, [navigate, dispatch, fetchUser, refreshAccessToken]);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-slate-200 to-base-300 backdrop-blur-lg bg-white/30">
      <div className="flex space-x-3 mb-6">
        <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce delay-100"></div>
        <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  )
}

export default App
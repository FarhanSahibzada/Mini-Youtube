import { useState } from "react"
import Navbar from "./components/Navber"
import Sidebar from "./components/Sidebar"
import { Outlet } from "react-router-dom"

function App() {
  const [loading, setLoading] = useState(false)

  return !loading ? (
    <div className='flex gap-1 flex-col-reverse sm:flex-row bg-base-200  overflow-hidden'>
      <div>
        <Sidebar />
      </div>
      <div className='w-full'>
        <Navbar />
        <Outlet />
      </div>
    </div>

  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-slate-400 to-base-300">
      <div className="flex space-x-3 mb-6">
        <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-100"></div>
        <div className="w-4 h-4 bg-white rounded-full animate-bounce delay-200"></div>
      </div>
      {/* <h1 className="text-white text-2xl font-semibold animate-pulse">Please Wait...</h1> */}
    </div>
  )
}

export default App
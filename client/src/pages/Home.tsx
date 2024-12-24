import Navbar from "@/components/Navber";
import Sidebar from "@/components/Sidebar";


export default function Home() {
  return (
    <div className='flex gap-1 flex-col-reverse sm:flex-row bg-base-200  overflow-hidden'>
       <div>
         <Sidebar />
       </div>
       <div className='w-full'>
         <Navbar />
       </div>
     </div>
  )
}

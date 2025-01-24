import { videoType } from "@/pages/Home"
import axios from "axios"
import { Plus } from "lucide-react"

interface historyCardProps {
    item: videoType,
    fun: (id: string) => void
}


export default function HistoryCard({ item , fun }: historyCardProps) {

    const handleDeletHistory = async (id: string) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/delet-history/${id}`, {}, { withCredentials: true })
            if (response.status == 200) {
                console.log("suessfull deleted")
                fun(id)
            }
        } catch (error) {
            console.log("error when delet the history ", error)

        }
    }

    return (
        <div className="w-full mb-3">
            <div className="w-full md:w-[80%] bg-white  flex gap-2 ">
                <figure  className="w-[350px]  h-[150px] md:w-[80%]  md:h-[220px]  rounded-xl">
                    <img src={item.thumbnail.url} alt=""
                        className="w-full rounded-xl"
                    />
                </figure>
                <div className="w-full px-2 ">
                    <div className="flex justify-between">
                        <h1 className="text-base md:text-lg text-gray-900 font-semibold mb-1">{item.title.slice(0,25)}</h1>
                        <h1 className="flex justify-center items-center p-2 -mt-2  hover:bg-base-300 rounded-full duration-100
                 cursor-pointer" onClick={() => handleDeletHistory(item._id)}
                        ><Plus size={20} strokeWidth={2.25} /></h1>
                    </div>
                    <h1 className="text-sm md:text-base text-neutral-500 mb-2">{item.ownerDetails.username}- {item.views}- views</h1>
                    <p className="text-sm md:text-base mb-1" >{item.description.slice(0,70)}...</p>
                </div>
            </div>
        </div>
    )
}

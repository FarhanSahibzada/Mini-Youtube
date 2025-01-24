import { videoType } from "@/pages/Home"

interface searchCardProps {
    item : videoType
}

export default function SearchCard({item} : searchCardProps) {

    return (
        <div className="w-full mb-5">
            <div className="min-w-full md:w-[80%] bg-white  flex gap-2 justify-start ">
                <figure>
                    <img src={item.thumbnail.url} alt=""
                        className="w-[350px]  h-[150px] md:w-[900px]  md:h-[220px] md:object-cover rounded-xl"
                    />
                </figure>
                <div className="w-full ps-2">
                    <div className="flex justify-between">
                        <h1 className="text-base md:text-lg text-gray-900  font-normal sm:font-semibold mb-1
                        ">{item.title}</h1>
                    </div>
                    <h1 className="text-sm md:text-base text-neutral-500 mb-2">{item.ownerDetails.username}- {item.views}- views</h1>
                    <p className="text-sm md:text-base mb-1" >{item.description.slice(0,70)}...</p>
                </div>
            </div>
        </div>
    )
}

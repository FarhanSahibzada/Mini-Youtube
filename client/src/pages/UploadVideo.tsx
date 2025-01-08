import DialogBox from "@/components/DialogBox";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactPlayer from "react-player";
function UploadVideo() {

    const [firstUpload, setFirstUpload] = useState(false);
    const [displayNum, setDisplayNum] = useState<number>(1)

    useEffect(() => {
        // Open the dialog when the component loads
        setFirstUpload(true);
    }, []);


    const { register, handleSubmit } = useForm()
    const onSubmit = async () => {
        console.log("as")
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogBox title="Upload Video" isDialogOpen={firstUpload} setIsDialogOpen={setFirstUpload} children={
                    <div className={`flex ${displayNum == 1 ? 'justify-center' : "justify-start"}  min-h-full w-full `}>
                        {displayNum == 1 && (
                            <div className="my-10 flex flex-col  items-center ">
                                <label htmlFor="Video" className="bg-base-200 flex items-center justify-center rounded-full w-32 h-32 border-4 border-transparent hover:border-white hover:shadow-lg  transition-shadow">
                                    <Upload size={38} />
                                </label>
                                <input
                                    id="Video"
                                    type="file"
                                    accept="video/*"
                                    style={{ display: 'none' }}
                                    {...register('Videos', { required: 'Video is Requried' })}
                                />
                                <div className="text-center mt-4 ">
                                    <h1 className="font-semibold ">Drop your video file to upload </h1>
                                    <h1 className="font-semibold mt-1 text-sm text-neutral-400">
                                        Your Videos will be private untill you publish them .
                                    </h1>
                                </div>
                            </div>
                        )}
                        {displayNum == 2 && (
                            <div className="w-full">
                                <div className="w-full flex flex-col items-center sm:items-start sm:justify-between sm:flex-row gap-4" >
                                    <div className="w-full pe-2 mt-3">
                                        <h1 className="font-bold text-xl mb-2 ">Details</h1>
                                        <textarea
                                            className="w-full pt-2 h-16 bg-transparent border-2 border-gray-600 focus:outline-gray-900 text-black text-base rounded-xl px-3 py-0 text-start"
                                            placeholder="Title"
                                            {...register("videoTitle", { required: "Title is required" })}
                                        />

                                        <textarea
                                            className="w-full h-28 mt-4 bg-transparent border-2 border-gray-600 focus:outline-gray-900 text-black text-base rounded-xl px-3 py-2 text-start"
                                            placeholder="Description"
                                            {...register("videoDescription", { required: "Description is required" })}
                                        />
                                    </div>
                                    <div className="rounded-xl bg-white mt-10" style={{ width: "320px", height: "180px" }}>
                                        <ReactPlayer
                                            url={"https://www.youtube.com/watch?v=JZjAg6fK-BQ"}
                                            width={"320x"}
                                            height={'180px'}
                                            controls={true}
                                        />
                                    </div>
                                </div>
                            </div>
                            /// playlist backend and front-end work
                        )}

                        <div className="absolute right-4 bottom-4" onClick={() => setDisplayNum((prev) => prev + 1)}>
                            <button className="bg-gray-900 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700">Next</button>
                        </div>
                    </div>

                } />

            </form>
        </>
    )
}

export default UploadVideo

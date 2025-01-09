import DialogBox from "@/components/DialogBox";
import PlaylistDialogBox from "@/components/PlaylistDialogBox";
import PlaylistUi from "@/components/PlaylistUi";
import { RootState } from "@/store/Store";
import axios from "axios";
import { Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";

interface playlistProps {
    name: string,
    description: string,
    _id: string,
    owner: string
}
interface temperoryVideo {
    name: string,
    url: string
}

function UploadVideo() {

    const [firstUpload, setFirstUpload] = useState(false);
    const [displayNum, setDisplayNum] = useState<number>(1)
    const UserData = useSelector((state: RootState) => state.auth.userLogin)
    const [playlists, setPlaylists] = useState<Array<playlistProps>>([])
    const [playlistDialog, setPlaylistDialog] = useState(false)
    const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
    const [videoPreview, setVideoPreview] = useState<temperoryVideo | null>(null)
    const { register, handleSubmit } = useForm()

    useEffect(() => {
        setFirstUpload(true);
    }, []);

    function handleUi() {
        if (displayNum > 1) {
            setDisplayNum(0)
            setFirstUpload(false)
        } else {
            setDisplayNum((prev) => prev + 1)
        }
        if (displayNum == 1) {
            handlePlaylistApi()
        }

    }

    const handlePlaylistApi = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/playlist/${UserData?._id}`, { withCredentials: true })
            if (response && response.data) {
                setPlaylists(response.data.data)
            }
        } catch (error) {
            console.log("cannot get the playlist", error)
        }
    }

    const handlePlaylistClick = (id: string) => {
        setSelectedPlaylists((prev) =>
            prev.includes(id) ? prev.filter((playlistId) => playlistId !== id) : [...prev, id]
        )
        setPlaylistDialog(false)

    }
    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setVideoPreview({ name: file.name, url: previewUrl });

        }
    }

    const onSubmitt = async (data: FieldValues) => {
        const formdata = new FormData();
        const videoFile = data.videoFile[0];
        const thumbnailFile = data.thumbnail[0];
        if (videoFile) formdata.append('videoFile', videoFile);
        if (thumbnailFile) formdata.append('thumbnail', thumbnailFile);
        formdata.append('title', data.videoTitle);
        formdata.append('description', data.videoDescription);
       

    }

    return (
        <>
            <DialogBox title="Upload Video" isDialogOpen={firstUpload} setIsDialogOpen={setFirstUpload} children={
                <form onSubmit={handleSubmit(onSubmitt)}>
                    <div className={`flex ${displayNum == 1 ? 'justify-center' : "justify-start"}  min-h-full w-full `}>
                        {/* step 1 video upload */}
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
                                    {...register('videoFile', { required: 'Video is Requried' })}
                                    onChange={(e) => {
                                        register('videoFile').onChange(e);
                                        handleVideoUpload(e);
                                    }}
                                />
                                <div className="text-center mt-4 ">
                                    <h1 className="font-semibold ">Drop your video file to upload </h1>
                                    <h1 className="font-semibold mt-1 text-sm text-neutral-400">
                                        Your Videos will be private untill you publish them .
                                    </h1>
                                </div>
                            </div>
                        )}
                        {/* step 2 details  */}
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
                                        <div className="mt-2">
                                            <h1 className="text-lg font-semibold mt-2">Thumbnail</h1>
                                            <div className="mt-3">
                                                <label htmlFor="image" className=' cursor-pointer hover:opacity-35 bg-gray-900 font-semibold px-2 py-1.5 text-white
                                                rounded-2xl 
                                                '> Upload Thumbnail
                                                </label>
                                                <input
                                                    id="image"
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                    {...register('thumbnail', { required: "thumbnail is requried " })}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <h1 className="font-semibold text-lg">Playlist</h1>
                                            <div className="flex items-center gap-2 mt-3">
                                                <div className="dropdown dropdown-top ">
                                                    <div tabIndex={0} role="button" className="btn  bg-transparent border-2 border-base-300">Select Playlist</div>
                                                    <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-[1] w-52 p-2 shadow">
                                                        {playlists.map((item, index) => (
                                                            <li key={index}>
                                                                <label className="cursor-pointer label">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="checkbox checkbox-secondary"
                                                                        onChange={() => handlePlaylistClick(item._id)}
                                                                        checked={selectedPlaylists.includes(item._id)}
                                                                    />
                                                                    <span className="label-text font-semibold">{item.name}</span>
                                                                </label>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="">
                                                    <h1 className="bg-transparent cursor-pointer rounded-xl
                                                     border-2 border-base-300 p-2 font-semibold"
                                                        onClick={() => setPlaylistDialog(true)}
                                                    >Create New Playlist</h1>
                                                    <PlaylistDialogBox title="Create a new Playlist" isDialogOpen={playlistDialog}
                                                        setIsDialogOpen={setPlaylistDialog} children={
                                                            <PlaylistUi onPlaylistCreated={handlePlaylistClick} />
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-10 " >
                                        {videoPreview ? (
                                            <div className="bg-base-200 rounded-xl">
                                                <div className="rounded-2xl bg-black overflow-hidden " style={{ width: "320px", height: "180px" }}>
                                                    <ReactPlayer
                                                        url={videoPreview.url} // Use the preview URL
                                                        width="100%"
                                                        height="100%"
                                                        controls={true}
                                                    />

                                                </div>
                                                <div>
                                                    <div className="mt-4 mb-2 p-4 ">
                                                        <span className="text-gray-600">FileName:</span>
                                                        <span className="font-semibold"> {videoPreview.name}</span>
                                                        </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-center">No video uploaded yet</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                        )}
                        <div className="absolute right-28 bottom-4" >
                            <button onClick={handleUi} type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700">
                                Next
                            </button>
                        </div>
                        <div className="absolute right-4 bottom-4" >
                            <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700">
                                Publish
                            </button>
                        </div>
                    </div>
                </form >
            } />

        </>
    )
}

export default UploadVideo

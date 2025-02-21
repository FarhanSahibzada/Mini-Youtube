import { videoType } from "@/pages/Home";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import PlaylistDialogBox from "../PlaylistDialogBox";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import { AlertBox } from "../AlertBox";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";

interface VideosProps {
    data: videoType
}
interface errortype {
    title: string,
    description: string
}
interface alertData {
    title?: string,
    content?: string
}

export default function SettingVideoCard({ data }: VideosProps) {
    const [videoList, setVideoList] = useState<videoType>()
    const [updateDialog, setUpdateDialog] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<errortype>()
    const [alertContent, setAlertContent] = useState<alertData>({})
    const [showAlert, setShowAlert] = useState(false)
    const navigate = useNavigate()
    const userId  = useSelector((state : RootState)=> state.auth.userLogin)

    useEffect(() => {
        setVideoList(data)
    }, [data])

    const handleUpdateVideo = async (values: FieldValues, id: string) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/videos/update/${id}`,
                values, { withCredentials: true })
            if (response && response.data) {
                setShowAlert(true)
                setAlertContent({ title: "Video Updated", content: "Video is Successfully Updated!" })
            }
        } catch (error) {
            console.log("cannot set the data", error)
            setShowAlert(true)
            setAlertContent({ title: "Video Updated", content: "Error Please Try again" })
        } finally {
            setUpdateDialog(false)
        }
    }

    const handleVideoDelet = async (id: string) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/videos/delet/${id}`, { withCredentials: true })
            if (response && response.data) {
                setShowAlert(true)
                setAlertContent({ title: "Video Updated", content: "Video is Successfully Delet" })
                navigate(`/my-profile/${userId?._id}`)
            }
        } catch (error) {
            console.log("error on delet the video", error)
            setShowAlert(true)
            setAlertContent({ title: "Video Updated", content: "Video is Successfully Delet" })
        }
    }
    return (
        <>
            {showAlert && <AlertBox
                title={alertContent.title || ""}
                content={alertContent.content || ""}
                isOpen={showAlert}
                setIsOpen={setShowAlert}
            />}
            <PlaylistDialogBox title="Update Video"
                isDialogOpen={updateDialog}
                setIsDialogOpen={setUpdateDialog}
                children={
                    <form onSubmit={handleSubmit((event) => handleUpdateVideo(event, data._id))}>
                        <div className="w-full pe-2 mt-3 mb-3">
                            <h1 className="font-bold text-xl mb-2 ">Details</h1>
                            <textarea
                                className="w-full pt-2 h-16 bg-transparent border-2 border-gray-600 focus:outline-gray-900 text-black text-base rounded-xl px-3 py-0 text-start"
                                placeholder="Add Title"
                                {...register("title", { required: "new title is required" })}
                            />
                            {errors.title && (
                                <p className="my-2 text-red-500">{errors.title.message}</p>
                            )}
                            <textarea
                                className="w-full h-28 mt-4 bg-transparent border-2 border-gray-600 focus:outline-gray-900 text-black text-base rounded-xl px-3 py-2 text-start"
                                placeholder="Add Description"
                                {...register("description", { required: "new description is required" })}
                            />
                            {errors.description && (
                                <p className="my-2 text-red-500">{errors.description.message}</p>
                            )}
                        </div>
                        <div className="text-right" >
                            <button type="submit"
                                className="bg-gray-900 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700">
                                Save</button>
                        </div>
                    </form>
                }
            />
            <Card className="w-[80%]] h-full">
                <CardHeader>
                    <CardTitle>Video Detail</CardTitle>
                    <CardDescription>
                        Update your Video settings. Set your preferred title and description.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col justify-center md:flex-row gap-4">
                        <figure className="w-[100%] md:w-[50%] p-1">
                            <img src={videoList?.thumbnail.url} alt=""
                                className="w-full h-full rounded-xl"
                            />
                        </figure>
                        <div className="w-full text-lg font-semibold">
                            <p className="">{videoList?.title}</p>
                            <p className="mt-2 text-neutral-500">{videoList?.description.slice(0, 100)}...</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-end gap-2 ">
                        <Button
                            onClick={() => setUpdateDialog(true)}
                            className="py-2 px-3.5 mt-3 bg-gray-800 text-white text-sm font-semibold"
                        >
                            Update
                        </Button>
                        <Button
                            onClick={() => handleVideoDelet(data._id)}
                            className="py-2 px-3.5 mt-3 bg-gray-800 text-white text-sm font-semibold"
                        >
                            Delet
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </>
    )
}

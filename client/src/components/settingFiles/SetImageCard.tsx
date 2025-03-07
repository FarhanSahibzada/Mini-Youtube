import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { FieldValues, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/Store'
import { Button } from '../ui/button'
import axios from 'axios'
import { AlertBox } from '../AlertBox'

interface alertData {
    title?: string,
    content?: string
}

export default function SetImageCard() {
    const { register, handleSubmit } = useForm()
    const [avatar, setAvatar] = React.useState<string>('')
    const [cover, setCover] = React.useState<string>('')
    const [alertContent, setAlertContent] = useState<alertData>({})
    const [showAlert, setShowAlert] = useState(false)
    const userData = useSelector((state: RootState) => state.auth.userLogin)

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setAvatar(previewUrl)
        }
    }

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setCover(previewUrl)
        }
    }
    const onSubmitForm = async (data: FieldValues) => {
        if (avatar.length > 0) {
            const Avatar = new FormData();
            Avatar.append('avatar', data?.avatar[0])
            try {
                const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/update-avatar`,
                    Avatar, { withCredentials: true })
                if (response && response.data) {
                    setShowAlert(true)
                    setAlertContent({ title: "profile Updated", content: "Profile is Successfully Updated!" })
                }
            } catch (error) {
                console.log("error", error)
                setShowAlert(true)
                setAlertContent({ title: "profile Updated", content: "Error Try Again" })
            }
        }
        if (cover.length > 0) {
            const coverimage = new FormData();
            coverimage.append('coverImage', data?.coverImage[0])
            try {
                const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/update-coverImage`,
                    coverimage, { withCredentials: true })
                if (response && response.data) {
                    setShowAlert(true)
                    setAlertContent({ title: "profile Updated", content: "Profile is Successfully Updated!" })
                }
            } catch (error) {
                console.log("error", error)
                setShowAlert(true)
                setAlertContent({ title: "profile Updated", content: "Error Try Again" })
            }
        }
    }


    return (
        <>
            {showAlert && <AlertBox title={alertContent.title || ""} content={alertContent.content || ""}
                isOpen={showAlert}
                setIsOpen={setShowAlert}
            />}
            <Card id='#ImageCard' className='w-full'>
                <CardHeader>
                    <CardTitle>Images Details</CardTitle>
                    <CardDescription>
                        Update your account settings. Set your preferred Avatar and CoverImage.
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <div className='w-full flex flex-col items-start'>
                            <div className='flex  flex-col items-start w-full mb-3'>
                                <label htmlFor="cover" className='cursor-pointer hover:opacity-35 w-full'>
                                    <img src={cover || userData?.coverImage?.url} alt="" className='w-[80%] rounded-xl h-[170px] border-2 border-red-500  object-cover' />
                                </label>
                                <input
                                    id="cover"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    {...register('coverImage')}
                                    onChange={(e) => {
                                        register('coverImage').onChange(e);
                                        handleCoverUpload(e);
                                    }}
                                />
                                <p className='text-gray-900 font-semibold text-lg'>
                                    CoverImage
                                </p>
                            </div>
                            <div className='flex  flex-col items-center'>
                                <label htmlFor="avatar" className='cursor-pointer hover:opacity-35 '>
                                    <img src={avatar || userData?.avatar.url} alt="" className='w-[120px] rounded-full h-[120px] border-2 border-red-500 ' />
                                </label>
                                <input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    {...register('avatar')}
                                    onChange={(e) => {
                                        register('avatar').onChange(e);
                                        handleAvatarUpload(e);
                                    }}
                                />
                                <p className='text-gray-900 font-semibold text-lg'>
                                    Avatar
                                </p>
                            </div>
                        </div>
                        <Button
                            type='submit'
                            className="py-2 px-3.5 mt-3 bg-gray-800 text-white text-sm font-semibold"
                        >
                            Save changes
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

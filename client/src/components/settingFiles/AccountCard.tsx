import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store/Store"
import { FieldValues, useForm } from "react-hook-form"
import axios from "axios"
import { userLogin } from "@/store/Userslice"
import { useState } from "react"
import { AlertBox } from "../AlertBox"

interface setAccountProps {
  username: string,
  email: string,
}
interface alertData {
  title?: string,
  content?: string
}

const AccountCard = () => {
  const userData = useSelector((state: RootState) => state.auth.userLogin)
  const dispatch = useDispatch()
  const [showAlert, setShowAlert] = useState(false)
  const [alertContent, setAlertContent] = useState<alertData>({})
  const { register, handleSubmit, formState: { errors } } = useForm<setAccountProps>()
  const setUserInformation = async (data: FieldValues) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/update-details`, data, { withCredentials: true })
      if (response && response.data) {
        const data = response.data?.data;
        dispatch(userLogin(data))
        setShowAlert(true)
        setAlertContent({ title: "profile Updated", content: "profile is successfully updated!" })
      }
    } catch (error) {
      console.log('cant set the data of the user', error)
      setShowAlert(true)
      setAlertContent({ title: "profile Updated", content: "Error" })
    }
  }

  return (
    <>
      {showAlert && <AlertBox title={alertContent.title || ""} content={alertContent.content || ""} 
      isOpen={showAlert}
      setIsOpen={setShowAlert}
      />}
      <Card id="Account" className="w-full">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>
            Update your account settings. Set your preferred name and email.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(setUserInformation)}>

            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <Input id="name" placeholder="Your name" defaultValue={userData?.username}
                {...register('username', { required: "username is required" })}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="Email">Email</label>
              <Input id="username" type="email" placeholder="Your Email" defaultValue={userData?.email}
                {...register('email', { required: "email is required " })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email?.message}</p>
              )}
            </div>
            <Button
              type='submit'
              className="py-2 px-3.5 mt-4 bg-gray-800 text-white text-sm font-semibold"
            >
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card >
    </>
  )
}

export default AccountCard

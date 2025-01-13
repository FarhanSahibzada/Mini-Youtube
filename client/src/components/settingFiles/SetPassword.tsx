import { FieldValues, useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import axios from 'axios'
import { AlertBox } from '../AlertBox'
import { Button } from '../ui/button'

interface passwordProps {
    oldPassword: string,
    newPassowrd: string
}

export default function SetPassword() {

    const { register, handleSubmit, formState: { errors }, reset } = useForm<passwordProps>()

    const onSubmitForm = async (data: FieldValues) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/change-password`, data, { withCredentials: true })
            if (response && response.data) {
                reset();
                <AlertBox title='Passowrd Update' content='Password is Successfully Updated!.' />
            }
        } catch (error) {
            console.log('cant set the data of the user  ', error)
        }
    }

    return (
        <Card id='#PassowrdCard' className='w-full'>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                    Update your account settings. Set your preferred Passowrd.
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div className="space-y-2 mb-3">
                        <label htmlFor="Old Password">Old Password</label>
                        <Input id="Old Password" placeholder="Your Old Password"
                            {...register('oldPassword', { required: "Old Passoword is required" })}
                        />
                        {errors.oldPassword && (
                            <p className="text-red-500 text-sm">{errors.oldPassword?.message}</p>
                        )}
                    </div>
                    <div className="space-y-2 mb-3">
                        <label htmlFor="email">New Passowrd</label>
                        <Input id="email" placeholder="Your New Password"
                            {...register('newPassowrd', { required: "newPassowrd is required" })}
                        />
                        {errors.newPassowrd && (
                            <p className="text-red-500 text-sm">{errors.newPassowrd?.message}</p>
                        )}
                    </div>
                    <Button
                    type='submit'
                        className="py-2 px-3.5  bg-gray-800 text-white text-sm font-semibold"
                    >
                        Save changes
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

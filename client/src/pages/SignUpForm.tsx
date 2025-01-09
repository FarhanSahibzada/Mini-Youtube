import Input from '@/components/Input'
import dpimage from '@/assest/dp.png'
import { useForm } from 'react-hook-form'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userLogin } from '@/store/Userslice';


interface formData {
    username: string,
    email: string,
    password: string,
}

export default function SignUpForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<formData>()
    const [image, showImage] = useState<string | null>(null)
    const [imagefile, setImagefile] = useState<FileList | null>(null)
    const [imageError, setImageError] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSubmit = async (data: formData) => {
        if (!imagefile) {
            setImageError('Image is Required')
            return
        }
        const databundle = new FormData()
        databundle.append("username", data.username);
        databundle.append("email", data.email);
        databundle.append("password", data.password);
        databundle.append("avatar", imagefile[0]);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/users/register`,
                databundle,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", 
                    },
                    withCredentials: true,

                }
            )
            if (response.status == 200) {
                dispatch(userLogin(response.data.data))
                navigate('/my-profile')
            } else {
                console.log('can t register your account')
            }
        } catch (error) {
            console.log("error when register", error)
            alert(error)
        }
    }


    const handleimage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const imageURL = URL.createObjectURL(files[0]);
            showImage(imageURL);
            setImagefile(files)
        }
    };


    return (
        <div className='flex w-full h-full justify-center items-center min-h-screen  p-2 sm:p-0'>
            <form onSubmit={handleSubmit(onSubmit)} className=' w-full sm:w-[40%] h-auto  bg-white border-4 border-red-400 px-4 py-2  rounded-2xl  shadow-xl'>
                <div className='profilepic flex justify-center items-center flex-col'>
                    <label htmlFor="image" className='cursor-pointer hover:opacity-35 '>
                        <img src={image || dpimage} alt="" className='w-[120px] rounded-full h-[120px] border-2 border-red-500 ' />
                    </label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleimage}
                        style={{ display: 'none' }}
                    />
                    {imageError && (
                        <p className="text-red-500 text-sm">{imageError}</p>
                    )}
                </div>
                <h1 className='text-center mt-2 font-semibold text-xl'>Register Your <span className='text-red-500 font-bold'> Profile </span>
                </h1>

                <div className='mt-4 px-4'>
                    <Input
                        label="Username"
                        placeholder="Enter Your Name"
                        type="text"
                        {...register("username", { required: "Username is required" })}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm">{errors.username.message}</p>
                    )}
                </div>
                <div className='mt-4 px-4'>
                    <Input
                        label="email"
                        placeholder="Enter Your Email"
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Enter a valid email",
                            },
                        })}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                </div>
                <div className='mt-4 px-4'>
                    <Input
                        label="Password"
                        placeholder="Enter Your Passwrd"
                        type="password"
                        {...register("password", {
                            required: "passowrd is required",
                            minLength: { value: 2, message: 'Min length is 2' },
                            maxLength: { value: 8, message: 'Max length is 8' }
                        })}
                    />
                    {errors.password && (
                        <p className='text-red-500 text-sm'>{errors.password.message}</p>
                    )}
                </div>
                <div className='flex justify-end'>
                    <button type='submit' className='text-white  font-semibold  bg-red-500  px-4 py-2
                 rounded-full mt-4  block '
                        disabled={imagefile?.length == 0 ? true : false}
                    >
                        Submit
                    </button>
                </div>
                <div className='flex items-center justify-center gap-1 mt-3 px-4'>
                    <div className="h-[2px] w-full bg-red-500"></div>
                    <h1>OR</h1>
                    <div className="h-[2px] w-full bg-red-500"></div>
                </div>
                <div className="mt-1 text-center">
                    <div className="text-gray-600">
                        Already have an{' '}
                        <Link to="/sign-in">
                            <span className="text-red-500">account? </span>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

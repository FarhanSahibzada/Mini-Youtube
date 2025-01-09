import axios from "axios"
import { FieldValues, useForm } from "react-hook-form"


interface fun {
    onPlaylistCreated: (id: string) => void
}
interface PlaylistFormData {
    name: string;
    description: string;
}

function PlaylistUi({ onPlaylistCreated }: fun) {
    const { register, handleSubmit } = useForm<PlaylistFormData>();

    const onsubmitForm = async (data: FieldValues) => {
        if (!data) {
            console.log("data is required")
            return
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/playlist/create`, data, { withCredentials: true })
            if (response.status == 201) {
                console.log("success");
                console.log(response.data)
                onPlaylistCreated(response.data?.data)
                
            } else {
                console.log('can not make playlist')
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    return (
        <form onSubmit={handleSubmit(onsubmitForm)}>
            <div className="w-full pe-2 mt-3 mb-3">
                <h1 className="font-bold text-xl mb-2 ">Details</h1>
                <textarea
                    className="w-full pt-2 h-16 bg-transparent border-2 border-gray-600 focus:outline-gray-900 text-black text-base rounded-xl px-3 py-0 text-start"
                    placeholder="Add Title"
                    {...register("name", { required: "Title is required" })}
                />
                <textarea
                    className="w-full h-28 mt-4 bg-transparent border-2 border-gray-600 focus:outline-gray-900 text-black text-base rounded-xl px-3 py-2 text-start"
                    placeholder="Add Description"
                    {...register("description", { required: "Description is required" })}
                />
            </div>
            <div className="text-right" >
                <button type='submit'
                    className="bg-gray-900 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700">
                    Create</button>
            </div>
        </form>

    )
}

export default PlaylistUi
import axios from "axios"
import { useState } from "react";

interface fun {
    onPlaylistCreated: (id: string) => void
}


function PlaylistUi({ onPlaylistCreated }: fun) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const onSubmitForm = async () => {
        const data = {
            name: name,
            description: description
        }
        if (!data) {
            console.log("data is required")
            return
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/playlist/create`, data, { withCredentials: true })
            if (response.status == 201) {
                const newPlaylistId = response.data?.data?._id;
                onPlaylistCreated(newPlaylistId);
            } else {
                console.log('can not make playlist')
            }
        } catch (error) {
            console.log("error", error)
        }
    }
    return (
        <div>
            <div className="w-full pe-2 mt-3 mb-3">
                <h1 className="font-bold text-xl mb-2 ">Details</h1>
                <textarea
                    className="w-full pt-2 h-16 bg-transparent border-2 border-gray-600 focus:outline-gray-900 text-black text-base rounded-xl px-3 py-0 text-start"
                    placeholder="Add Title"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <textarea
                    className="w-full h-28 mt-4 bg-transparent border-2 border-gray-600 focus:outline-gray-900 text-black text-base rounded-xl px-3 py-2 text-start"
                    placeholder="Add Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="text-right" >
                <button onClick={onSubmitForm}
                    className="bg-gray-900 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-700">
                    Create</button>
            </div>
        </div>

    )
}

export default PlaylistUi
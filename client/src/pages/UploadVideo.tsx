import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
function UploadVideo() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        // Open the dialog when the component loads
        setIsDialogOpen(true);
    }, []);
    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Upload Video</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center min-h-full w-full ">
                        <div className="my-10 flex flex-col items-center ">
                            <label htmlFor="image" className="bg-base-200 flex items-center justify-center rounded-full w-32 h-32 border-4 border-transparent hover:border-white hover:shadow-lg  transition-shadow">
                                <Upload size={38} />
                            </label>
                            <input
                                id="image"
                                type="file"
                                accept="video/*"
                                style={{ display: 'none' }}
                            />
                            <div className="text-center mt-4 ">
                                <h1 className="font-semibold ">Drop your video file to upload </h1>
                                <h1 className="font-semibold mt-1 text-sm text-neutral-400">
                                    Your Videos will be private untill you publish them .
                                </h1>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <div >Layout</div>
        </>
    )
}

export default UploadVideo
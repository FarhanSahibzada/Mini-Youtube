import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import React from "react"

interface dialogProps {
    title : string ,
    children : React.ReactNode,
    isDialogOpen : boolean,
    setIsDialogOpen :  React.Dispatch<React.SetStateAction<boolean>>
}

export default function PlaylistDialogBox({title , children , isDialogOpen , setIsDialogOpen} : dialogProps) {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="font-bold text-2xl">{title}</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}

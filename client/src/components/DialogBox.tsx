import {
    Dialog,
    DialogContent,
    DialogDescription,
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

export default function DialogBox({title , children , isDialogOpen , setIsDialogOpen} : dialogProps) {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="font-bold text-2xl">{title}</DialogTitle>
                    <DialogDescription>
                        
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}

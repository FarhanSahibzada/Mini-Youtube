import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import React from "react"

interface alertProps {
    title: string,
    content: string,
    isOpen : boolean,
    setIsOpen : React.Dispatch<React.SetStateAction<boolean>>
}

export function AlertBox({ title , content,  isOpen , setIsOpen  }: alertProps) {
    
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{content}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsOpen(false)}>
                    Done
                </AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    )
}

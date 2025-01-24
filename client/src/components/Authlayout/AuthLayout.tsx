import { RootState } from "@/store/Store";
import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type authlayoutprops = {
    children: ReactNode;
    authentication: boolean
}

export default function AuthLayout({ children, authentication = true }: authlayoutprops) {
    const navigate = useNavigate()
    const userstatus = useSelector((state: RootState) => state.auth.authStatus)
    const [loader, setLoader] = useState(true)

    useEffect(() => {
        if (authentication && userstatus !== authentication) {
            navigate('/sign-in')
        } else if (!authentication && userstatus !== authentication) {
            navigate('/')
        }
        setLoader(false)
    }, [navigate, authentication, userstatus])


    return loader ? <div className="min-h-screen font-bold text-blue-600 flex justify-center items-center">...Loading</div> :
        <div className="flex flex-col  items-center ">
            {children}
        </div>
}

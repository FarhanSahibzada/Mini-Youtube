import { useStopPropagationandNavigate } from "@/hooks/StopPagination";
import { videoType } from "@/pages/Home";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";


interface CardProps {
    items: videoType;
    profileshow?: boolean; // Make profileshow optional with a default value
}

function Card({ items, profileshow = true }: CardProps) {

    const createdAt  = items?.createdAt;
    const relatime = moment(createdAt).fromNow()
 const {onStartShouldSetResponder , onTouchEnd} = useStopPropagationandNavigate()
 const navigate = useNavigate();
    return (
        <div className="card card-compact  bg-base-100  min-h-60   overflow-hidden cursor-pointer">
            <div onClick={()=> navigate(`/watch/${items._id}`)}>
                <figure>
                    <img
                        src={items.thumbnail.url}
                        alt="Shoes"
                        className="w-[600px]"
                    />
                </figure>
                <div className="card-body">
                    <div className="flex gap-2" onMouseDown={onStartShouldSetResponder}  onClick={(e)=> onTouchEnd(e,`/my-profile/${items.ownerDetails.username}` )}>
                        {profileshow && (
                            <img src={items.ownerDetails.avatar.url} alt="" className='w-12 h-12 object-cover rounded-full' />
                        )}
                        <h1 className="card-title text-lg">{items.title}</h1>
                    </div>
                    <p>{items.ownerDetails.username}</p>
                    <p>{items.views} views - {relatime}</p>
                </div>
            </div>
        </div>
    )
}

export default Card
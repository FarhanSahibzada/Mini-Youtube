import { videoType } from "@/pages/Home";
import moment from "moment";
import { Link } from "react-router-dom";


interface CardProps {
    items: videoType;
    profileshow?: boolean; // Make profileshow optional with a default value
}

function Card({ items, profileshow = true }: CardProps) {

    const createdAt  = items?.createdAt;
    const relatime = moment(createdAt).fromNow()

    return (
        <div className="card card-compact  bg-base-100  min-h-60   overflow-hidden cursor-pointer">
            <Link to={`/watch/${items._id}`}>
                <figure>
                    <img
                        src={items.thumbnail.url}
                        alt="Shoes"
                        className="w-[600px]"
                    />
                </figure>
                <div className="card-body">
                    <div className="flex gap-2">
                        {profileshow && (
                            <img src={items.ownerDetails.avatar.url} alt="" className='w-12 h-12 object-cover rounded-full' />
                        )}
                        <h2 className="card-title">{items.title}</h2>
                    </div>
                    <p>{items.ownerDetails.username}</p>
                    <p>{items.views}views - {relatime}</p>
                </div>
            </Link>
        </div>
    )
}

export default Card
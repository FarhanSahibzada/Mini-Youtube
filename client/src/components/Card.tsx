
export interface videoProps {
    thumbnail: string,
    title: string,
    description: string,
    owner: string
}

interface CardProps {
    items: videoProps;
    profileshow?: boolean; // Make profileshow optional with a default value
}

function Card({ items, profileshow = true }: CardProps) {
    return (
        <div className="card card-compact  bg-base-100  min-h-60   overflow-hidden">
            <figure>
                <img
                    src={items.thumbnail}
                    alt="Shoes"
                    className="w-[600px]"
                />
            </figure>
            <div className="card-body">
                <div className="flex gap-2">
                    {profileshow && (
                        <img src={items.thumbnail} alt="" className='w-12 h-12 object-cover rounded-full' />
                    )}
                    <h2 className="card-title">{items.title}</h2>
                </div>
                <p>{items.description}</p>
                <p>{items.owner}</p>
            </div>
        </div>
    )
}

export default Card
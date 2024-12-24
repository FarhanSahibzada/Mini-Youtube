
export interface  videoProps {
    thumbnail: string,
    title: string,
    description: string,
    owner: string
}

function Card({ items }: { items: videoProps }) {

    return (
        <div className="card card-compact bg-base-100 w-80 h-80 shadow-xl  overflow-hidden">
            <figure>
                <img
                    src={items.thumbnail}
                    alt="Shoes"  
                    className="w-[600px]"
                    />
            </figure>
            <div className="card-body">
                <div className="flex gap-2">
                    <img src={items.thumbnail} alt="" className='w-12 h-12 object-cover rounded-full' />
                    <h2 className="card-title">{items.title}</h2>
                </div>
                <p>{items.description}</p>
                <p>{items.owner}</p>
            </div>
        </div>
    )
}

export default Card
import { playlistType } from "./Profile.tabs/Playlist";

interface playlistProps {
  playlists?: playlistType;
}

export default function Cardstackk({ playlists }: playlistProps) {
  return (
    <div className="h-full flex items-center justify-center md:justify-start pt-4 pb-6 w-full mt-4 cursor-pointer">
      <div className="md:w-72 h-[180px] w-[90%] relative">
        {/* First image with shadow */}
        <div className="w-full ">
        <figure>
          <img
            src={playlists?.videos?.[0].thumbnail.url}
            alt={playlists?.videos?.[0].title}
            className="w-full h-full rounded-xl  relative  z-20 " style={{ boxShadow: '0 -6px 10px white' }}
          />
        </figure>

        {/* Second image with shadow */}
        <figure>
          <img
            src={playlists?.videos?.[0]?.thumbnail.url} 
            alt={playlists?.videos?.[0]?.title}
            className="w-[90%] h-full rounded-xl shadow-xl absolute duration-200 -top-4 z-10" style={{ boxShadow: '0 -6px 10px white' }}
          />
        </figure>
        <figure>
          <img
            src={playlists?.videos?.[0]?.thumbnail.url} // Ensure there's a third video
            alt={playlists?.videos?.[0]?.title}
            className="w-[80%] h-full rounded-xl shadow-xl duration-200 absolute -top-8  z-0" // Adjust the top position for overlap
          />
        </figure>

            </div>
        {/* Title */}
        <div className="absolute bottom-16 sm:bottom-10 right-4 z-50">
          <p className="text-white sm:text-lg font-semibold ">{playlists?.name}</p>
        </div>
      </div>
    </div>
  );
}

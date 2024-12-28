import library from '@/assest/Videofile.json'
import Card, { videoProps } from '../Card';
import ReactPlayer from 'react-player';

function Home() {
  const latestvideo = library[0];
  const data = library.slice(1)
  return (
    <div className='w-full px-4 '>
      <div className='h-120 w-full bg-blue mt-3 flex md:flex-row flex-col  gap-10 items-start'>
        <div className='rounded-xl bg-red-400 overflow-hidden ' style={{width : '420px' , height :'210px'}}>
      <ReactPlayer
       url={"https://www.youtube.com/watch?v=whfPBZmNtd4"}
         light={true}
          width={"420px"} 
          height={'210px'} 
          controls={true} 
          playing={true}
          />
        </div> 
        <div>
          <h1 className='font-bold text-gray-500  text-xl md:text-2xl  '>{latestvideo.title}</h1>
          <h1 className='font-semibold text-neutral-600 text-lg '>{latestvideo.description}</h1>
          <h1 className='font-medium  text-base mt-2'>{latestvideo.owner}</h1>
        </div>
      </div>
      <div className='w-full  my-6 '>
        <h1 className='my-6  font-bold text-xl md:text-2xl '>For You</h1>
        <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
          {data.map((item: videoProps, index) => (
            <Card key={index} items={item} profileshow={false} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
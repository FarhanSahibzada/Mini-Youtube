import Card from '../Card';
import ReactPlayer from 'react-player';
import { useEffect, useState } from 'react';
import { videoType } from '@/pages/Home';
import moment from 'moment';

interface Homeprops {
  data: Array<videoType>
}

function Home({ data }: Homeprops) {
  
  const [videoList, setVideoList] = useState<Array<videoType>>([])

  useEffect(() => {
    setVideoList(data)
  }, [data])
  
  const time = videoList[0]?.createdAt;
  const relatime = moment(time).fromNow();

  return (
    <div className='w-full px-4 '>
      <div className='h-120 w-full bg-blue mt-3 flex md:flex-row flex-col  gap-10 items-start'>
        <div className='rounded-xl bg-white overflow-hidden ' style={{ width: '420px', height: '210px' }}>
          <ReactPlayer
            url={videoList[0]?.videoFile.url}
            width={"420px"}
            height={'210px'}
            controls={true}
          // playing={true}
          />
        </div>
        <div>
          <h1 className='font-semibold text-base md:text-lg  '>{videoList[0]?.ownerDetails.username} - {videoList[0]?.title}</h1>
          <h1 className='font-medium text-gray-500 text-base mt-2 '>{videoList[0]?.views} views - {relatime} </h1>
          <h1 className='font-semibold  text-base mt-2'>{videoList[0]?.description}</h1>
        </div>
      </div>
      <div className='w-full  my-6 '>
        <h1 className='my-6  font-bold text-xl md:text-2xl '>For You</h1>
        <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
          {videoList?.map((item, index) => (
            <Card key={index} items={item} profileshow={false} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
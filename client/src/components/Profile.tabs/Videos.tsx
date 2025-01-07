import Card from "@/components/Card";
import { videoType } from "@/pages/Home";
import { useEffect, useState } from "react";

interface VideosProps {
  data: Array<videoType>
}

export default function Videos({ data }: VideosProps) {
  const [videoList, setVideoList] = useState<Array<videoType>>([])
  useEffect(()=>{
    setVideoList(data)
  },[data])
  return (
    <div className="py-4 pe-2 w-full my-2 ">
      <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
        {videoList.map((dataa, index) => (
          <Card key={index} items={dataa} profileshow={false} />
        ))}
      </div>
    </div>
  )
}

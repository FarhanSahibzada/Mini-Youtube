import libaray from '@/assest/Videofile.json'
import Card from "@/components/Card";


export default function Home() {
  const data = libaray;

  return (
    <div className="py-4 pe-2 w-full my-2 ">
      <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
        {data.map((dataa , index)=>(
          <Card key={index} items={dataa} profileshow={false} />
        ))}
      </div>
    </div>
  )
}

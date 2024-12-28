import libaray from '@/assest/Videofile.json'
import Card from "@/components/Card";


export default function Home() {
  const data = libaray;

  return (
    <div className="px-4 py-4 w-full  mt-14 sm:mt-0 ">
      <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-2">
        {data.map((dataa , index)=>(
          <Card key={index} items={dataa} />
        ))}
      </div>
    </div>
  )
}

import libaray from '@/assest/Videofile.json'
import Card from "@/components/Card";


export default function Home() {
  const data = libaray;

  return (
    <div className="py-4 px-4 w-full my-2 ">
      <div className="flex flex-wrap gap-6 justify-start">
        {data.map((dataa , index)=>(
          <Card key={index} items={dataa} />
        ))}
      </div>
    </div>
  )
}

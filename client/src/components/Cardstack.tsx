import { CardStack } from "./ui/card-stack";
import { cn } from "@/lib/utils";
import library from '@/assest/Videofile.json'

export default function Cardstackk() {
  const playlists = library[0];
  const playlistsCopies = Array(3).fill(null).map(() => JSON.parse(JSON.stringify(playlists)));
    
  return (
    <div className="h-full flex items-center justify-start pt-4 pb-6 w-full">
      <CardStack items={playlistsCopies} />
    </div>
  )
}


export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};
 

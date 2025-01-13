import { Separator } from "@/components/ui/separator"
import AccountCard from "./AccountCard"
import { useState } from "react"
import VideoCard from "./VideoCard"
import SetPassword from "./SetPassword"
import SetImageCard from "./SetImageCard"

export default function SettingPage() {
  const [tab, setTab] = useState('')
  const tabs = [
    { name: 'Account' },
    { name: 'Videos' }
  ]

  return (
    <div className="space-y-6 p-10 pb-16 md:block w-full h-full">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {tabs.map((item, index) => (
              <a
                key={index}
                href={`#${item.name}`}
                onClick={() => setTab(item.name)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </aside>
        <div className="space-y-8 w-full">
          {tab == "Videos" ? (
            // <VideoCard data={}/>
            <>
            </>
          ) : (
            <>
              <AccountCard />
              <SetPassword/>
              <SetImageCard/>
            </>
          )}

        </div>
      </div>
    </div>
  )
}


import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="w-full bg-black border-b border-gray-800">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-white font-bold text-2xl">
            Pass<span className="text-[#026CDF]">Master</span>
          </span>
        </Link>
      </div>
    </header>
  )
}

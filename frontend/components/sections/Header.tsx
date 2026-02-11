import Link from "next/link"

export default function Header() {
  return (
    <header className="w-full bg-[#18181b] border-b border-[#3f3f46]">
      <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#fafafa] font-bold text-xl">
            Pass<span className="text-[#f59e0b]">Master</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link 
            href="/event" 
            className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors text-sm"
          >
            Events
          </Link>
        </nav>
      </div>
    </header>
  )
}

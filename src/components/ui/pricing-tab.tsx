import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

interface TabProps {
  text: string
  selected: boolean
  setSelected: (value: string) => void
  discount?: boolean
}

export function Tab({ text, selected, setSelected, discount }: TabProps) {
  return (
    <button
      onClick={() => setSelected(text)}
      className={cn(
        "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
        selected ? "text-neutral-900 bg-white" : "text-neutral-300"
      )}
    >
      <span className="capitalize">{text}</span>
      {discount && (
        <span className="absolute -right-8 -top-2 flex items-center gap-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-2 py-0.5 text-xs text-white">
          <Sparkles className="h-3 w-3" />
          20%
        </span>
      )}
    </button>
  )
}
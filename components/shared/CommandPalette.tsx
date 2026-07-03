'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from 'cmdk'
import { Zap, FolderOpen, User, LayoutDashboard, Compass, Plus, LogOut } from 'lucide-react'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog 
      open={open} 
      onOpenChange={setOpen}
      className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border border-[#1E2533] bg-[#10131E] p-4 shadow-lg overflow-hidden"
    >
      <CommandInput 
        placeholder="Type a command or search..." 
        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground border-b border-[#1E2533] mb-2"
      />
      <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigate" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          <CommandItem 
            onSelect={() => { router.push('/dashboard'); setOpen(false) }}
            className="flex items-center gap-2 rounded-sm px-2 py-2 text-sm text-[#F7F3EC] aria-selected:bg-[#161A28] aria-selected:text-[var(--color-ember)] cursor-pointer"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem 
            onSelect={() => { router.push('/projects'); setOpen(false) }}
            className="flex items-center gap-2 rounded-sm px-2 py-2 text-sm text-[#F7F3EC] aria-selected:bg-[#161A28] aria-selected:text-[var(--color-ember)] cursor-pointer"
          >
            <FolderOpen className="h-4 w-4" />
            Projects
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator className="h-px bg-[#1E2533] my-1" />
        
        <CommandGroup heading="Actions" className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          <CommandItem 
            onSelect={() => { router.push('/skills/prove'); setOpen(false) }}
            className="flex items-center gap-2 rounded-sm px-2 py-2 text-sm text-[#F7F3EC] aria-selected:bg-[#161A28] aria-selected:text-[var(--color-ember)] cursor-pointer"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            Prove a Skill
            <kbd className="ml-auto text-xs text-muted-foreground font-mono">AI</kbd>
          </CommandItem>
          <CommandItem 
            onSelect={() => { router.push('/projects/create'); setOpen(false) }}
            className="flex items-center gap-2 rounded-sm px-2 py-2 text-sm text-[#F7F3EC] aria-selected:bg-[#161A28] aria-selected:text-[var(--color-ember)] cursor-pointer"
          >
            <Plus className="h-4 w-4 text-teal-400" />
            Start a Project
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

'use client'
import React, { createContext, useContext, useState } from 'react'
import clsx from 'clsx'

type TabsCtx = { value: string; setValue: (v: string) => void }
const Ctx = createContext<TabsCtx | null>(null)

export function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [value, setValue] = useState(defaultValue)
  return <Ctx.Provider value={{ value, setValue }}>{children}</Ctx.Provider>
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return (
    <div role="tablist" className="inline-flex rounded-lg border border-outline bg-bg">
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(Ctx)!
  const active = ctx.value === value
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={() => ctx.setValue(value)}
      className={clsx(
        'px-3 py-1.5 text-sm rounded-md focus-visible:ring-2 focus-visible:ring-offset-2',
        active ? 'bg-secondary text-text' : 'text-text/70 hover:bg-secondary'
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(Ctx)!
  if (ctx.value !== value) return null
  return <div className="mt-3">{children}</div>
}

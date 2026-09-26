'use client'
import { type ReactNode, createContext, useState, useContext } from 'react'
import { useStore } from 'zustand'

import { type TTimelineStore, createTimelineStore } from './store'

type TTimelineStoreApi = ReturnType<typeof createTimelineStore>

const TimelineContext = createContext<TTimelineStoreApi | null>(null)

export type TimelineProviderProps = {
    children: ReactNode
}

export function TimelineProvider({ children }: TimelineProviderProps) {
    const [store] = useState(() => createTimelineStore())

    return (
        <TimelineContext.Provider value={store}>
            {children}
        </TimelineContext.Provider>
    )
}

export function useTimelineStore<T>(
    selector: (store: TTimelineStore) => T
): T {
    const store = useContext(TimelineContext)

    if (!store) {
        throw new Error('useTimelineStore must be used within TimelineProvider')
    }

    return useStore(store, selector)
}
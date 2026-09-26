'use client'

import {createContext, type ReactNode, useContext, useState} from 'react'
import {useStore} from 'zustand'
import {
    createDetectionsStore,
    type TDetectionsStore
} from '@/app/detections/store/store'

type TDetectionsStoreApi = ReturnType<typeof createDetectionsStore>

const DetectionsContext = createContext<TDetectionsStoreApi | null>(null)

export type DetectionsProviderProps = {
    children: ReactNode
}

export function DetectionsProvider({children}: DetectionsProviderProps) {
    const [store] = useState(() => createDetectionsStore())

    return (
        <DetectionsContext.Provider value={store}>
            {children}
        </DetectionsContext.Provider>
    )
}

export function useDetectionsStore<T>(
    selector: (store: TDetectionsStore) => T
): T {
    const store = useContext(DetectionsContext)

    if (!store) {
        throw new Error('useDetectionsStore must be used within DetectionsProvider')
    }

    return useStore(store, selector)
}
import {createStore} from 'zustand/vanilla'
import type {TDetectionDetail, TDetectionEvent} from '@/app/types'
import {getDetectionEventDetails, getDetectionEvents, type TTimelineParams} from '@/app/lib/api'

type TDetail<T> = {
    data: T | null
    id: number | null
    loading: boolean
    error: string | null
}

export type TTimelineState = {
    events: TDetectionEvent[]
    loading: boolean
    error: string | null

    // Detail
    selectedEvent: TDetail<TDetectionDetail>
}

export type TTimelineActions = {
    loadEvents: (params: Partial<TTimelineParams>) => Promise<void>
    loadNextPage: (params: Partial<TTimelineParams>) => Promise<void>

    // Detail
    selectEvent: (id: number | null) => Promise<void>
}

export type TTimelineStore = TTimelineState & TTimelineActions

export const defaultInitState: TTimelineState = {
    events: [],
    loading: false,
    error: null,
    selectedEvent: {
        data: null,
        id: null,
        loading: false,
        error: null
    }
}

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message
    }

    return 'An unknown error occurred'
}

export const createTimelineStore = (initState: TTimelineState = defaultInitState) => {
    return createStore<TTimelineStore>()((set, get) => (
        {
            ...initState,
            loadEvents: async (params: Partial<TTimelineParams> = {}) => {
                set({
                    loading: true,
                    error: null
                })

                try {
                    const events = await getDetectionEvents({
                        page: params.page ?? 1,
                        start: params.start,
                        end: params.end
                    })

                    set({
                        events,
                        loading: false,
                        error: null
                    })
                } catch (error) {
                    set({
                        loading: false,
                        error: getErrorMessage(error)
                    })
                    console.error(error)
                }
            },

            loadNextPage: async (params: Partial<TTimelineParams>) => {
                const nextPage = params.page + 1
                set({
                    loading: true,
                    error: null
                })
                try {
                    const events = await getDetectionEvents({
                        page: nextPage,
                        start: params.start ?? undefined,
                        end: params.end ?? undefined
                    })
                    set((state) => (
                        {
                            events: [...state.events, ...events],
                            page: nextPage,
                            loading: false,
                            error: null
                        }
                    ))
                } catch (error) {
                    set({
                        loading: false,
                        error: getErrorMessage(error)
                    })
                    console.error(error)
                }
            },

            // Detail actions
            selectEvent: async (id: number | null) => {
                if (id === null) {
                    set({
                        selectedEvent: {
                            data: null,
                            id: null,
                            loading: false,
                            error: null
                        }
                    })
                    return
                }
                set({
                    selectedEvent: {
                        data: null,
                        id,
                        loading: true,
                        error: null
                    }
                })
                try {
                    const detail = await getDetectionEventDetails(id)
                    if (get().selectedEvent.id !== id) {
                        return
                    }
                    set({
                        selectedEvent: {
                            data: detail,
                            id,
                            loading: false,
                            error: null
                        }
                    })
                } catch (error) {
                    if (get().selectedEvent.id !== id) {
                        return
                    }
                    set({
                        selectedEvent: {
                            data: null,
                            id,
                            loading: false,
                            error: getErrorMessage(error)
                        }
                    })
                    console.error(error)
                }
            }
        }
    ))
}
import {createStore} from 'zustand/vanilla'
import {getUrl} from '@/app/config'
import type {TDetection, TDevice} from '@/app/types'
import {getDevices, getLabels} from '@/app/lib/api'
import {sortByCreatedAt} from '@/app/lib/sortBy'

export type TDetectionsParams = {
    labels: string[]
    deviceIds: number[]
}

export type TDetectionsState = {
    labels: string[]
    selectedLabels: string[]

    devices: TDevice[]
    selectedDeviceIds: number[]

    detections: TDetection[]

    loadingFilters: boolean
    loadingDetections: boolean
    error: string | null
}

export type TDetectionsActions = {
    loadFilters: (controller?: AbortController) => Promise<void>
    loadDetections: (params?: Partial<TDetectionsParams>) => Promise<void>

    setSelectedLabels: (labels: string[]) => Promise<void>
    setSelectedDeviceIds: (deviceIds: number[]) => Promise<void>

    clearError: () => void
}

export type TDetectionsStore = TDetectionsState & TDetectionsActions

export const defaultInitState: TDetectionsState = {
    labels: [],
    selectedLabels: [],

    devices: [],
    selectedDeviceIds: [],

    detections: [],

    loadingFilters: false,
    loadingDetections: false,
    error: null
}

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message
    }

    return 'An unknown error occurred'
}

const isAbortError = (error: unknown): boolean => {
    return error instanceof DOMException && error.name === 'AbortError'
}

const buildDetectionSearchParams = ({
                                        labels,
                                        deviceIds
                                    }: TDetectionsParams): URLSearchParams => {
    const params = new URLSearchParams()

    labels.forEach((label) => {
        params.append('label', label)
    })

    deviceIds.forEach((deviceId) => {
        params.append('device_id', String(deviceId))
    })

    return params
}

export const createDetectionsStore = (
    initState: TDetectionsState = defaultInitState
) => {
    return createStore<TDetectionsStore>()((set, get) => (
        {
            ...initState,

            loadFilters: async (controller?: AbortController) => {
                set({
                    loadingFilters: true,
                    error: null
                })

                try {
                    const labelList: string[] = await getLabels(controller)
                    const devices: TDevice[] = await getDevices(controller)


                    const labels = (
                        labelList.includes('person') ? labelList : labelList.concat('person')
                    ).toSorted()
                    console.log(`Labels: ${labels}`)
                    const selectedDeviceIds: number[] = devices.map(({id}) => id)

                    set({
                        labels,
                        selectedLabels: labels,
                        devices,
                        selectedDeviceIds,
                        loadingFilters: false,
                        error: null
                    })

                    await get().loadDetections({
                        labels,
                        deviceIds: selectedDeviceIds
                    })
                } catch (error) {
                    if (isAbortError(error)) {
                        return
                    }

                    set({
                        loadingFilters: false,
                        error: getErrorMessage(error)
                    })

                    console.error(error)
                }
            },

            loadDetections: async (params: Partial<TDetectionsParams> = {}) => {
                const labels = params.labels ?? get().selectedLabels
                const deviceIds = params.deviceIds ?? get().selectedDeviceIds

                set({
                    loadingDetections: true,
                    error: null
                })

                try {
                    const searchParams = buildDetectionSearchParams({
                        labels,
                        deviceIds
                    })

                    const detections: TDetection[] = await fetch(
                        getUrl('api/detection-image', searchParams)
                    ).then((response) => response.json())

                    set({
                        detections: sortByCreatedAt(detections),
                        loadingDetections: false,
                        error: null
                    })
                } catch (error) {
                    if (isAbortError(error)) {
                        return
                    }

                    set({
                        loadingDetections: false,
                        error: getErrorMessage(error)
                    })

                    console.error(error)
                }
            },

            setSelectedLabels: async (labels: string[]) => {
                set({
                    selectedLabels: labels
                })

                await get().loadDetections({
                    labels
                })
            },

            setSelectedDeviceIds: async (deviceIds: number[]) => {
                set({
                    selectedDeviceIds: deviceIds
                })

                await get().loadDetections({
                    deviceIds
                })
            },

            clearError: () => {
                set({
                    error: null
                })
            }
        }
    ))
}
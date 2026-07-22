import {cache} from 'react'
import {getUrl} from '@/app/config'
import type {TDetectionDetail, TDetectionEvent, TDevice} from '@/app/types'

export const getDevices = cache(async (controller: AbortController): Promise<TDevice[]> => {
    const res = await fetch(getUrl(`/api/device`), {
        signal: controller.signal,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await res.json()
})


export const getLabels = cache(async (controller: AbortController): Promise<string[]> => {
    const response = await fetch(getUrl('/api/label'), {
        signal: controller.signal,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await response.json()
})


export type DetectionEventParams = {
    page?: number
    start?: Date
    end?: Date
}

export async function getDetectionEvents({
                                             page,
                                             start,
                                             end
                                         }: DetectionEventParams): Promise<TDetectionEvent[]> {
    const params = new URLSearchParams()
    if (page !== undefined) {
        params.set('page', String(page))
    }
    if (start) {
        params.set('start', start.getTime().toString())
    }
    if (end) {
        params.set('end', end.getTime().toString())
    }

    const response = await fetch(getUrl('/api/event', params), {
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
    }

    return (
               await response.json()
           ) || []
}

export async function getDetectionEventDetails(
    eventId: number
): Promise<TDetectionDetail> {
    console.log(`getDetectionEventDetails: ${eventId}`)
    const response = await fetch(getUrl(`/api/event/${eventId}`), {
        headers: {
            'Content-Type': 'application/json'
        },
        cache: 'no-store'
    })

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
    }

    const value = await response.json()
    console.log(JSON.stringify({
        endpoint: `api/event/${eventId}`,
        data: value
    }, null, 4))
    return value
}

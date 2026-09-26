'use client'

import {useEffect, useState} from 'react'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {Alert, Grid, Loader} from '@mantine/core'
import {DateTimePicker} from '@mantine/dates'

import EventList from '@/app/timeline/components/EventList'
import EventTimeline from './EventTimeline'
import {useTimelineStore} from '@/app/timeline/store/provider'

const parseDate = (value: string | null): Date | undefined => {
    if (!value) {
        return undefined
    }

    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? undefined : date
}

const parseNumber = (value: string | null): number | null => {
    if (!value) {
        return null
    }

    const number = Number(value)
    return Number.isInteger(number) && number > 0 ? number : null
}

export default function TimelineClient() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const loading = useTimelineStore((state) => state.loading)
    const error = useTimelineStore((state) => state.error)
    const loadEvents = useTimelineStore((state) => state.loadEvents)

    const startParam = searchParams.get('start')
    const endParam = searchParams.get('end')
    const pageParam = searchParams.get('page')
    const eventParam = searchParams.get('event')

    const [startDraft, setStartDraft] = useState<string | null>(startParam)
    const [endDraft, setEndDraft] = useState<string | null>(endParam)

    useEffect(()=> {
        loadEvents({
            page: parseNumber(pageParam) ?? 1,
            start: parseDate(startParam),
            end: parseDate(endParam)
        })
    }, [loadEvents])

    const updateUrl = (
        updateParams: (params: URLSearchParams) => void,
        replace = false
    ) => {
        const params = new URLSearchParams(searchParams.toString())

        updateParams(params)

        const query = params.toString()
        const href = query ? `${pathname}?${query}` : pathname

        if (replace) {
            router.replace(href, {scroll: false})
        } else {
            router.push(href, {scroll: false})
        }
    }

    const updateDateFilter = (key: 'start' | 'end', value: string | null) => {
        updateUrl((params) => {
            if (value) {
                params.set(key, new Date(value).toISOString())
            } else {
                params.delete(key)
            }

            params.set('page', '1')
            params.delete('event')
        }, true)
    }

    const selectEventId = (eventId: number) => {
        updateUrl((params) => {
            params.set('event', String(eventId))
        })
    }

    return (
        <div className="w-full">
            <Grid>
                <Grid.Col span={4}>
                    <DateTimePicker
                        label="Start Date"
                        value={startDraft}
                        disabled={loading}
                        onChange={setStartDraft}
                        onDropdownClose={() => updateDateFilter('start', startDraft)}
                    />
                </Grid.Col>

                <Grid.Col span={4}>
                    <DateTimePicker
                        label="End Date"
                        value={endDraft}
                        disabled={loading}
                        onChange={setEndDraft}
                        onDropdownClose={() => updateDateFilter('end', endDraft)}
                    />
                </Grid.Col>
            </Grid>

            <Grid mt="md">
                <Grid.Col span={{base: 12, lg: 3}}>
                    {loading ? <Loader/> : null}

                    {error ? (
                        <Alert color="red" mb="md">
                            {error}
                        </Alert>
                    ) : null}

                    <EventList />
                </Grid.Col>

                <Grid.Col span={{base: 12, lg: 9}}>
                    <EventTimeline />
                </Grid.Col>
            </Grid>
        </div>
    )
}
'use client'

import {ReactNode, useState, useTransition} from 'react'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'

import {Grid, Loader} from '@mantine/core'
import {DateTimePicker} from '@mantine/dates'

import {TDetectionEvent} from '@/app/types'
import EventTimeline from '@/app/timeline/components/EventTimeline'

type TimelineClientProps = {
    events: TDetectionEvent[]
    start: string | null
    end: string | null
    selectedEventId: number | null
    children: ReactNode
}

export default function TimelineClient({
                                           events,
                                           start,
                                           end,
                                           selectedEventId,
                                           children
                                       }: TimelineClientProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [startDt, setStart] = useState<string | null>(start)
    const [endDt, setEnd] = useState<string | null>(end)

    const navigateWithParams = (
        updateParams: (params: URLSearchParams) => void,
        options?: {
            replace?: boolean
        }
    ) => {
        const params = new URLSearchParams(searchParams.toString())

        updateParams(params)

        const query = params.toString()
        const href = query ? `${pathname}?${query}` : pathname

        startTransition(() => {
            if (options?.replace) {
                router.replace(href)
            } else {
                router.push(href)
            }
        })
    }

    const updateDateFilter = (key: 'start' | 'end', value: string | null) => {
        console.log(JSON.stringify({key, value}, null, 4))
        navigateWithParams((params) => {
            if (value) {
                params.set(key, new Date(value).toISOString())
            } else {
                params.delete(key)
            }

            params.set('page', '0')

            // The selected event may no longer match the new filter range.
            params.delete('event')
        }, {
            replace: true
        })
    }

    const selectEvent = (eventId: number) => {
        navigateWithParams((params) => {
            params.set('event', String(eventId))
        })
    }

    return (
        <div className="w-full">
            <Grid>
                <Grid.Col span={4}>
                    <DateTimePicker
                        label="Start Date"
                        value={startDt}
                        disabled={isPending}
                        onChange={(value) => setStart(value)}
                        onDropdownClose={()=> updateDateFilter('start', startDt)}
                    />
                </Grid.Col>

                <Grid.Col span={4}>
                    <DateTimePicker
                        label="End Date"
                        value={endDt}
                        disabled={isPending}
                        onChange={(value) => setEnd(value)}
                        onDropdownClose={()=> updateDateFilter('end', endDt)}
                    />
                </Grid.Col>
            </Grid>

            <Grid mt="md">
                <Grid.Col span={{base: 12, lg: 3}}>
                    {isPending ? <Loader/> : null}

                    <EventTimeline
                        events={events}
                        selectedId={selectedEventId}
                        setSelectedId={selectEvent}
                    />
                </Grid.Col>

                <Grid.Col span={{base: 12, lg: 9}}>
                    {children}
                </Grid.Col>
            </Grid>
        </div>
    )
}
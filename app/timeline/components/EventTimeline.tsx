'use client'

import Link from 'next/link'
import {Text, Timeline} from '@mantine/core'
import {TimeValue} from '@mantine/dates'
import {useViewportSize} from '@mantine/hooks'
import type {TDetectionEvent} from '@/app/types'
import {formatDate} from '@/app/lib/dateUtils'
import {useTimelineStore} from '@/app/timeline/store/provider'

export default function EventTimeline() {
    const events = useTimelineStore((state) => state.events)
    const selectEvent = useTimelineStore((state) => state.selectEvent)
    const selectedIndex: number = useTimelineStore(state => !state.selectedEvent.id ? -1 : state.events.findIndex(({id}) => id === state.selectedEvent.id))

    const {width} = useViewportSize()
    const isMobile = width < 700

    return (
        <Timeline active={selectedIndex} bulletSize={24} lineWidth={2}>
            {events.map((evt: TDetectionEvent) => {
                if (isMobile) {
                    return (
                        <Timeline.Item
                            key={evt.id}
                            title={evt.labels.join(', ')}
                        >
                            <Link href={`/timeline/${evt.id}`}>
                                <TimelineItem event={evt}/>
                            </Link>
                        </Timeline.Item>
                    )
                }

                return (
                    <Timeline.Item
                        key={evt.id}
                        title={evt.labels.join(', ')}
                        onClick={() => void selectEvent(evt.id)}
                    >
                        <TimelineItem event={evt}/>
                    </Timeline.Item>
                )
            })}
        </Timeline>
    )
}

function TimelineItem({event}: { event: TDetectionEvent }) {
    const startTime = new Date(event.created_at)
    const endTime = event.ended_at ? new Date(event.ended_at) : null

    return (
        <>
            <Text c="dimmed" size="sm">
                <TimeValue value={startTime} format="12h"/>
                {!endTime ? null : ' - '}
                {!endTime ? null : <TimeValue value={endTime} format="12h"/>}
            </Text>

            <Text c="dimmed" size="sm">
                {formatDate(startTime)}
            </Text>
        </>
    )
}
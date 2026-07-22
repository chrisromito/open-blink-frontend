/**
 * EventTimeline renders DetectionEvents
 *  Accepts `setSelected` & `selected`
 */
import Link from 'next/link'
import {Text, Timeline} from '@mantine/core'
import {TimeValue} from '@mantine/dates'
import {useViewportSize} from '@mantine/hooks'
import {TDetectionEvent} from '@/app/types'
import {formatDate} from '@/app/lib/dateUtils'

export type EventTimelineProps = {
    events: TDetectionEvent[]
    selectedId: number | null
    setSelectedId(value: number): void
}


export default function EventTimeline({events, selectedId, setSelectedId}: EventTimelineProps) {
    const selectedIndex = selectedId === null ? 0 : events.findIndex(({id}) => id === selectedId)
    const {height, width} = useViewportSize()
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
                        onClick={() => setSelectedId(evt.id)}
                    >
                        <TimelineItem event={evt}/>
                    </Timeline.Item>
                )
            })}
        </Timeline>
    )
}


function TimelineItem({event}: { event: TDetectionEvent }) {
    const startTime: Date = new Date(event.created_at)
    const endTime: Date | null = event.ended_at ? new Date(event.ended_at) : null
    return (
        <>
            <Text c="dimmed" size="sm">
                <TimeValue value={startTime} format="12h"/>
                {!endTime ? null : ' - '}
                {!endTime ? null : <TimeValue value={endTime} format="12h"/>}
            </Text>
            {/* Date */}
            <Text c="dimmed" size="sm">
                {formatDate(startTime)}
            </Text>
        </>
    )
}
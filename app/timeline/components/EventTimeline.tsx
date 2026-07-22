/**
 * EventTimeline renders DetectionEvents
 *  Accepts `setSelected` & `selected`
 */
import {Text, Timeline} from '@mantine/core'
import {TimeValue} from '@mantine/dates'
import {TDetectionEvent} from '@/app/types'
import {formatDate} from '@/app/lib/dateUtils'

export type EventTimelineProps = {
    events: TDetectionEvent[]
    selectedId: number | null
    setSelectedId(value: number): void
}


export default function EventTimeline({events, selectedId, setSelectedId}: EventTimelineProps) {
    const selectedIndex = selectedId === null ? 0 : events.findIndex(({id}) => id === selectedId)
    return (
        <Timeline active={selectedIndex} bulletSize={24} lineWidth={2}>
            {events.map((evt: TDetectionEvent) => {
                const startTime: Date = new Date(evt.created_at)
                const endTime: Date | null = evt.ended_at ? new Date(evt.ended_at) : null
                return (
                    <Timeline.Item
                        key={evt.id}
                        title={evt.labels.join(', ')}
                        onClick={() => setSelectedId(evt.id)}
                    >
                        <Text c="dimmed" size="sm">
                            <TimeValue value={startTime} format="12h"/>
                            {!endTime ? null : ' - '}
                            {!endTime ? null : <TimeValue value={endTime} format="12h"/>}
                        </Text>
                        {/* Date */}
                        <Text c="dimmed" size="sm">
                            {formatDate(startTime)}
                        </Text>
                    </Timeline.Item>
                )
            })}
        </Timeline>
    )
}
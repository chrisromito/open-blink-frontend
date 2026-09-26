import Link from 'next/link'
import {List, Text} from '@mantine/core'
import {TimeValue} from '@mantine/dates'
import {useViewportSize} from '@mantine/hooks'
import {TDetectionEvent} from '@/app/types'
import {formatDate} from '@/app/lib/dateUtils'
import {useTimelineStore} from '@/app/timeline/store/provider'

export default function EventList() {
    const events = useTimelineStore((state) => state.events)
    const selectedId = useTimelineStore((state) => state.selectedEvent.id)
    const selectEvent = useTimelineStore((state) => state.selectEvent)

    const {width} = useViewportSize()
    const isMobile = width < 700

    return (
        <List style={{maxHeight: 'calc(100vh - 150px)', overflow: 'auto'}}>
            {events.map((evt: TDetectionEvent) => {
                const style = evt.id === selectedId
                    ? {
                        backgroundColor: 'var(--mantine-primary-color-light)',
                        color: 'var(--mantine-primary-color-light-color)'
                    }
                    : undefined

                if (isMobile) {
                    return (
                        <List.Item key={evt.id} style={style}>
                            <Link href={`/timeline/${evt.id}`}>
                                <EventItem event={evt}/>
                            </Link>
                        </List.Item>
                    )
                }

                return (
                    <List.Item
                        key={evt.id}
                        onClick={() => void selectEvent(evt.id)}
                        style={style}
                    >
                        <EventItem event={evt}/>
                    </List.Item>
                )
            })}
        </List>
    )
}

function EventItem({event}: { event: TDetectionEvent }) {
    const startTime = new Date(event.created_at)
    const endTime = event.ended_at ? new Date(event.ended_at) : null

    return (
        <div className="pb-2">
            <Text>
                {event.labels.toSorted().join(', ')}
            </Text>

            <Text pl="md" c="dimmed" size="sm">
                <TimeValue value={startTime} format="12h"/>
                {endTime ? (
                    <>
                        {' - '}
                        <TimeValue value={endTime} format="12h"/>
                    </>
                ) : null}
            </Text>

            <Text pl="md" c="dimmed" size="sm">
                {formatDate(startTime)}
            </Text>
        </div>
    )
}
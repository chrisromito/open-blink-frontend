import Link from 'next/link'
import {List, Text} from '@mantine/core'
import {TimeValue} from '@mantine/dates'
import {useViewportSize} from '@mantine/hooks'
import {TDetectionEvent} from '@/app/types'
import {EventTimelineProps} from '@/app/timeline/components/EventTimeline'
import {formatDate} from '@/app/lib/dateUtils'

export default function EventList({events, selectedId, setSelectedId}: EventTimelineProps) {
    // const selectedIndex = selectedId === null ? 0 : events.findIndex(({id}) => id === selectedId)
    const {height, width} = useViewportSize()
    const isMobile = width < 700
    const selectedStyle = {
        backgroundColor: 'var(--mantine-primary-color-light)',
        color: 'var(--mantine-primary-color-light-color)'
    }

    return (
        <List style={{maxHeight: 'calc(100vh - 150px)', overflow: 'auto'}}>
            {events.map((evt: TDetectionEvent) => {
                const style = evt.id === selectedId ? selectedStyle : {}
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
                        onClick={() => setSelectedId(evt.id)}
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
    const startTime: Date = new Date(event.created_at)
    const endTime: Date | null = event.ended_at ? new Date(event.ended_at) : null
    const Tail = !endTime ? null : (
        <>
            {' - '}
            <TimeValue value={endTime} format="12h"/>
        </>
    )
    return (
        <div className={'pb-2'}>
            <Text>
                {event.labels.toSorted().join(', ')}
            </Text>
            <Text pl={'md'} className={'pl-2'} c="dimmed" size="sm">
                <TimeValue value={startTime} format="12h"/>
                {Tail}
            </Text>
            {/* Date */}
            <Text pl={'md'} c="dimmed" size="sm">
                {formatDate(startTime)}
            </Text>
        </div>
    )
}

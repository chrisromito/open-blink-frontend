import {Suspense} from 'react'
import {getDetectionEvents} from '@/app/lib/devices'
import TimelineClient from '@/app/timeline/components/TimelineClient'
import EventCard from '@/app/timeline/components/EventCard'

type TimelinePageProps = {
    searchParams: Promise<{
        start?: string
        end?: string
        page?: string
        event?: string
    }>
}

function parseDateParam(value?: string): Date | undefined {
    if (!value) {
        return undefined
    }
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return undefined
    }
    return date
}

function parsePageParam(value?: string): number {
    const page = Number(value)
    if (!Number.isInteger(page) || page < 0) {
        return 0
    }
    return page
}

function parseIdParam(value?: string): number | null {
    const id = Number(value)
    if (!Number.isInteger(id) || id <= 0) {
        return null
    }
    return id
}

export default async function TimelinePage({searchParams}: TimelinePageProps) {
    const params = await searchParams

    const page = parsePageParam(params.page)
    const start = parseDateParam(params.start)
    const end = parseDateParam(params.end)
    const selectedEventId = parseIdParam(params.event)

    const events = await getDetectionEvents({
        page,
        start,
        end
    })

    return (
        <TimelineClient
            events={events}
            start={params.start ?? null}
            end={params.end ?? null}
            selectedEventId={selectedEventId}
        >
            <Suspense
                key={selectedEventId ?? 'no-event-selected'}
                fallback={<Fallback/>}
            >
                {selectedEventId === null ? (
                    <div>Select an event to view details.</div>
                ) : (
                    <EventCard eventId={selectedEventId}/>
                )}
            </Suspense>
        </TimelineClient>
    )
}

const Fallback = () => (
    <div>Loading event details...</div>
)
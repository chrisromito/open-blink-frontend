'use client'

import {useEffect} from 'react'
import {Alert, Loader, Text} from '@mantine/core'
import EventCardView from '@/app/timeline/components/EventCardView'
import {useTimelineStore} from '@/app/timeline/store/provider'

type EventCardProps = {
    eventId: number
}

export default function EventCard({eventId}: EventCardProps) {
    const selectedId = useTimelineStore((state) => state.selectedEvent.id)
    const event = useTimelineStore((state) => state.selectedEvent.data)
    const loading = useTimelineStore((state) => state.selectedEvent.loading)
    const error = useTimelineStore((state) => state.selectedEvent.error)
    const selectEvent = useTimelineStore((state) => state.selectEvent)

    useEffect(() => {
        if (selectedId !== eventId) {
            void selectEvent(eventId)
        }
    }, [eventId, selectedId, selectEvent])

    if (selectedId !== eventId || loading) {
        return <Loader/>
    }

    if (error) {
        return (
            <Alert color="red">
                {error}
            </Alert>
        )
    }

    if (!event) {
        return (
            <Text c="dimmed">
                No details found for this event.
            </Text>
        )
    }

    return <EventCardView event={event}/>
}
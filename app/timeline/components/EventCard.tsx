import {getDetectionEventDetails} from '@/app/lib/devices'
import EventCardView from '@/app/timeline/components/EventCardView'

type EventCardProps = {
    eventId: number
}

export default async function EventCard({eventId}: EventCardProps) {
    const event = await getDetectionEventDetails(eventId)

    return <EventCardView event={event}/>
}
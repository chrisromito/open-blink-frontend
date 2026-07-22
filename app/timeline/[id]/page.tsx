import EventCard from '@/app/timeline/components/EventCard'


type TParam = Promise<{ id: number }>

export default async function EventDetailPage({ params }: TParam) {
    const { id } = await params

    return (
        <EventCard eventId={id}/>
    )
}
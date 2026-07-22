import Link from 'next/link'
import { MdOutlineNavigateBefore } from "react-icons/md";
import { Group, Stack } from '@mantine/core'
import EventCard from '@/app/timeline/components/EventCard'


type TParam = Promise<{ id: number }>

export default async function EventDetailPage({params}: { params: TParam }) {
    const {id} = await params

    return (
        <Stack>
            <Link href={`/timeline`}>
                <Group>
                    <MdOutlineNavigateBefore />
                    Back
                </Group>
            </Link>
            <EventCard eventId={id}/>
        </Stack>
    )
}
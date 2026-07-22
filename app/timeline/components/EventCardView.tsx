'use client'
import {useState} from 'react'
import {Badge, Card, Divider, Group, Image, Paper, Progress, SimpleGrid, Stack, Text, Title} from '@mantine/core'

import {TDetectionDetail, TDetectionLite, TEventDetails} from '@/app/types'
import {anyToDate, formatDate, formatDateTime, formatTime} from '@/app/lib/dateUtils'
import {sortBy} from '@/app/lib/sortBy'
import ImageModal from '@/components/ImageModal'

type EventCardViewProps = {
    event: TDetectionDetail
}

export default function EventCardView({event}: EventCardViewProps) {
    const [eventDetails, setEventDetails] = useState<TEventDetails | null>(null)

    return (
        <Stack gap="md">
            <Paper withBorder radius="md" p="md" shadow="sm">
                <Stack gap="md">
                    <Group justify="space-between" align="flex-start" gap="md">
                        <Stack gap={2}>
                            <Title order={2} size="h3">
                                Event {event.id}
                            </Title>
                        </Stack>

                        <Group gap="xs">
                            <Badge variant="light">
                                Device {event.device_id}
                            </Badge>

                            <Badge variant="light">
                                State {event.state}
                            </Badge>

                            <Badge variant="filled">
                                {event.details?.length ?? 0} images
                            </Badge>
                        </Group>
                    </Group>

                    <Divider/>

                    <SimpleGrid cols={{base: 1, sm: 2}} spacing="sm">
                        <Stack gap={2}>
                            <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                                Started
                            </Text>

                            <Text size="sm">
                                {formatDateTime(event.created_at)}
                            </Text>
                        </Stack>

                        <Stack gap={2}>
                            <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
                                Ended
                            </Text>

                            <Text size="sm">
                                {formatDateTime(event.ended_at)}
                            </Text>
                        </Stack>
                    </SimpleGrid>
                </Stack>
            </Paper>

            {!event.details ? (
                <Paper withBorder radius="md" p="md">
                    <Text size="sm" c="dimmed">
                        No images were found for this event.
                    </Text>
                </Paper>
            ) : (
                <SimpleGrid cols={{base: 1, xl: 2}} spacing="md">
                    {event.details.map((evtDetail) => (
                        <EventImageCard
                            key={evtDetail.id}
                            details={evtDetail}
                            onClick={() => setEventDetails(evtDetail)}
                        />
                    ))}
                </SimpleGrid>
            )}

            {!eventDetails ? null : (
                <ImageModal
                    title={`Detail ${eventDetails.id}`}
                    src={eventDetails.image_url}
                    description={`${eventDetails.detections.map(({label}) => label).join(', ')} detected at ${formatTime(anyToDate(eventDetails.created_at))} on ${formatDate(anyToDate(eventDetails.created_at))}`}
                    onClose={() => setEventDetails(null)}
                />
            )}
        </Stack>
    )
}


type EventImageCardProps = {
    details: TEventDetails
    onClick: React.MouseEventHandler<HTMLElement>
    key?: string | number
}


function EventImageCard({details, onClick}: EventImageCardProps) {
    const {id, created_at, image_url, detections} = details
    const sortedDetections = sortByConfidence(detections)
    return (
        <Card
            onClick={onClick}
            withBorder
            radius="md"
            shadow="sm"
            padding="md"
        >
            <Card.Section>
                <Image
                    src={image_url}
                    alt={`Event image ${id}`}
                    height={260}
                    fit="cover"
                />
            </Card.Section>

            <Stack gap="sm" mt="md">
                <Group justify="space-between" align="flex-start" gap="sm">
                    <Stack gap={2}>
                        <Text fw={600}>
                            Image {id}
                        </Text>

                        <Text size="sm" c="dimmed">
                            {formatDateTime(created_at)}
                        </Text>
                    </Stack>

                    <Badge variant="light">
                        {sortedDetections.length} detections
                    </Badge>
                </Group>

                <Divider/>

                {sortedDetections.length === 0 ? (
                    <Text size="sm" c="dimmed">
                        No detections found in this image.
                    </Text>
                ) : (
                    <Stack gap="xs">
                        {sortedDetections.map((detection, index) => (
                            <EventDetectionRow
                                key={`${details.id}-${detection.label}-${index}`}
                                detection={detection}
                            />
                        ))}
                    </Stack>
                )}
            </Stack>
        </Card>
    )
}


function EventDetectionRow({detection}: { detection: TDetectionLite, key?: string }) {
    const confidencePercent = getConfidencePercent(detection.confidence)

    return (
        <Paper withBorder radius="md" p="sm">
            <Group justify="space-between" align="center" gap="sm">
                <Text size="sm" fw={500}>
                    {detection.label}
                </Text>

                <Badge variant="light">
                    {confidencePercent}%
                </Badge>
            </Group>

            <Progress
                value={confidencePercent}
                size="sm"
                radius="xl"
                mt="xs"
            />
        </Paper>
    )
}


const sortByConfidence = sortBy(({confidence}) => confidence)


function getConfidencePercent(value: number): number {
    const percent = value <= 1
        ? Math.round(value * 100)
        : Math.round(value)

    return Math.max(0, Math.min(100, percent))
}
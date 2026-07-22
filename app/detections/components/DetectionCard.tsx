'use client'

import {Badge, Card, Group, Image, Progress, Stack, Text} from '@mantine/core'
import {TDetection} from '@/app/types'
import {useState} from 'react'
import ImageModal from '@/components/ImageModal'
import {clampConfidence, formatDate, formatTime} from '@/app/lib/dateUtils'

type DetectionCardViewProps = {
    detection: TDetection;
};


export default function DetectionCardView({detection}: DetectionCardViewProps) {
    const createdAt = new Date(detection.created_at)
    const confidencePercent = clampConfidence(detection.confidence)
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    return (
        <Card
            withBorder
            radius="md"
            shadow="sm"
            padding="md"
        >
            <Card.Section>
                <Image
                    src={detection.image_url}
                    alt={`Detection image from ${detection.created_at}`}
                    height={220}
                    fit="cover"
                    onClick={()=> setModalOpen(true)}
                />
            </Card.Section>

            <Stack gap="xs" mt="sm">
                <Group justify="space-between" align="flex-start" gap="sm">
                    <Badge variant="light">{detection.label}</Badge>

                    <Group gap="xs" flex={1} justify="flex-end" wrap="nowrap">
                        <Progress
                            value={confidencePercent}
                            size="sm"
                            radius="xl"
                            w={120}
                        />

                        <Text size="sm" c="dimmed" visibleFrom="sm">
                            • {confidencePercent}% confidence
                        </Text>
                    </Group>
                </Group>

                <Text size="sm" c="dimmed">
                    <time>{formatTime(createdAt)}</time>
                    ,{' '}
                    <time>{formatDate(createdAt)}</time>
                </Text>
            </Stack>
            {!modalOpen ? null : (
                <ImageModal
                    title={`Detection ${detection.id}`}
                    src={detection.image_url}
                    description={`${detection.label} detected at ${formatTime(createdAt)} on ${formatDate(createdAt)}`}
                    onClose={()=> setModalOpen(false)}
                />
            )}
        </Card>
    )
}


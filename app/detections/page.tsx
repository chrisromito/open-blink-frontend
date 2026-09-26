'use client'

import {useEffect} from 'react'
import {Alert, Group, Loader, MultiSelect, Stack} from '@mantine/core'
import DetectionCard from '@/app/detections/components/DetectionCard'
import {
    DetectionsProvider,
    useDetectionsStore
} from '@/app/detections/store/provider'

export default function DetectionsPage() {
    return (
        <DetectionsProvider>
            <DetectionsPageContent/>
        </DetectionsProvider>
    )
}

function DetectionsPageContent() {
    const labels = useDetectionsStore((state) => state.labels)
    const selectedLabels = useDetectionsStore((state) => state.selectedLabels)

    const devices = useDetectionsStore((state) => state.devices)
    const selectedDeviceIds = useDetectionsStore((state) => state.selectedDeviceIds)

    const detections = useDetectionsStore((state) => state.detections)

    const loadingFilters = useDetectionsStore((state) => state.loadingFilters)
    const loadingDetections = useDetectionsStore((state) => state.loadingDetections)
    const error = useDetectionsStore((state) => state.error)

    const loadFilters = useDetectionsStore((state) => state.loadFilters)
    const setSelectedLabels = useDetectionsStore((state) => state.setSelectedLabels)
    const setSelectedDeviceIds = useDetectionsStore((state) => state.setSelectedDeviceIds)

    console.log(JSON.stringify({ labels, selectedLabels }, null, 4))

    useEffect(() => {
        const controller = new AbortController()

        void loadFilters(controller)

        return () => {
            controller.abort()
        }
    }, [loadFilters])

    const loading = loadingFilters || loadingDetections

    return (
        <div className="w-full">
            <Group className="p-4">
                <div className="px-4">
                    <MultiSelect
                        label="Labels"
                        data={labels}
                        disabled={loadingFilters}
                        onChange={(value) => {
                            void setSelectedLabels(value)
                        }}
                        value={selectedLabels}
                    />
                </div>

                <div className="px-4">
                    <MultiSelect
                        label="Devices"
                        data={devices.map(({id, name}) => ({
                            value: String(id),
                            label: name
                        }))}
                        disabled={loadingFilters}
                        onChange={(value) => {
                            void setSelectedDeviceIds(value.map(Number))
                        }}
                        value={selectedDeviceIds.map(String)}
                    />
                </div>
            </Group>

            <div className="px-4">
                {error ? (
                    <Alert color="red" mb="md">
                        {error}
                    </Alert>
                ) : null}

                {loading ? <Loader mb="md"/> : null}

                <Stack gap={6} justify="center">
                    {detections.map((detection) => (
                        <DetectionCard
                            key={detection.id}
                            detection={detection}
                        />
                    ))}
                </Stack>
            </div>
        </div>
    )
}
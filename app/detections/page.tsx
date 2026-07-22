'use client'
import {Group, Stack} from '@mantine/core'
import {useState} from 'react'
import LabelGroup from '@/app/detections/components/LabelGroup'
import DeviceSelect from '@/app/detections/components/DeviceSelect'
import DetectionCard from '@/app/detections/components/DetectionCard'
import {getUrl} from '@/app/config'
import {TDetection} from '@/app/types'
import {sortByCreatedAt} from '@/app/lib/sortBy'


export default function DetectionsPage() {
    const [deviceIds, setDeviceIds] = useState<number[]>([])
    const [labels, setLabels] = useState<string[]>([])
    const [detections, setDetections] = useState<TDetection[]>([])

    const onFiltersChange = async () => {
        const params = new URLSearchParams()
        labels.forEach(label => {
            params.append('label', label)
        })
        deviceIds.forEach(did => {
            params.append('device_id', String(did))
        })
        const res: TDetection[] = await fetch(getUrl('api/detection-image', params))
            .then(res => res.json())
        setDetections(sortByCreatedAt(res))
    }

    return (
        <div className="w-full">
            {/* Filter Form */}
            <Group className={"p-4"}>
                <div className={"px-4"}>
                    <LabelGroup
                        onChange={ls => {
                            setLabels(ls)
                            return onFiltersChange()
                        }}
                    />
                </div>
                <div className={"px-4"}>
                    <DeviceSelect
                        onChange={ds => {
                            setDeviceIds(ds)
                            return onFiltersChange()
                        }}
                    />
                </div>
            </Group>
            <div className={"px-4"}>
                <Stack gap={6} justify={'center'}>
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
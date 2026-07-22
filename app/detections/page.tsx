'use client'
import {Group, MultiSelect, Stack} from '@mantine/core'
import {useEffect, useState} from 'react'
import DetectionCard from '@/app/detections/components/DetectionCard'
import {getUrl} from '@/app/config'
import {TDetection, TDevice} from '@/app/types'
import {sortByCreatedAt} from '@/app/lib/sortBy'
import {getDevices, getLabels} from '@/app/lib/devices'


export default function DetectionsPage() {
    // Labels
    const [labels, setLabels] = useState<string[]>([])
    const [selectedLabels, setSelectedLabels] = useState<string[]>([])
    // Devices
    const [devices, setDevices] = useState<TDevice[]>([])
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    // Detections
    const [detections, setDetections] = useState<TDetection[]>([])

    const onFiltersChange = async () => {
        const params = new URLSearchParams()
        labels.forEach(label => {
            params.append('label', label)
        })
        selectedIds.forEach(did => {
            params.append('device_id', String(did))
        })
        const res: TDetection[] = await fetch(getUrl('api/detection-image', params))
            .then(res => res.json())
        setDetections(sortByCreatedAt(res))
    }

    useEffect(() => {
        const controller = new AbortController()
        getLabels(controller)
            .then(ls => {
                const sortedLabels: string[] = ls.toSorted()
                setLabels(sortedLabels)
                setSelectedLabels(sortedLabels)
            })
            .catch(err => {
                if (err.name === 'AbortError') {
                    return Promise.resolve([])
                }
                throw err
            })

        getDevices(controller)
            .then(ds => {
                setDevices(ds)
                setSelectedIds(ds.map(({id}) => id))
                return ds
            })
            .then(onFiltersChange)
            .catch(err => {
                if (err.name === 'AbortError') {
                    return Promise.resolve([])
                }
                return Promise.reject(err)
            })

        return () => {
            controller.abort()
        }
    }, [])

    return (
        <div className="w-full">
            {/* Filter Form */}
            <Group className={"p-4"}>
                <div className={"px-4"}>
                    <MultiSelect
                        label="Labels"
                        data={labels}
                        onChange={value => setSelectedLabels(value)}
                        value={selectedLabels}
                    />
                </div>
                <div className={"px-4"}>
                    <MultiSelect
                        label="Devices"
                        data={devices.map(({id, name}) => (
                            {
                                value: String(id),
                                label: name
                            }
                        ))}
                        onChange={value => {
                            const ids: number[] = value.map(Number)

                            setSelectedIds(ids)
                        }}
                        value={selectedIds.map(String)}
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
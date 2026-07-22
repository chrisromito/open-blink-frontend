import {useCallback, useEffect, useState} from 'react'
import {MultiSelect} from '@mantine/core'
import type {TDevice} from '@/app/types'
import {getDevices} from '@/app/lib/devices'


export interface TDeviceSelectProps {
    onChange(value: number[]): void
}

export default function DeviceSelect({onChange}: TDeviceSelectProps) {
    const [devices, setDevices] = useState<TDevice[]>([])
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    const handleChange = useCallback((nextValue: string[]) => {
        const ids: number[] = nextValue.map(Number)
        onChange(ids)
        setSelectedIds(ids)
    }, [onChange])

    useEffect(() => {
        const controller = new AbortController()
        getDevices(controller)
            .then(ds => {
                setDevices(ds)
                handleChange(ds.map(({id}) => String(id)))
                return ds
            })
            .catch(err => {
                console.warn(`DeviceSelect -> Catch ${err.name}`)
                if (err.name === 'AbortError') {
                    return Promise.resolve([])
                }
                return Promise.reject(err)
            })

        return () => {
            controller.abort()
        }
    }, [handleChange])

    return (
        <MultiSelect
            label="Devices"
            data={devices.map(({id, name}) => (
                {
                    value: String(id),
                    label: name
                }
            ))}
            onChange={handleChange}
            value={selectedIds.map(String)}
        />
    )
}
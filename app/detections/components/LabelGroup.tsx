import {MultiSelect} from '@mantine/core'
import {useCallback, useEffect, useState} from 'react'
import {getLabels} from '@/app/lib/devices'


export interface TLabelSelectProps {
    onChange(value: string[]): void
}

export default function LabelGroup({onChange}: TLabelSelectProps) {
    const [labels, setLabels] = useState<string[]>([])
    const [selectedLabels, setSelected] = useState<string[]>([])

    const handleChange = useCallback((nextValue: string[]) => {
        setSelected(nextValue)
        onChange(nextValue)
    }, [onChange])

    useEffect(() => {
        const controller = new AbortController()
        getLabels(controller)
            .then(ls => {
                setLabels(ls.toSorted())
                handleChange(ls)
            })
            .catch(err => {
                console.warn(`\n\nLabelGroup Catch -> ${err.name}\n\n`)
                if (err.name === 'AbortError') {
                    return Promise.resolve([])
                }
                throw err
            })

        return () => {
            controller.abort()
        }
    }, [handleChange])

    return (
        <MultiSelect
            label="Labels"
            data={labels}
            onChange={handleChange}
            value={selectedLabels}
        />
    )
}
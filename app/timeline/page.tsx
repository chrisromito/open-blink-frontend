'use client'

import {Suspense} from 'react'
import TimelineClient from '@/app/timeline/components/TimelineClient'
import {TimelineProvider} from '@/app/timeline/store/provider'

export default function TimelinePage() {
    return (
        <Suspense fallback={<Fallback/>}>
            <TimelineProvider>
                <TimelineClient/>
            </TimelineProvider>
        </Suspense>
    )
}

const Fallback = () => (
    <div>Loading timeline...</div>
)
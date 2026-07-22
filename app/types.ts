export type TDevice = {
    id: number
    name: string
    device_url: string
}

export type TDetection = {
    id: number | string;
    image_url: string;
    created_at: string | Date;
    label: string;
    confidence: number;
    bbox?: unknown;
    device_id?: number | string;
};


export type TDetectionEvent = {
    id: number
    created_at: string
    ended_at: string
    device_id: number
    state: number
    labels: string[]
}


export type TDetectionDetail = {
    id: number
    created_at: string
    ended_at: string
    device_id: number
    state: number
    details: TEventDetails[]
}


export type TEventDetails = {
    id: number
    created_at: string
    image_url: string
    detections: TDetectionLite[] | null
}


export type TDetectionLite = {
    id: number
    confidence: number
    label: string
}

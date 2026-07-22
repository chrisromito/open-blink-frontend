export function anyToDate(value: string | Date | number): Date {
    return new Date(value)
}

export function formatTime(date: Date): string {
    return new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date)
}

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    }).format(date)
}

export function clampConfidence(confidence: number): number {
    return Math.max(0, Math.min(100, Math.trunc(confidence * 100)))
}

export function formatDateTime(value: string): string {
    if (!value || value.startsWith('0001-01-01')) {
        return '—'
    }

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return '—'
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(date)
}
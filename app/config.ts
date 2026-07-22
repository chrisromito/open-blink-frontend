export const ApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export function getUrl(path: string, params?: URLSearchParams): URL {
    const fullUrl = new URL(path, ApiUrl)
    if (params) {
        for (const [key, value] of params?.entries()) {
            fullUrl.searchParams.set(key, value)
        }
    }
    return fullUrl
}
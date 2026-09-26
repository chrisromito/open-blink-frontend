const getApiUrl = (): string => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
export const ApiUrl: string = getApiUrl()

export function getUrl(path: string, params?: URLSearchParams): URL {
    const fullUrl = new URL(path, ApiUrl)
    if (params) {
        for (const [key, value] of params?.entries()) {
            fullUrl.searchParams.append(key, value)
        }
    }
    return fullUrl
}
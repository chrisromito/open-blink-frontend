export function sortBy(getter) {
    return (list, asc: boolean = false) => {
        return list.toSorted((left, right) => {
            const leftValue = getter(left)
            const rightValue = getter(right)
            return asc ? leftValue - rightValue : rightValue - leftValue
        })
    }
}

export const sortByName = sortBy(({name}) => name)

export const sortByCreatedAt = sortBy(({created_at}) => new Date(created_at).getTime())
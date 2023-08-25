export const DateToTimestamp = (
    year: number, 
    monthIndex: number, 
    date?: number | undefined, 
    hours?: number | undefined, 
    minutes?: number | undefined, 
    seconds?: number | undefined, 
    ms?: number | undefined
): string => {
    const specificDate = new Date(Date.UTC(year, monthIndex, date, hours, minutes, seconds, ms))
    const unixTimestamp = Math.floor(specificDate.getTime() / 1000)
    return unixTimestamp.toString()
}

export const TimestampToDate = (unixTimestamp: string): string => {
    const timestamp = 1674777600
    const date = new Date(parseInt(unixTimestamp) * 1000)

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    const formattedDate = `${day}/${month}/${year}`
    return formattedDate
}
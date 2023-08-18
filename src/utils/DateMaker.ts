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
    const dateInMiliseconds = parseInt(unixTimestamp) * 1000
    const convertedDate: string = new Date(dateInMiliseconds).toLocaleDateString()
    return convertedDate
}
export default function () {
    return [
        {
            text: '今天',
            value: new Date(),
        },
        {
            text: '明天',
            value: () => {
                const date = new Date()
                date.setTime(date.getTime() + 3600 * 1000 * 24)
                return date
            },
        },
        {
            text: '一周後',
            value: () => {
                const date = new Date()
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
                return date
            },
        },
    ]
}

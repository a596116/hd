interface responseResult<T> {
    code: number
    message: string
    type: 'success' | 'error'
    data: T
}

interface responseData<T> {
    code: number
    message: string
    type: 'success' | 'error'
    data: T
    current_page?: number
    last_page?: number
    total?: number
    per_page?: number
}
interface responseResult<T> {
  status: boolean
  message: string
  modifydate: string
  data: T
}

interface responseData<T> {
  status: boolean
  message: string
  modifydate: string
  data: T
  current_page?: number
  last_page?: number
  total?: number
  per_page?: number
}

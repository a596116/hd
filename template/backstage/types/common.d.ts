interface IRadioTable {
  title: string
  search_keyword: string
  showTab?: boolean
  code:
    | 'all_number'
    | 'manufacturer'
    | 'customer'
    | 'product'
    | 'product2'
    | 'bank'
    | 'employee'
    | 'manufacturer,customer'
  selected?: any
  filter?: any
  func_type: 1 | 2
  columns: any[]
  // 其他欄位
  [key: string]: any
}

interface IColumns {
  label: string
  prop: string
  width?: number | string
  formatter?: true | false
  sort?: 'no'
  align?: 'left' | 'center' | 'right'
  path?: string
  params?: string
  query?: any
  target?: '_blank' | '_self' | '_parent' | '_top'
  type?:
    | 'image'
    | 'date'
    | 'input'
    | 'tag'
    | 'alert'
    | 'switch'
    | 'preview'
    | 'category'
    | 'link'
    | 'list'
    | 'status'
    | 'money'
}

interface IRadio {
  api: string
  columns: IColumns[]
  title: string
  type?: number //刊登類型
  selected?: any
  search_keyword?: string
}

// errors
type IErrors<T> = Partial<Record<keyof T, string>>

// response?.data?.errors
interface I422Error<T> {
  response: {
    status: number
    data: {
      errors: {
        [K in Extract<keyof T, string>]: string[]
      }
    }
  }
}

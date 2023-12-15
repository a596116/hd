interface formColumnsType {
  label: string
  prop: string
  align?: 'left' | 'center' | 'right'
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
  width?: number
  formatter?: boolean
  sort?: string
}

interface formColumnsType {
  title: string
  name: string
  error_name?: string
  icon?: string
  type?:
    | 'input'
    | 'textarea'
    | 'image'
    | 'preview'
    | 'radio'
    | 'checkbox'
    | 'tag'
    | 'password'
    | 'select'
    | 'content'
    | 'list'
  options?: any
  readonly?: boolean
  disabled?: boolean
  placeholder?: string
  value?: any
}

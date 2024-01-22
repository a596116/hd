import { isEmpty } from 'lodash-es'

/**
 * @description: 驗證email
 */
export const validateEmail = (rule: any, value: any, callback: any) => {
  if (value !== '') {
    const reg = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
    if (!reg.test(value)) {
      return callback(new Error('Email格式不正確'))
    } else {
      return callback() // *验证成功的地方必须callback()
    }
  } else {
    return callback(new Error('請輸入Email'))
  }
}

/**
 * @description: 驗證手機號碼
 */
export const validatePhones = (rule: any, value: any, callback: any) => {
  if (!isEmpty(value)) {
    const reg = /^09\d{8}$/
    if (!reg.test(value)) {
      return callback(new Error('手機號碼格式不正確'))
    } else {
      return callback() // *验证成功的地方必须callback()
    }
  } else {
    if (rule.required) {
      return callback(new Error('手機號碼為必填欄位'))
    } else {
      return callback()
    }
  }
}

/**
 * @description: 驗證網址
 */
export const validateUrl = (rule: any, value: any, callback: any) => {
  if (!isEmpty(value)) {
    const reg = /^(https:\/\/)/
    if (reg.test(value)) {
      return callback(new Error('請刪除https://'))
    } else {
      return callback() // *验证成功的地方必须callback()
    }
  } else {
    if (rule.required) {
      return callback(new Error('連結為必填欄位'))
    } else {
      return callback()
    }
  }
}

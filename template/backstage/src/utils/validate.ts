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
    if (value !== '') {
        const reg = /^09\d{8}$/
        if (!reg.test(value)) {
            return callback(new Error('手機號碼格式不正確'))
        } else {
            return callback() // *验证成功的地方必须callback()
        }
    } else {
        return callback(new Error('請輸入手機號碼'))
    }
}
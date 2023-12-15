export const useListEmptyCheck = (lists: any, val: string, isNumber = false, canZero = false) => {
  if (isNumber) {
    if (canZero) {
      //   return lists.every((x) => Number(x[val] || 0) >= 0)
      return true
    }
    return lists.every((x: any) => Number(x[val] || 0) > 0)
  } else {
    return lists.every((x: any) => !!x[val])
  }
}

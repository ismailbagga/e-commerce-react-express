export const debounce = (callBack: Function, delay = 1000) => {
  let timeout: NodeJS.Timeout
  return (...args: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => callBack(...args), delay)
  }
}
export const throttle = (callback: Function, delay = 1000) => {
  let shouldWait = false
  let pendingCallArgs: any[] | undefined
  return (...args: any[]) => {
    if (shouldWait) {
      pendingCallArgs = args
      return
    }

    callback(...args)
    shouldWait = true

    setTimeout(() => {
      shouldWait = false
      if (pendingCallArgs === undefined) return

      callback(...pendingCallArgs)
      pendingCallArgs = undefined
    }, delay)
  }
}

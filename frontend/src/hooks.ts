import Api from 'api'
import React from 'react'
import { getLocalStorageValue, setLocalStorageValue } from 'utils'

export function useLocalStorage(key: string): [any, (val: any) => void] {
  const [value, setValue] = React.useState<any>(getLocalStorageValue(key))
  const firstRun = React.useRef(true)
  React.useEffect(() => {
    if (!firstRun) {
      setLocalStorageValue(key, value)
    }
    firstRun.current = false
  }, [key, value])

  return [value, setValue]
}

export function useAdminStatus(): boolean {
  const [userToken] = useLocalStorage('userToken')
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false)
  React.useEffect(() => {
    Api.getAdminStatus(userToken).then((res) => {
      setIsAdmin(res.data.isAdmin)
    })
  }, [])
  return isAdmin
}

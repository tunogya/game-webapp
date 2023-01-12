import {useCallback, useEffect, useState} from "react";
import axios from "axios";

const useTelegramUser = (userId: string | string[] | undefined) => {
  const [user, setUser] = useState<{
    username: string,
    first_name: string,
    last_name: string,
    avatar_url: string,
  }>({
    username: '',
    first_name: '',
    last_name: '',
    avatar_url: '',
  });

  const getUserInfo = useCallback(async () => {
    if (!userId) {
      return
    }
    try {
      const res = await Promise.all([
        axios({
          method: 'get',
          url: `https://api.wizardingpay.com/tg/user?userId=${userId}`,
        }),
        axios({
          method: 'get',
          url: `https://api.wizardingpay.com/tg/user?userId=${userId}`,
        })
      ])
      setUser({
        username: res[0].data.username,
        first_name: res[0].data.first_name,
        last_name: res[0].data.last_name,
        avatar_url: `https://static.wizardingpay.com/avatar/${userId}.jpg`
      })
    } catch (e) {
      console.log(e)
    }
  }, [userId])

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo])

  return {
    user
  }
}

export default useTelegramUser
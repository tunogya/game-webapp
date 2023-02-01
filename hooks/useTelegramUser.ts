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
      const res = await axios({
          method: 'get',
          url: `/api/users/${userId}`,
        })
      setUser({
        username: res.data.username,
        first_name: res.data.first_name,
        last_name: res.data.last_name,
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
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
          url: `https://tsxzkf7krxbgj5cbqmhbwgbni40couxa.lambda-url.ap-northeast-1.on.aws/?userId=${userId}`,
        }),
        axios({
          method: 'get',
          url: `https://dcelk3jpf4neqyx52usmjar5x40fxvqw.lambda-url.ap-northeast-1.on.aws/?userId=${userId}`,
        })
      ])
      setUser({
        username: res[0].data.username,
        first_name: res[0].data.first_name,
        last_name: res[0].data.last_name,
        avatar_url: `https://wizardingpay.s3.ap-northeast-1.amazonaws.com/avatar/${userId}.jpg`
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
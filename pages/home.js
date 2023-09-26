import { useState, useEffect } from "react";
import Head from "next/head";
import { Button } from "antd";
import axios from "../axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  const { query, isReady } = router;
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if (isReady) {
      init();
    }
  }, [isReady]);

  const init = () => {
    if (Cookies.get("token")) {
      getUserInfo();
    } else if (query.ticket) {
      verifyTicket({ ticket: query.ticket });
    } else if(query.isLogin === '2' || Cookies.get('isLogin' === '2')) { // 登录页面的域名也未登录
      Cookies.set('isLogin', '2') 
    }else {
      redirectUrl();
    }
  };

  const redirectUrl = () => {
    const serviceURL = window.location.href;
    window.location.replace(
      // `http://a.com:10000/login?serviceURL=${serviceURL}`
      `http://localhost:3000/login?serviceURL=${encodeURIComponent(serviceURL)}`
    );
  };

  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const { status, data } = await axios.post("/api/userInfo");
      if (status === 200) {
        setUserInfo(data.data);
      } else {
        redirectUrl();
      }
    } catch (err) {
      redirectUrl();
    }
  };

  // 验证sso ticket
  const verifyTicket = async () => {
    try {
      const { status, data } = await axios.post("/api/verifyTicket", {
        ticket: query.ticket,
      });
      if (status === 200) {
        Cookies.set("token", data.data.token);
        getUserInfo();
      } else {
        redirectUrl();
      }
    } catch (err) {
      redirectUrl();
    }
  };

  return (
    <>
      <Head>
        <title>home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        {userInfo.email && (
          <>
            <div>
              当前登录账号:
              <span style={{ color: "skyblue" }}>{userInfo.email}</span>
            </div>
            <Button>退出登录</Button>
          </>
        )}
      </div>
    </>
  );
}

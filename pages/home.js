import { useState, useEffect } from "react";
import Head from "next/head";
import { Button } from "antd";
import axios from "../axios";
import Cookies from "js-cookie";

import styles from "../styles/Home.module.css";

export default function Home() {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if (Cookies.get("token")) {
      getUserInfo();
    } else {
      window.addEventListener("message", function (event) {
        // 判断消息是否来自可信任的源
        // if (event.origin === '') {
          console.log(event)
        // console.log("message: " + JSON.parse(event.data));
        // }
      });
    }
  }, []);

  const redirectUrl = () => { // 跳转登录页面
    // window.location.replace(`http://localhost:3000/login`);
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

  return (
    <>
      <Head>
        <title>home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        {userInfo.email ? (
          <>
            <div>
              当前登录账号:
              <span style={{ color: "skyblue" }}>{userInfo.email}</span>
            </div>
            <Button>退出登录</Button>
          </>
        ) : (
          <div style={{ width: 200, height: 100 }}>
            <iframe src="http://a.com:10000/login" />
          </div>
        )}
      </div>
    </>
  );
}

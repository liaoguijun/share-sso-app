import { useEffect, useState } from "react";
import Head from "next/head";
import { Form, Input, Button, message } from "antd";
import axios from "../axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import styles from "../styles/Home.module.css";
import { replaceQueryString, removeParam, addParam } from '../utils'

// case1：跳转到登录页面（serviceURL如果未携带会默认一个URL）
  // 未登录：登录后返回ticket, serviceURL携带ticket返回
  // 已登录：根据serviceURL返回ticket, serviceURL携带ticket返回



export default function Login() {
  const [form] = Form.useForm();
  const { query, isReady } = useRouter();
  let { serviceURL, needLogin } = query; // serviceURL needLogin: 1: serviceUrl必须登录才能访问 2: serviceUrl不用登录也可以访问
  const [init, setInit] = useState(false); 

  useEffect(() => {
    if (isReady) {
      if (Cookies.get("token")) {
        setInit(false); // 不显示登录表单
        getServiceTicket(); // 获取ticket
        return;
      }else if(needLogin === '1') { // serviceUrl一定要登录才能访问
        setInit(true)
      }else {
        let _serviceURL = removeParam( 'ticket', serviceURL)
        _serviceURL = addParam('isLogin', '2', _serviceURL)
        window.location.replace(_serviceURL);
      }
    }
  }, [isReady]);

  const getServiceTicket = async () => {
    try {
      if (!serviceURL) {
        serviceURL = `${window.location.origin}/home`;
      }

      const { data, status } = await axios.post("/api/getServiceTicket", {
        serviceURL,
        token: Cookies.get('token')
      });

      if (status === 200) {
        backUrl(serviceURL, data.data.ticket)
      }else {
        // token过期或者其他
        setInit(true) //显示登录表单 
        Cookies.remove('token')
      }
    } catch (err) {}
  };

  const onSubmit = async (values) => {
    try {
      if (!serviceURL) {
        serviceURL = `${window.location.origin}/home`;
      }
      await form.validateFields();
      const { email, password } = values;
      const { data, status } = await axios.post("/api/login", {
        email,
        password,
        serviceURL,
      });
      if (status === 200) {
        Cookies.set('token', data.data.token)
        getServiceTicket()
      }
    } catch (err) {
      message.error('用户名或密码错误')
    }
  };

  const backUrl = (serviceURL, ticket) => {
    if(serviceURL.includes('ticket')) {
      const _serviceURL = replaceQueryString(serviceURL, 'ticket', ticket)
      window.location.replace(_serviceURL);
    }else {
      window.location.replace(`${serviceURL}?ticket=${ticket}`);
    }
  }

  return init ? (
    <>
      <Head>
        <title>login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <div>登录</div>
        <br />
        <Form name={form} onFinish={onSubmit}>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, message: "请输入邮箱" }]}
            initialValue={"ben@krquant.com"}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
            initialValue={"abcd1234"}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">登录</Button>
          </Form.Item>
        </Form>
      </div>
    </>
  ) : null;
}

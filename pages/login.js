import { useEffect, useState } from "react";
import Head from "next/head";
import { Form, Input, Button, message } from "antd";
import axios from "../axios";
import Cookies from "js-cookie";

import styles from "../styles/Home.module.css";

export default function Login() {
  const [form] = Form.useForm();
  const [init, setInit] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    console.log(document.cookie)
    if (token) {
      setInit(false); // 不显示登录表单
      console.log("login 获取到token");
      window.postMessage(JSON.stringify({ token }), "*");
      return;
    }
    console.log("login 未获取到token");
    setInit(true);
  }, []);

  const onSubmit = async (values) => {
    try {
      await form.validateFields();
      const { email, password } = values;
      const { data, status } = await axios.post("/api/login", {
        email,
        password,
      });
      if (status === 200) {
        Cookies.set("token", data.data.token);
      }
    } catch (err) {
      message.error("用户名或密码错误");
    }
  };

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

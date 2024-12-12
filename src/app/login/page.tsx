"use client";
import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LoginOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { authService } from "@/services/auth";
import type { LoginParams } from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { checkAuth } = useAuth();

  const handleLogin = async (values: LoginParams) => {
    setLoading(true);
    try {
      const response = await authService.login(values);
      localStorage.setItem("token", response.access_token);
      // 检查并更新认证状态
      await checkAuth();
      message.success("登录成功");
      router.push(`/dashboard`);
    } catch (error: any) {
      message.error(error.response?.data?.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl"
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Welcome Back</h1>
            <p className="text-primary-200 text-xl">Sign in to your account</p>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
            className="space-y-8"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-primary-600 text-2xl" />}
                placeholder="Username"
                size="large"
                className="h-16 text-lg bg-white/80 border-white/20 text-primary-900 placeholder:text-primary-400
                          focus:bg-white focus:border-primary-300 hover:border-primary-400 transition-colors
                          [&>input]:text-primary-900 [&>input]:placeholder:text-primary-400"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-primary-600 text-2xl" />}
                placeholder="Password"
                size="large"
                className="h-16 text-lg bg-white/80 border-white/20 text-primary-900 placeholder:text-primary-400
                          focus:bg-white focus:border-primary-300 hover:border-primary-400 transition-colors
                          [&>input]:text-primary-900 [&>input]:placeholder:text-primary-400
                          [&_.ant-input-password-icon]:text-primary-600"
              />
            </Form.Item>

            <Form.Item name="channel" hidden>
              <Input />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                icon={<LoginOutlined className="text-2xl" />}
                className="h-16 text-xl bg-gradient-to-r from-secondary via-secondary-light to-secondary 
                          hover:opacity-90 border-none shadow-xl hover:shadow-2xl transition-all duration-300
                          font-medium"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}

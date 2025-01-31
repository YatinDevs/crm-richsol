import React, { useState } from "react";
import { Form, Input, Button, message, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { logo } from "../../assets/index";
import useAuthStore from "../../store/authStore";

const SignupPage = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [form] = Form.useForm();
  const signUp = useAuthStore((state) => state.signUp);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    if (!agreedToTerms) {
      message.error(
        "You must agree to the Terms and Conditions before signing up."
      );
      return;
    }
    try {
      await signUp(values);
      message.success("Signup successful");
      form.resetFields();
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error.message);
      message.error("Signup failed. Please try again.");
    }
  };

  const validatePasswords = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("The two passwords do not match!"));
    },
  });

  return (
    <div className="h-[100vh] absolute max-md:w-[100vw] w-[100vw] bg-blue-400 flex justify-center items-start">
      <div className="mx-auto max-w-lg max-md:max-w-lg max-md:w-[1280px] w-[1280px] bg-white rounded-b-2xl border-blue-100 border-l-2 border-r-2 border h-[55vh]">
        <div className="flex justify-center flex-col items-center mb-32 mt-16">
          <img src={logo} className="w-20 h-20 m-1" alt="Logo" />
          <h1 className="text-center">
            <span className="text-[32px] font-kanit text-center text-gray-700 font-extrabold uppercase">
              System Solutions Pvt. ltd.
            </span>
          </h1>
        </div>
        <div className="relative mx-4 px-6 md:mx-6 border-8 pt-10 rounded-2xl border-blue-500 bg-white">
          <Form
            form={form}
            onFinish={handleSubmit}
            className="flex flex-col bg-white p-5 pb-2 rounded-2xl"
          >
            <div className="inputArea space-y-2 w-full">
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input
                  name="username"
                  placeholder="Username"
                  className="shadow-md h-12 input-blue"
                />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Email Id" },
                  {
                    // pattern: /^\d{10}$/,
                    message: "Contact must be a 10 digit number",
                  },
                ]}
              >
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter Email Id"
                  className="shadow-md h-12 input-blue"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters long",
                  },
                ]}
              >
                <Input.Password
                  name="password"
                  placeholder="Password"
                  className="shadow-md h-12 input-blue"
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  validatePasswords,
                ]}
              >
                <Input.Password
                  name="confirmPassword"
                  placeholder="Repeat Password"
                  className="shadow-md h-12 input-blue"
                />
              </Form.Item>
            </div>
            <div className="actionArea w-full text-left">
              <div className="mb-2 text-slate-600 text-sm cursor-pointer">
                <Checkbox
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                >
                  <a className="text-blue-400">
                    I agree with the Terms and Conditions
                  </a>
                </Checkbox>
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full rounded-xl shadow-lg active:scale-95 !bg-blue-600 !active:bg-blue-600 !focus:bg-blue-600 hover:bg-blue-800 text-white px-4 transition-all"
                >
                  Create Account
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

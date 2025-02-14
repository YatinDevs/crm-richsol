import React, { useState } from "react";
import { Form, Input, Button, message, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { logo } from "../../assets/index";
import useAuthStore from "../../store/authStore";

function AuthPage() {
  const [rememberMeTerms, setRememberMeTerms] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [form] = Form.useForm();
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (values) => {
    if (!rememberMeTerms) {
      message.info(
        "You can check 'Remember Me' for a more convenient experience."
      );
    }
    try {
      const response = await login(formData);
      console.log("Response:", response);

      if (response.success) {
        message.success(response.message);
        form.resetFields();
        navigate("/dashboard");
      } else {
        throw new Error(response.error || "Login failed");
      }
    } catch (error) {
      console.error("Login Issue:", error);
      message.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className=" h-[100vh] bg-blue-400 flex justify-center items-start">
      <div className="mx-auto max-w-lg w-[1280px] bg-white rounded-b-2xl border-blue-100 border-l-2 border-r-2 h-[55vh]">
        <div className="flex justify-center flex-col items-center mb-32 mt-16">
          <img src={logo} className="w-20 h-20 m-1" alt="Logo" />
          <h1 className="text-center">
            <span className="text-[32px] font-kanit text-gray-700"> </span>
            <span className="block font-kanit text-gray-700 text-[20px]">
              System Solutions Pvt. Ltd.
            </span>
          </h1>
        </div>

        <div className="relative mx-4 px-6 md:mx-6 border-8 pt-10 rounded-2xl border-blue-500 bg-white">
          <Form
            form={form}
            onFinish={handleSubmit}
            className="flex flex-col justify-between bg-white p-5 rounded-2xl"
          >
            <div className="inputArea space-y-2 w-full ">
              <div className="formInput pt-5 ">
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    {
                      type: "email",
                      message: "Please enter a valid email address",
                    },
                  ]}
                >
                  <Input
                    name="email"
                    placeholder="Enter Email Id"
                    className="shadow-md rounded-md h-12 input-blue "
                    onChange={handleChange}
                  />
                </Form.Item>
              </div>
              <div className="formInput">
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
                    placeholder="Enter your Password"
                    className="shadow-md rounded-md h-12 input-blue"
                    onChange={handleChange}
                  />
                </Form.Item>
                <div className="text-slate-600 text-sm cursor-pointer flex items-center justify-between ">
                  <div>
                    <Checkbox
                      checked={rememberMeTerms}
                      onChange={(e) => setRememberMeTerms(e.target.checked)}
                    />{" "}
                    Remember Me
                  </div>

                  <div
                    onClick={() => navigate("/forgot-password")}
                    className="text-blue-400"
                  >
                    Forgot Password?
                  </div>
                </div>
              </div>
            </div>

            <div className="actionArea text-center py-2 w-full">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full mt-5 rounded-xl shadow-lg bg-blue-500 text-white px-4"
                >
                  Log in
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

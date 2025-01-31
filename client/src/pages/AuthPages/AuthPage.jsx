import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { logo } from "../../assets/index";
import useAuthStore from "../../store/authStore";

function AuthPage() {
  const [rememberMeTerms, setRememberMeTerms] = useState(false);
  //   const { isAuthenticated, initialize } = useAuthStore((state) => ({
  //     isAuthenticated: state.isAuthenticated,
  //     initialize: state.initialize,
  //   }));
  const [form] = Form.useForm();
  const logIn = useAuthStore((state) => state.logIn);
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    try {
      await logIn(values);
      // message.success("Login successful");
      if (!rememberMeTerms) {
        message.info(
          "You can check 'Remember Me' for a more convenient experience."
        );
      }
      form.resetFields();
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error.message);
      message.error("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    // const checkAuth = async () => {
    //   try {
    //     await initialize();
    //     if (isAuthenticated) {
    //       navigate("/home", { replace: true });
    //     }
    //   } catch (error) {
    //     console.error("Error during initialization:", error);
    //   }
    // };
    // checkAuth();
  }, []);

  return (
    <div className=" h-[100vh] absolute  max-md:w-[100vw] w-[100vw]  bg-blue-400 flex justify-center items-start">
      <div className="   mx-auto max-w-lg max-md:max-w-lg max-md:w-[1280px] w-[1280px] bg-white rounded-b-2xl  border-blue-100 border-l-2 border-r-2  border h-[55vh]">
        <div className="flex justify-center flex-col items-center  mb-32 mt-16">
          <img src={logo} className="w-20 h-20 m-1" alt="Logo" />
          <h1 className="text-center">
            <span className="text-[32px] font-kanit text-center text-gray-700 font-extrabold uppercase ">
              {" "}
            </span>
            <span className="block font-kanit  text-gray-700 text-center text-[20px]  ">
              {" "}
              System Solutions Pvt. ltd.
            </span>
          </h1>
        </div>

        <div className="relative mx-4 px-6 md:mx-6 border-8 pt-10 rounded-2xl border-blue-500 bg-white">
          <Form
            // form={form}
            // onFinish={handleSubmit}
            className="flex flex-col justify-between bg-white p-5 rounded-2xl"
          >
            <div className="inputArea space-y-2 w-full ">
              <div className="formInput pt-5 ">
                <Form.Item
                  name="contact"
                  rules={[
                    { required: true, message: "Please enter your contact" },
                    {
                      pattern: /^\d{10}$/,
                      message: "Contact must be a 10 digit number",
                    },
                  ]}
                >
                  <Input
                    name="contact"
                    placeholder="Enter Email Id"
                    className="shadow-md rounded-md h-12 input-blue "
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
                  <div>
                    <Input.Password
                      name="password"
                      placeholder="Enter your Password"
                      className="shadow-md rounded-md h-12 input-blue"
                    />
                  </div>
                </Form.Item>
                <div className=" text-slate-600 text-sm cursor-pointer flex items-center justify-between ">
                  <div>
                    {" "}
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

            <div className="actionArea text-center py-2  w-full">
              <Form.Item>
                <div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full mt-5 rounded-xl shadow-lg active:scale-95 !bg-blue-500 !active:bg-blue-600 !focus:bg-blue-600 hover:bg-blue-800 text-white px-4 transition-all"
                  >
                    Log in
                  </Button>

                  <div className="m-2 text-slate-600 text-sm cursor-pointer flex justify-between  items-center">
                    <div>Don't have an account? </div>
                    <div
                      onClick={() => navigate("/signup")}
                      className="text-blue-400"
                    >
                      Create an account
                    </div>
                  </div>
                </div>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

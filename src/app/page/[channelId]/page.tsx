"use client";
import {
  Form,
  Input,
  Button,
  message,
  Select,
  Radio,
  InputNumber,
  Tag,
  Flex,
} from "antd";
import { useParams } from "next/navigation";
import { UAParser } from "ua-parser-js";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { ajaxWithLogin } from "@/utils/request";
import { EXP_LABEL, EXP_DATA } from "@/constants";
import Heart from "@/components/Heart";
import Mask from "@/components/Mask";
import "./index.css";

// 定义响应类型
interface ApiResponse {
  data?: {
    id: string;
    [key: string]: unknown;
  };
  message?: string;
}

// 移除 FC 类型，使用普通函数组件
export default function RegisterPage() {
  const params = useParams();
  const channel = params.channelId as string; // 修改变量名以匹配表单中使用的名称

  const [hasAgreed, setHasAgreed] = useState(true);
  const [agrees, setAgrees] = useState([0, 0, 0]);
  const [form] = Form.useForm();

  useEffect(() => {
    const initializeForm = async () => {
      try {
        const parsed = UAParser(navigator.userAgent);
        form.setFieldValue("device", parsed.os.name);

        const response = await fetch("https://ipinfo.io/?token=2225a93488dea9");
        const data = await response.json();
        form.setFieldValue("ip", data.ip);
        form.setFieldValue("country", data.country);
      } catch (error) {
        console.error("Failed to initialize form:", error);
      }
    };

    initializeForm();
  }, [form]);

  const handleSubmit = () => {
    if (agrees.some((item) => item === 0)) {
      setHasAgreed(false);
    } else {
      setHasAgreed(true);
      form.validateFields().then((values) => {
        values.local_time = dayjs().format("YYYY-MM-DD HH:mm");
        values.experience = EXP_LABEL[values.experience] as string;
        ajaxWithLogin
          .post("/customers", values)
          .then((res: ApiResponse) => {
            console.log("🚀 ~ .then ~ res:", res);
            if (res?.data?.id) {
              message.success("success");
            } else {
              message.error(res?.message || "Failed");
            }
          });
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100">
      <main>
        <header className="p-6 flex justify-between items-center bg-dark shadow-lg">
          <div className="text-3xl text-white">Morgan Stanley</div>
          <div className="hidden md:block">
            <div className="text-secondary font-medium">Opening Time</div>
            <div className="text-xl text-white">7*12 HOURS</div>
          </div>
        </header>
        <section className="flex justify-center items-center bg-tg h-screen md:h-[70vh]">
          <div className=" text-sm bg-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.9)] w-4/5 p-6 text-gray-50 md:w-full lg:w-5/6 lg:text-lg md:font-mono">
            <Mask />
          </div>
        </section>
        <section className="text-2xl bg-white text-gray-400 mt-16 pt-8 pb-12">
          <div className="mx-auto text-2xl text-gray-500 w-full p-6 lg:max-w-[1200px]">
            <h2 className="text-4xl text-center text-gray-600 ">
              Capital Enhancement Plan with Over 800% Returns
            </h2>
            <p className="mt-8">
              The 4th phase of the Capital Enhancement Plan, led by Mr. Shyam,
              offers investors the opportunity to achieve returns exceeding
              800%. Currently in its initial stages, the program is designed to
              deliver exceptional value to participants.
            </p>
            <p className="mt-8">
              India, with its vast population and highly developed stock and
              financial markets, provides an ideal platform for this initiative.
              This plan aims to enhance Morgan Stanley's presence across diverse
              regions in India while offering significant benefits to
              participating investors. By fostering collaboration, we seek to
              create a mutually rewarding relationship with our investors.
            </p>
            <p className="mt-8">
              Through our specialized departments, digital platforms, and
              comprehensive services, clients can leverage the unified expertise
              and global reach of Morgan Stanley to achieve their financial
              aspirations.
            </p>
          </div>
        </section>
        <section className="py-12 bg-gradient-to-r from-dark to-primary-800 flex justify-center flex-col items-center mt-8">
          <div className="mx-auto xl:max-w-[1200px]">
            <h2 className="text-center text-white text-4xl font-bold mb-8">
              Registration for Capital Enhancement Plan
            </h2>
            <div className="rounded-lg bg-white shadow-xl mt-6 p-8 mx-6 xl:mx-0">
              <h3 className="text-center text-gray-600 text-3xl">
                Read and Agree to the Terms
              </h3>
              <section className="m-6">
                <ul className=" space-y-2">
                  <li>
                    <i>
                      1. To participate in the 4th phase of the Capital
                      Enhancement Plan, you must have strong execution skills
                      and must use the trading account provided by Morgan
                      Stanley for trading. Can you adhere to this rule?
                    </i>
                    <div>
                      <Radio.Group
                        options={[
                          { label: "Yes", value: "Y" },
                          { label: "No", value: "N" },
                        ]}
                        onChange={(e) => {
                          agrees[0] = e.target.value === "Y" ? 1 : 0;
                          setAgrees(agrees);
                        }}
                      />
                    </div>
                  </li>
                  <li>
                    <i>
                      2. Following to our instructions, we will charge a
                      commission of 15% to 30% on your profits. Do you agree to
                      this arrangement?
                    </i>
                    <div>
                      <Radio.Group
                        options={[
                          { label: "Yes", value: "Y" },
                          { label: "No", value: "N" },
                        ]}
                        onChange={(e) => {
                          agrees[1] = e.target.value === "Y" ? 1 : 0;
                          setAgrees(agrees);
                        }}
                      />
                    </div>
                  </li>
                  <li>
                    <i>
                      3. In order to achieve our common goals, you must adhere
                      to our confidentiality clauses. You are not permitted to
                      share the details of our actions, including assets and
                      specifics, with non-members to avoid disrupting our
                      strategic operations. Are you willing to accept these
                      terms?
                    </i>
                    <div>
                      <Radio.Group
                        options={[
                          { label: "Yes", value: "Y" },
                          { label: "No", value: "N" },
                        ]}
                        onChange={(e) => {
                          agrees[2] = e.target.value === "Y" ? 1 : 0;
                          setAgrees(agrees);
                        }}
                      />
                    </div>
                  </li>
                </ul>
              </section>
            </div>
            <Form
              className="text-white mt-6 mx-6"
              form={form}
              initialValues={{ channel }}
            >
              <div>
                <div className="xl:grid xl:grid-cols-3 xl:gap-4">
                  <div>
                    <div className="mb-4">
                      <div>Name:</div>
                      <div>कृपया अपना नाम भरें</div>
                    </div>
                    <Form.Item
                      name="name"
                      label=""
                      rules={[{ required: true, message: "Name is required" }]}
                    >
                      <Input placeholder="write first name" size="large" />
                    </Form.Item>
                  </div>
                  <div>
                    <div className="mb-4">
                      <div>Age:</div>
                      <div>कृपया अपनी आयु भरें</div>
                    </div>
                    <Form.Item
                      name="age"
                      label=""
                      // rules={[{ required: true, message: "Name is required" }]}
                    >
                      <InputNumber
                        className="w-full"
                        placeholder="write age"
                        size="large"
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <div className="mb-4">
                      <div>WhatsApp number:</div>
                      <div>व्हाट्सएप नंबर:</div>
                    </div>
                    <Form.Item
                      name="whatsApp"
                      label=""
                      rules={[
                        { required: true, message: "WhatsApp is required" },
                      ]}
                    >
                      <Input placeholder="WhatsApp number" size="large" />
                    </Form.Item>
                  </div>
                  <div>
                    <div className="mb-4">
                      <div>Phone number:</div>
                      <div>कृपया अपना फ़ोन नंबर भरें</div>
                    </div>
                    <Form.Item
                      name="phone"
                      label=""
                      rules={[
                        {
                          required: true,
                          message: "Phone number is required.",
                        },
                      ]}
                    >
                      <Input placeholder="Phone number" size="large" />
                    </Form.Item>
                  </div>
                  <div>
                    <div className="mb-4">
                      <div>Investment experience:</div>
                      <div>कृपया िवेश अनुभव चुनें</div>
                    </div>
                    <Form.Item name="experience" label="">
                      <Select
                        placeholder="Please choose"
                        size="large"
                        options={EXP_DATA}
                      ></Select>
                    </Form.Item>
                  </div>
                  <div>
                    <div className="mb-4">
                      <div>Available investment amount:</div>
                      <div>उपलब्ध निवेश राशि:</div>
                    </div>
                    <Form.Item
                      name="amount"
                      label=""
                      rules={[
                        {
                          required: true,
                          message: "Money to invest is required.",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Please write investable money"
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <div className="mb-4">
                      <div>Address:</div>
                      <div>कृपया अपना पता लिखें:</div>
                    </div>
                    <Form.Item
                      name="address"
                      label=""
                      rules={[
                        {
                          required: true,
                          message: "Address is required.",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        placeholder="Please write your address"
                      />
                    </Form.Item>
                  </div>
                  <div className=" col-span-2">
                    <div className="mb-4">
                      <div>The name of Whatsapp group you belong to:</div>
                      <div>आप जिस व्हाट्सएप ग्रुप से जुड़े हैं सका नाम:</div>
                    </div>
                    <Form.Item
                      name="group"
                      label=""
                      rules={[
                        { required: true, message: "Group name is required." },
                      ]}
                    >
                      <Input.TextArea
                        size="large"
                        placeholder="Please write group name.."
                      />
                    </Form.Item>
                  </div>
                  <Form.Item name="ip" label="" className="hidden">
                    <Input />
                  </Form.Item>
                  <Form.Item name="country" label="" className="hidden">
                    <Input />
                  </Form.Item>
                  <Form.Item name="device" label="" className="hidden">
                    <Input />
                  </Form.Item>
                  <Form.Item name="channel" label="" className="hidden">
                    <Input value={channel} />
                  </Form.Item>
                </div>
                <div
                  className={`text-red-500 text-2xl mb-4 ${
                    hasAgreed ? "hidden" : "block"
                  }`}
                >
                  Please agree to all terms.
                </div>
                <div>
                  <Button
                    danger
                    className="w-full hover:scale-105 transition-transform"
                    ghost
                    size="large"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </section>
        <section className="bg-white text-2xl text-gray-600 py-16">
          <h2 className=" text-gray-600 text-center pt-12 xl:pb-16 pb-8 text-3xl">
            Advantages of Morgan Stanley Trading Account
          </h2>
          <div className="p-4 flex flex-col xl:grid xl:grid-cols-3 gap-6 mx-auto xl:max-w-[1200px]">
            <div className="">
              <p>
                1. Morgan Stanley's unique 1-to-1 model: experts will tailor a
                unique investment portfolio for members based on their goals.
              </p>
              <Heart>36.6+ Lakhs</Heart>
            </div>
            <div>
              <p>
                2. Utilize Morgan Stanley' exclusive trading strategies and
                substantial capital to ensure stable returns..
              </p>
              <Heart>37.8+ Lakhs</Heart>
            </div>
            <div>
              <p>
                3. Indirectly invest in the stock market through the Morgan
                Stanley proprietary trading firm and share trading information
                with global capital companies.
              </p>
              <Heart>24.1+ Lakhs</Heart>
            </div>
            <div>
              <p>
                4. Utilize the advanced investment principles and quantitative
                trading of Morgan Stanley' proprietary trading institution to
                enhance trading efficiency and stability.
              </p>
              <Heart>64.6+ Lakhs</Heart>
            </div>
          </div>
        </section>
        <section className="bg-white ">
          <h2 className="text-3xl text-gray-600 text-center pt-12 pb-16">
            Details Of 4th Phase Capital Enhancement Plan
          </h2>
          <div className="flex flex-col xl:flex-row">
            <div className="xl:w-1/2 flex items-center text-white text-2xl bg-[#062247] p-4">
              <div className="xl:w-1/4"></div>
              <div className="xl:w-3/4 flex flex-col ">
                <div className="xl:w-7/8">
                  <p className="mt-4">
                    To further enhance Morgan Stanley' influence in the Indian
                    market, a multi-institutional joint initiative will be
                    launched in November 2024 to open more trading seat accounts
                    for Indian investors.
                  </p>
                  <p className="mt-4">
                    Investment Projects: High-quality Upper Circuit Stocks, Bulk
                    Deals, Initial Public Offerings.
                  </p>
                  <p className="mt-4">Expected Returns: 800%+</p>
                </div>
              </div>
            </div>
            <div className="relative z-10 xl:w-1/2">
              <img
                src="/background-image.png"
                alt="background"
                className="w-full h-auto"
              />
              <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-[rgba(0,0,0,0.4)] text-[#ccd230] text-3xl px-4 py-2 font-bold">
                Choice of the wize
              </div>
            </div>
          </div>
        </section>

        <div className="bg-[rgb(245,245,245)] mt-8 master">
          <section className="p-6 xl:max-w-[1200px] mx-auto text-lg text-gray-400">
            <h2 className=" text-4xl text-center text-gray-500">
              Introduction to Program Mentor
            </h2>
            <div className=" xl:flex xl:justify-center mt-12 xl:items-start">
              <img src="/teacher-7th.png" alt="master" className="xl:w-1/2" />
              <div className="mt-8 xl:ml-8 xl:mt-0">
                <p>
                  Mr. Shyamsundar Gurumoorthy is a Managing Director and Co-Head
                  of Morgan Stanley India Infrastructure. Shyam joined Morgan
                  Stanley in 2014 and has 21 years of experience. Prior to
                  joining the firm, Shyam was a founding member and partner at
                  IDFC Private Equity where he led a number of investments in a
                  range of infrastructure sectors such as power, telecom, oil &
                  gas, roads, seaports, airports, shipping and logistics. Shyam
                  started his career at ICICI Securities. Shyam received a PGDM
                  from Indian Institute of Management, Calcutta, and a BE
                  (Mechanical) from Anna University.
                </p>
              </div>
            </div>
          </section>
        </div>
        <div className="bg-[rgb(245,245,245)] mt-8 ">
          <section className="p-6 max-w-[1200px] mx-auto">
            <h2 className=" text-4xl text-center">Platform & Services</h2>
            <div className=" flex justify-center">
              <div className="grid grid-cols-3 mt-4 space-x-4">
                <div>
                  <img src="/1.png" alt="logo" />
                </div>
                <div>
                  <img src="/2.png" alt="logo" />
                </div>
                <div>
                  <img src="/3.png" alt="logo" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="mt-8 bg-gradient-to-r from-primary-700 to-primary-900 text-white p-6">
        <div className="flex flex-col md:flex-row md:max-w-[1200px] mx-auto">
          <div className="min-w-52 md:w-1/4 text-3xl">Morgan Stanley</div>
          <div className="mt-4 md:ml-6 xlw-3/4 md:mt-0">
            <h3 className=" uppercase text-3xl">Tags Populares</h3>
            <Flex gap="4px 0" wrap className="mt-2 md:mt-6">
              {[
                "themes",
                "consultant",
                "themes",
                "replacement",
                "business",
                "titles",
              ].map((item, index: number) => (
                <Tag color="geekblue" key={index}>
                  {item}
                </Tag>
              ))}
            </Flex>
          </div>
        </div>
      </footer>
      <section className="bg-dark h-16 flex justify-center items-center text-white text-sm">
        © 2024 Morgan Stanley
      </section>
    </div>
  );
}

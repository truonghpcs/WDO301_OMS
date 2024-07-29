import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  Select,
  Spin,
  TimePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./AddClass.css";
import courseApi from "../../apis/courseApi";
import userApi from "../../apis/userApi";

const { Option } = Select;

const AddClass = () => {
  const history = useHistory();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [timeLearn, setTimeLearn] = useState([]);
  const [dateLearn, setDateLearn] = useState("");

  const handleCreateClass = async (values) => {
    const local = localStorage.getItem("user");
    const user = JSON.parse(local);
    if (timeLearn.length < 1) {
      alert("Thời gian không đáp ứng yêu cầu");
      return;
    }
    const formatData = {
      mentorId: user._id,
      courseId: values.course,
      urlLearn: values.urlLearn,
      dateLearn: dateLearn,
      timeStart: timeLearn[0],
      timeEnd: timeLearn[1],
    };
    await userApi
      .createClass(formatData)
      .then((res) => {
        alert(res.message);
      })
      .catch((e) => {
        throw e;
      });
      if (timeLearn.length > 0) {
        form.resetFields();
      }
  };

  const CancelCreateRecruitment = () => {
    form.resetFields();
    history.push("/account-management");
  };
  useEffect(() => {
    const getCourse = async () => {
      await courseApi.getAllCourses().then((res) => {
        setCourses(res.data.docs);
      });
    };
    getCourse();
  }, []);
  useEffect(() => {
    setTimeout(function () {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="create_account">
      <h1
        style={{
          borderRadius: 1,
          marginTop: 40,
          marginBottom: 0,
          padding: 15,
          color: "#FFFFFF",
          background: "linear-gradient(-135deg, #000000, #000000)",
        }}
      >
        Tạo lớp học
      </h1>
      <div className="create_account__dialog">
        <Spin spinning={loading}>
          <Form
            form={form}
            onFinish={handleCreateClass}
            name="eventCreate"
            layout="vertical"
            initialValues={{
              residence: ["zhejiang", "hangzhou", "xihu"],
              prefix: "86",
            }}
            scrollToFirstError
          >
            <Form.Item
              name="course"
              label="Chọn khóa học"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn khóa học!",
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Select placeholder="Chọn khóa học">
                {courses.map((item) => {
                  return <Option value={item._id}>{item.title}</Option>;
                })}
              </Select>
            </Form.Item>

            <Form.Item name={"dateLearn"} label="Ngày học">
              <DatePicker
                onChange={(time, timeString) => {
                  console.log();
                  if (new Date(timeString) - new Date() <= 0) {
                    alert("thời gian đăng ký phải bắt đầu từ ngày mai ");
                    return;
                  }
                  setDateLearn(timeString);
                }}
              />
            </Form.Item>

            <Form.Item
              name={"timeLearn"}
              label="Thời gian học"
              rules={[
                { required: true, message: "Dữ liệu không được để trống" },
              ]}
            >
              <TimePicker.RangePicker
                minuteStep={15}
                secondStep={10}
                hourStep={1}
                onChange={(time, timeString) => {
                  if (
                    new Date(time[1]).getTime() - new Date(time[0]).getTime() <
                    7199635
                  ) {
                    alert("Thời gian tối thiểu 2 tiếng");
                    setTimeLearn([]);
                    return;
                  }
                  if (
                    new Date(time[1]).getTime() - new Date(time[0]).getTime() >
                    10799631
                  ) {
                    alert("Thời gian tối đa 3 tiếng");
                    setTimeLearn([]);
                    return;
                  }
                  setTimeLearn(timeString);
                }}
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: 10 }}
              name="urlLearn"
              label="Liên kết lớp học"
              rules={[
                { required: true, message: "Dữ liệu không được để trống" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button
                style={{
                  background: "#000",
                  color: "#FFFFFF",
                  float: "right",
                  marginTop: 20,
                  marginLeft: 8,
                }}
                htmlType="submit"
              >
                Hoàn thành
              </Button>
              <Button
                style={{
                  background: "#000",
                  color: "#FFFFFF",
                  float: "right",
                  marginTop: 20,
                }}
                onClick={CancelCreateRecruitment}
              >
                Hủy
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default AddClass;

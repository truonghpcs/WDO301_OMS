import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import courseApi from "../../../apis/courseApi";
import bookingApi from "../../../apis/bookingApi"; // Import your booking API
import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  message,
  Modal,
  notification,
  Row,
  Select,
  Spin,
} from "antd";
import triangleTopRight from "../../../assets/icon/Triangle-Top-Right.svg";
import { numberWithCommas } from "../../../utils/common";
import userApi from "../../../apis/userApi";
import CertificateApi from "../../../apis/certificateApi";

const { Panel } = Collapse;
const { Option } = Select;

const ProductDetail = () => {
  const [productDetail, setProductDetail] = useState({});
  const [recommend, setRecommend] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartLength, setCartLength] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const { id } = useParams();
  const history = useHistory();
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [certificateList, setCertificateList] = useState([]);
  const [reload, setReload] = useState(0);
  const [classes, setClasses] = useState([]);
  const [classChossen, setClassChossen] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = localStorage.getItem("user");
        const parsedUser = user ? JSON.parse(user) : null;
        setUserRole(parsedUser);
    
        const courseResponse = await courseApi.getCourseById(id);
        setProductDetail(courseResponse.data);
    
        const recommendResponse = await courseApi.getAllCourses(id);
        setRecommend(recommendResponse.data?.docs || []);
    
        // Fetch mentors (assuming you have an API for mentors)
        const response = await userApi.listUserByAdmin({
          page: 1,
          limit: 1000,
        });
        const courseCertificates = courseResponse.data.certificates;
    
        const mentors = response.data.docs.filter((user) => {
          if (user.role !== "isMentor") {
            return false;
          }
          const mentorCertificates = user.certificates;
          return courseCertificates.every((certificate) =>
            mentorCertificates.includes(certificate)
          );
        });
    
        setMentors(mentors);
    
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch course details:", error);
      }
    };
    

    fetchData();
  }, [id, cartLength, mentors]);

  const handleReadMore = (id) => {
    history.push(`/product-detail/${id}`);
    window.location.reload();
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleMentorSelect = async (value) => {
    const local = localStorage.getItem("user");
    const user = JSON.parse(local);

    const mentorChosen = mentors.filter((mentor) => {
      return mentor._id === value;
    });
    await CertificateApi.getCertificateByListId(
      mentorChosen[0].certificates
    ).then((res) => {
      setCertificateList(res.data);
    });
    setSelectedMentor(mentorChosen[0]);

    await courseApi
      .getClassesByCourseAndMentor({
        courseId: productDetail._id,
        mentorId: value,
        studentId: user._id,
      })
      .then((res) => {
        console.log(res);
        setClasses(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleBooking = async () => {
    if (!selectedMentor) {
      return notification["error"]({
        message: "Thông báo",
        description: "Vui lòng chọn mentor trước khi đăng ký!",
      });
    }
    if (classChossen.length < 1) {
      return notification["error"]({
        message: "Thông báo",
        description: "Vui lòng chọn lớp học trước khi đăng ký!",
      });
    }
    if (paymentMethod === "stripe") {
      try {
        const response = await bookingApi.createCheckoutSession({
          items: [
            { name: productDetail.title, price: productDetail.price, qty: 1 },
          ],
          userId: userRole._id,
          courseId: productDetail._id,
          mentorId: selectedMentor || null,
          customer_id: userRole._id,
          fullName: userRole.fullName,
          address: userRole.address,
          email: userRole.email,
          phone: userRole.phone,
        });

        if (response.message == "Bạn đã mua khóa học này trước đó!") {
          return notification["error"]({
            message: `Thông báo`,
            description: "Bạn đã mua khóa học này trước đó!",
          });
        }

        window.location.href = response.data;
      } catch (error) {
        console.error("Failed to create checkout session:", error);
        message.error("Failed to proceed with booking.");
      }
    } else if (paymentMethod === "wallet") {
      try {
        const response = await bookingApi.bookCourse({
          userId: userRole._id,
          courseId: productDetail._id,
          mentorId: selectedMentor || null,
          price: productDetail.price,
        });

        if (response.message === "Bạn đã mua khóa học này trước đó!") {
          return notification["error"]({
            message: `Thông báo`,
            description: "Bạn đã mua khóa học này trước đó!",
          });
        }

        if (
          response.message === "Số dư của bạn không đủ để mua khóa học này!"
        ) {
          return notification["error"]({
            message: `Thông báo`,
            description: "Số dư của bạn không đủ để mua khóa học này!",
          });
        }
        const local = localStorage.getItem("user");
        const user = JSON.parse(local);
        const data = {
          student: user._id,
          classes: classChossen,
          priceProduct: productDetail.price,
        };
        await userApi.registerClass(data, user._id).then((res) => {
          alert(res.message);
        });

        notification["success"]({
          message: `Thông báo`,
          description: "Đăng ký và thanh toán thành công qua ví!",
        });
        window.location.reload();
        // Redirect or update UI as necessary
      } catch (error) {
        console.error("Failed to book course with wallet:", error);
        message.error("Failed to book course with wallet payment.");
      }
    }
  };

  const getYoutubeId = (url) => {
    const regExp =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : "";
  };
  useEffect(() => {}, [reload]);
  return (
    <div>
      <Spin spinning={loading}>
        <Card className="container_details">
          <div className="product_detail">
            <Row gutter={12} style={{ marginTop: 20, marginBottom: 20 }}>
              <Col span={14}>
                <div className="w-10/12 mx-auto">
                  <div className="card_image">
                    <div className="bg-gray-100 border border-gray-200 p-4 rounded-md">
                      <img
                        className="w-full h-auto object-contain"
                        src={productDetail?.image}
                        alt={productDetail?.title}
                      />
                      <div className="promotion"></div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={10}>
                <div className="price">
                  <h1 className="product_name">{productDetail?.title}</h1>
                </div>
                <Card
                  className="card_total"
                  bordered={false}
                  style={{ width: "90%" }}
                >
                  <div className="text-lg">
                    {productDetail?.price?.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </div>
                  <div className="box-product-promotion">
                    <div className="box-product-promotion-header">
                      <p>Ưu đãi</p>
                    </div>
                    <div className="box-content-promotion">
                      <p className="box-product-promotion-number"></p>
                      <a>
                        Nhiều ưu đãi - Giá hấp dẫn nhất <br />
                        <br /> Tặng thêm phiếu mua hàng <br />
                        <br /> Giảm giá cho khách hàng mới
                      </a>
                    </div>
                  </div>
                  <Select
                      placeholder="Chọn mentor"
                      style={{ width: "100%", marginBottom: 20 }}
                      onChange={handleMentorSelect}
                      value={selectedMentor}
                    >
                      {mentors.map((mentor) => (
                        <Option key={mentor._id} value={mentor._id}>
                          {mentor.username}
                        </Option>
                      ))}
                    </Select>

                  <div className="mt-3">
                    {selectedMentor && (
                      <div style={{ marginBottom: 10 }}>
                        <h3>Thông tin Mentor</h3>
                        <p>Tên: {selectedMentor.username}</p>
                        <p>Email : {selectedMentor.username}</p>
                        {certificateList.length > 0 && (
                          <p>
                            Chứng chỉ :
                            {certificateList
                              .map((item) => item.title)
                              .toString(", ")}
                          </p>
                        )}

                        <Row>
                          {certificateList &&
                            certificateList.map((item, index) => {
                              return (
                                <img
                                  key={index}
                                  style={{ marginRight: 20 }}
                                  src={item.image}
                                  alt={"image"}
                                />
                              );
                            })}
                        </Row>

                        {classes.length > 0 && (
                          <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            tokenSeparators={[","]}
                            placeholder="Chọn lớp học"
                            onChange={(value) => {
                              setClassChossen(value);
                            }}
                            showSearch
                            filterOption={(input, option) =>
                              option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {classes?.map((item, index) => {
                              return (
                                <Select.Option value={item?._id} key={index}>
                                  Ngày học: {item?.dateLearn} ({item?.timeStart}{" "}
                                  - {item?.timeEnd})
                                </Select.Option>
                              );
                            })}
                          </Select>
                        )}
                      </div>
                    )}
                   
                    <div box_cart_1 style={{ marginBottom: 20 }}>
                      <input
                        type="radio"
                        value="wallet"
                        checked={paymentMethod === "wallet"}
                        onChange={handlePaymentMethodChange}
                      />{" "}
                      Ví
                    </div>
                    <Button
                      type="primary"
                      className="ms-2"
                      onClick={handleBooking}
                    >
                      Đăng Ký Ngay
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
            <hr />
            <div className="describe">
              <div
                className="title_total"
                style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}
              >
                Giới thiệu: "{productDetail.title}"
              </div>
              <div
                className="describe_detail_description"
                dangerouslySetInnerHTML={{ __html: productDetail.description }}
              ></div>
            </div>
            <hr />

            <div className="lessons mt-8">
              <h1 className="text-xl font-bold mb-4">
                Các bài học trong khóa học
              </h1>
              <Collapse accordion>
                {productDetail?.lessons?.map((lesson) => (
                  <Panel
                    header={
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          {lesson.title}
                        </h3>
                        <Button type="link">Xem video</Button>
                      </div>
                    }
                    key={lesson._id}
                  >
                    <div className="border p-4 rounded-lg shadow-md">
                      <div className="aspect-w-16 aspect-h-9">
                        <iframe
                          title={lesson.title}
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${getYoutubeId(
                            lesson.videoUrl
                          )}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  </Panel>
                ))}
              </Collapse>
            </div>
            <hr />
            <div className="price" style={{ marginTop: 20, fontSize: 20 }}>
              <h1 className="product_name" style={{ fontWeight: "bold" }}>
                Khóa học bạn có thể quan tâm
              </h1>
            </div>
            <Row className="mt-10 flex flex-wrap -mx-2">
              {recommend?.map((item) => (
                <Col
                  key={item._id}
                  className="w-full sm:w-1/2 lg:w-1/4 p-2 cursor-pointer"
                  onClick={() => handleReadMore(item._id)}
                >
                  <div className="show-product relative bg-white border border-gray-200 p-2">
                    {item.image ? (
                      <img
                        className="image-product w-full h-48 object-cover mb-2"
                        src={item.image}
                        alt="Product"
                      />
                    ) : (
                      <img
                        className="image-product w-full h-48 object-cover mb-2"
                        src={require("../../../assets/image/NoImageAvailable.jpg")}
                        alt="No Image Available"
                      />
                    )}
                    <div className="wrapper-products p-2">
                      <div className="price-amount mb-2">
                        <p className="price-cross text-gray-500 line-through">
                          {numberWithCommas(item.price)} đ
                        </p>
                      </div>
                      <p
                        className="title-product text-lg font-semibold truncate"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.title}
                      </p>
                    </div>
                  </div>
                  <p className="badge absolute top-2 left-2 bg-red-500 text-white text-sm p-1 rounded">
                    <span>Gợi ý</span>
                    <img
                      src={triangleTopRight}
                      alt="Badge"
                      className="inline-block ml-1"
                    />
                  </p>
                </Col>
              ))}
            </Row>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default ProductDetail;

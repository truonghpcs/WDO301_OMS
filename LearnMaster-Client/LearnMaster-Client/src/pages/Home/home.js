import QueueAnim from "rc-queue-anim";
import { OverPack } from "rc-scroll-anim";
import Texty from "rc-texty";
import TweenOne from "rc-tween-one";
import React, { useEffect, useRef, useState } from "react";
import eventApi from "../../apis/eventApi";
import productApi from "../../apis/productApi";
import triangleTopRight from "../../assets/icon/Triangle-Top-Right.svg";
import service10 from "../../assets/image/service/service10.png";
import service6 from "../../assets/image/service/service6.png";
import service7 from "../../assets/image/service/service7.png";
import service8 from "../../assets/image/service/service8.png";
import service9 from "../../assets/image/service/service9.png";
import "../Home/home.css";

import {
  BackTop,
  Card,
  Carousel,
  Col,
  Row,
  Spin,
  Button
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { useHistory } from "react-router-dom";
import { numberWithCommas } from "../../utils/common";

const Home = () => {
  const [productList, setProductList] = useState([]);
  const [eventListHome, setEventListHome] = useState([]);
  const [totalEvent, setTotalEvent] = useState(Number);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [productsPhone, setProductsPhone] = useState([]);
  const [productsPC, setProductsPC] = useState([]);
  const [productsTablet, setProductsTablet] = useState([]);
  const [visible, setVisible] = useState(true);
  const initialCountdownDate = new Date().getTime() + 24 * 60 * 60 * 1000;
  const [countdownDate, setCountdownDate] = useState(
    localStorage.getItem("countdownDate") || initialCountdownDate
  );

  const [timeLeft, setTimeLeft] = useState(
    countdownDate - new Date().getTime()
  );

  const history = useHistory();

  const handleReadMore = (id) => {
    console.log(id);
    history.push("product-detail/" + id);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await productApi.getListProducts({
          page: 1,
          limit: 10,
        });
        setProductList(response.data.docs);
        setTotalEvent(response);
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch event list:" + error);
      }

      try {
        const response = await productApi.getListEvents(1, 6);
        setEventListHome(response.data);
        setTotalEvent(response.total_count);
      } catch (error) {
        console.log("Failed to fetch event list:" + error);
      }
      try {
        const response = await productApi.getCategory({ limit: 10, page: 1 });
        console.log(response);
        setCategories(response.data.docs);
      } catch (error) {
        console.log(error);
      }
      try {
        const data = { limit: 10, page: 1 };
        const response = await productApi.getProductsByCategory(
          "668c9fb166f35c4ec22b3f71"
        );
        console.log(response);
        setProductsPhone(response.data);
        const response3 = await productApi.getProductsByCategory(
          "668cb23963bb98f79ffef905"
        );
        console.log(response3);
        setProductsTablet(response3.data);
        const response2 = await productApi.getProductsByCategory(
          "668cb22863bb98f79ffef901"
        );
        console.log(response2);
        setProductsPC(response2.data);

      } catch (error) {
        console.log(error);
      }

      localStorage.setItem("countdownDate", countdownDate);

      const interval = setInterval(() => {
        const newTimeLeft = countdownDate - new Date().getTime();
        setTimeLeft(newTimeLeft);

        if (newTimeLeft <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    })();
  }, [countdownDate]);

  const paymentCard = (product) => {
    console.log(product);
    const existingItems = JSON.parse(localStorage.getItem("cart")) || [];
    let updatedItems;
    const existingItemIndex = existingItems.findIndex(
      (item) => item._id === product._id
    );
    if (existingItemIndex !== -1) {
      // If product already exists in the cart, increase its quantity
      updatedItems = existingItems.map((item, index) => {
        if (index === existingItemIndex) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
    } else {
      // If product does not exist in the cart, add it to the cart
      updatedItems = [...existingItems, { ...product, quantity: 1 }];
    }
    console.log(updatedItems.length);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    localStorage.setItem("cartLength", updatedItems.length);
    history.push("/cart");
  };

  return (
    <Spin spinning={false}>
      <div
        style={{
          background: "#FFFFFF",
          overflowX: "hidden",
          overflowY: "hidden",
        }}
        className="home"
      >
        <div
          style={{ background: "#FFFFFF" }}
          className="container-home banner-promotion"
        >
          <Row justify="center" align="top" key="1">
            <Col span={24}>
              <Carousel autoplay className="carousel-image">
                <div className="img">
                  <img
                    style={{ width: "100%", height: 750, objectFit: 'cover' }}
                    src="https://websitehoctructuyen.com/wp-content/uploads/2019/05/trien-khai-marketing-ban-khoa-hoc.jpg"
                    alt=""
                  />
                </div>
                <div className="img">
                  <img
                    style={{ width: "100%", height: 750, objectFit: 'cover' }}
                    src="https://theme.hstatic.net/200000343833/1001159108/14/collection_banner.jpg?v=220"
                    alt=""
                  />
                </div>
                <div className="img">
                  <img
                    style={{ width: "100%", height: 750, objectFit: 'cover' }}
                    src="https://khanhhung.academy/wp-content/uploads/2024/03/nhung-yeu-to-anh-huong-gia-tri-khoa-hoc-online.png"
                    alt=""
                  />
                </div>
                <div className="img">
                  <img
                    style={{ width: "100%", height: 750, objectFit: 'cover' }}
                    src="https://diploma.qts.edu.vn/wp-content/uploads/2023/10/QTS-BSB50120-Diploma-of-Business-vn-banner.jpg"
                  />
                </div>
              </Carousel>

            </Col>
          </Row>
        </div>

        <div className="image-one">
          <div className="texty-demo">
            <Texty>Khuyến Mãi</Texty>
          </div>
          <div className="texty-title">
            <p>
              Khóa Học <strong style={{ color: "#3b1d82" }}>Mới</strong>
            </p>
          </div>


          <div className="list-products container" key="1">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsPhone.map((item) => (
                <div
                  key={item._id}
                  className="col-product cursor-pointer"
                  onClick={() => handleReadMore(item._id)}
                >
                  <div className="show-product bg-white border border-gray-200 p-4 rounded-lg shadow-md">
                    {item.image ? (
                      <img
                        className="image-product w-full h-48 object-cover mb-4 rounded-lg"
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <img
                        className="image-product w-full h-48 object-cover mb-4 rounded-lg"
                        src={require("../../assets/image/NoImageAvailable.jpg")}
                        alt="No Image Available"
                      />
                    )}
                    <div className="wrapper-products">
                      <p className="title-product font-semibold text-lg overflow-ellipsis overflow-hidden whitespace-nowrap">
                        {item.title}
                      </p>
                      <div className="price-amount flex items-center">
                        <p className="text-gray-600 text-lg mr-1">
                          {numberWithCommas(item.price)}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs font-semibold leading-none text-white bg-green-500 rounded-full uppercase">
                          Giá đặc biệt
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="image-one">
          <div className="texty-demo">
            <Texty>Khuyến Mãi</Texty>
          </div>
          <div className="texty-title">
            <p>
              Khóa Học <strong style={{ color: "#3b1d82" }}>Backend</strong>
            </p>
          </div>


          <div className="list-products container" key="1">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsPC.map((item) => (
                <div
                  key={item._id}
                  className="col-product cursor-pointer"
                  onClick={() => handleReadMore(item._id)}
                >
                  <div className="show-product bg-white border border-gray-200 p-4 rounded-lg shadow-md">
                    {item.image ? (
                      <img
                        className="image-product w-full h-48 object-cover mb-4 rounded-lg"
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <img
                        className="image-product w-full h-48 object-cover mb-4 rounded-lg"
                        src={require("../../assets/image/NoImageAvailable.jpg")}
                        alt="No Image Available"
                      />
                    )}
                    <div className="wrapper-products">
                      <p className="title-product font-semibold text-lg overflow-ellipsis overflow-hidden whitespace-nowrap">
                        {item.title}
                      </p>
                      <div className="price-amount flex items-center">
                        <p className="text-gray-600 text-lg mr-1">
                          {numberWithCommas(item.price)}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs font-semibold leading-none text-white bg-green-500 rounded-full uppercase">
                          Giá đặc biệt
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        <div className="image-one">
          <div className="texty-demo">
            <Texty>Khuyến Mãi</Texty>
          </div>
          <div className="texty-title">
            <p>
              Khóa Học <strong style={{ color: "#3b1d82" }}>Frontend</strong>
            </p>
          </div>


          <div className="list-products container" key="1">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {productsTablet.map((item) => (
                <div
                  key={item._id}
                  className="col-product cursor-pointer"
                  onClick={() => handleReadMore(item._id)}
                >
                  <div className="show-product bg-white border border-gray-200 p-4 rounded-lg shadow-md">
                    {item.image ? (
                      <img
                        className="image-product w-full h-48 object-cover mb-4 rounded-lg"
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <img
                        className="image-product w-full h-48 object-cover mb-4 rounded-lg"
                        src={require("../../assets/image/NoImageAvailable.jpg")}
                        alt="No Image Available"
                      />
                    )}
                    <div className="wrapper-products">
                      <p className="title-product font-semibold text-lg overflow-ellipsis overflow-hidden whitespace-nowrap">
                        {item.title}
                      </p>
                      <div className="price-amount flex items-center">
                        <p className="text-gray-600 text-lg mr-1">
                          {numberWithCommas(item.price)}
                        </p>
                        <span className="inline-block px-2 py-1 text-xs font-semibold leading-none text-white bg-green-500 rounded-full uppercase">
                          Giá đặc biệt
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        <div className="image-one">
          <div className="heading_slogan">
            <div>Tại sao</div>
            <div>Nên chọn chúng tôi</div>
          </div>
          <div className="card_wrap container-home container">
            <div>
              <Card
                bordered={false}
                className="card_suggest card_why card_slogan"
              >
                <img src={service6}></img>
                <p class="card-text mt-3 fw-bold text-center">
                  Nhanh chóng & Bảo mật <br />
                </p>
              </Card>
            </div>
            <div>
              <Card
                bordered={false}
                className="card_suggest card_why card_slogan"
              >
                <img src={service7}></img>
                <p class="card-text mt-3 fw-bold text-center">
                  Đảm bảo 100% <br />
                  Chính Hãng
                </p>
              </Card>
            </div>
            <div>
              <Card
                bordered={false}
                className="card_suggest card_why card_slogan"
              >
                <img src={service8}></img>
                <p class="card-text mt-3 fw-bold text-center">
                  24 Giờ <br /> Đổi Trả
                </p>
              </Card>
            </div>
            <div>
              <Card
                bordered={false}
                className="card_suggest card_why card_slogan"
              >
                <img src={service9}></img>
                <p class="card-text mt-3 fw-bold text-center">
                  Giao hàng <br /> Nhanh nhất
                </p>
              </Card>
            </div>
            <div>
              <Card
                bordered={false}
                className="card_suggest card_why card_slogan"
              >
                <img src={service10}></img>
                <p class="card-text mt-3 fw-bold text-center">
                  Hỗ trợ <br /> Nhanh chóng
                </p>
              </Card>
            </div>
          </div>
        </div>

        <div className="image-footer">
          <OverPack style={{ overflow: "hidden", height: 800, marginTop: 20 }}>
            <TweenOne
              key="0"
              animation={{ opacity: 1 }}
              className="code-box-shape"
              style={{ opacity: 0 }}
            />
            <QueueAnim
              key="queue"
              animConfig={[
                { opacity: [1, 0], translateY: [0, 50] },
                { opacity: [1, 0], translateY: [0, -50] },
              ]}
            >
              <div className="texty-demo-footer">
                <Texty>NHANH LÊN! </Texty>
              </div>
              <div className="texty-title-footer">
                <p>
                  Tham Dự Buổi <strong>Ra Khóa Học Mới</strong>
                </p>
              </div>
              <Row
                justify="center"
                style={{ marginBottom: 30, fill: "#FFFFFF" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="71px"
                  height="11px"
                >
                  {" "}
                  <path
                    fill-rule="evenodd"
                    d="M59.669,10.710 L49.164,3.306 L39.428,10.681 L29.714,3.322 L20.006,10.682 L10.295,3.322 L1.185,10.228 L-0.010,8.578 L10.295,0.765 L20.006,8.125 L29.714,0.765 L39.428,8.125 L49.122,0.781 L59.680,8.223 L69.858,1.192 L70.982,2.895 L59.669,10.710 Z"
                  ></path>
                </svg>
              </Row>
              <Row justify="center">
                <a href="#" class="footer-button" role="button">
                  <span>ĐĂNG KÝ NGAY</span>
                </a>
              </Row>
            </QueueAnim>
          </OverPack>
        </div>
      </div>

      <BackTop style={{ textAlign: "right" }} />
    </Spin>
  );
};

export default Home;

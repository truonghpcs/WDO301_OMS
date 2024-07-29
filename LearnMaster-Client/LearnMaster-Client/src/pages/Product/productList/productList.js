import React, { useEffect, useState } from "react";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  List,
  Modal,
  Row,
  Select,
  Spin,
} from "antd";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import productApi from "../../../apis/productApi";
import { numberWithCommas } from "../../../utils/common";
import "./productList.css";

const ProductList = () => {
  const [productDetail, setProductDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  let { id } = useParams();
  const history = useHistory();
  const match = useRouteMatch();

  const handleReadMore = (id) => {
    console.log(id);
    history.push("/product-detail/" + id);
    window.location.reload();
  };

  const handleCategoryDetails = (id) => {
    const newPath = match.url.replace(/\/[^/]+$/, `/${id}`);
    history.push(newPath);
    window.location.reload();
  };

  const handleSearchClick = async () => {
    const response = await productApi.getListProducts();
    setProductDetail(response.data.docs);
  };


  useEffect(() => {
    (async () => {
      try {
        const response = await productApi.getCategory({ limit: 50, page: 1 });
        setCategories(response.data.docs);

        await productApi.getProductsByCategory(id).then((response) => {
          // Cập nhật state với danh sách sản phẩm chỉ có trạng thái 'Available'
          setProductDetail(response.data);
        });

        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch event detail:" + error);
      }
    })();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Spin spinning={false}>
        <Card className="container_details">
          <div className="product_detail">
            <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
              <Breadcrumb>
                <Breadcrumb.Item href="http://localhost:3500/home">
                  <span>Trang chủ</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <span>Khóa học </span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr></hr>
            <div className="container box">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryDetails(category._id)}
                  className="menu-item-1"
                >
                  <div className="menu-category-1">{category.name}</div>
                </div>
              ))}
            </div>

            <div
              className="list-products container"
              key="1"
              style={{ marginTop: 0, marginBottom: 50 }}
            >
              <Row>
                <Col span={12}>
                  <div className="title-category">
                    <div class="title">
                      <h3 style={{ paddingTop: "30px" }}>DANH SÁCH KHÓA HỌC</h3>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="button-category">
                    <Button type="primary" onClick={() => handleSearchClick()}>
                      Tất cả sản phẩm
                    </Button>
                  </div>
                </Col>
              </Row>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
                {productDetail.slice(0, 20).map((item) => (
                  <div
                    key={item.id}
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
                          src={require("../../../assets/image/NoImageAvailable.jpg")}
                          alt="No Image Available"
                        />
                      )}
                      <div className="wrapper-products">
                        <p className="title-product font-semibold text-lg overflow-ellipsis overflow-hidden whitespace-nowrap">
                          {item.title}
                        </p>
                        <div className="price-amount">
                          <p className="price-product text-gray-600">
                            {numberWithCommas(Number(item.price))}đ
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
   
      </Spin>
    </div>
  );
};

export default ProductList;

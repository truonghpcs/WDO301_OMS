import {
  ContactsTwoTone,
  DashboardOutlined,
  HddTwoTone,
  HomeOutlined,
  ShoppingTwoTone,
  ShopTwoTone,
} from "@ant-design/icons";
import {
  BackTop,
  Breadcrumb,
  Card,
  Col,
  Empty,
  Row,
  Spin,
  Table,
  Tag
} from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import orderApi from "../../apis/orderApi";
import statisticApi from "../../apis/statistic";
import "./dashBoard.css";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";


const DashBoard = () => {
  const [order, setOrder] = useState([]);
  const [statisticList, setStatisticList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotalList] = useState();



  useEffect(() => {
    (async () => {
      try {
        await statisticApi.getTotal().then((res) => {
          console.log(res);
          setTotalList(res);
          setStatisticList(res);
          setLoading(false);
        });
        await orderApi.getListOrder({ page: 1, limit: 6 }).then((res) => {
          console.log(res);
          setTotalList(res.totalDocs);
          setOrder(res.data.docs);
          setLoading(false);
        });
      } catch (error) {
        console.log("Failed to fetch event list:" + error);
      }
    })();
  }, []);
  return (
    <div>
      <Spin spinning={false}>
        <div className="container">
          <div style={{ marginTop: 20 }}>
            <Breadcrumb>
              <Breadcrumb.Item href="">
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item href="">
                <DashboardOutlined />
                <span>DashBoard</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <Row gutter={12} style={{ marginTop: 20 }}>
            <Col span={6}>
              <Card className="card_total" bordered={false}>
                <div className="card_number">
                  <div>
                    <div className="number_total">
                      {statisticList?.users}
                    </div>
                    <div className="title_total">Số người dùng</div>
                  </div>
                  <div>
                    <ContactsTwoTone style={{ fontSize: 48 }} />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="card_total" bordered={false}>
                <div className="card_number">
                  <div>
                    <div className="number_total">
                      {statisticList?.courses}
                    </div>
                    <div className="title_total">Số khóa học</div>
                  </div>
                  <div>
                    <ShopTwoTone style={{ fontSize: 48 }} />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="card_total" bordered={false}>
                <div className="card_number">
                  <div>
                    <div className="number_total">
                      {statisticList?.category}
                    </div>
                    <div className="title_total">Số danh mục</div>
                  </div>
                  <div>
                    <HddTwoTone style={{ fontSize: 48 }} />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card className="card_total" bordered={false}>
                <div className="card_number">
                  <div>
                    <div className="number_total">
                      {statisticList?.bookings}
                    </div>
                    <div className="title_total">Số đăng ký khóa học</div>
                  </div>
                  <div>
                    <ShoppingTwoTone style={{ fontSize: 48 }} />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        
        </div>
        <BackTop style={{ textAlign: "right" }} />
      </Spin>
    </div>
  );
};

export default DashBoard;


import React, { useEffect, useState } from 'react';
import styles from './header.module.css';
import userApi from "../../../apis/userApi";
import logo from "../../../assets/icon/logo.svg";
import DropdownAvatar from "../../DropdownMenu/dropdownMenu";
import { useHistory, NavLink } from "react-router-dom";
import { Layout, Avatar, Badge, Row, Col, List, Popover, Modal, Drawer, Select } from 'antd';
import { BellOutlined, NotificationTwoTone, BarsOutlined, ShoppingCartOutlined, UserOutlined  } from '@ant-design/icons';
import axiosClient from "../../../apis/axiosClient";

const { Option } = Select;

const { Header } = Layout;

function Topbar() {

  const [countNotification, setCountNotification] = useState(0);
  const [notification, setNotification] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visiblePopover, setVisiblePopover] = useState(false);
  const [titleNotification, setTitleNotification] = useState('');
  const [contentNotification, setContentNotification] = useState('');
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [userData, setUserData] = useState([]);
  const [cart, setCart] = useState();

  const history = useHistory();

  const handleLink = (link) => {
    setVisibleDrawer(false);
    history.push(link);
  }

  const content = (
    <div>
      {notification.map((values, index) => {
        return (
          <div>
            <List.Item style={{ padding: 0, margin: 0 }}>
              <List.Item.Meta
                style={{ width: 250, margin: 0 }}
                avatar={<NotificationTwoTone style={{ fontSize: '20px', color: '#08c' }} />}
                title={<a onClick={() => handleNotification(values.content, values.title)}>{values.title}</a>}
                description={<p className={styles.fixLine} dangerouslySetInnerHTML={{ __html: values.content }}></p>}
              />
            </List.Item>
          </div>
        )
      })}
    </div>
  );

  const handleNotification = (valuesContent, valuesTitile) => {
    setVisible(true);
    setVisiblePopover(visible !== visible)
    setContentNotification(valuesContent);
    setTitleNotification(valuesTitile);
  }

  const handleVisibleChange = (visible) => {
    setVisiblePopover(visible);
  };

  const handleOk = () => {
    setVisible(false);
  }

  const showDrawer = () => {
    setVisibleDrawer(true);
  };

  const onClose = () => {
    setVisibleDrawer(false);
  };

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectOptions, setSelectOptions] = useState([
    
  ]);

  const handleSelectChange = async (value) => {
    setSelectedOption(value);
    console.log(value);
    history.push("/product-detail/"+value);
    window.location.reload();
    };

  const updateSelectOptions = (newOptions) => {
    const updatedOptions = newOptions.map((option) => ({
      value: option._id,
      label: option.title,
    }));

    setSelectOptions(updatedOptions);
  };

  const handleSearch = async (value) => {
    try {
      const response = await axiosClient.get(`/course/search?title=${value}`);
      const data = response.data;

      updateSelectOptions(data.docs);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }

  };

  useEffect(() => {
    (async () => {
      try {
        const response = await userApi.getProfile();
        const cart = localStorage.getItem('cartLength');
        console.log(cart);
        setCart(cart);
        setUserData(response);
      } catch (error) {
        console.log('Failed to fetch profile user:' + error);
      }
    })();
  }, [])

  return (
    <Header
      style={{ background: "#FFFFFF" }}
      className={styles.header}
    >
      <div className="">
        <img style={{ color: "#000000", fontSize: 15, height: 190,padding: 10, cursor: "pointer", objectFit:'contain' }} src="data:image/png;base64,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" onClick={() => handleLink("/home")}></img>
      </div>
      <BarsOutlined className={styles.bars} onClick={showDrawer} />
      <div className={styles.navmenu} style={{ marginLeft: 20 }}>
        <NavLink className={styles.navlink} to="/home" activeStyle>
          Trang chủ
        </NavLink>
        <NavLink className={styles.navlink} to="/product-list/668c9fb166f35c4ec22b3f71" activeStyle>
          Sản phẩm
        </NavLink>
        <NavLink className={styles.navlink} to="/news" activeStyle>
          Tin tức
        </NavLink>
        <NavLink className={styles.navlink} to="/contact" activeStyle>
          Liên hệ
        </NavLink>
        <Select
          showSearch
          style={{ marginLeft: 20, width: 300 }}
          placeholder="Bạn tìm gì..."
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={selectOptions}
          onChange={handleSelectChange}
          onSearch={handleSearch}

        />
      </div>
      <div className={styles.logBtn}>
        <div style={{ position: 'relative', display: 'flex', float: 'right', alignItems: "center", cursor: 'pointer' }}>
          <Row>
           
            <Col>
              <Badge style={{ marginLeft: 10 }} overflowCount={9999} count={userData?.score > 0 ? userData?.score : 0} />
            </Col>
          </Row>
        
          <Row>
            <DropdownAvatar key="avatar" />
            <p style={{ marginRight: 10, padding: 0, margin: 0, color: '#FFFFFF' }}><UserOutlined  style={{ fontSize: '28px', color: '#FFFFFF' }} /></p>
          </Row>
          <Modal
            title={titleNotification}
            visible={visible}
            onOk={handleOk}
            onCancel={handleOk}
            cancelButtonProps={{ style: { display: 'none' } }}
          >
            <p dangerouslySetInnerHTML={{ __html: contentNotification }} ></p>
          </Modal>
        </div>
      </div>
      <Drawer title="Menu" placement="right" onClose={onClose} open={visibleDrawer}>
        <div className={styles.navmenu2}>
          <NavLink className={styles.navlink2} to="/home" activeStyle>
            Trang chủ
          </NavLink>
          <NavLink className={styles.navlink2} to="/event" activeStyle>
            Sản phẩm
          </NavLink>
          <NavLink className={styles.navlink2} to="/about" activeStyle>
            Về chúng tôi
          </NavLink>
          <NavLink className={styles.navlink2} to="/contact" activeStyle>
            Liên hệ
          </NavLink>
          <div className={styles.navlink2}>
            <div style={{ display: 'flex', cursor: 'pointer' }} onClick={() => handleLink("/cart")}>
              <p style={{ marginRight: 10, padding: 0, margin: 0, color: 'black' }}><ShoppingCartOutlined style={{ fontSize: '18px', color: 'black' }} /> {cart} Giỏ hàng</p>
              <Badge style={{ marginLeft: 10 }} overflowCount={9999} count={userData?.score > 0 ? userData?.score : 0} />
            </div>
          </div>
          <div className={styles.navlink2}>
            <DropdownAvatar key="avatar" />
          </div>
        </div>
      </Drawer>
    </Header >
  );
}

export default Topbar;
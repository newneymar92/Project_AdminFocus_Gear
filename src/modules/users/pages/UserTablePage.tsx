import React, { useState } from 'react';
import { Layout, Menu, Breadcrumb, Dropdown } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  MenuOutlined,
  BellOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'typesafe-actions';
import { replace } from 'connected-react-router';
import { ROUTES } from '../../../configs/routes';
import { logout } from '../../auth/redux/authReducer';
import UserManageTable from './UserManageTable';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

interface Props {}

const UserTablePage = (props: Props) => {
  const [collapsed, setCollapsed] = useState(false);

  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const onCollapse = (collapsed: boolean) => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };

  const onLogout = () => {
    dispatch(logout());
    dispatch(replace(ROUTES.login));
  };

  const menu = (
    <Menu>
      <Menu.Item>My Profile</Menu.Item>
      <Menu.Item disabled>admin.training@powergatesoftware.com</Menu.Item>
      <Menu.Item onClick={onLogout}>Log out</Menu.Item>
    </Menu>
  );

  const renderPadding = () => {
    if (!collapsed) {
      return '220px';
    } else {
      return '100px';
    }
  };

  return (
    <Layout style={{ backgroundColor: '#323259', minHeight: '100vh' }}>
      <Header
        className="site-layout-background"
        style={{ backgroundColor: '#323259', color: '#fff', position: 'fixed', width: '100%', zIndex: 1000 }}
      >
        <div style={{ position: 'relative' }}>
          <a
            href="#"
            style={{
              color: '#FFFFFF',
              height: '20',
              position: 'absolute',
              fontSize: '1.75rem',
              fontFamily: 'Open Sans,sans-serif',
            }}
          >
            Gear Focus Admin
          </a>
          <BellOutlined
            style={{ position: 'relative', left: '280px', fontSize: '1.5rem', marginTop: '21px', color: '#FFFFFF' }}
          />
          <div className="" style={{ float: 'right' }}>
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                <UserOutlined style={{ position: 'relative', fontSize: '1.5rem', color: '#FFFFFF' }} />
              </a>
            </Dropdown>
          </div>
        </div>
      </Header>

      <Sider
        style={{
          backgroundColor: '#323259',
          color: '#fff',
          top: '64px',
          position: 'fixed',
          width: '240px',
          zIndex: 1000,
          height: '100%',
        }}
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div className="logo" />
        <Menu style={{ backgroundColor: '#323259', color: '#fff' }} defaultSelectedKeys={['1']} mode="inline">
          <SubMenu
            style={{ backgroundColor: '#323259', color: '#fff' }}
            key="sub1"
            icon={<UserOutlined />}
            title="Orders"
          >
            <Menu.Item style={{ backgroundColor: '#323259', color: '#fff', margin: '0px 0px 0px' }} key="3">
              Orders list
            </Menu.Item>
            <Menu.Item style={{ backgroundColor: '#323259', color: '#fff', margin: '0px 0px 0px' }} key="4">
              Abandoned carts
            </Menu.Item>
            <Menu.Item style={{ backgroundColor: '#323259', color: '#fff', margin: '0px 0px 0px' }} key="5">
              Accounting
            </Menu.Item>
            <Menu.Item style={{ backgroundColor: '#323259', color: '#fff', margin: '0px 0px 0px' }} key="6">
              Payment Transactions
            </Menu.Item>
            <Menu.Item style={{ backgroundColor: '#323259', color: '#fff', margin: '0px 0px 0px' }} key="7">
              Vendor statistics
            </Menu.Item>
            <Menu.Item style={{ backgroundColor: '#323259', color: '#fff', margin: '0px 0px 0px' }} key="8">
              Returns
            </Menu.Item>
            <Menu.Item style={{ backgroundColor: '#323259', color: '#fff', margin: '0px 0px 0px' }} key="9">
              Messages
            </Menu.Item>
          </SubMenu>

          <SubMenu key="sub2" icon={<TeamOutlined />} title="Catalog">
            <Menu.Item style={{ backgroundColor: '#323259', color: '#fff', margin: '0px 0px 0px' }} key="10">
              <Link to={ROUTES.productPage} style={{ backgroundColor: '#323259', color: '#FFFFFF' }}>
                Product
              </Link>
            </Menu.Item>
            <Menu.Item style={{ backgroundColor: '#323259', color: '#fff', margin: '0px 0px 0px' }} key="12">
              Reviews
            </Menu.Item>
            <Menu.Item style={{ backgroundColor: '#323259', color: '#fff', margin: '0px 0px 0px' }} key="13">
              Product tabs
            </Menu.Item>
            <Menu.Item style={{ backgroundColor: '#323259', color: '#fff', margin: '0px 0px 0px' }} key="14">
              Brand
            </Menu.Item>
            <Menu.Item style={{ backgroundColor: '#323259', color: '#fff', margin: '0px 0px 0px' }} key="15">
              Import
            </Menu.Item>
            <Menu.Item style={{ backgroundColor: '#323259', color: '#fff', margin: '0px 0px 0px' }} key="16">
              Exports
            </Menu.Item>
            <Menu.Item style={{ backgroundColor: '#323259', color: '#fff', margin: '0px 0px 0px' }} key="17">
              Watched Products
            </Menu.Item>
          </SubMenu>

          <SubMenu key="sub3" icon={<TeamOutlined />} title="User">
            <Menu.Item style={{ backgroundColor: '#323259', color: '#fff', margin: '0px 0px 0px' }} key="18">
              <Link to={ROUTES.userPage} style={{ backgroundColor: '#323259', color: '#FFFFFF' }}>
                User list
              </Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="19" icon={<PieChartOutlined />}>
            Sales Channels
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Content style={{ position: 'relative', paddingLeft: `${renderPadding()}` }}>
          <div className="site-layout-background">
            <UserManageTable />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserTablePage;

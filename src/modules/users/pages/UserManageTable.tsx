import { BgColorsOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { retry } from '@redux-saga/core/effects';
import { Button, DatePicker, Space, Col, Input, Modal, Radio, Row, Select, Spin, Table, Tag } from 'antd';
import Column from 'antd/lib/table/Column';
import ColumnGroup from 'antd/lib/table/ColumnGroup';
import moment from 'antd/node_modules/moment';
import { replace } from 'connected-react-router';
import { parseInt } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'typesafe-actions';
import { API_PATHS } from '../../../configs/api';
import { ROUTES } from '../../../configs/routes';
import { AppState } from '../../../redux/reducer';
import { fetchThunk } from '../../common/redux/thunk';
import AccessLevelTitleTable from '../title/AccessLevelTitleTable';
import CreatedTitleTable from '../title/CreatedTitleTable';
import LastLoginTitleTable from '../title/LastLoginTitleTable';
import UserEmailTitleTable from '../title/UserEmailTitleTable';
import UserNameTitleTable from '../title/UserNameTitleTable';

export default function UserManageTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState('');
  const [memberships, setMemberships] = useState([]);
  const [types, setTypes] = useState([]);
  const [status, setStatus] = useState<string[]>([]);
  const [countryList, setCountryList] = useState<string[]>([]);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [dateType, setDateType] = useState('R');
  const [dateRange, setDateRange] = useState<string[]>([]);
  const [sort, setSort] = useState('last_login');
  const [tz, setTz] = useState(7);
  const [selectedDeleteArr, setSelectedDeleteArr] = useState<string[]>([]);

  const handleSortUserTable = async (page: number, pageSize: number, title: string, orderby: string) => {
    setLoading(true);
    const json = await dispatch(
      fetchThunk(API_PATHS.userList, 'post', {
        page: page,
        count: pageSize,
        search: search,
        memberships: memberships,
        types: types,
        status: status,
        country: country,
        state: state,
        address: address,
        phone: phone,
        date_type: dateType,
        date_range: dateRange,
        sort: title,
        order_by: orderby,
        tz: 7,
      }),
    );
    const newArr = json.data.map((user: any) => ({
      ...user,
      key: user.profile_id,
      loginEmail: { nameVendor: user.vendor, nameStore: user.storeName, userId: user.profile_id },
      fullName: user.fistName + ' ' + user.lastName,
    }));
    console.log('User', newArr);
    setUserList(newArr);
    setLoading(false);
  };

  const columns = [
    {
      title: <UserEmailTitleTable title={'Login/Email'} sortCustom={handleSortUserTable} />,
      dataIndex: 'loginEmail',
      render: (loginEmail: any) => {
        return (
          <div>
            <Link to={`/userDetail/${loginEmail.userId}`} style={{ color: '#007bff' }}>
              {loginEmail.nameVendor}
            </Link>
            <div>{loginEmail.nameStore}</div>
          </div>
        );
      },
    },
    {
      title: <UserNameTitleTable title={'Name'} sortCustom={handleSortUserTable} />,
      dataIndex: 'fullName',
    },
    {
      title: <AccessLevelTitleTable title={'Access level'} sortCustom={handleSortUserTable} />,
      dataIndex: 'access_level',
    },
    {
      title: 'Products',
      dataIndex: 'product',
    },
    {
      title: 'Orders',
      dataIndex: 'order',
      render: (temp: any) => {
        return <div>{temp.order_as_buyer}</div>;
      },
    },
    {
      title: 'Wishlist',
      dataIndex: 'wishlist',
    },
    {
      title: <CreatedTitleTable title={'Created'} sortCustom={handleSortUserTable} />,
      dataIndex: 'created',
      render: (temp: any) => {
        return (
          <div key={temp}>
            <div>{moment(parseInt(temp) * 1000).format('MMM D,YYYY,hh:mm A')}</div>
          </div>
        );
      },
    },
    {
      title: <LastLoginTitleTable title={'Last Login'} sortCustom={handleSortUserTable} />,
      dataIndex: 'last_login',
      render: (temp: any) => {
        return (
          <div key={temp}>
            <div>{moment(parseInt(temp) * 1000).format('MMM D,YYYY,hh:mm A')}</div>
          </div>
        );
      },
      sorter: (a: any, b: any) => a.arrivalDate - b.arrivalDate,
    },
    {
      title: '',
      dataIndex: 'profile_id',
      render: (record: string) => (
        <Space
          style={{
            backgroundColor: '#b18aff',
            color: '#FFF',
            borderColor: '#b18aff',
            fontSize: '15px',
            borderRadius: '5px',
          }}
          size="large"
        >
          <DeleteOutlined
            onClick={() => {
              handleDeleteButton(record);
            }}
          />
        </Space>
      ),
    },
  ];

  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const getAllUsers = async (page: number, pageSize: number) => {
    setLoading(true);
    const json = await dispatch(
      fetchThunk(API_PATHS.userList, 'post', {
        page: page,
        count: pageSize,
        search: search,
        memberships: memberships,
        types: types,
        status: status,
        country: country,
        state: state,
        address: address,
        phone: phone,
        date_type: dateType,
        date_range: dateRange,
        sort: sort,
        order_by: 'DESC',
        tz: 7,
      }),
    );
    const newArr = json.data.map((user: any) => ({
      ...user,
      key: user.profile_id,
      loginEmail: { nameVendor: user.vendor, nameStore: user.storeName, userId: user.profile_id },
      fullName: user.fistName + ' ' + user.lastName,
    }));
    console.log('User', newArr);
    setUserList(newArr);
    // dispatch(saveAllVendors(json.data))
    setLoading(false);
  };

  const getAllCountries = async () => {
    setLoading(true);
    const json = await dispatch(fetchThunk(API_PATHS.countryList, 'get'));
    setCountryList(json.data);
    // dispatch(saveAllCountries(json.data));
    setLoading(false);
  };

  const handleSearchKeywords = (e: any) => {
    console.log('search', e.target.value);
    setSearch(e.target.value);
  };

  const handleChangeGenerals = (e: any) => {
    setMemberships(e);
  };

  const handleSearchUserTypes = (e: any) => {
    console.log('membership', e);
    setTypes(e);
  };

  const handleSearchActivity = (e: any) => {
    console.log('activity', e);
    setDateType(e.target.value);
  };

  const handleSearchDate = (date: any, dateString: any) => {
    console.log('date', dateString);
    const formatDateStart = moment(parseInt(date[0])).format('YYYY-MM-DD');
    const formatDateEnd = moment(parseInt(date[1])).format('YYYY-MM-DD');
    console.log('formatDate', formatDateStart, formatDateEnd);
    const newDateRangeArr: string[] = [];
    newDateRangeArr.push(formatDateStart, formatDateEnd);
    console.log(newDateRangeArr);
    setDateRange(newDateRangeArr);
  };

  const handleSearchStatus = (e: any) => {
    console.log('status', e.target.value);
    const newArr: string[] = [];
    newArr.push(e.target.value);
    setStatus(newArr);
  };

  const handleSearchCountry = (e: any) => {
    setCountry(e);
  };

  const handleSearchState = (e: any) => {
    setState(e.target.value);
  };

  const handleSearchAddress = (e: any) => {
    setAddress(e.target.value);
  };

  const handleSearchPhone = (e: any) => {
    setPhone(e.target.value);
  };

  const handleDeleteButton = (id: string) => {
    Modal.confirm({
      title: 'Do you want to delete this user?',
      onOk: async () => {
        setLoading(true);
        const json = await dispatch(
          fetchThunk(API_PATHS.userDelete, 'post', {
            params: [{ id: id, delete: 1 }],
          }),
        );
        getAllUsers(1, 25);
        setLoading(false);
      },
    });
  };

  const handleMultipleDeleteButton = (idArr: string[]) => {
    const newArr: any[] = [];
    idArr.forEach((id: string) => {
      return newArr.push({ id: id, delete: 1 });
    });
    console.log('deleteArr', newArr);
    Modal.confirm({
      title: 'Do you want to delete these product?',
      onOk: async () => {
        setLoading(true);
        const json = await dispatch(
          fetchThunk(API_PATHS.userDelete, 'post', {
            params: newArr,
          }),
        );
        console.log('UserDelete', json.data);
        getAllUsers(1, 25);
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    getAllUsers(page, pageSize);
    getAllCountries();
  }, []);

  const handleButtonClick = () => {
    getAllUsers(1, 25);
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 70 }} spin />;
  const { Option, OptGroup } = Select;
  const { RangePicker } = DatePicker;

  const style = { background: '#323259', borderColor: '#13132b', padding: '8px', borderRadius: '6px' };

  return (
    <div>
      <div>
        {loading === true ? (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 299,
              color: '#FFF',
            }}
          >
            <Spin indicator={antIcon} />{' '}
          </div>
        ) : (
          ''
        )}
      </div>
      <h2 style={{ color: '#FFFFFF', fontSize: '32px' }}>Search for users</h2>
      <div className="" style={{ backgroundColor: '#323259', padding: '20px 20px 40px', width: '100%' }}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={6}>
            <div style={style}>
              <Input
                className="input1"
                style={{ backgroundColor: '#252547', borderColor: '#13132b', padding: '8px',borderRadius: '5px', }}
                onChange={handleSearchKeywords}
                placeholder="Search keywords"
              />
            </div>
          </Col>

          {/* search Membership*/}
          <Col className="gutter-row" span={6}>
            <div>
              <Select
                mode="multiple"
                placeholder="All memberships"
                onChange={handleChangeGenerals}
                style={{
                  width: '100%',
                  backgroundColor: '#1b1b38',
                  borderColor: '#13132b',
                  padding: '8px',
                  borderRadius: '5px',
                  color: 'black',
                  fontSize: '15px',
                }}
              >
                <OptGroup label="Memberships">
                  <Option value="M_4">General</Option>
                </OptGroup>
                <OptGroup label="Pending Memberships">
                  <Option value="P_4">General</Option>
                </OptGroup>
              </Select>
            </div>
          </Col>

          {/* search User types */}
          <Col className="gutter-row" span={6}>
            <div>
              <Select
                onChange={handleSearchUserTypes}
                mode="multiple"
                placeholder="All user types"
                style={{
                  width: '100%',
                  backgroundColor: '#1b1b38',
                  borderColor: '#13132b',
                  padding: '8px',
                  borderRadius: '5px',
                  color: 'black',
                  fontSize: '15px',
                }}
              >
                <OptGroup label="Memberships">
                  <Option value="1">Administrator</Option>
                  <Option value="3">Content management</Option>
                  <Option value="2">Coupons management</Option>
                  <Option value="5">Vendor</Option>
                  <Option value="6">View order reports</Option>
                  <Option value="4">Volume discounts management</Option>
                </OptGroup>

                <OptGroup label="Pending Memberships">
                  <Option value="C">Registered Customers</Option>
                  <Option value="N">Anonymous Customers</Option>
                </OptGroup>
              </Select>
            </div>
          </Col>

          {/* search Status */}
          <Col className="gutter-row" span={4}>
            <div>
              <select
                onChange={handleSearchStatus}
                style={{
                  width: '100%',
                  backgroundColor: '#1b1b38',
                  borderColor: '#13132b',
                  padding: '8px',
                  borderRadius: '5px',
                  color: '#FFFFFF',
                  fontSize: '15px',
                }}
              >
                <option style={{ color: '#FFFFFF', fontSize: '15px' }} value="">
                  Any status
                </option>
                <option style={{ color: '#FFFFFF', fontSize: '15px' }} value="E">
                  Enable
                </option>
                <option style={{ color: '#FFFFFF', fontSize: '15px' }} value="D">
                  Disable
                </option>
                <option style={{ color: '#FFFFFF', fontSize: '15px' }} value="U">
                  Unapproved vendor
                </option>
              </select>
            </div>
          </Col>

          {/* button Search */}
          <Col style={{ marginBottom: '50px' }} className="gutter-row" span={2}>
            <div>
              <Button
                onClick={handleButtonClick}
                style={{ backgroundColor: '#b18aff', color: '#FFFFF', fontSize: '15px' }}
                type="primary"
              >
                Search
              </Button>
            </div>
          </Col>
        </Row>

        {/* search Country*/}
        <Row style={{ position: 'relative' }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={6}>
            <div style={{ position: 'absolute', top: '5px', left: '20px', color: '#FFFFFF', fontSize: '15px' }}>
              Country
            </div>
            {/* <Select style={{ position: 'absolute', left: '100px', width: '70%' }} /> */}
            <Select
              defaultValue=""
              showSearch
              optionFilterProp="children"
              filterOption={(input: any, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ position: 'absolute', left: '100px', width: '70%' }}
              listHeight={250}
              onChange={handleSearchCountry}
            >
              <Option value="">Select country</Option>
              {countryList.map((country: any) => {
                return (
                  <Option key={country.id} value={country.code}>
                    {country.country}
                  </Option>
                );
              })}
            </Select>
            <div style={{ color: '#323259', borderColor: '#13132b', padding: '8px', borderRadius: '6px' }}>col-6</div>
          </Col>

          {/* search User activity*/}
          <Col style={{ marginLeft: '100px', marginBottom: '15px' }} className="gutter-row" span={6}>
            <div style={{ position: 'absolute', top: '5px', left: '20px', color: '#FFFFFF', fontSize: '15px' }}>
              User activity
            </div>
            <Radio.Group
              defaultValue={dateType}
              onChange={handleSearchActivity}
              style={{ position: 'absolute', left: '120px', top: '5px', width: '70%', color: '#FFFFFF' }}
            >
              <Radio style={{ color: '#FFFFFF' }} value="R">
                Register
              </Radio>
              <Radio style={{ color: '#FFFFFF' }} value="L">
                Last logged in
              </Radio>
            </Radio.Group>
            <div style={{ color: '#323259', borderColor: '#13132b', padding: '8px', borderRadius: '6px' }}>col-6</div>
          </Col>
        </Row>

        {/* search State  */}
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={6}>
            <div style={{ position: 'absolute', top: '5px', left: '20px', color: '#FFFFFF', fontSize: '15px' }}>
              State
            </div>
            <Input onChange={handleSearchState} style={{ position: 'absolute', left: '100px', width: '70%' }} />
            <div style={{ color: '#323259', borderColor: '#13132b', padding: '8px', borderRadius: '6px' }}>col-6</div>
          </Col>

          {/* search Date */}
          <Col style={{ marginLeft: '210px', marginBottom: '15px' }} className="gutter-row" span={6}>
            <Space direction="vertical" size={14}>
              <RangePicker onChange={handleSearchDate} format={'MMM D,YYYY'} />
            </Space>
            {/* <div style={{ color: '#323259', borderColor: '#13132b', padding: '8px', borderRadius: '6px' }}>col-6</div> */}
          </Col>
        </Row>

        {/* search Address */}
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col style={{ marginBottom: '15px' }} className="gutter-row" span={6}>
            <div style={{ position: 'absolute', top: '5px', left: '20px', color: '#FFFFFF', fontSize: '15px' }}>
              Address
            </div>
            <Input onChange={handleSearchAddress} style={{ position: 'absolute', left: '100px', width: '70%' }} />
            <div style={{ color: '#323259', borderColor: '#13132b', padding: '8px', borderRadius: '6px' }}>col-6</div>
          </Col>
        </Row>

        {/* search Phone */}
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={6}>
            <div style={{ position: 'absolute', top: '5px', left: '20px', color: '#FFFFFF', fontSize: '15px' }}>
              Phone
            </div>
            <Input onChange={handleSearchPhone} style={{ position: 'absolute', left: '100px', width: '70%' }} />
            <div style={{ color: '#323259', borderColor: '#13132b', padding: '8px', borderRadius: '6px' }}>col-6</div>
          </Col>
        </Row>
      </div>
      <Button
        onClick={() => {
          dispatch(replace(ROUTES.userForm));
        }}
        style={{
          marginTop: '20px',
          marginBottom: '20px',
          backgroundColor: '#b18aff',
          color: '#FFFFF',
          fontSize: '15px',
        }}
        type="primary"
      >
        Add User
      </Button>
      <Table
        rowSelection={{
          type: 'checkbox',
          onSelect: (record, selected) => {
            console.log(selected);
            if (selected) {
              setSelectedDeleteArr([...selectedDeleteArr, record.profile_id]);
            } else if (selected == false) {
              setSelectedDeleteArr(
                selectedDeleteArr.filter((arr) => {
                  return arr !== record.profile_id;
                }),
              );
            }
          },
        }}
        pagination={{
          defaultPageSize: 25,
          total: 4000,
          pageSizeOptions: [25, 50, 75, 100],
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
            getAllUsers(page, pageSize);
          },
        }}
        columns={columns}
        dataSource={userList}
        className="table1"
      />
      <Button
        onClick={() => {
          handleMultipleDeleteButton(selectedDeleteArr);
        }}
        style={{ backgroundColor: '#f0ad4e', color: '#FFFFF', fontSize: '15px' }}
        type="primary"
      >
        Removed Selected
      </Button>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Input, Table, Select, Spin, Space, Modal } from 'antd';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../configs/api';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'typesafe-actions';

import { Row, Col } from 'antd';
import { DeleteOutlined, LoadingOutlined, PoweroffOutlined } from '@ant-design/icons';
import { replace } from 'connected-react-router';
import { ROUTES } from '../../../configs/routes';
import moment from 'antd/node_modules/moment';
import {
  saveAllProduct,
  saveAllVendors,
  saveAllCategories,
  saveAllBrands,
  saveAllCountries,
} from '../redux/ProductReducer';
import { Link, NavLink } from 'react-router-dom';
import NameTitleTable from '../title/NameTitleTable';
import SkuTitleTable from '../title/SkuTitleTable';
import PriceTitleTable from '../title/PriceTitleTable';
import StockTitleTable from '../title/StockTitleTable';
import VendorTitleTable from '../title/VendorTitleTable';
import ArrivalDateTitleTable from '../title/ArrivalDateTitleTable';

export interface Vendor {
  amount: number;
  arrivalDate: number;
  category: string;
  condition: string;
  created: number;
  description: string;
  enabled: number;
  id: string;
  name: string;
  participateSale: number;
  price: number;
  sku: string;
  vendor: string;
  vendorID: number;
  weight: number;
}

export default function ManageTable() {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState<Vendor[]>([]);
  const [vendorList, setVendorList] = useState([]);
  const [vendor, setVendor] = useState('');
  const [brandList, setBrandList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [stock, setStock] = useState('all');
  const [availability, setAvailability] = useState('all');
  const [category, setCategory] = useState(0);
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('');
  const [checkAll, setCheckAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [allReadySelectedRow, setAllReadySelectedRow] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [selectedDeleteArr, setSelectedDeleteArr] = useState<string[]>([]);
  const [id, setId] = useState('');
  const [recordTotal, setRecordTotal] = useState('');
  const [disabled,setDisable]=useState(true)

  const handleSortTable = async (page: number, pageSize: number, title: string, orderby: string) => {
    setLoading(true);
    const json = await dispatch(
      fetchThunk(API_PATHS.productList, 'post', {
        page: page,
        count: pageSize,
        search: search,
        category: category,
        stock_status: stock,
        availability: availability,
        vendor: vendor,
        sort: title,
        order_by: orderby,
        search_type: searchType,
      }),
    );
    if (json?.success && json?.data) {
      const newArr = json.data.map((product: any) => ({
        ...product,
        key: product.id,
        nameDetail: { name: product.name, id: product.id },
        enabledDetail: { enabled: product.enabled, id: product.id },
      }));
      setId(json.data.id);
      setRecordTotal(json.recordsTotal);
      setProductList(newArr);
      dispatch(saveAllProduct(newArr));
    } else {
      setProductList(json.data);
    }
    setLoading(false);
    console.log("totalRecord",recordTotal);
  };

  const getAllProducts = async (page: number, pageSize: number) => {
    setLoading(true);
    const json = await dispatch(
      fetchThunk(API_PATHS.productList, 'post', {
        page: page,
        count: pageSize,
        search: search,
        category: category,
        stock_status: stock,
        availability: availability,
        vendor: vendor,
        sort: 'name',
        order_by: 'ASC',
        search_type: searchType,
      }),
    );

    if (json?.success && json?.data) {
      const newArr = json.data.map((product: any) => ({
        ...product,
        key: product.id,
        nameDetail: { name: product.name, id: product.id },
        // Test
        enabledDetail: { enabled: product.enabled, id: product.id },
      }));
      setId(json.data.id);
      setRecordTotal(json.recordsTotal);
      setProductList(newArr);
      dispatch(saveAllProduct(newArr));
    } else {
      setProductList(json.data);
    }
    setLoading(false);
    console.log("totalRecord",recordTotal);

  };

  const getAllCategories = async () => {
    setLoading(true);
    const json = await dispatch(fetchThunk(API_PATHS.categoryList, 'get'));
    console.log('Categories', json.data);
    setCategoryList(json.data);
    dispatch(saveAllCategories(json.data));
    setLoading(false);
  };

  const getAllVendors = async () => {
    setLoading(true);
    const json = await dispatch(fetchThunk(API_PATHS.vendorList, 'get'));
    console.log('Vendor', json);
    setVendorList(json.data);
    dispatch(saveAllVendors(json.data));
    setLoading(false);
  };

  const getAllBrands = async () => {
    setLoading(true);
    const json = await dispatch(fetchThunk(API_PATHS.brandList, 'get'));
    console.log('Brand', json.data);
    setBrandList(json.data);
    dispatch(saveAllBrands(json.data));
    setLoading(false);
  };

  const getAllCountries = async () => {
    setLoading(true);
    const json = await dispatch(fetchThunk(API_PATHS.countryList, 'get'));
    setCountryList(json.data);
    dispatch(saveAllCountries(json.data));
    setLoading(false);
  };

  const handleSearchCategory = (e: any) => {
    setCategory(e.target.value);
  };
  const handleSearchStock = (e: any) => {
    setStock(e.target.value);
  };
  const handleSearchAvailability = (e: any) => {
    setAvailability(e.target.value);
  };
  const handleSearchVendor = (e: any) => {
    console.log('Vendor', e);
    setVendor(e);
  };
  const handleSearchKeyword = (e: any) => {
    setSearch(e.target.value);
  };
  const handleSearchCheckBox = (e: any) => {
    console.log('checkbox', e);
    setSearchType(e.toString());
  };

  const handleDeleteButton = (id: string) => {
    Modal.confirm({
      title: 'Do you want to delete this product?',
      onOk: async () => {
        setLoading(true);
        const json = await dispatch(
          fetchThunk(API_PATHS.productDelete, 'post', {
            params: [{ id: id, delete: 1 }],
          }),
        );
        console.log('ProductDelete', json.data);
        getAllProducts(1, 25);
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
          fetchThunk(API_PATHS.productDelete, 'post', {
            params: newArr,
          }),
        );
        console.log('ProductDelete', json.data);
        getAllProducts(1, 25);
        setLoading(false);
      },
    });
  };

  const handleButtonDisable = async (id: string) => {
    setLoading(true);
    const json = await dispatch(
      fetchThunk(API_PATHS.productDelete, 'post', {
        params: [
          {
            enable: '0',
            id: id,
          },
        ],
      }),
    );
    if (json?.success && json?.data) {
      getAllProducts(1, 25);
    }
    setLoading(false);
  };

  const handleButtonEnable = async (id: string) => {
    setLoading(true);
    const json = await dispatch(
      fetchThunk(API_PATHS.productDelete, 'post', {
        params: [
          {
            enable: '1',
            id: id,
          },
        ],
      }),
    );
    if (json?.success && json?.data) {
      getAllProducts(1, 25);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllProducts(1, 25);
    getAllCategories();
    getAllVendors();
    getAllBrands();
    getAllCountries();
  }, []);

  const handleButtonClick = () => {
    getAllProducts(1, 25);
  };
  const columns = [
    {
      title: '',
      dataIndex: 'enabledDetail',
      render: (temp: any) => {
        if (temp.enabled === '1')
          return (
            <div>
              <PoweroffOutlined
                onClick={() => {
                  handleButtonDisable(temp.id);
                }}
                style={{ color: 'green' }}
              />
            </div>
          );
        if (temp.enabled === '0') {
          return (
            <div>
              <PoweroffOutlined
                onClick={() => {
                  handleButtonEnable(temp.id);
                }}
                style={{ color: 'red' }}
              />
            </div>
          );
        }
      },
    },
    {
      title: <SkuTitleTable title={'SKU'} sortCustom={handleSortTable} />,
      dataIndex: 'sku',
    },
    {
      title: <NameTitleTable title={'Name'} sortCustom={handleSortTable} />,
      dataIndex: 'nameDetail',
      render: (name: any) => {
        return (
          <Link to={`/productDetail/${name.id}`} style={{ color: '#007bff' }}>
            {name.name}
          </Link>
        );
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: <PriceTitleTable title={'Price'} sortCustom={handleSortTable} />,
      dataIndex: 'price',
      render: (temp: any) => {
        return (
          <div key={temp}>
            <div>${temp.substr(0, 7)}</div>
          </div>
        );
      },
    },
    {
      title: <StockTitleTable title={'In stock'} sortCustom={handleSortTable} />,
      dataIndex: 'amount',
    },
    {
      title: <VendorTitleTable title={'Vendor'} sortCustom={handleSortTable} />,
      dataIndex: 'vendor',
      render: (temp: any) => {
        return (
          <div key={temp}>
            <div>{temp.substr(0, 13)}...</div>
          </div>
        );
      },
    },
    {
      title: <ArrivalDateTitleTable title={'Arrival Date'} sortCustom={handleSortTable} />,
      dataIndex: 'arrivalDate',
      render: (temp: any) => {
        return (
          <div key={temp}>
            <div>{moment(parseInt(temp) * 1000).format('MMM D,YYYY')}</div>
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'id',
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

  const antIcon = <LoadingOutlined style={{ fontSize: 70 }} spin />;
  const { Option } = Select;
  const style = { background: '#1b1b38', borderColor: '#13132b', padding: '8px', borderRadius: '6px' };

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

      <h2 style={{ color: '#FFFFFF', fontSize: '32px' }}>Products</h2>
      <div className="" style={{ backgroundColor: '#323259', padding: '20px 20px 40px', width: '100%' }}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={10}>
            <div style={style}>
              <Input
                className="input1"
                style={{ backgroundColor: '#252547' }}
                onChange={handleSearchKeyword}
                placeholder="Search keywords"
              />
            </div>
          </Col>

          {/* search Category */}
          <Col className="gutter-row" span={6}>
            <div style={{ padding: '0', paddingLeft: '15px' }}>
              <select
                onChange={handleSearchCategory}
                style={{
                  width: '100%',
                  backgroundColor: '#1b1b38',
                  borderColor: '#13132b',
                  padding: '8px',
                  borderRadius: '5px',
                  color: '#FFFFFF',
                }}
              >
                <option value="0" style={{ width: '5px', color: '#FFFFFF', fontSize: '15px' }}>
                  Any category
                </option>
                {categoryList.map((category: any, id: any) => {
                  return (
                    <option style={{ width: '5px' }} key={id} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </Col>

          {/* search stock */}
          <Col className="gutter-row" span={6}>
            <div>
              <select
                onChange={handleSearchStock}
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
                <option style={{ color: '#FFFFFF', fontSize: '15px' }} value="all">
                  Any stock status
                </option>
                <option style={{ color: '#FFFFFF', fontSize: '15px' }} value="in">
                  In stock
                </option>
                <option style={{ color: '#FFFFFF', fontSize: '15px' }} value="low">
                  Low stock
                </option>
                <option style={{ color: '#FFFFFF', fontSize: '15px' }} value="out">
                  SOLD
                </option>
              </select>
            </div>
          </Col>

          {/* button search */}
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

        {/* search in */}
        <Row style={{ position: 'relative' }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col style={{ position: 'relative' }} className="gutter-row" span={3}>
            <div style={{ position: 'absolute', top: '5px', left: '20px', color: '#FFFFFF', fontSize: '15px' }}>
              Search in:
            </div>
          </Col>
          <Col style={{ position: 'absolute', left: '80px', color: '#FFFFFF' }} className="gutter-row" span={4}>
            <div style={{}}>
              <Checkbox.Group onChange={handleSearchCheckBox}>
                <Checkbox value="name" style={{ color: '#FFFFFF' }}>
                  Name
                </Checkbox>
                <br />
                <Checkbox value="sku" style={{ color: '#FFFFFF' }}>
                  SKU
                </Checkbox>
                <br />
                <Checkbox value="description" style={{ color: '#FFFFFF' }}>
                  Full Description
                </Checkbox>
                <br />
              </Checkbox.Group>
            </div>
          </Col>

          {/* search availability */}
          <Col style={{ position: 'relative', color: '#FFFFFF' }} className="gutter-row" span={3}>
            <div style={{ position: 'absolute', top: '5px', left: '80px', fontSize: '15px' }}>Availability</div>
          </Col>
          <Col className="gutter-row" span={4}>
            <div>
              <select
                onChange={handleSearchAvailability}
                style={{
                  color: '#FFFFFF',
                  width: '100%',
                  backgroundColor: '#1b1b38',
                  borderColor: '#13132b',
                  padding: '8px',
                  borderRadius: '5px',
                }}
              >
                <option value="all">Any availability status</option>
                <option value="1">Only enable</option>
                <option value="0">Only disable</option>
              </select>
            </div>
          </Col>
          {/* search vendor */}
          <Col style={{ position: 'relative' }} className="gutter-row" span={3}>
            <div style={{ position: 'absolute', top: '5px', left: '50px', color: '#FFFFFF', fontSize: '15px' }}>
              Vendor
            </div>
          </Col>
          <Col style={{ position: 'absolute', left: '700px' }} className="gutter-row" span={4}>
            <div>
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{ width: '200px' }}
                listHeight={250}
                onChange={handleSearchVendor}
              >
                {vendorList.map((vendor: any, id: any) => {
                  return (
                    <Option key={id} value={vendor.id}>
                      {vendor.name}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </Col>
        </Row>
      </div>

      <Button
        onClick={() => {
          dispatch(replace(ROUTES.productForm));
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
        Add Product
      </Button>
      {/* {console.log(selectedDeleteArr)} */}

      <div style={{ backgroundColor: '#323259', paddingBottom: '100px', width: '100%' }}>
        <Table
          rowSelection={{
            type: 'checkbox',
            onSelect: (record, selected) => {
              console.log(selected);
              if (selected) {
                setSelectedDeleteArr([...selectedDeleteArr, record.id]);
              } else if (selected == false) {
                setSelectedDeleteArr(
                  selectedDeleteArr.filter((arr) => {
                    return arr !== record.id;
                  }),
                );
              }
            },
          }}
          pagination={{
            defaultPageSize: 25,
            total: parseInt(recordTotal),
            // total:3143,
            pageSizeOptions: [25, 50, 75, 100],
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
              getAllProducts(page, pageSize);
            },
          }}
          columns={columns}
          dataSource={productList}
          style={{ backgroundColor: '#1b1b38' }}
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
    </div>
  );
}

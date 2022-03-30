import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, DatePicker, Form, Input, Select, Spin, Switch } from 'antd';

import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { ROUTES } from '../../../configs/routes';
import { fetchThunk, fetchThunk2 } from '../../common/redux/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'typesafe-actions';
import { push, replace } from 'connected-react-router';
import { Editor } from '@tinymce/tinymce-react';
import { API_PATHS } from '../../../configs/api';
import { saveAllProduct } from '../redux/ProductReducer';
import moment from 'antd/node_modules/moment';
import TextArea from 'antd/lib/input/TextArea';
import { LoadingOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: {
    xs: { span: 16 },

    sm: { span: 6 },
  },
};

const { Option } = Select;

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

export interface IfileList {
  originFileObj: File;
}

export interface IMembership {
  membership_id: string;
}

export interface IShipping {
  id: string;
  price: string;
  zone_name: string;
}
export default function ManageForm(props: any) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<IfileList[]>([]);
  const [display, setDisplay] = useState('none');
  const editorRef: any = useRef<HTMLDivElement>(null);
  const [stock, setStock] = useState('');
  const [priceShipping, setPriceShipping] = useState('');
  const [priceSale, setPriceSale] = useState('');
  const [continentalUS, setContinentalUS] = useState('');
  const [general, setGeneral] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableSale, setAvailableSale] = useState('NO');
  const [disabledButton, setDisabledButton] = useState(true);
  const [requiredConfirmEditor, setRequiredConfirmEditor] = useState('');
  const [requiredConfirmPercent, setRequiredConfirmPercent] = useState('');
  const [requiredConfirmDate, setRequiredConfirmDate] = useState('');
  const [requiredConfirmPrice, setRequiredConfirmPrice] = useState('');
  const [requireConfirmPriceSale, setRequireConfirmPriceSale] = useState('');

  const [vendorId, setVendorId] = useState('');
  const [nameProduct, setNameProduct] = useState('');
  const [brandId, setBrandId] = useState('');
  const [conditionId, setConditionId] = useState('');
  const [categories, setCategories] = useState<number[]>([]);
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(1);
  const [memberships, setMemberships] = useState<IMembership[]>([]);
  const [shippingToZones, setShippingToZones] = useState([{ id: 1, price: priceShipping }]);
  const [taxExempt, setTaxExempt] = useState(0);
  const [price, setPrice] = useState('');
  const [priceSaleType, setPriceSaleType] = useState('');
  const [salePriceType, setSalePriceType] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [inventoryTracking, setInventoryTracking] = useState(0);
  const [quantity, setQuantity] = useState('');
  const [sku, setSku] = useState('');
  const [participateSale, setParticipateSale] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [ogTagsType, setOgTagType] = useState('0');
  const [ogTags, setOgTags] = useState('');
  const [metaDescType, setMetaDescType] = useState('A');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [productPageTitle, setProductPageTitle] = useState('');
  const [marketingTitle, setMarketingTitle] = useState('');
  const [facebookMarketingEnabled, setFacebookMarketingEnabled] = useState(0);
  const [googleFeedEnable, setGoogleFeedEnable] = useState(0);
  const [imagesOrder, setImagesOrder] = useState<string[]>([]);
  const [id, setId] = useState('');
  const [deletedImages, setDeletedImages] = useState([]);

  const [productList, setProductList] = useState<Vendor[]>([]);

  const vendorList = useSelector((state: any) => state.product.vendor);
  const brandList = useSelector((state: any) => state.product.brand);
  const categoryList = useSelector((state: any) => state.product.category);
  const countryList = useSelector((state: any) => state.product.country);

  const handleAddProduct = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append(
      'productDetail',
      JSON.stringify({
        vendor_id: vendorId,
        name: nameProduct,
        brand_id: brandId,
        condition_id: conditionId,
        categories: categories,
        description: description,
        enabled: enabled,
        memberships: memberships,
        shipping_to_zones: [{ id: 1, price: continentalUS }],
        tax_exempt: taxExempt,
        price: price,
        sale_price_type: salePriceType,
        arrival_date: arrivalDate,
        inventory_tracking: inventoryTracking,
        quantity: quantity,
        sku: `${Date.now()}`,
        participate_sale: participateSale,
        sale_price: salePrice,
        og_tags_type: ogTagsType,
        og_tags: ogTags,
        meta_desc_type: metaDescType,
        meta_description: metaDescription,
        meta_keywords: metaKeywords,
        product_page_title: marketingTitle,
        facebook_marketing_enabled: facebookMarketingEnabled,
        google_feed_enabled: googleFeedEnable,
        imagesOrder: imagesOrder,
        deleted_images: deletedImages,
      }),
    );
    const json = await dispatch(fetchThunk2(API_PATHS.productCreate, 'post', formData, true, 'multipart/form-data'));
    const formDataImage = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formDataImage.append('productId', json.data);
      formDataImage.append('order', JSON.stringify(i));
      formDataImage.append('images[]', fileList[i].originFileObj);
      await dispatch(
        fetchThunk2(
          'https://api.gearfocus.div4.pgtest.co/api/products/upload-image',
          'post',
          formDataImage,
          true,
          'multipart/form-data',
        ),
      );
    }
    dispatch(push(`/productDetail/${json.data}`));
    console.log('ProductList', json.data);
    setLoading(false);
  };

  const handleChangeImage = (result: any) => {
    console.log('check', result.file);
    if (result.file.status === 'done') {
      setImagesOrder([...imagesOrder, result.file.name]);
    }
    console.log('result', imagesOrder);
    setFileList(result.fileList);
  };

  const handleAddVendor = (e: any) => {
    console.log('AddVendor', e);
    setVendorId(e);
  };

  const handleAddProductTitle = (e: any) => {
    console.log('AddProduct', e.target.value);
    setProductPageTitle(e.target.value);
    setNameProduct(e.target.value);
  };

  const handleAddBrand = (e: any) => {
    console.log('AddBrand', e);
    setBrandId(e);
  };

  const handleAddCondition = (e: any) => {
    console.log('condition', e);
    setConditionId(e);
  };

  const handleAddSku = (e: any) => {
    console.log('sku', e.target.value);
    setSku(e.target.value);
  };

  const handleAddCategory = (e: any) => {
    console.log('category', e);
    setCategories(e);
  };

  const handleAvailableSale = (e: any) => {
    console.log('availableSale', e);
    if (e == true) {
      setEnabled(1);
    } else {
      setEnabled(0);
    }
  };

  const handleAddDescription = (e: any) => {
    if (e === '') {
      setRequiredConfirmEditor('The input is required');
      setDisabledButton(true);
    } else {
      setRequiredConfirmEditor('');
      setDisabledButton(false);
    }
    setDescription(e);
  };

  const handleAddMembership = (e: any) => {
    setMemberships(e);
  };

  const handleAddArrivalDate = (e: any) => {
    console.log('date', e);
    if (e === null) {
      setRequiredConfirmDate('arrivalDate is required !');
    } else {
      setRequiredConfirmDate('');
      setArrivalDate(moment(e._d.toLocaleDateString()).format('YYYY-DD-MM'));
    }

    // setArrivalDate(dateString);
  };

  const handleAddOgTagType = (e: any) => {
    setOgTagType(e);
  };
  const handleAddOgTag = (e: any) => {
    setOgTags(e.target.value);
  };

  const handleAddMeteDescType = (e: any) => {
    setMetaDescType(e);
  };

  const handleAddMetaDescription = (e: any) => {
    setMetaDescription(e.target.value);
  };

  const handleAddMetaKeywords = (e: any) => {
    setMetaKeywords(e.target.value);
  };

  const handleAddMarketingTitle = (e: any) => {
    setMarketingTitle(e.target.value);
  };

  const handleAddFacebook = (e: any) => {
    if (e == true) {
      setFacebookMarketingEnabled(1);
    } else {
      setFacebookMarketingEnabled(0);
    }
  };

  const handleAddGoogle = (e: any) => {
    if (e == true) {
      setGoogleFeedEnable(1);
    } else {
      setGoogleFeedEnable(0);
    }
  };

  const handleAddPrice = (e: any) => {
    const { value } = e.target;
    const regex = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && regex.test(value)) || value === '' || value === '-') {
      setPrice(value);
    }
    if (value === '') {
      setRequiredConfirmPrice('Price is required !');
    } else {
      setRequiredConfirmPrice('');
    }
    if (priceSaleType === '$') {
      if (parseFloat(value) < parseFloat(priceSale) || parseFloat(value) === parseFloat(priceSale)) {
        setRequiredConfirmPrice('The priceSale need smaller than price !');
      } else {
        setRequiredConfirmPrice('');
      }
    }
  };

  const handleAddSalePrice = (e: any) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (!isNaN(value) && reg.test(value)) {
      setSalePrice(value);
    }
    if (value.trim() === '') {
      setRequiredConfirmPercent('PriceSale is required !');
    } else {
      setRequiredConfirmPercent('');
    }

    if (salePriceType === '$') {
      if (parseFloat(value) > parseFloat(price) || parseFloat(value) === parseFloat(price)) {
        setRequireConfirmPriceSale('The priceSale need smaller than price !');
      } else {
        setRequireConfirmPriceSale('');
      }
    } else if (salePriceType === '%') {
      if (parseInt(value) > 100) {
        setRequireConfirmPriceSale('The discount need to smaller than 100 and bigger 0');
      } else {
        setRequireConfirmPriceSale('');
      }
    }
  };

  const handleAddStock = (e: any) => {
    const { value } = e.target;
    const regex = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && regex.test(value)) || value === '' || value === '-') {
      setQuantity(value);
    }
  };

  const handleDisableButton = () => {
    if (
      vendorId.trim() !== '' &&
      nameProduct.trim() !== '' &&
      brandId !== '' &&
      fileList.length > 0 &&
      categories.length > 0 &&
      price !== '' &&
      quantity !== '' &&
      continentalUS !== '' &&
      requiredConfirmDate === '' &&
      priceSale !== '' &&
      requireConfirmPriceSale === '' &&
      requiredConfirmEditor == '' &&
      requiredConfirmPercent == '' &&
      description  !== ''
    ) {
      setDisabledButton(false);
    } else if (
      vendorId.trim() === '' ||
      nameProduct.trim() === '' ||
      brandId === '' ||
      fileList.length === 0 ||
      categories.length === 0 ||
      price === '' ||
      quantity === '' ||
      continentalUS === '' ||
      requiredConfirmDate !== '' ||
      salePrice === '' ||
      requireConfirmPriceSale !== '' ||
      requiredConfirmEditor !== '' ||
      requiredConfirmPercent !== '' ||
      description  === ''
    ) {
      setDisabledButton(true);
    }
  };

  const handlePreviewImage = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src) as any;
    imgWindow.document.write(image.outerHTML);
  };

  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const onFinish = (values: any) => {
    setDisabledButton(false);
    console.log('Received values of form: ', values);
  };

  useEffect(() => {
    handleDisableButton();
  }, []);

  const antIcon = <LoadingOutlined style={{ fontSize: 70 }} spin />;

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
      <h2>--------</h2>
      <h2>--------</h2>
      <div>
        <Button
          onClick={() => {
            dispatch(replace(ROUTES.productPage));
          }}
          type="primary"
          size={'large'}
        >
          Back
        </Button>
      </div>

      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        style={{ width: '80%', backgroundColor: '#1b1b38' }}
      >
        <h3 style={{ color: '#FFFFFF', fontSize: '26px' }}>Add Product</h3>
        <Form.Item
          name="vendor"
          label={<label style={{ color: '#FFFFFF' }}>Vendor</label>}
          rules={[
            {
              required: true,
              message: 'Please input your Vendor !',
            },
          ]}
        >
          <Select
            onChange={handleAddVendor}
            showSearch
            optionFilterProp="children"
            filterOption={(input: any, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            style={{ width: '660px', backgroundColor: 'red !important' }}
            placeholder="Type Vendor name to select"
          >
            {vendorList.map((vendor: any, id: any) => {
              return (
                <Option key={id} value={vendor.id}>
                  {vendor.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="Product title"
          label={<label style={{ color: '#FFFFFF' }}>Product title</label>}
          rules={[
            {
              required: true,
              message: 'Please input your product title !',
            },
          ]}
        >
          <Input onChange={handleAddProductTitle} style={{ width: '660px' }} />
        </Form.Item>

        <Form.Item
          style={{ color: '#FFFFFF' }}
          name="brand"
          label={<label style={{ color: '#FFFFFF' }}>Brand</label>}
          rules={[
            {
              required: true,
              message: 'Please select type brand !',
            },
          ]}
        >
          <Select onChange={handleAddBrand} style={{ width: '660px' }} placeholder="Type Brand name to select">
            {brandList.map((brand: any, id: any) => {
              return (
                <Option key={id} value={brand.id}>
                  {brand.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="condition"
          label={<label style={{ color: '#FFFFFF' }}>Condition</label>}
          rules={[{ required: true, message: 'Please select condition !' }]}
        >
          <div>
            <Select onChange={handleAddCondition} style={{ width: '660px' }} placeholder="select condition">
              <Option value="294">Used</Option>
            </Select>
          </div>
        </Form.Item>

        {display == 'block' ? (
          <Form.Item
            name="condition"
            label={<label style={{ color: '#FFFFFF' }}> Used Condition</label>}
            rules={[{ required: false, message: 'Please select condition !' }]}
          >
            <Select style={{ width: '660px' }}>
              <Option value="used"> </Option>
            </Select>
          </Form.Item>
        ) : (
          ''
        )}

        <Form.Item
          name="sku"
          label={<label style={{ color: '#FFFFFF' }}>SKU</label>}
          rules={[{ required: false, message: 'Please input sku !' }]}
        >
          <div>
            <Input defaultValue={Date.now()} style={{ width: '660px' }} />
          </div>
        </Form.Item>

        <Form.Item
          name="images"
          label={<label style={{ color: '#FFFFFF' }}>Images</label>}
          rules={[{ required: true, message: 'Please input images !' }]}
        >
          <div>
            <ImgCrop rotate>
              <Upload
                action="https://api.gearfocus.div4.pgtest.co/api/products/upload-image"
                listType="picture-card"
                fileList={fileList as []}
                onChange={handleChangeImage}
                onPreview={handlePreviewImage}
              >
                <i className="fa-solid fa-camera" style={{ fontSize: '50px' }}></i>
              </Upload>
            </ImgCrop>
          </div>
        </Form.Item>

        <Form.Item
          name="category"
          label={<label style={{ color: '#FFFFFF' }}>Category</label>}
          rules={[{ required: true, message: 'Please select category !' }]}
        >
          <div>
            <Select
              onChange={handleAddCategory}
              mode="tags"
              style={{ width: '660px' }}
              placeholder="Type Categories name to select"
            >
              {categoryList.map((category: any, id: any) => {
                return (
                  <Option key={id} value={category.id}>
                    {category.name}
                  </Option>
                );
              })}
            </Select>
          </div>
        </Form.Item>

        <Form.Item
          name="description"
          label={
            <label style={{ color: '#FFFFFF' }}>
              <div style={{ color: 'red' }}>*</div>Description
            </label>
          }
          rules={[{ required: false, message: 'Please enter description !' }]}
        >
          <div>
            <Editor
              onInit={(evt, editor) => (editorRef.current = editor)} // @ts-nocheck
              initialValue=""
              onEditorChange={handleAddDescription}
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount',
                ],
                toolbar:
                  'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              }}
            />
          </div>
          <p style={{ color: 'red' }}>{requiredConfirmEditor}</p>
        </Form.Item>

        <Form.Item name="" label={<label style={{ color: '#FFFFFF' }}>Available for sale</label>}>
          <div>
            <Switch defaultChecked={true} onChange={handleAvailableSale} checkedChildren="YES" unCheckedChildren="NO" />
          </div>
        </Form.Item>

        <div
          style={{
            display: 'block',
            height: '20px',
            backgroundColor: '#323259',
            boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,.75)',
            marginRight: '-17.25rem',
            marginLeft: '-2.25rem',
          }}
        ></div>
        <h2 style={{ fontSize: '26px', color: '#FFFFFF' }}>Prices & Inventory</h2>

        <Form.Item label={<label style={{ color: '#FFFFFF' }}>Memberships</label>} name="membership">
          <div>
            <Select mode="multiple" onChange={handleAddMembership} style={{ width: '300px' }}>
              <Option value="4">General</Option>
            </Select>
          </div>
        </Form.Item>

        <Form.Item
          rules={[{ required: true, message: 'Please input price !' }]}
          label={<label style={{ color: '#FFFFFF' }}>Price</label>}
          name="price"
        >
          <div>
            <Input value={price} onChange={handleAddPrice} style={{ width: '150px' }} placeholder="0.00" addonAfter="$" />
          </div>
          <p style={{ color: 'red' }}>{requiredConfirmPrice}</p>
        </Form.Item>

        <Form.Item
          name="priceSale"
          label={
            <label style={{ color: '#FFFFFF' }}>
              <Checkbox
                defaultChecked={display === 'block'}
                onChange={(e: any) => {
                  if (e.target.checked === true) {
                    setDisplay('block');
                  } else {
                    setDisplay('none');
                  }
                }}
              ></Checkbox>
              Sale <p style={{ color: 'red' }}>*</p>
            </label>
          }
        >
          <div style={{ display: `${display}` }}>
            <Select
              onChange={(e: any) => {
                setSalePriceType(e);
              }}
              defaultValue={salePriceType}
              style={{ width: '50px' }}
            >
              <Option value="$">$</Option>
              <Option value="%">%</Option>
            </Select>
            <input
              className="ant-input bg-main"
              onChange={handleAddSalePrice}
              value={salePrice}
              style={{ width: '100px' }}
            />
          </div>
          <p style={{ color: 'red' }}>{requireConfirmPriceSale}</p>
          <p style={{ color: 'red' }}>{requiredConfirmPercent}</p>
        </Form.Item>

        <Form.Item label={<label style={{ color: '#FFFFFF' }}>Arrival date</label>} name="arrivalDate">
          <div>
            <DatePicker onChange={handleAddArrivalDate} defaultValue={moment(new Date())} />
          </div>
          <p style={{ color: 'red' }}>{requiredConfirmDate}</p>
        </Form.Item>

        <Form.Item
          label={<label style={{ color: '#FFFFFF' }}>Quantity in stock</label>}
          rules={[{ required: true, message: 'Please input quantity stock !' }]}
          name="stocks"
        >
          <div>
            <Input onChange={handleAddStock} style={{ width: '150px' }} addonAfter="$" />
          </div>
        </Form.Item>

        <div
          style={{
            display: 'block',
            height: '20px',
            backgroundColor: '#323259',
            boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,.75)',
            marginRight: '-17.25rem',
            marginLeft: '-2.25rem',
          }}
        ></div>
        <h2 style={{ fontSize: '26px', color: '#FFFFFF' }}>Shipping</h2>
        <Form.Item
          label={<label style={{ color: '#fff' }}>Continental U.S</label>}
          rules={[
            {
              required: true,
              message: 'This field is required !',
            },
          ]}
          name="continental"
        >
          <div>
            <Input
              onChange={(event: any) => {
                const { value } = event.target;
                const regex = /^-?\d*(\.\d*)?$/;
                if ((!isNaN(value) && regex.test(value)) || value === '' || value === '-') {
                  setContinentalUS(value);
                }
              }}
              style={{ width: '150px' }}
              placeholder="0.00"
              addonAfter="$"
            />
          </div>
        </Form.Item>

        <Form.Item label={<label style={{ color: '#fff' }}>Add Shipping Location</label>} name="location">
          <Select style={{ width: '300px' }} placeholder="Select new zone">
            {countryList.map((country: any, id: any) => {
              return <Option key={id}>{country.country}</Option>;
            })}
          </Select>
        </Form.Item>

        <Form.Item>
          <div
            style={{
              boxShadow: '0 0 13px 0 #b18aff',
              position: 'fixed',
              width: '81%',
              backgroundColor: '#323259',
              bottom: '0',
              left: '264px',
            }}
          >
            <button
            disabled={disabledButton}
              onClick={() => {
                handleAddProduct();
              }}
              style={{ opacity: disabledButton === true ? '0.4' : '1', backgroundColor: '#f0ad4e' }}
            >
              Add Product
            </button>
          </div>
        </Form.Item>

        <div
          style={{
            display: 'block',
            height: '20px',
            backgroundColor: '#323259',
            boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,.75)',
            marginRight: '-17.25rem',
            marginLeft: '-2.25rem',
          }}
        ></div>
        <h2 style={{ fontSize: '26px', color: '#FFFFFF' }}>Marketing</h2>

        <Form.Item label={<label style={{ color: '#fff' }}>Open Graph meta tags</label>}>
          <div>
            <Select style={{ width: '300px' }} value={ogTagsType} onChange={handleAddOgTagType}>
              <Option value="0">Autogenerated</Option>
              <Option value="1">Custom</Option>
            </Select>
          </div>
        </Form.Item>

        {ogTagsType == '1' ? (
          <Form.Item
            label={<label style={{ color: '#FFFFFF' }}></label>}
            rules={[{ required: false, message: 'Please select account status !' }]}
          >
            <div>
              <TextArea value={ogTags} onChange={handleAddOgTag} rows={4} />
            </div>
          </Form.Item>
        ) : (
          ''
        )}

        <Form.Item label={<label style={{ color: '#fff' }}>Meta description</label>}>
          <div>
            <Select style={{ width: '300px' }} value={metaDescType} onChange={handleAddMeteDescType}>
              <Option value="A">Autogenerated</Option>
              <Option value="C">Custom</Option>
            </Select>
          </div>
        </Form.Item>

        {metaDescType == 'C' ? (
          <Form.Item
            label={<label style={{ color: '#FFFFFF' }}></label>}
            rules={[{ required: false, message: 'Please select account status !' }]}
          >
            <div>
              <TextArea value={metaDescription} onChange={handleAddMetaDescription} rows={4} />
            </div>
          </Form.Item>
        ) : (
          ''
        )}

        <Form.Item label={<label style={{ color: '#fff' }}>Meta keywords</label>}>
          <div>
            <Input onChange={handleAddMetaKeywords} style={{ width: '300px' }} />
          </div>
        </Form.Item>

        <Form.Item label={<label style={{ color: '#fff' }}>Product page title</label>}>
          <div>
            <Input onChange={handleAddMarketingTitle} style={{ width: '300px' }} />
          </div>
        </Form.Item>

        <Form.Item label={<label style={{ color: '#fff' }}>Add to Facebook product feed</label>}>
          <div>
            <Switch defaultChecked={false} onChange={handleAddFacebook} checkedChildren="YES" unCheckedChildren="NO" />
          </div>
        </Form.Item>

        <Form.Item label={<label style={{ color: '#fff' }}>Add to Google product feed</label>}>
          <div>
            <Switch defaultChecked={false} onChange={handleAddGoogle} checkedChildren="YES" unCheckedChildren="NO" />
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

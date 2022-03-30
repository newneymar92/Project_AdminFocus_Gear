import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, DatePicker, Form, Input, notification, Select, Spin, Switch } from 'antd';

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
import { useParams } from 'react-router';
import { check } from 'prettier';
import moment from 'antd/node_modules/moment';
import TextArea from 'antd/lib/input/TextArea';
import { LoadingOutlined, SmileOutlined } from '@ant-design/icons';

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
  id: string;
  file: string;
  thumbs: string;
}

export interface IMembership {
  membership_id: string;
}

export interface IShipping {
  id: string;
  price: string;
  zone_name: string;
}

export default function ManageDetail(props: any) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [display, setDisplay] = useState('none');
  const editorRef: any = useRef<HTMLDivElement>(null);
  const [stock, setStock] = useState('');
  const [priceShipping, setPriceShipping] = useState<IShipping[]>([{ id: '', price: '', zone_name: '' }]);
  const [continentalUS, setContinentalUS] = useState('');
  const [general, setGeneral] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableSale, setAvailableSale] = useState('0');

  const [vendorId, setVendorId] = useState('');
  const [nameProduct, setNameProduct] = useState('');
  const [brandId, setBrandId] = useState('');
  const [conditionId, setConditionId] = useState('');
  const [categories, setCategories] = useState<object[]>([]);
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState('0');
  const [memberships, setMemberships] = useState<IMembership[]>([]);
  const [shippingToZones, setShippingToZones] = useState([{ id: 1, price: priceShipping }]);
  const [taxExempt, setTaxExempt] = useState('0');
  const [price, setPrice] = useState('');
  const [salePriceType, setSalePriceType] = useState('$');
  const [arrivalDate, setArrivalDate] = useState('');
  const [inventoryTracking, setInventoryTracking] = useState(0);
  const [quantity, setQuantity] = useState('');
  const [sku, setSku] = useState('');
  const [participateSale, setParticipateSale] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [ogTagsType, setOgTagType] = useState('');
  const [ogTags, setOgTags] = useState('');
  const [metaDescType, setMetaDescType] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [productPageTitle, setProductPageTitle] = useState('');
  const [marketingTitle, setMarketingTitle] = useState('');
  const [facebookMarketingEnabled, setFacebookMarketingEnabled] = useState(0);
  const [googleFeedEnable, setGoogleFeedEnable] = useState(0);
  const [imagesOrder, setImagesOrder] = useState<string[]>([]);
  const [id, setId] = useState('');
  const [deletedImages, setDeletedImages] = useState<any[]>([]);
  const [customFileList, setCustomFileList] = useState<any[]>([]);
  const [imagesFile, setImagesFile] = useState<any[]>([]);

  const [productList, setProductList] = useState<Vendor[]>([]);
  const [disabledButton, setDisabledButton] = useState(false);

  const [requiredProductTitle, setRequiredProductTitle] = useState('');
  const [requiredBrand, setRequiredBrand] = useState('');
  const [requiredImage, setRequiredImage] = useState('');
  const [requiredCategory, setRequiredCategory] = useState('');
  const [requiredEditor, setRequiredEditor] = useState('');
  const [requiredPrice, setRequiredPrice] = useState('');
  const [requiredStock, setRequiredStock] = useState('');

  const vendorList = useSelector((state: any) => state.product.vendor);
  const brandList = useSelector((state: any) => state.product.brand);
  const categoryList = useSelector((state: any) => state.product.category);
  const countryList = useSelector((state: any) => state.product.country);

  const params = useParams<{ id: string }>();

  const handleAddProduct = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append(
      'productDetail',
      JSON.stringify({
        id: params.id,
        vendor_id: vendorId,
        name: nameProduct,
        brand_id: brandId,
        condition_id: conditionId,
        categories: categories,
        description: description,
        enabled: enabled,
        memberships: memberships,
        shipping_to_zones: [{ id: 1, price: priceShipping }],
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

    if (json?.success) {
      for (let i = 0; i < imagesFile.length; i++) {
        const formDataImage = new FormData();
        formDataImage.append('productId', json.data);
        formDataImage.append('order', JSON.stringify(fileList.length + i));
        formDataImage.append('images[]', imagesFile[i].originFileObj);
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
    }

    console.log('ProductList', json.data);
    setLoading(false);
  };

  const handleDetailProduct = async () => {
    setLoading(true);
    const jsonDetail = await dispatch(
      fetchThunk(API_PATHS.productDetail, 'post', {
        id: params.id,
      }),
    );
    setVendorId(jsonDetail.data.vendor_id);
    setNameProduct(jsonDetail.data.name);
    setBrandId(jsonDetail.data.brand_id);
    setConditionId(jsonDetail.data.condition_id);
    setSku(jsonDetail.data.sku);
    setFileList(jsonDetail.data.images);
    setCategories(jsonDetail.data.categories);
    setDescription(jsonDetail.data.description);
    setEnabled(jsonDetail.data.enabled);
    setMemberships(jsonDetail.data.memberships);
    setTaxExempt(jsonDetail.data.tax_exempt);
    setPrice(jsonDetail.data.price);
    setParticipateSale(jsonDetail.data.participate_sale);
    setSalePrice(jsonDetail.data.sale_price);
    setSalePriceType(jsonDetail.data.sale_price_type);
    setArrivalDate(jsonDetail.data.arrival_date);
    setStock(jsonDetail.data.quantity);
    if (jsonDetail.data.shipping.length != 0) {
      setPriceShipping(jsonDetail.data.shipping);
    }
    setMarketingTitle(jsonDetail.data.product_page_title);
    setOgTagType(jsonDetail.data.og_tags_type);
    setOgTags(jsonDetail.data.og_tags);
    setMetaDescType(jsonDetail.data.meta_desc_type);
    setMetaDescription(jsonDetail.data.meta_description);
    setFacebookMarketingEnabled(jsonDetail.data.facebook_marketing_enabled);
    setGoogleFeedEnable(jsonDetail.data.google_feed_enabled);
    setLoading(false);
  };

  useEffect(() => {
    handleDetailProduct();
  }, [params]);

  useEffect(() => {
    console.log('render');
    setCustomFileList(
      fileList.map((file: any) => {
        return {
          uid: file.id,
          name: file.file,
          status: 'done',
          url: file?.thumbs[1],
        };
      }),
    );
  }, [fileList]);

  const customCategory = categories.map((category: any) => {
    return category.category_id;
  });

  const handleAddVendor = (e: any) => {
    console.log('AddVendor', e);
    setVendorId(e);
  };

  const handleAddProductTitle = (e: any) => {
    console.log('AddProduct', e.target.value);
    if (e.target.value === '') {
      setRequiredProductTitle('The input is required');
      setDisabledButton(true);
    } else {
      setRequiredProductTitle('');
      setDisabledButton(false);
    }
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
    if (e.length === 0) {
      setRequiredCategory('The input is required');
      setDisabledButton(true);
    } else {
      setRequiredCategory('');
      setDisabledButton(false);
    }
    setCategories(e);
  };

  const handleAvailableSale = (e: any) => {
    console.log('availableSale', e);
    setAvailableSale(e);
  };

  const handleAddMembership = (e: any) => {
    if (e[0] !== null) {
      const newArr: IMembership[] = [];
      newArr.push({ membership_id: e[0] });
      setMemberships(newArr);
    } else {
      setMemberships(e);
    }
  };

  const handleAddDescription = (e: any) => {
    if (e === '') {
      setRequiredEditor('The input is required');
      setDisabledButton(true);
    } else {
      setRequiredEditor('');
      setDisabledButton(false);
    }
    setDescription(e);
  };

  const handleChangeImage = (result: any) => {
    console.log('result', result);
    if (result.file.status === 'done') {
      setImagesOrder([...imagesOrder, result.file.name]);
      setImagesFile([...imagesFile, result.file]);
    }
    if (result.file.status === 'removed') {
      setDeletedImages([...deletedImages, result.file.uid]);
    }
    console.log('imageFile', imagesFile);
    console.log('imagesOrder', imagesOrder);
    console.log('deletedImage', deletedImages);
    setCustomFileList(result.fileList);
    if (result.fileList.length === 0) {
      setRequiredImage('The input is required');
      setDisabledButton(true);
    } else {
      setRequiredImage('');
      setDisabledButton(false);
    }
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
    console.log('Received values of form: ', values);
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 70 }} spin />;

  const openNotification = () => {
    notification.open({
      message: 'Congrats',
      description: 'Update successfully',
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
  };

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
      <h2>----</h2>
      <h2>----</h2>
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
        <h2 style={{ color: '#FFFFFF', fontSize: '26px', fontFamily: 'Open Sans,sans-serif' }}>{nameProduct}</h2>
        <h3 style={{ color: '#FFFFFF', fontSize: '18px' }}>Info</h3>
        <Form.Item name="vendor" label={<label style={{ color: '#FFFFFF' }}>Vendor *</label>}>
          <div>
            <Select
              value={vendorId}
              onChange={handleAddVendor}
              showSearch
              optionFilterProp="children"
              filterOption={(input: any, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: '660px', backgroundColor: 'red !important' }}
              placeholder="Type Vendor name to select"
            >
              {vendorList.map((vendor: any, id: any) => {
                return (
                  <Option key={id} value={vendor.id.toString()}>
                    {vendor.name}
                  </Option>
                );
              })}
            </Select>
          </div>
        </Form.Item>

        <Form.Item name="Product title" label={<label style={{ color: '#FFFFFF' }}>Product title *</label>} rules={[]}>
          <div>
            <Input value={nameProduct} onChange={handleAddProductTitle} style={{ width: '660px' }} />
            <p style={{ color: 'red' }}>{requiredProductTitle}</p>
          </div>
        </Form.Item>

        <Form.Item
          style={{ color: '#FFFFFF' }}
          name="brand"
          label={<label style={{ color: '#FFFFFF' }}>Brand *</label>}
        >
          <div>
            <Select
              value={brandId}
              onChange={handleAddBrand}
              style={{ width: '660px' }}
              placeholder="Type Brand name to select"
            >
              {brandList.map((brand: any, id: any) => {
                return (
                  <Option key={id} value={brand.id}>
                    {brand.name}
                  </Option>
                );
              })}
            </Select>
            <p style={{ color: 'red' }}>{requiredBrand}</p>
          </div>
        </Form.Item>

        <Form.Item name="condition" label={<label style={{ color: '#FFFFFF' }}>Condition *</label>}>
          <div>
            <Select
              value={conditionId}
              onChange={handleAddCondition}
              style={{ width: '660px' }}
              placeholder="select condition"
            >
              <Option value={conditionId}>Used</Option>
            </Select>
          </div>
        </Form.Item>

        {display == 'block' ? (
          <Form.Item name="condition" label={<label style={{ color: '#FFFFFF' }}> Used Condition</label>}>
            <div>
              <Select style={{ width: '660px' }}>
                <Option value="used"> </Option>
              </Select>
            </div>
          </Form.Item>
        ) : (
          ''
        )}

        <Form.Item name="sku" label={<label style={{ color: '#FFFFFF' }}>SKU</label>}>
          <div>
            <Input onChange={handleAddSku} value={sku} style={{ width: '660px' }} />
          </div>
        </Form.Item>

        <Form.Item name="images" label={<label style={{ color: '#FFFFFF' }}>Images *</label>}>
          <div>
            <ImgCrop rotate>
              <Upload
                action="https://api.gearfocus.div4.pgtest.co/api/products/upload-image"
                listType="picture-card"
                fileList={customFileList as any}
                onChange={handleChangeImage}
                onPreview={handlePreviewImage}
              >
                <i className="fa-solid fa-camera" style={{ fontSize: '50px' }}></i>
              </Upload>
            </ImgCrop>
            <p style={{ color: 'red' }}>{requiredImage}</p>
          </div>
        </Form.Item>

        <Form.Item name="category" label={<label style={{ color: '#FFFFFF' }}>Category *</label>}>
          <div>
            <Select
              value={customCategory}
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
            <p style={{ color: 'red' }}>{requiredCategory}</p>
          </div>
        </Form.Item>

        <Form.Item name="description" label={<label style={{ color: '#FFFFFF' }}>Description *</label>}>
          <div>
            <Editor
              onInit={(evt, editor) => (editorRef.current = editor)} // @ts-nocheck
              value={description}
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
            <p style={{ color: 'red' }}>{requiredEditor}</p>
          </div>
        </Form.Item>

        <Form.Item name="" label={<label style={{ color: '#FFFFFF' }}>Available for sale</label>}>
          <div>
            <Switch
              checked={enabled == '1' ? true : false}
              onChange={handleAvailableSale}
              checkedChildren="YES"
              unCheckedChildren="NO"
            />
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
            <Select
              mode="multiple"
              onChange={handleAddMembership}
              value={memberships[0]?.membership_id}
              style={{ width: '300px' }}
            >
              <Option value="4">General</Option>
            </Select>
          </div>
        </Form.Item>

        <Form.Item name="taxClass" label={<label style={{ color: '#FFFFFF' }}>Tax class</label>} rules={[]}>
          <div style={{ fontSize: '15px', color: '#FFFFFF' }}>
            <div>
              Default
              <Checkbox checked={taxExempt == '1' ? true : false} style={{ marginLeft: '133px', color: '#FFFFFF' }}>
                Tax exempt
              </Checkbox>
            </div>
          </div>
        </Form.Item>

        <Form.Item label={<label style={{ color: '#FFFFFF' }}>Price *</label>} name="price">
          <div>
            <Input
              onChange={(event: any) => {
                const { value } = event.target;
                const regex = /^-?\d*(\.\d*)?$/;
                if ((!isNaN(value) && regex.test(value)) || value === '' || value === '-') {
                  setPrice(value);
                }
              }}
              style={{ width: '150px' }}
              placeholder="Input a number"
              value={price}
              addonAfter="$"
            />
          </div>
          <p style={{ color: 'red' }}>{requiredPrice}</p>
        </Form.Item>

        <Form.Item
          label={<label style={{ color: '#FFFFFF' }}>Sale</label>}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !parseFloat(value) ||
                  parseFloat(getFieldValue('price')) > parseFloat(value) ||
                  parseFloat(getFieldValue('price')) > parseFloat(value)
                ) {
                  return Promise.resolve();
                }
                return Promise.reject('The price sale must be small than price');
              },
            }),
          ]}
          name="priceSale"
        >
          <div>
            <Checkbox
              checked={participateSale == '1' ? true : false}
              style={{ marginLeft: '30px', color: '#FFFFFF' }}
              onChange={(event: any) => {
                if (event.target.checked === true) {
                  setDisplay('inline-block');
                } else if (event.target.checked === false) {
                  setDisplay('none');
                }
              }}
            ></Checkbox>

            <Input
              onChange={(event: any) => {
                const { value } = event.target;
                const regex = /^-?\d*(\.\d*)?$/;
                if ((!isNaN(value) && regex.test(value)) || value === '' || value === '-') {
                  setSalePrice(value);
                }
              }}
              value={salePrice}
              style={{ display: `${participateSale == '1' ? 'inline-block' : 'none'}`, width: '250px' }}
              placeholder="Input a number"
              addonBefore={
                <Select value={salePriceType} defaultValue="USD" style={{ width: 60 }}>
                  <Option value="$">$</Option>
                  <Option value="%">%</Option>
                </Select>
              }
            />
          </div>
        </Form.Item>

        <Form.Item label={<label style={{ color: '#fff' }}>Arrival date</label>} name="arrivalDate">
          <div>
            <DatePicker value={moment(parseInt(arrivalDate) * 1000)} format={'YYYY-MM-DD'} />
          </div>
        </Form.Item>

        <Form.Item label={<label style={{ color: '#fff' }}>Quantity in stock *</label>} name="stocks">
          <div>
            <Input
              onChange={(event: any) => {
                const { value } = event.target;
                const regex = /^-?\d*(\.\d*)?$/;
                if ((!isNaN(value) && regex.test(value)) || value === '' || value === '-') {
                  setStock(value);
                }
              }}
              style={{ width: '150px' }}
              placeholder="Input a number"
              value={stock}
              addonAfter="$"
            />
            <p style={{ color: 'red' }}>{requiredStock}</p>
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
        <Form.Item label={<label style={{ color: '#fff' }}>Continental U.S *</label>} rules={[]} name="continental">
          <div>
            <Input
              onChange={(event: any) => {
                const { value } = event.target;
                const regex = /^-?\d*(\.\d*)?$/;
                if ((!isNaN(value) && regex.test(value)) || value === '' || value === '-') {
                  setPriceShipping(value);
                }
              }}
              style={{ width: '150px' }}
              placeholder="Input a number"
              value={priceShipping[0].price}
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
                openNotification();
                handleAddProduct();
              }}
              style={{ opacity: disabledButton === true ? '0.3' : '1', backgroundColor: '#f0ad4e' }}
            >
              Update Product
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
            <Input value={metaKeywords} onChange={handleAddMetaKeywords} style={{ width: '300px' }} />
          </div>
        </Form.Item>

        <Form.Item label={<label style={{ color: '#fff' }}>Product page title</label>}>
          <div>
            <Input value={marketingTitle} onChange={handleAddMarketingTitle} style={{ width: '300px' }} />
          </div>
        </Form.Item>

        <Form.Item label={<label style={{ color: '#fff' }}>Add to Facebook product feed</label>}>
          <div>
            <Switch
              checked={facebookMarketingEnabled == 1 ? true : false}
              defaultChecked={false}
              onChange={handleAddFacebook}
              checkedChildren="YES"
              unCheckedChildren="NO"
            />
          </div>
        </Form.Item>

        <Form.Item label={<label style={{ color: '#fff' }}>Add to Google product feed</label>}>
          <div>
            <Switch
              checked={googleFeedEnable == 1 ? true : false}
              defaultChecked={false}
              onChange={handleAddGoogle}
              checkedChildren="YES"
              unCheckedChildren="NO"
            />
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

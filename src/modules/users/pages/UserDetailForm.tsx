import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, DatePicker, Form, Input, notification, Select, Spin, Switch } from 'antd';

import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { ROUTES } from '../../../configs/routes';
import { fetchThunk, fetchThunk3 } from '../../common/redux/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'typesafe-actions';
import { replace } from 'connected-react-router';
import { Editor } from '@tinymce/tinymce-react';
import { API_PATHS } from '../../../configs/api';
import { useParams } from 'react-router';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'antd/node_modules/moment';
import { LoadingOutlined, SmileOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: {
    xs: { span: 16 },

    sm: { span: 6 },
  },
};

const { Option } = Select;

export default function UserDetailForm(props: any) {
  const [form] = Form.useForm();
  const [display, setDisplay] = useState('none');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState([] as any);
  const [membershipId, setMembershipId] = useState('');
  const [forceChangePassword, setForceChangePassword] = useState(0);
  const [taxExempt, setTaxExempt] = useState(0);
  const [paymentRailsType, setPaymentRailsType] = useState('individual');
  const [accessLevel, setAccessLevel] = useState('10');
  const [status, setStatus] = useState('E');
  const [statusComment, setStatusComment] = useState('');
  const [disabledButton, setDisabledButton] = useState(false);

  //   const [id, setId] = useState("")

  const [orderAsBuyer, setOrderAsBuyer] = useState(0);
  const [vendorIncome, setVendorIncome] = useState('');
  const [vendorExpense, setVendorExpense] = useState('');
  const [earningBalance, setEarningBalance] = useState(0);
  const [productListedAsVendor, setProdutListedAsVendor] = useState('');
  const [joined, setJoined] = useState('');
  const [lastLogin, setLastLogin] = useState('');
  const [language, setLanguage] = useState('');
  const [referer, setReferer] = useState('');
  const [pendingMembership, setPendingMembership] = useState(null);
  const [requiredEmail, setRequiredEmail] = useState('');
  const [requiredFirstName, setRequiredFirstName] = useState('');
  const [requiredLastName, setRequiredLastName] = useState('');
  const [requiredPassword, setRequiredPassword] = useState('');
  const [requiredConfirmPassword, setRequiredConfirmPassword] = useState('');

  const [userDetail, setUserDetail] = useState<any>({});

  const params = useParams<{ id: string }>();

  const handleUpdateUser = async () => {
    setLoading(true);
    console.log('testt');
    const json = await dispatch(
      fetchThunk(API_PATHS.userUpdate, 'post', {
        params: [
          {
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password,
            confirm_password: confirmPassword,
            membership_id: membershipId,
            forceChangePassword: forceChangePassword,
            taxExempt: taxExempt,
            id: params.id,
            roles: role,
            status: status,
            statusComment: statusComment,
          },
        ],
      }),
    );
    dispatch(replace(`/userDetail/${json.data.info.profile_id}`));
    console.log('json user ', json);
    setLoading(false);
  };

  const handleDetailUser = async () => {
    setLoading(true);
    const json = await dispatch(
      fetchThunk(API_PATHS.userDetail, 'post', {
        id: params.id,
      }),
    );
    const { info } = json.data;
    console.log('inforUser', info);
    setEmail(info.email);
    setFirstName(info.firstName);
    setLastName(info.lastName);
    setAccessLevel(info.access_level);
    setRole(info.roles);
    setOrderAsBuyer(info.order_as_buyer);
    setStatusComment(info.statusComment);
    setMembershipId(info.membership_id);
    setVendorIncome(info.income);
    setVendorExpense(info.expense);
    setEarningBalance(info.earning);
    setProdutListedAsVendor(info.products_total);
    setJoined(info.joined);
    setLastLogin(info.last_login);
    setLanguage(info.language);
    setReferer(info.referer);
    setPendingMembership(info.pending_membership_id);
    setLoading(false);
  };

  useEffect(() => {
    handleDetailUser();
  }, []);

  const handleAddStatus = (e: any) => {
    console.log('status', e.target.value);
    setStatus(`${e.target.value}`);
  };

  const handleAddFirstName = (e: any) => {
    if (e.target.value === '') {
      setRequiredFirstName('The input is required');
      setDisabledButton(true);
    } else {
      setRequiredFirstName('');
      setDisabledButton(false);
    }
    setFirstName(e.target.value);
  };

  const handleAddLastName = (e: any) => {
    if (e.target.value === '') {
      setRequiredLastName('The input is required');
      setDisabledButton(true);
    } else {
      setRequiredLastName('');
      setDisabledButton(false);
    }
    setLastName(e.target.value);
  };

  const handleAddEmail = (e: any) => {
    if (e.target.value === '') {
      setRequiredEmail('The input is required');
      setDisabledButton(true);
    } else {
      setRequiredEmail('');
      setDisabledButton(false);
    }
    setEmail(e.target.value);
  };

  const handleAddPassword = (e: any) => {
    if (e.target.value === '') {
      setRequiredPassword('The input is required');
      setDisabledButton(true);
    } else {
      setRequiredPassword('');
      setDisabledButton(false);
    }
    setPassword(e.target.value);
  };

  const handleAddConfirmPassword = (e: any) => {
    if (e.target.value === '') {
      setRequiredConfirmPassword('The input is required');
      setDisabledButton(true);
    } else {
      setRequiredConfirmPassword('');
      setDisabledButton(false);
    }
    setConfirmPassword(e.target.value);
  };

  const handleAddType = (e: any) => {
    setPaymentRailsType(e);
  };

  const handleAddAccessLevel = (e: any) => {
    if (e == '100') {
      setDisplay('block');
    }
    setAccessLevel(e);
  };

  const handleAddRoles = (e: string) => {
    const newArr: string[] = [];
    newArr.push(e);
    setRole(newArr);
  };

  const handleAddRequireChangePassword = (e: any) => {
    if (e.target.checked === true) {
      setForceChangePassword(1);
    }
  };

  const handleAddTaxExempt = (e: any) => {
    if (e.target.checked === true) {
      setTaxExempt(1);
    }
  };

  const handleAddStatusComment = (e: any) => {
    console.log('statusComment', e.target.value);
    setStatusComment(e.target.value);
  };

  const handleAddMembership = (e: any) => {
    console.log('membership', e);
    setMembershipId(e);
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
      <h2>------</h2>
      <h2>------</h2>
      <div>
        <Button
          onClick={() => {
            dispatch(replace(ROUTES.userPage));
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
        <h2 style={{ color: '#FFFFFF', fontSize: '26px' }}>{email}</h2>
        <h3 style={{ fontSize: '18px', color: '#FFFFFF' }}>Account details</h3>
        <Form.Item
          name="OrdersPlaceAsBuyer"
          label={<label style={{ color: '#FFFFFF' }}>Orders placed as a buyer</label>}
          rules={[
            {
              required: false,
              message: 'Please input your first name !',
            },
          ]}
        >
          <div style={{ fontSize: '15px', color: '#FFFFFF' }}>
            <a style={{ fontSize: '15px', color: 'blue' }}>{orderAsBuyer}</a>($0.00)
          </div>
        </Form.Item>

        <Form.Item
          name="vendorIncome"
          label={<label style={{ color: '#FFFFFF' }}>Vendor Income</label>}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <div style={{ fontSize: '15px', color: '#FFFFFF' }}>
            <div>${vendorIncome}</div>
          </div>
        </Form.Item>

        <Form.Item
          name="vendorExpense"
          label={<label style={{ color: '#FFFFFF' }}>Vendor Expense</label>}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <div style={{ fontSize: '15px', color: '#FFFFFF' }}>
            <div>${vendorExpense}</div>
          </div>
        </Form.Item>

        <Form.Item
          name="earningBalance"
          label={<label style={{ color: '#FFFFFF' }}>Earning balance</label>}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <div style={{ fontSize: '15px', color: '#FFFFFF' }}>
            <div>${earningBalance}</div>
          </div>
        </Form.Item>

        <Form.Item
          name="productListedAsVendor"
          label={<label style={{ color: '#FFFFFF' }}>Products listed as vendor</label>}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <div style={{ fontSize: '15px', color: '#FFFFFF' }}>
            <a>{productListedAsVendor}</a>
          </div>
        </Form.Item>

        <Form.Item
          name="joined"
          label={<label style={{ color: '#FFFFFF' }}>Joined</label>}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <div style={{ fontSize: '15px', color: '#FFFFFF' }}>
            <div>{moment(parseInt(joined) * 1000).format('MMM D,YYYY,hh:mm A')}</div>
          </div>
        </Form.Item>

        <Form.Item
          name="lastLogin"
          label={<label style={{ color: '#FFFFFF' }}>Last login</label>}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <div style={{ fontSize: '15px', color: '#FFFFFF' }}>
            <div>{moment(parseInt(lastLogin) * 1000).format('MMM D,YYYY,hh:mm A')}</div>
          </div>
        </Form.Item>

        <Form.Item
          name="language"
          label={<label style={{ color: '#FFFFFF' }}>Language</label>}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <div style={{ fontSize: '15px', color: '#FFFFFF' }}>
            <div>{language}</div>
          </div>
        </Form.Item>

        <Form.Item
          name="referer"
          label={<label style={{ color: '#FFFFFF' }}>Referer</label>}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <div style={{ fontSize: '15px', color: '#FFFFFF' }}>
            <div>{referer}</div>
          </div>
        </Form.Item>

        <h3 style={{ fontSize: '18px', color: '#FFFFFF' }}>Email & Password</h3>

        <Form.Item
          name="First name"
          label={<label style={{ color: '#FFFFFF' }}>First Name *</label>}
          rules={[{ whitespace: true }, { min: 3 }]}
          // hasFeedback
        >
          <div>
            <Input onChange={handleAddFirstName} value={firstName} style={{ width: '660px' }} />
            <p style={{ color: 'red' }}>{requiredFirstName}</p>
          </div>
        </Form.Item>

        <Form.Item
          name="Last name"
          label={<label style={{ color: '#FFFFFF' }}>Last Name *</label>}
          rules={[{ whitespace: true }, { min: 3 }]}
          // hasFeedback
        >
          <div>
            <Input onChange={handleAddLastName} value={lastName} style={{ width: '660px' }} />
            <p style={{ color: 'red' }}>{requiredLastName}</p>
          </div>
        </Form.Item>

        <Form.Item
          name="Email"
          label={<label style={{ color: '#FFFFFF' }}>Email *</label>}
          rules={[
            {
              type: 'email',
              message: 'The input is not valid email',
            },
          ]}
          // hasFeedback
        >
          <div>
            <Input onChange={handleAddEmail} value={email} style={{ width: '660px' }} />
            <p style={{ color: 'red' }}>{requiredEmail}</p>
          </div>
        </Form.Item>

        <Form.Item
          name="Password"
          label={<label style={{ color: '#FFFFFF' }}>Password</label>}
          rules={[
            {
              required: false,
              message: 'Please input your password !',
            },
            // { min: 6 },
            // {
            //   validator: (_, value) => {
            //     value && value.includes('1') ? Promise.resolve() : Promise.reject('Password need symbol 1');
            //   },
            // },
          ]}
          // hasFeedback
        >
          <div>
            <Input.Password onChange={handleAddPassword} style={{ width: '660px' }} />
            <p style={{ color: 'red' }}>{requiredPassword}</p>
          </div>
        </Form.Item>

        <Form.Item
          name="Confirm password"
          dependencies={['Password']}
          label={<label style={{ color: '#FFFFFF' }}>Confirm password</label>}
          rules={[
            {
              required: false,
              message: 'Please input your confirm password !',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('Password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('The two password that you entered does not match');
              },
            }),
          ]}
          hasFeedback
        >
          <div>
            <Input.Password onChange={handleAddConfirmPassword} style={{ width: '660px' }} />
            <p style={{ color: 'red' }}>{requiredConfirmPassword}</p>
          </div>
        </Form.Item>

        <Form.Item
          style={{ color: '#FFFFFF' }}
          name="type"
          label={<label style={{ color: '#FFFFFF' }}>Type</label>}
          rules={[
            {
              required: false,
              message: 'Please select type !',
            },
          ]}
        >
          individual
        </Form.Item>

        <Form.Item
          name="Confirm password"
          label={<label style={{ color: '#FFFFFF' }}>PaymentRails ID</label>}
          rules={[
            {
              required: false,
              message: 'Please input your confirm password !',
            },
          ]}
        ></Form.Item>

        <h3 style={{ fontSize: '18px', color: '#FFFFFF' }}>Access information</h3>

        <Form.Item
          name="accessLevel"
          label={<label style={{ color: '#FFFFFF' }}>Access level</label>}
          rules={[{ required: false, message: 'Please select access level !' }]}
        >
          <div>
            <Select value={accessLevel} onChange={handleAddAccessLevel} style={{ width: '660px' }}>
              <Option value="100">Admin</Option>
              <Option value="10">Vendor</Option>
            </Select>
          </div>
        </Form.Item>

        <Form.Item
          name="roles"
          label={<label style={{ color: '#FFFFFF' }}> Roles</label>}
          rules={[{ required: false, message: 'Please select condition !' }]}
        >
          <Select onChange={handleAddRoles} mode="multiple" defaultValue={role} style={{ width: '660px' }}>
            <Option value="2">Coupons management</Option>
            <Option value="3">Content management</Option>
            <Option value="4">Volume discounts management</Option>
            <Option value="5">Vendor</Option>
            <Option value="6">View order reports</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="accountstatus"
          label={<label style={{ color: '#FFFFFF' }}> Account status *</label>}
          rules={[{ required: false, message: 'Please select account status !' }]}
        >
          <div>
            <select
              defaultValue={status}
              onChange={handleAddStatus}
              style={{
                width: '20%',
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
        </Form.Item>

        <Form.Item
          name="status"
          label={<label style={{ color: '#FFFFFF' }}>Status comment(reason)</label>}
          rules={[{ required: false, message: 'Please select account status !' }]}
        >
          <div>
            <TextArea value={statusComment} onChange={handleAddStatusComment} rows={4} />
          </div>
        </Form.Item>

        <Form.Item
          name="membership"
          label={<label style={{ color: '#FFFFFF' }}>Membership</label>}
          rules={[{ required: false, message: 'Please select account status !' }]}
        >
          <div>
            <Select onChange={handleAddMembership} defaultValue={membershipId} style={{ width: '660px' }}>
              <Option value="">Ignore Membership</Option>
              <Option value="4">General</Option>
            </Select>
          </div>
        </Form.Item>

        <Form.Item
          name="pendingMembership"
          label={<label style={{ color: '#FFFFFF' }}>Pending membership</label>}
          rules={[{ required: false, message: 'Please select account status !' }]}
        >
          <div style={{ fontSize: '15px', color: '#FFFFFF' }}>
            <div>{pendingMembership == !null ? pendingMembership : 'none'}</div>
          </div>
        </Form.Item>

        <Form.Item
          name="sku"
          label={<label style={{ color: '#FFFFFF' }}>Require to change password on next log in</label>}
          rules={[{ required: false }]}
        >
          <div>
            <Checkbox onChange={handleAddRequireChangePassword} />
          </div>
        </Form.Item>

        <h3 style={{ fontSize: '18px', color: '#FFFFFF' }}>Tax information</h3>

        <Form.Item
          name="sku"
          label={<label style={{ color: '#FFFFFF' }}>Tax exempt</label>}
          rules={[{ required: false }]}
        >
          <div>
            <Checkbox onChange={handleAddTaxExempt} />
          </div>
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
                handleUpdateUser();
              }}
              style={{ opacity: disabledButton === true ? '0.3' : '1', backgroundColor: '#f0ad4e' }}
            >
              Update user
            </button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

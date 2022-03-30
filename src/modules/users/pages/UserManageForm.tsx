import React, { useEffect, useRef, useState } from 'react';
import { Button, Checkbox, DatePicker, Form, Input, Select, Spin, Switch } from 'antd';

import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { ROUTES } from '../../../configs/routes';
import { fetchThunk } from '../../common/redux/thunk';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'typesafe-actions';
import { replace } from 'connected-react-router';
import { Editor } from '@tinymce/tinymce-react';
import { API_PATHS } from '../../../configs/api';
import { Routes } from '../../../Routes';
import { LoadingOutlined } from '@ant-design/icons';

const formItemLayout = {
  labelCol: {
    xs: { span: 16 },

    sm: { span: 6 },
  },
};

const { Option } = Select;

export default function UserManageForm(props: any) {
  const [form] = Form.useForm();
  const [display, setDisplay] = useState('none');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<string[]>([]);
  const [membershipId, setMembershipId] = useState('');
  const [forceChangePassword, setForceChangePassword] = useState(0);
  const [taxExempt, setTaxExempt] = useState(0);
  const [paymentRailsType, setPaymentRailsType] = useState('individual');
  const [accessLevel, setAccessLevel] = useState('');

  const [userList, setUserList] = useState([]);

  const handleAddUser = async () => {
    setLoading(true);
    const json = await dispatch(
      fetchThunk(API_PATHS.userCreate, 'post', {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        confirm_password: confirmPassword,
        membership_id: membershipId,
        forceChangePassword: forceChangePassword,
        taxExempt: taxExempt,
        paymentRailsType: paymentRailsType,
        roles: role,
        access_level: accessLevel,
      }),
    );
    dispatch(replace(`/userDetail/${json.data.info.profile_id}`));
    setLoading(false);
  };

  const handleAddFirstName = (e: any) => {
    setFirstName(e.target.value);
  };

  const handleAddLastName = (e: any) => {
    setLastName(e.target.value);
  };

  const handleAddEmail = (e: any) => {
    setEmail(e.target.value);
  };

  const handleAddPassword = (e: any) => {
    setPassword(e.target.value);
  };

  const handleAddConfirmPassword = (e: any) => {
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

  const handleAddRoles = (e: string[]) => {
    // const newArr: string[] = [];
    // newArr.push(e);
    setRole(e);
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

  const handleAddMembership = (e: any) => {
    setMembershipId(e);
  };

  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

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
      <h2>-----</h2>
      <h2>-----</h2>

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
        autoComplete="off"
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        style={{ width: '80%', backgroundColor: '#1b1b38' }}
      >
        <h2 style={{ color: '#FFFFFF', fontSize: '26px' }}>Create Profile</h2>
        <h3 style={{ fontSize: '18px', color: '#FFFFFF' }}>Email & password</h3>
        <Form.Item
          name="First name"
          label={<label style={{ color: '#FFFFFF' }}>First Name</label>}
          rules={[
            {
              required: true,
              message: 'Please input your first name !',
            },
            { whitespace: true },
            { min: 3 },
          ]}
          hasFeedback
        >
          <div>
            <Input onChange={handleAddFirstName} value={firstName} style={{ width: '660px' }} />
          </div>
        </Form.Item>

        <Form.Item
          name="Last name"
          label={<label style={{ color: '#FFFFFF' }}>Last Name</label>}
          rules={[
            {
              required: true,
              message: 'Please input your last name !',
            },
            { whitespace: true },
            { min: 3 },
          ]}
          hasFeedback
        >
          <div>
            <Input onChange={handleAddLastName} value={lastName} style={{ width: '660px' }} />
          </div>
        </Form.Item>

        <Form.Item
          name="Email"
          label={<label style={{ color: '#FFFFFF' }}>Email</label>}
          rules={[
            {
              type: 'email',
              message: 'The input is not valid email',
            },
            {
              required: true,
              message: 'Please input your email !',
            },
          ]}
          hasFeedback
        >
          <div>
            <Input onChange={handleAddEmail} value={email} style={{ width: '660px' }} />
          </div>
        </Form.Item>

        <Form.Item
          name="Password"
          label={<label style={{ color: '#FFFFFF' }}>Password</label>}
          rules={[
            {
              required: true,
              message: 'Please input your password !',
            },
            { min: 6 },
            // {
            //   validator: (_, value) => {
            //     value && value.includes('1') ? Promise.resolve() : Promise.reject('Password need symbol 1');
            //   },
            // },
          ]}
          // hasFeedback
        >
          <div>
            <Input.Password onChange={handleAddPassword} value={password} style={{ width: '660px' }} />
          </div>
        </Form.Item>

        <Form.Item
          name="Confirm password"
          dependencies={['Password']}
          label={<label style={{ color: '#FFFFFF' }}>Confirm password</label>}
          rules={[
            {
              required: true,
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
            <Input.Password onChange={handleAddConfirmPassword} value={confirmPassword} style={{ width: '660px' }} />
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
          <div>
            <Select onChange={handleAddType} defaultValue="individual" style={{ width: '660px' }}>
              <Option value="individual">Individual</Option>
              <Option value="business">Business</Option>
            </Select>
          </div>
        </Form.Item>

        <Form.Item
          name="Payment"
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
          rules={[{ required: true, message: 'Please select access level !' }]}
        >
          <div>
            <Select onChange={handleAddAccessLevel} style={{ width: '660px' }}>
              <Option value="100">Admin</Option>
              <Option value="10">Vendor</Option>
            </Select>
          </div>
        </Form.Item>

        {display == 'block' ? (
          <Form.Item
            name="roles"
            label={<label style={{ color: '#FFFFFF' }}> Roles</label>}
            rules={[{ required: false, message: 'Please select condition !' }]}
          >
            <div>
              <Select onChange={handleAddRoles} mode="multiple" style={{ width: '660px' }}>
                <Option value="1">Administrator</Option>
                <Option value="2">Coupons management</Option>
                <Option value="3">Content management</Option>
                <Option value="4">Volume discounts management</Option>
                <Option value="5">Vendor</Option>
                <Option value="6">View order reports</Option>
              </Select>
            </div>
          </Form.Item>
        ) : (
          ''
        )}

        <Form.Item
          style={{ color: '#FFFFFF' }}
          name="membership"
          label={<label style={{ color: '#FFFFFF' }}>Membership</label>}
          rules={[
            {
              required: false,
              message: 'Please select type membership !',
            },
          ]}
        >
          <div>
            <Select onChange={handleAddMembership} defaultValue={membershipId} style={{ width: '660px' }}>
              <Option value="">Ingore Membership</Option>
              <Option value="4">General</Option>
            </Select>
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
          name="taxExempt"
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
            <button onClick={handleAddUser} style={{ backgroundColor: '#f0ad4e' }}>
              Add User
            </button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

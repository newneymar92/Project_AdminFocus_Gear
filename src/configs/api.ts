import { APIHost } from '../utils/constants';

enum APIService {
  auth,
  protected,
  public,
}

function getBaseUrl(service: APIService) {
  if (service === APIService.auth) {
    return `${APIHost}/auth`;
  } else if (service === APIService.protected) {
    return `${APIHost}/protected`;
  } else if (service === APIService.public) {
    return `${APIHost}`;
  }

  return '';
}

export const API_PATHS = {
  signIn: `${getBaseUrl(APIService.public)}/api/authentication/login`,
  userProfile: `${getBaseUrl(APIService.public)}/apiAdmin/commons/role`,
  userList: `${getBaseUrl(APIService.public)}/apiAdmin/users/list`,
  userDelete: `${getBaseUrl(APIService.public)}/apiAdmin/users/edit`,
  userCreate: `${getBaseUrl(APIService.public)}/apiAdmin/users/create`,
  userUpdate: `${getBaseUrl(APIService.public)}/apiAdmin/users/edit`,
  categoryList: `${getBaseUrl(APIService.public)}/api/categories/list`,
  productList: `${getBaseUrl(APIService.public)}/api/products/list`,
  productDetail: `${getBaseUrl(APIService.public)}/apiAdmin/products/detail`,
  productUpdate: `${getBaseUrl(APIService.public)}/apiAdmin/products/create`,
  productCreate: `${getBaseUrl(APIService.public)}/apiAdmin/products/create`,
  productDelete: `${getBaseUrl(APIService.public)}/apiAdmin/products/edit`,
  conditionList: `${getBaseUrl(APIService.public)}/apiAdmin/conditions/list`,
  shippingList: `${getBaseUrl(APIService.public)}/apiAdmin/shipping/list`,
  vendorList: `${getBaseUrl(APIService.public)}/apiAdmin/vendors/list`,
  userDetail: `${getBaseUrl(APIService.public)}/apiVendor/profile/detail`,
  brandList: `${getBaseUrl(APIService.public)}/apiAdmin/brands/list`,
  countryList: `${getBaseUrl(APIService.public)}/apiAdmin/commons/country`,
};

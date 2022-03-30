import React, { lazy, Suspense } from 'react';
import { Switch } from 'react-router';
import { Route, useLocation } from 'react-router-dom';
import { ROUTES } from './configs/routes';
import ProtectedRoute from './modules/common/components/ProtectedRoute';



const DetailProductPage=lazy(()=>import('./modules/products/pages/DetailProductPage'))
const UserDetailPage=lazy(()=>import('./modules/users/pages/UserDetailPage'))
const TablePage = lazy(()=>import('./modules/products/pages/TablePage'))
const FormPage = lazy(()=>import('./modules/products/pages/FormPage'))
const UserTablePage = lazy(()=>import('./modules/users/pages/UserTablePage'))
const UserFormPage = lazy(()=>import('./modules/users/pages/UserFormPage'))
const LoginPage = lazy(() => import('./modules/auth/pages/LoginPage'));


interface Props {}

export const Routes = (props: Props) => {
  const location = useLocation();

  return (
    <Suspense fallback={<div>Loading.....</div>}>
      <Switch location={location}>
        <Route path={ROUTES.login} component={LoginPage} />
        <ProtectedRoute path={ROUTES.productPage} component={TablePage} />
        <ProtectedRoute path={ROUTES.productForm} component={FormPage} />
        <ProtectedRoute path={ROUTES.userPage} component={UserTablePage} />
        <ProtectedRoute path={ROUTES.userForm} component={UserFormPage} />
        <ProtectedRoute path={ROUTES.userDetail} component={UserDetailPage} />
        <ProtectedRoute path={ROUTES.productDetails} component={DetailProductPage} />
        <Route path="/" component={LoginPage} />
      </Switch>
    </Suspense>
  );
};

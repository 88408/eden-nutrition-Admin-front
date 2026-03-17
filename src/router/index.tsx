import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ProductList from '../pages/ProductList';
import CategoryList from '../pages/CategoryList';
import OrderList from '../pages/OrderList';
import SeckillList from '../pages/SeckillList';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'product/list',
        element: <ProductList />,
      },
      {
        path: 'category/list',
        element: <CategoryList />,
      },
      {
        path: 'order/list',
        element: <OrderList />,
      },
      {
        path: 'marketing/seckill',
        element: <SeckillList />,
      },
    ],
  },
]);

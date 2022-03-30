import React from 'react';
import { ActionType, createCustomAction, getType } from 'typesafe-actions';

export const saveAllCategories = createCustomAction('product/saveCategories', (category: any) => ({
  category,
}));
export const saveAllProduct = createCustomAction('product/saveProducts', (product: any) => ({
  product,
}));
export const saveAllVendors = createCustomAction('product/saveVendors', (vendor: any) => ({
  vendor,
}));

export const saveAllBrands = createCustomAction('product/saveBrands', (brand: any) => ({
  brand,
}));

export const saveAllCountries = createCustomAction('product/saveCountries', (country: any) => ({
  country,
}));

const actions = { saveAllCategories, saveAllProduct, saveAllVendors, saveAllCountries, saveAllBrands };

type Action = ActionType<typeof actions>;

export default function ProductReducer(state: any = {}, action: Action) {
  switch (action.type) {
    case getType(saveAllCategories):
      return { ...state, category: action.category };
    case getType(saveAllProduct):
      return { ...state, product: action.product };
    case getType(saveAllVendors):
      return { ...state, vendor: action.vendor };
    case getType(saveAllBrands):
      return { ...state, brand: action.brand };
    case getType(saveAllCountries):
      return { ...state, country: action.country };

    default:
      return state;
  }
}

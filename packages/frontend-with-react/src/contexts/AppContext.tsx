import {
  ProductListing,
  ProductRating,
  RatingLevel,
} from '@site-wrapper/common'
import React, { FC, useContext, useEffect, useReducer, useState } from 'react'
import { PropsWithChildren } from 'react'
import {
  FilterState,
  PricePayload,
  ProductFilterReducer,
  initialState,
} from '../reducers/ProductsFilterReducer'
import axiosClient from '../setup/axiosClient'

const AppContext = React.createContext({
  productsFound: [] as ProductRating[],
  productsFilterState: initialState,
  onRatingChange: (rating: RatingLevel) => {},
  onPriceChange: (price: PricePayload) => {},
  onTermChange: (term: string) => {},
  onListingChange: (listing: ProductListing) => {},
  onCategoryIdChange: (categoryId: number | undefined) => {},
})

const filterProducts = async (filterState: FilterState) => {
  // const params = new Param()
  const response = await axiosClient.get<ProductRating[]>('/products/search', {
    params: filterState,
  })
  return response.data
}

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [productsFound, setProductsFound] = useState<ProductRating[]>([])
  const [productsFilterState, dispatcher] = useReducer(
    ProductFilterReducer,
    initialState
  )

  const onTermChange = (term: string) => {
    dispatcher({ type: 'CHANGE-TERM', payload: term })
  }
  const onRatingChange = (rating: RatingLevel) => {
    dispatcher({ type: 'CHANGE-RATING', payload: rating })
  }
  const onPriceChange = (price: PricePayload) => {
    dispatcher({ type: 'CHANGE-PRICE', payload: price })
  }
  const onCategoryIdChange = (categoryId: number | undefined) => {
    dispatcher({ type: 'CHANGE-CATEGORY-ID', payload: categoryId })
  }
  const onListingChange = (listing: ProductListing) => {
    dispatcher({ type: 'CHANGE-LISTING-TYPE', payload: listing })
  }

  const searchForProducts = async () => {
    let params = {}
    if (productsFilterState.price.minPrice)
      params = { ...params, minPrice: productsFilterState.price.minPrice }
    if (productsFilterState.price.maxPrice)
      params = { ...params, maxPrice: productsFilterState.price.maxPrice }
    if (productsFilterState.term && productsFilterState.term.trim() === '')
      params = { ...params, term: productsFilterState.term }
    if (productsFilterState.rating)
      params = { ...params, rating: productsFilterState.rating }
    if (productsFilterState.price.minPrice)
      params = { ...params, minPrice: productsFilterState.price.minPrice }
    if (productsFilterState.listing)
      params = { ...params, listing: productsFilterState.listing }
    if (productsFilterState.categoryId)
      params = { ...params, categoryId: productsFilterState.categoryId }

    const response = await axiosClient.get<ProductRating[]>(
      '/products/search',
      { params }
    )
    return response.data
  }
  useEffect(() => {
    console.log('state changed')

    searchForProducts().then((products) => setProductsFound(products))
  }, [productsFilterState])
  return (
    <AppContext.Provider
      value={{
        productsFound,
        productsFilterState,
        onTermChange,
        onRatingChange,
        onPriceChange,
        onListingChange,
        onCategoryIdChange,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
export const useAppContext = () => {
  return useContext(AppContext)
}

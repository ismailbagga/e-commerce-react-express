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
import { useSearchParams } from 'react-router-dom'

const AppContext = React.createContext({
  productsFound: [] as ProductRating[],
  productCount: 0,
  loading: true,
  onPageChange: (page: number) => {},
  onRatingChange: (rating: RatingLevel) => {},
  onPriceChange: (price: PricePayload) => {},
  onTermChange: (term: string) => {},
  onListingChange: (listing: ProductListing) => {},
  onCategoryIdChange: (categoryId: number | undefined) => {},
})

type ProductResult = {
  productsCount: {
    _count: {
      _all: number
    }
  }
  products: ProductRating[]
}
export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams({
    term: '',
    page: '1',
  })
  const [productsFound, setProductsFound] = useState<ProductRating[]>([])
  const [productCount, setProductsCount] = useState(0)
  const changeParams = (key: string, value: string) => {
    setSearchParams((prevParams) => {
      prevParams.set(key, value)
      return prevParams
    })
  }
  const removeParam = (key: string) => {
    setSearchParams((prev) => {
      prev.delete(key)
      return prev
    })
  }
  const onTermChange = (term: string) => {
    changeParams('term', term)
  }
  const onRatingChange = (rating: RatingLevel) => {
    if (!rating) removeParam('rating')
    else changeParams('rating', rating.toString())
  }
  const onPriceChange = (price: PricePayload) => {
    if (price.minPrice) {
      const min = price.minPrice
      changeParams('minPrice', min.toString())
    } else removeParam('minPrice')

    if (price.maxPrice) {
      const max = price.maxPrice
      changeParams('maxPrice', max.toString())
    } else removeParam('maxPrice')
  }
  const onCategoryIdChange = (categoryId: number | undefined) => {
    if (categoryId) changeParams('categoryId', categoryId.toString())
    else removeParam('categoryId')
  }
  const onListingChange = (listing: ProductListing) => {
    changeParams('listing', listing)
  }
  const onPageChange = (page: number) => {
    changeParams('page', page.toString())
  }
  const searchForProducts = async () => {
    const response = await axiosClient.get<ProductResult>('/products/search', {
      params: searchParams,
    })
    return response.data
  }
  useEffect(() => {
    searchForProducts().then((result) => {
      setLoading(false)
      setProductsCount(result.productsCount._count._all)
      setProductsFound(result.products)
      window.scroll(0, 0)
    })
  }, [searchParams])
  return (
    <AppContext.Provider
      value={{
        loading,
        productsFound,
        productCount,
        onTermChange,
        onRatingChange,
        onPriceChange,
        onListingChange,
        onCategoryIdChange,
        onPageChange,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
export const useAppContext = () => {
  return useContext(AppContext)
}

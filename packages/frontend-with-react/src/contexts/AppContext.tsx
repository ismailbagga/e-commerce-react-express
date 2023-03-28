import { ProductRating, RatingLevel } from '@site-wrapper/common'
import React, { FC, useContext, useEffect, useReducer } from 'react'
import { PropsWithChildren } from 'react'
import {
  FilterState,
  PricePayload,
  ProductFilterReducer,
  initialState,
} from '../reducers/ProductsFilterReducer'
import axiosClient from '../setup/axiosClient'

const AppContext = React.createContext({
  productsFilterState: initialState,
  onRatingChange: (rating: RatingLevel) => {},
  onPriceChange: (price: PricePayload) => {},
  onTermChange: (term: string) => {},
})

const filterProducts = async (filterState: FilterState) => {
  // const params = new Param()
  const response = await axiosClient.get<ProductRating[]>('/products/search', {
    params: filterState,
  })
  return response.data
}

export const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
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
  useEffect(() => {
    console.log('Filter State Changed')
  }, [productsFilterState])
  return (
    <AppContext.Provider
      value={{
        productsFilterState,
        onTermChange,
        onRatingChange,
        onPriceChange,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
export const useAppContext = () => {
  return useContext(AppContext)
}

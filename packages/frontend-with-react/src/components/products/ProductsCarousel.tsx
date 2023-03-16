import React, { FC } from 'react'
import { HomeProductListingCategory } from '@site-wrapper/common'
export type ProductsCarouselsProps = {
  title: string
  listingCategory: HomeProductListingCategory
}

const ProductsCarousels: FC<ProductsCarouselsProps> = (props) => {
  return <div>Products Carousels</div>
}

export default ProductsCarousels

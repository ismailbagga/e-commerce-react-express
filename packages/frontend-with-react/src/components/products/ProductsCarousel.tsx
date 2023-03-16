import React, { FC, useEffect } from 'react'
import { HomeProductListingCategory, Product } from '@site-wrapper/common'
import axiosClient from '../../setup/axiosClient'
export type ProductsCarouselsProps = {
  title: string
  listingCategory: HomeProductListingCategory
}
export type ProductPaginationResult = {
  count: number
  products: Product[]
}
const ProductCard: FC<{ product: Product }> = ({ product }) => {
  return (
    <div>
      <img src="https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_UY218_.jpg"></img>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>{product.price}</p>
    </div>
  )
}

const fetchProducts = async (
  page: number,
  listing: HomeProductListingCategory
) => {
  const result = await axiosClient.get<ProductPaginationResult>(
    '/products/home',
    {
      params: { page, listing },
    }
  )
  return result.data
}

const ProductsCarousels: FC<ProductsCarouselsProps> = (props) => {
  useEffect(() => {
    fetchProducts(1, props.listingCategory).then((data) => console.log(data))
  }, [])

  return <section className="bg-black">Products Carousels</section>
}

export default ProductsCarousels

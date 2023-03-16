import React, { FC, useEffect, useRef, useState } from 'react'
import { HomeProductListingCategory, Product } from '@site-wrapper/common'
import axiosClient from '../../setup/axiosClient'

import LeftArrow from '../../assets/icons/l-arrow.svg'
import RightArrow from '../../assets/icons/r-arrow.svg'
export type ProductsCarouselsProps = {
  title: string
  listingCategory: HomeProductListingCategory
}
export type ProductPaginationResult = {
  count: number
  products: Product[]
}
const ProductCard: FC<{ product: Product }> = ({ product }) => {
  const headerRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    // abc def
    // 2
    console.log(headerRef.current?.innerHTML)
  }, [])

  return (
    <div className="w-[20rem] shrink-0 rounded-t bg-white shadow">
      <img
        src="https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_UY218_.jpg"
        className="h-[15rem] w-full rounded-t "
      ></img>
      <div className="content my-5 px-6">
        {/* 2 lines = 2 * fontHeight = 2 * (1.875rem + 2.25rem) */}
        {/* 4,125 */}
        <h1
          ref={headerRef}
          className="h-[60px] line-clamp-2 overflow-hidden text-2xl font-bold hover:text-purple-700"
        >
          {product.title} Lorem, ipsum dolor sit amet consectetur adipisicing
          elit. Impedit, provident rerum? Eum, labore ipsa provident voluptate,
          placeat suscipit quae tempora obcaecati harum vel sed itaque iusto
          sit! Doloribus, quisquam natus!
        </h1>
        <p>{product.description}</p>
        <p>{product.price}</p>
      </div>
    </div>
  )
}

const fetchProducts = async (
  page: number,
  listing: HomeProductListingCategory
) => {
  const result = await axiosClient.get<Product[]>('/products/home', {
    params: { page, listing },
  })
  return result.data
}

const ProductsCarousels: FC<ProductsCarouselsProps> = (props) => {
  const [data, setData] = useState<Product[]>([])
  useEffect(() => {
    fetchProducts(1, props.listingCategory).then((data) => setData(data))
  }, [])

  return (
    <section className="mx-auto mt-10">
      <main className="relative w-fit mx-auto">
      <nav className="mb-5 h-10">
        <h1 className="text-4xl font-bold">{props.title}</h1>
      </nav>
        <div className="relative 2xl:w-[calc((4*20rem)+2.5rem)] lg:w-[calc((3*20rem)+2.5rem)] md:w-[calc((2*20rem)+2.5rem)]w-[20rem]   flex space-x-5 overflow-x-hidden">
          {data.map((pr) => (
            <ProductCard key={pr.id} product={pr} />
          ))}
        </div>
        <button className="absolute top-1/2 left-0  flex h-[10rem] w-10 -translate-y-[calc(50%-2.5rem)] cursor-pointer items-center bg-gray-400/50   ">
          <img src={LeftArrow} />
        </button>
        <button className="absolute top-1/2 right-0  flex h-[10rem] w-10 -translate-y-[calc(50%-2.5rem)] cursor-pointer items-center bg-gray-400/50 ">
          <img src={RightArrow} />
        </button>
      </main>
    </section>
  )
}

export default ProductsCarousels

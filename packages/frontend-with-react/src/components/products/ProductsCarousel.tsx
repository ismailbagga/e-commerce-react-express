import React, { FC, useEffect, useRef, useState } from 'react'
import { HomeProductListingCategory, Product } from '@site-wrapper/common'
import axiosClient from '../../setup/axiosClient'
import './ProductCarousel.css'

import LeftArrow from '../../assets/icons/l-arrow.svg'
import RightArrow from '../../assets/icons/r-arrow.svg'
import { throttle } from '../../utils/core-utils'
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
    // 2derRef.current?.innerHTML)
  }, [])

  return (
    <div className="w-[calc(100%/var(--items-per-scroll))] shrink-0 px-3 ">
      <div className="h-full rounded bg-white shadow ">
        <img
          src="https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_UY218_.jpg"
          className="h-[15rem] w-full rounded-t object-contain "
        ></img>
        <div className="content my-5 px-6">
          <h1
            ref={headerRef}
            className="h-[60px] overflow-hidden text-2xl font-bold line-clamp-2 hover:text-purple-700"
          >
            {product.id}
          </h1>
          <p>{product.description}</p>
          <p>{product.price}</p>
        </div>
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
  const wrapperEl = useRef<HTMLDivElement>(null)
  let [scrolls, setScrolls] = useState(0)
  const [data, setData] = useState<Product[]>([])

  const extractComputedValue = (property: string, defaultValue = '4') => {
    if (!wrapperEl.current) return parseInt(defaultValue)
    return parseInt(
      getComputedStyle(wrapperEl.current).getPropertyValue(property)
    )
  }
  const setPropertyToWrapper = (property: string, value: string) => {
    if (!wrapperEl.current) return
    wrapperEl.current.style.setProperty(property, value)
  }
  const applySlide = (x100Times: number) => {
    if (!wrapperEl.current) return
    wrapperEl.current.style.transform = `translateX(calc(${100 * x100Times}%))`
  }
  const applySlideInEdges = (className: string) => {
    if (!wrapperEl.current) return
    wrapperEl.current.classList.add(className)
    setTimeout(() => {
      wrapperEl.current && wrapperEl.current.classList.remove(className)
    }, 0.4 * 1000)
  }
  const calculateLastSlide = () => {
    if (!wrapperEl.current) return
    const itemsPerScroll = extractComputedValue('--items-per-scroll')
    const totalItems = extractComputedValue('--total-items')

    const lastSlide = Math.ceil(totalItems / itemsPerScroll - 1)
    setScrolls((prev) => {
      // debugger
      if (Math.abs(prev) > lastSlide) {
        applySlide(lastSlide * -1)
        return -1 * lastSlide
      }
      return prev
    })
    setPropertyToWrapper('--last-slide', lastSlide.toString())
  }

  const scrollCarousel = (direction: 'RIGHT' | 'LEFT') => {
    if (!wrapperEl.current) return
    // debugger
    direction == 'LEFT' ? scrolls++ : scrolls--
    const ITEMS_PER_SLIDE = extractComputedValue('--items-per-scroll')
    const NUMBER_OF_SCROLLS_POSSIBLE =
      Math.ceil(data.length / ITEMS_PER_SLIDE) - 1
    if (scrolls > 0) {
      scrolls = 0
      applySlideInEdges('left-slide-animation')
    } else if (Math.abs(scrolls) > NUMBER_OF_SCROLLS_POSSIBLE) {
      scrolls = -1 * NUMBER_OF_SCROLLS_POSSIBLE
      applySlideInEdges('right-slide-animation')
    } else applySlide(scrolls)
    setScrolls(scrolls)
  }
  useEffect(() => {
    // window.

    fetchProducts(1, props.listingCategory).then((response) => {
      setData(response)
      setPropertyToWrapper('--total-items', response.length.toString())
      calculateLastSlide()
      if (
        response.length % 2 !== 0 ||
        response.length % 3 !== 0 ||
        response.length % 4 !== 0
      ) {
        window.addEventListener('resize', throttle(calculateLastSlide, 300))
      }
    })
  }, [])

  return (
    <section className="mx-auto mt-10">
      <main className="relative mx-4 ">
        <nav className="mb-5 h-10">
          <h1 className=" text-4xl font-bold">{props.title}</h1>
        </nav>
        <div className="mx-auto flex  space-x-3 overflow-hidden">
          <button
            onClick={() => scrollCarousel('LEFT')}
            className="z-40 flex w-16 cursor-pointer   items-center  justify-center  rounded border bg-black/40 px-3 "
          >
            <img src={LeftArrow} className="w-10" />
          </button>
          <div
            ref={wrapperEl}
            className={`slider sm:  relative flex min-w-[calc(100%-8rem)]    items-stretch  
         transition-transform [--items-per-scroll:1]    md:[--items-per-scroll:2]  lg:[--items-per-scroll:3]  2xl:[--items-per-scroll:4]`}
          >
            {data.map((pr) => (
              <ProductCard key={pr.id} product={pr} />
            ))}
          </div>

          <button
            onClick={() => scrollCarousel('RIGHT')}
            className="z-40 flex w-16 cursor-pointer  items-center  justify-center  rounded border bg-black/40 px-3 "
          >
            <img className="w-10" src={RightArrow} />
          </button>
        </div>
      </main>
    </section>
  )
}

export default ProductsCarousels

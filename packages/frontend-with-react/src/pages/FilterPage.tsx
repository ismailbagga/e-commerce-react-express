import React, { FC, FormEventHandler, ForwardedRef, useRef } from 'react'
import GOLD_STAR from '../assets/icons/gold-star.png'
import WHITE_STAR from '../assets/icons/white-star.png'
import { Product, RatingLevel, priceValidator } from '@site-wrapper/common'
import { useAppContext } from '../contexts/AppContext'

const RatingValue: FC<{
  minRating: 1 | 2 | 3 | 4
}> = ({ minRating }) => {
  const STARS = [...new Array(5).keys()]
  const { onRatingChange } = useAppContext()
  const clickHandler = () => {
    console.log('min rating ', minRating)
    onRatingChange(minRating)
  }
  return (
    <div
      className="mb-2 flex w-fit space-x-1 border-2 border-transparent hover:border-red-600"
      onClick={clickHandler}
    >
      {STARS.map((val, index) => {
        return (
          <span key={val}>
            <img
              className="w-5"
              src={index < minRating ? GOLD_STAR : WHITE_STAR}
            />
          </span>
        )
      })}
    </div>
  )
}
// { placeholder: string ,  ref: RefObject<HTMLInputElement> }
// <
//   unknown,
//   { props: { placeholder: string }; ref: RefObject<HTMLInputElement> }
// >
const Input = React.forwardRef(
  (props: any, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <input
        ref={ref}
        type="number"
        className=" w-16 rounded border-2 border-gray-600 px-1 py-1"
        min="0"
        placeholder={props.placeholder}
      />
    )
  }
)

const PriceForm = () => {
  const minPriceRef = useRef<HTMLInputElement>(null)
  const maxPriceRef = useRef<HTMLInputElement>(null)
  const { onPriceChange } = useAppContext()
  const handleOnSubmit: FormEventHandler = (event) => {
    event.preventDefault()
    let maxPrice: number | undefined = undefined
    let minPrice: number | undefined = undefined
    if (maxPriceRef.current)
      maxPrice = priceValidator.parse(maxPriceRef.current.value)
    if (minPriceRef.current)
      minPrice = priceValidator.parse(minPriceRef.current.value)
    console.log(minPrice, maxPrice)

    onPriceChange({ maxPrice, minPrice })
  }
  return (
    <form className="flex h-8 space-x-2 " onSubmit={handleOnSubmit}>
      <Input placeholder="Min" ref={minPriceRef} />
      <Input placeholder="Max" ref={maxPriceRef} />

      <button className=" rounded bg-slate-800 px-5 text-white">Go</button>
    </form>
  )
}

const SearchHeader: FC<{ text: string }> = ({ text }) => {
  return <h1 className="mb-3 text-xl font-bold">{text}</h1>
}

const FilterSideNav = () => {}

const ProductSearchCard: FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="w-[calc(100%/var(--items-per-scroll))] shrink-0 px-3 ">
      <div className="h-full rounded bg-white shadow ">
        <img
          src="https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_UY218_.jpg"
          className="h-[15rem] w-full rounded-t object-contain "
        ></img>
        <div className="content my-5 px-6">
          <h1 className="h-[60px] overflow-hidden text-2xl font-bold line-clamp-2 ">
            {product.id}
          </h1>
          <p>{product.description}</p>
          <p>{product.price}</p>
        </div>
      </div>
    </div>
  )
}

const ProductListing = () => {
  const {} = useAppContext()
  return <main className="h-56 grow "></main>
}
const FilterPage = () => {
  const stars = [4, 3, 2, 1] as const

  return (
    <section className="mx-5 mt-10 flex">
      <header className="  mr-5 border-r-2 border-gray-600 pr-4">
        <h1 className="text-4xl font-bold tracking-wide">Filter</h1>
        <div className="mt-5">
          <SearchHeader text="Rating" />
          {/* <h1 className="mb-3 text-xl font-bold">Rating</h1> */}
          {stars.map((star) => (
            <RatingValue key={star} minRating={star} />
          ))}
        </div>
        <div className="mt-5">
          <SearchHeader text="Price" />
          <PriceForm />
        </div>
      </header>
      <ProductListing />
    </section>
  )
}

export default FilterPage

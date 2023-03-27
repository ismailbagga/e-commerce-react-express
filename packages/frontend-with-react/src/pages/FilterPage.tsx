import React, { FC } from 'react'
import GOLD_STAR from '../assets/icons/gold-star.png'
import WHITE_STAR from '../assets/icons/white-star.png'
const RatingValue: FC<{ minRating: 1 | 2 | 3 | 4 }> = ({ minRating }) => {
  const STARS = [...new Array(5).keys()]
  const clickHandler = () => {
    console.log('min rating ', minRating)
  }
  return (
    <div
      className="mb-2 flex w-fit space-x-1 border-2 border-transparent hover:border-red-600"
      onClick={clickHandler}
    >
      {STARS.map((val, index) => {
        console.log(val)

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

const Input: FC<{ placeholder: string }> = ({ placeholder }) => {
  return (
    <input
      type="number"
      className=" w-16 rounded border-2 border-gray-600 px-1 py-1"
      min="0"
      placeholder={placeholder}
    />
  )
}

const PriceForm = () => {
  return (
    <form className="flex h-8 space-x-2 ">
      <Input placeholder="Min" />
      <Input placeholder="Max" />

      <button className=" rounded bg-slate-800 px-5 text-white">Go</button>
    </form>
  )
}

const SearchHeader: FC<{ text: string }> = ({ text }) => {
  return <h1 className="mb-3 text-xl font-bold">{text}</h1>
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
      <main className="h-56 grow bg-black"></main>
    </section>
  )
}

export default FilterPage

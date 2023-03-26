import React, { FC } from 'react'
import GOLD_STAR from '../assets/icons/gold-star.png'
import WHITE_STAR from '../assets/icons/white-star.png'
const RatingValue: FC<{ minRating: 1 | 2 | 3 | 4 }> = ({ minRating }) => {
  const STARS = [...new Array(5).keys()]
  const clickHandler = () => {
    console.log('min rating ', minRating)
  }
  return (
    <div className="flex space-x-1" onClick={clickHandler}>
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
const PriceForm = () => {
  return (
    <form className="flex h-8 space-x-2 ">
      <input
        type="number"
        className=" w-14 rounded border-2 border-gray-600 px-1 py-1"
        min="0"
        placeholder="Min"
      />
      <input
        type="number"
        className="w-14 rounded border-2 border-gray-600 px-1 py-1"
        min="0"
        placeholder="Max"
      />
      <button className=" rounded bg-slate-800 px-5 text-white">Go</button>
    </form>
  )
}
const FilterPage = () => {
  const stars = [4, 3, 2, 1] as const
  return (
    <section>
      <header className="ml-10 mt-10">
        <h1>Filter</h1>
        <div>
          <h1>Rating</h1>
          {stars.map((star) => (
            <RatingValue key={star} minRating={star} />
          ))}
        </div>
        <div className="">
          <h1>Price</h1>
          <PriceForm />
        </div>
      </header>
      <main></main>
    </section>
  )
}

export default FilterPage

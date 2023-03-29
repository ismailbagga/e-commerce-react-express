import { priceValidator } from '@site-wrapper/common'
import React, { ForwardedRef, useRef } from 'react'
import { FormEventHandler } from 'react'
import { useAppContext } from '../../contexts/AppContext'
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

export const ProductPriceForm = () => {
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

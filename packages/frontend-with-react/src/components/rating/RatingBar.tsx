import { FC } from 'react'
import GOLD_STAR from '../../assets/icons/gold-star.png'
import WHITE_STAR from '../../assets/icons/white-star.png'
export const RatingBar: FC<{
  rating: number
}> = ({ rating }) => {
  const STARS = [...new Array(5).keys()]
  return (
    <div className="flex w-fit space-x-1 border-2 border-transparent">
      {STARS.map((val, index) => {
        return (
          <span key={val}>
            <img
              className="w-5"
              src={index < (rating ?? 1) ? GOLD_STAR : WHITE_STAR}
            />
          </span>
        )
      })}
    </div>
  )
}

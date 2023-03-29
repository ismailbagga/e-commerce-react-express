import { RatingLevel } from '@site-wrapper/common'
import { useAppContext } from '../../contexts/AppContext'
import { RatingBar } from './RatingBar'

export const RatingBox = () => {
  const STARS = [1, 2, 3, 4] satisfies RatingLevel[]
  const { onRatingChange } = useAppContext()
  const clickHandler = (minRating: number) => {
    onRatingChange(minRating as RatingLevel)
  }
  return (
    <div className="">
      {STARS.map((val) => (
        <RatingBar key={val} rating={val} onClickHandler={clickHandler} />
      ))}
    </div>
  )
}

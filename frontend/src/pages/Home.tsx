import { ActionsGrid } from "../components/ActionsGrid.tsx/ActionsGrid"
import { Carousels } from "../components/Carousel/Carousel"
import { FeaturesCards } from "../components/FeaturedCards/FeaturesCards"

const Home = () => {
  return (
    <>
      <Carousels />
      <FeaturesCards />
      <ActionsGrid />
    </>
  )
}

export default Home

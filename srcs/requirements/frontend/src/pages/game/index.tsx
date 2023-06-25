import { Outlet } from "react-router-dom"
import { GameProvider } from "../../provider/GameProvider"

const index = () => {
  return (
	<div className='w-full h-full '>
    <GameProvider >
    <Outlet />
    </GameProvider>
  </div>
  )
}

export default index
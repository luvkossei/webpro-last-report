import { useState } from "react"
import Canvas from "./Canvas"
import WeatherInfo from "./WeatherInfo"

function App() {
  const [weather, setWeather] = useState("Loading...")
  const [temp, setTemp] = useState("")
  const [mode, setMode] = useState("Clear")

  return (
    <>
      <WeatherInfo weather={weather} temp={temp} />
      <Canvas
        mode={mode}
        setWeather={setWeather}
        setTemp={setTemp}
        setMode={setMode}
      />
    </>
  )
}

export default App

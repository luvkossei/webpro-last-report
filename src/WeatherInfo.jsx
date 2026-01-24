function WeatherInfo({ weather, temp }) {
  return (
    <div id="info">
      <div>{weather}</div>
      <div>{temp && `${temp}°C`}</div>
    </div>
  )
}

export default WeatherInfo

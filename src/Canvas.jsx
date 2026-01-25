import { useEffect, useRef } from "react"

const API_KEY = "3af3f8c736b5ea40272b6d95ef884bef"

function Canvas({ mode, setWeather, setTemp, setMode }) {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const audio = useRef(new Audio())
  const audioEnabled = useRef(false)

  useEffect(() => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext("2d")

  function getTimeColor() {
    const h = new Date().getHours()
    if (h >= 6 && h < 16) return "rgba(50,150,255,0.3)"
    if (h >= 16 && h < 19) return "rgba(255,120,50,0.3)"
    return "rgba(10,10,40,0.3)"
  }

  function createParticles(n) {
    particles.current = []
    for (let i = 0; i < n; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 + 1,
        r: Math.random() * 2 + 1
      })
    }
  }

  createParticles(150)

  function update() {
    ctx.fillStyle = getTimeColor()
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (mode === "Rain") {
      ctx.strokeStyle = "cyan"
      particles.current.forEach(p => {
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x, p.y + 15)
        ctx.stroke()
        p.y += p.vy * 6
        if (p.y > canvas.height) p.y = 0
      })
    } else {
      ctx.fillStyle = "white"
      particles.current.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        p.x += p.vx
        p.y += p.vy * 0.5
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      })
    }

    requestAnimationFrame(update)
  }

  update()
}, [mode])


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      )
        .then(res => res.json())
        .then(data => {
          setWeather(data.weather[0].main)
          setTemp(data.main.temp)
          setMode(data.weather[0].main)

          if (data.weather[0].main === "Rain") {
            audio.current.src = "/rain.mp3"
          } else if (data.weather[0].main === "Clear") {
            audio.current.src = "/sunny.mp3"
          } else {
            audio.current.src = "/wind.mp3"
          }
          audio.current.loop = true
        })
    })
  }, [])

  useEffect(() => {
    const handleOrientation = e => {
      const x = e.gamma || 0
      particles.current.forEach(p => {
        p.vx += x * 0.05
      })
    }
    window.addEventListener("deviceorientation", handleOrientation)
    return () => window.removeEventListener("deviceorientation", handleOrientation)
  }, [])

  useEffect(() => {
    const handleClick = () => {
      if (!audioEnabled.current) {
        audio.current.play()
        audioEnabled.current = true
      }
    }
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  return <canvas ref={canvasRef} width={360} height={500} />
}

export default Canvas

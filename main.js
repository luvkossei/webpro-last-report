const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

const weatherDiv = document.getElementById("weather")
const tempDiv = document.getElementById("temp")

const API_KEY = "3af3f8c736b5ea40272b6d95ef884bef"

let particles = []
let mode = "Clear"
let bgColor = "rgba(0,0,0,0.3)"
let audio = new Audio()
let audioEnabled = false

navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude
    const lon = pos.coords.longitude
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            mode = data.weather[0].main
            weatherDiv.textContent = data.weather[0].main
            tempDiv.textContent = data.main.temp + "°C"
            setAudio()
        })
})

function setTimeColor() {
    const h = new Date().getHours()
    if(h >= 6 && h < 16) bgColor = "rgba(50,150,255,0.3)"
    else if(h >= 16 && h < 19) bgColort = "rgba(255,120,50,0.3)"
    else bgColor = "rgba(10,10,40,0.3)"
}

function setAudio() {
    if(mode === "Rain") audio.src = "rain.mp3"
    if(mode === "Clear") audio.src = "sunny.mp3"
    else audio.src = "wind.mp3"
    audio.loop = true
}

function createParticles(n) {
    particles = []
    for(let i=0;i<n;i++) {
        particles.push({
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height,
            vx: Math.random()*2-1,
            vy: Math.random()*2+1,
            r: Math.random()*2+1
        })
    }
}

createParticles(120)

function update() {
    setTimeColor()
    ctx.fillStyle = bgColor
    ctx.fillRect(0,0,canvas.width,canvas.height)

    if(mode === "Rain") {
        ctx.strokeStyle = "cyan"
        particles.forEach(p => {
            ctx.beginPath()
            ctx.moveTo(p.x,p.y)
            ctx.lineTo(p.x,p.y+12)
            ctx.stroke()
            p.y += p.vy*4
            if(p.y > canvas.height) p.y = 0
        })
    } else {
        ctx.fillStyle = "white"
        particles.forEach(p => {
            ctx.beginPath()
            ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
            ctx.fill()
            p.x += p.vx
            p.y += p.vy*0.5
            if(p.x<0||p.x>canvas.width) p.vx*=-1
            if(p.y<0||p.y>canvas.height) p.vy*=-1
        })
    }

    requestAnimationFrame(update)
}

update()

window.addEventListener("click", () => {
    if(!audioEnabled) {
        audio.play()
        audioEnabled = true
    }
})

window.addEventListener("deviceorientation", e => {
    const x = e.gamma || 0
    particles.forEach(p => p.vx += x*0.001)
})

const canvas = document.querySelector("#canvas")
const canvasContext = canvas.getContext('2d')
canvas.width = 1300
canvas.height = 900
const canvasRect = canvas.getClientRects()[0]
let strokeState
let position
let stroke = []
let record = []
const convertPosition= (canvasRect, position) => {
    return {
        x: position.x - canvasRect.x,
        y: position.y - canvasRect.y
    }
}
const drawLine = (start, end, color) => {
    canvasContext.strokeStyle = color
    canvasContext.beginPath()
    canvasContext.moveTo(start.x, start.y)
    canvasContext.lineTo(end.x, end.y)
    canvasContext.lineWidth = 2
    canvasContext.stroke()
    canvasContext.closePath()
}
canvas.onmousemove = e => {
    e.preventDefault()
    // 判断鼠标坐标超出范围
    if (e.x < canvasRect.x || e.x > canvasRect.x + canvasRect.width || e.y < canvasRect.y || e.y > canvasRect.y + canvasRect.height)
        strokeState = false
    else {
        const currentPosition = { x: e.clientX, y: e.clientY }
        const newPosition = convertPosition(canvasRect, currentPosition)
        // 判断当前是否在画
        if (strokeState) {
            // 画
            stroke.push(position)
            drawLine(position, newPosition, 'black')
            position = newPosition
        }
    }
}
canvas.ontouchmove = e => {
    e.preventDefault()
    // 判断鼠标坐标超出范围
    if (e.touches[0].clientX < canvasRect.x || e.touches[0].clientX > canvasRect.x + canvasRect.width || e.touches[0].clientY < canvasRect.y || e.touches[0].clientY > canvasRect.y + canvasRect.height)
        strokeState = false
    else {
        const currentPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        const newPosition = convertPosition(canvasRect, currentPosition)
        // 判断当前是否在画
        if (strokeState) {
            // 画
            stroke.push(position)
            drawLine(position, newPosition, 'black')
            position = newPosition
        }
    }
}
canvas.onmousedown = e => {
    strokeState = true
    stroke = []
    position = convertPosition(canvasRect,{x: e.clientX, y: e.clientY})
}
canvas.ontouchstart = e => {
    strokeState = true
    stroke = []
    position = convertPosition(canvasRect,{x: e.touches[0].clientX, y: e.touches[0].clientY})
}
canvas.ontouchend = e => {
    strokeState = false
    record.push(stroke)
}
canvas.onmouseup = e => {
    strokeState = false
    record.push(stroke)
}
document.querySelector('#log').onclick = () => {
    console.log(JSON.stringify(record))
}
document.querySelector('#clear').onclick = () => {
    record = []
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
}
document.querySelector('#withdraw').onclick = () => {
    record.pop()
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    record.map(stroke => {
        let previousPosition = stroke[0]
        stroke.forEach((position) => {
            drawLine(previousPosition, position, 'black')
            previousPosition = position
        })
    })

}

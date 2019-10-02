import GOF from './src/GOF'

/*
go to each alive cells
set every dead neighbour to be checked check
*/

/*
For a space that is 'populated':
	Each cell with one or no neighbors dies, as if by solitude. or 7-8 dead ones
	Each cell with four or more neighbors dies, as if by overpopulation. 4- dead
	Each cell with two or three neighbors survives. or 5-6 dead
For a space that is 'empty' or 'unpopulated'
	Each cell with three neighbors becomes populated. 6 dead
*/

let canvasWidth = 1000
let cellNumber = 50
let cellSize = canvasWidth/cellNumber

const c: HTMLCanvasElement = document.querySelector("canvas")

c.addEventListener("mousedown", (e) => {
	const rect = c.getBoundingClientRect()
	const x = (Math as any).trunc((e.clientX - rect.left)/cellSize)
	const y = (Math as any).trunc((e.clientY - rect.top)/cellSize)
	console.log("x: " + x + " y: " + y)
	let tCell = gof.getCellAt(x, y)
	if (tCell !== undefined) {
		tCell.value = false
		tCell.ntValue = false
	}
	else tCell = gof.addCell(x, y)
	tCell.draw()
})

let gof = new GOF(c, canvasWidth, canvasWidth, cellSize);
(window as any).gof = gof
gof.update()
// gof.addCell(3,4)
// let cell = gof.addCell(4,4)
// for (let k = 0; k < cellNumber; k++) {
// 	gof.addCell(k, cellNumber/2)

// }
gof.alive.forEach(el => {
	el.draw()
})
// gof.update()

let interval: number

document.querySelector(".start").addEventListener("click", () => {
	if (interval === undefined) interval = setInterval(() => {
		let start = new Date().getTime()
		gof.update()
		let speed = document.querySelector(".speed")
		speed.innerHTML = new Date().getTime() - start + ""
	}, 1)
})

document.querySelector(".pause").addEventListener("click", () => {
	if (interval != undefined) clearInterval(interval)
	interval = undefined
})

document.querySelector(".grid").addEventListener("click", () => {
	gof.showGrid = !gof.showGrid
})

document.querySelector(".step").addEventListener("click", () => {
	let start = new Date().getTime()
	gof.update()
	let speed = document.querySelector(".speed")
	speed.innerHTML = new Date().getTime() - start + ""

})

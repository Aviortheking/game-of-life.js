import Cell from './Cell'

interface keyVal {
	[key: string]: Cell
}

export default class GOF {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D

	cellSize: number
	width: number
	height: number

	alive: Cell[] = []

	showGrid: boolean = true
	public constructor(canvas: HTMLCanvasElement, width: number = 100, height: number = 100, size: number = 10) {
		this.ctx = canvas.getContext("2d")
		this.canvas = canvas
		this.width = width
		this.canvas.width = width
		this.height = height
		this.canvas.height = height
		this.cellSize = size
		console.log(this.alive)
	}

	public addCell(x: number, y: number): Cell {
		let cell = new Cell(x, y, this.cellSize, this, true)
		this.alive.push(cell)
		return cell
	}

	public getCellAt(x: number, y: number): Cell {
		 return (this.alive as any).find((el: Cell) => {return el.x == x && el.y == y})
	}

	public removeDups(cells: Cell[]): Cell[] {
		let temp: keyVal = {}
		for (const cell of cells) {
			temp[`${cell.x}:${cell.y}`] = cell
		}
		let arr: Cell[] = []
		for (const key in temp) {
			if (temp.hasOwnProperty(key)) {
				const cell = temp[key];
				arr.push(cell)
			}
		}
		return arr
	}

	public update() {
		let counter = document.querySelector(".counter")
		counter.innerHTML = parseInt(counter.innerHTML)+1 + ""
		let cellsToCheck: Cell[] = []

		this.ctx.clearRect(0,0,this.width,this.height)
		this.alive.forEach(cell => {
			cellsToCheck.push(...cell.getDeadNeighbour())
			// console.log(...cell.getDeadNeighbour())
		})
		cellsToCheck.push(...this.alive)
		cellsToCheck = this.removeDups(cellsToCheck)
		// console.log(cellsToCheck)
		let tAlive: Cell [] = []
		cellsToCheck.forEach((cell: Cell) => {
			cell.prepareNextTurn()
			if (
				cell.ntValue == true &&
				// cell.x <= this.width/this.cellSize &&
				// cell.y <= this.height/this.cellSize &&
				!(tAlive as any).find((el: Cell) => {return el.x == cell.x && el.y == cell.y})
			) {
				tAlive.push(cell)
			}
		})
		this.alive = tAlive
		let count = document.querySelector(".cell-count")
		count.innerHTML = this.alive.length + ""

		this.alive.forEach(cell => {
			let toDraw = true
			if (cell.y > this.height/this.cellSize || cell.y < 0) toDraw = false
			if (cell.x > this.width/this.cellSize || cell.x < 0) toDraw = false
			cell.draw(toDraw)
		})
		if (this.showGrid) {
			this.ctx.fillStyle = "black"
			this.ctx.beginPath()
			for (let index = 0; index < this.height; index += this.cellSize) {
				this.ctx.moveTo(0, index)
				this.ctx.lineTo(this.width, index)
				this.ctx.stroke()
			}
			for (let index = 0; index < this.width; index += this.cellSize) {
				this.ctx.moveTo(index, 0)
				this.ctx.lineTo(index, this.height)
				this.ctx.stroke()
			}
			this.ctx.closePath()
		}

	}
}

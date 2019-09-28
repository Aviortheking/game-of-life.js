class GOF {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D

	cellSize: number
	width: number
	height: number

	alive: Cell[] = []
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

	public update() {
		let cellsToCheck: Cell[] = []

		this.ctx.clearRect(0,0,this.width,this.height)
		this.alive.forEach(cell => {
			cellsToCheck.push(...cell.getDeadNeighbour())
			// console.log(...cell.getDeadNeighbour())
		})
		cellsToCheck.push(...this.alive)
		// console.log(cellsToCheck)
		let tAlive: Cell [] = []
		cellsToCheck.forEach((cell: Cell) => {
			cell.prepareNextTurn()
			if (
				cell.ntValue == true &&
				!(tAlive as any).find((el: Cell) => {return el.x == cell.x && el.y == cell.y})
			) {
				tAlive.push(cell)
			}
		})
		this.alive = tAlive

		this.alive.forEach(cell => {
			cell.draw()
		})
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

class Cell {

	// public constructor(x:number, y: number, size: number, engine: GOF) {
	// 	this.x = x
	// 	this.y = y
	// 	this.size = size
	// 	this.engine = engine
	// }

	public constructor(x:number, y: number, size: number, engine: GOF, value: boolean = false) {
		this.x = x
		this.y = y
		this.size = size
		this.engine = engine
		this.value = value
	}


	private color: string = "yellow"

	private _engine: GOF
	public set engine(v: GOF) {
		this._engine = v
	}
	public get engine(): GOF {
		return this._engine
	}

	private _x: number
	public set x(v: number) {
		this._x = v
	}
	public get x(): number {
		return this._x
	}

	private _y: number
	public set y(v: number) {
		this._y = v
	}
	public get y(): number {
		return this._y
	}

	private _size: number
	public set size(v: number) {
		this._size = v
	}
	public get size(): number {
		return this._size
	}


	private _value: boolean = false
	public set value(v: boolean) {
		this._value = v
	}
	public get value(): boolean {
		return this._value
	}

	private _ntValue: boolean
	public set ntValue(v: boolean) {
		this._ntValue = v
	}
	public get ntValue(): boolean {
		return this._ntValue
	}


	public getDeadNeighbour() {
		let nb: Cell[] = []
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				let cell = this.engine.getCellAt(this.x+i, this.y+j)
				if (cell === undefined) {
					nb.push(new Cell(this.x+i, this.y+j, this.size, this.engine))
					continue
				}
			}
		}
		return nb
	}

	public draw() {
		if (this.ntValue) this.value = true
		this.ntValue = undefined
		this.engine.ctx.fillStyle = this.color
		this.engine.ctx.fillRect(this.x*this.size,this.y*this.size,this.size,this.size)
		// this.engine.ctx.fillStyle = "black"
		// this.engine.ctx.font = "30px Roboto"
		// this.engine.ctx.fillText(this.getDeadNeighbour().length + "", this.x*this.size+this.size/2.5,this.y*this.size+this.size/1.5)
	}

	public prepareNextTurn() {
		let nLength = this.getDeadNeighbour().length
		if (!this.value && nLength == 6) this.ntValue = true
		if (this.value && (nLength > 6 || nLength < 5)) this.ntValue = false
		if (this.ntValue === undefined) this.ntValue = this.value
	}
}

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


const c: HTMLCanvasElement = document.querySelector("canvas")
let gof = new GOF(c, 900, 900, 900/100);
(window as any).gof = gof
gof.update()
// gof.addCell(3,4)
// let cell = gof.addCell(4,4)
gof.addCell(5,4)
for (let k = 0; k < 100; k++) {
	gof.addCell(k, 100/2)

}
gof.alive.forEach(el => {
	el.draw()
})
// gof.update()

let interval: number

document.querySelector(".start").addEventListener("click", () => {
	interval = setInterval(() => {
		gof.update()
	}, 10)
})

document.querySelector(".pause").addEventListener("click", () => {
	clearInterval(interval)
})

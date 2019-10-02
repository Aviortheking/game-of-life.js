import GOF from './GOF'

export default class Cell {

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

	public draw(draw: boolean = true) {
		if (this.ntValue) this.value = true
		this.ntValue = undefined
		if (draw) {
			this.engine.ctx.fillStyle = this.color
			if (this.value)this.engine.ctx.fillRect(this.x*this.size,this.y*this.size,this.size,this.size)
			else this.engine.ctx.clearRect(this.x*this.size,this.y*this.size,this.size,this.size)
		}
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

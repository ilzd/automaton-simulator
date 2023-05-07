import { BoardMap } from "../model/map.model"

export const MAP_POINT_RADIUS = 80
export const MAP_STEP_SIZE = 190
export const MAP_TILE_SIZE = 75

export enum BoardPointType {
	NORMAL,
	LUCK,
	DECISION
}

// export const BOARD_MAP: BoardMap = {
// 	points: [
// 		{
// 			id: 0,
// 			prev: [],
// 			next: [1],
// 			type: BoardPointType.NORMAL,
// 			coords: {
// 				x: 0,
// 				y: 5
// 			}
// 		}, {
// 			id: 1,
// 			prev: [0],
// 			next: [2],
// 			type: BoardPointType.NORMAL,
// 			coords: {
// 				x: 1,
// 				y: 5
// 			}
// 		},
// 		{
// 			id: 2,
// 			prev: [1],
// 			next: [3],
// 			type: BoardPointType.DECISION,
// 			coords: {
// 				x: 2,
// 				y: 5
// 			}
// 		},
// 		{
// 			id: 3,
// 			prev: [2],
// 			next: [4],
// 			type: BoardPointType.LUCK,
// 			coords: {
// 				x: 3,
// 				y: 5
// 			}
// 		},
// 		{
// 			id: 4,
// 			prev: [3],
// 			next: [],
// 			// next: [5],
// 			type: BoardPointType.NORMAL,
// 			coords: {
// 				x: 3,
// 				y: 6
// 			}
// 		},
// 		// {
// 		// 	id: 5,
// 		// 	prev: [4],
// 		// 	next: [6],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 3,
// 		// 		y: 7
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 6,
// 		// 	prev: [5],
// 		// 	next: [7],
// 		// 	type: BoardPointType.LUCK,
// 		// 	coords: {
// 		// 		x: 3,
// 		// 		y: 8
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 7,
// 		// 	prev: [6],
// 		// 	next: [8],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 3,
// 		// 		y: 9
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 8,
// 		// 	prev: [7],
// 		// 	next: [9],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 4,
// 		// 		y: 9
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 9,
// 		// 	prev: [8],
// 		// 	next: [10, 11],
// 		// 	type: BoardPointType.DECISION,
// 		// 	coords: {
// 		// 		x: 5,
// 		// 		y: 9
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 10,
// 		// 	prev: [9],
// 		// 	next: [15],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 5,
// 		// 		y: 10
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 11,
// 		// 	prev: [9],
// 		// 	next: [12],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 5,
// 		// 		y: 8
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 12,
// 		// 	prev: [11],
// 		// 	next: [13],
// 		// 	type: BoardPointType.DECISION,
// 		// 	coords: {
// 		// 		x: 6,
// 		// 		y: 8
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 13,
// 		// 	prev: [12],
// 		// 	next: [14],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 7,
// 		// 		y: 8
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 14,
// 		// 	prev: [13, 18],
// 		// 	next: [19],
// 		// 	type: BoardPointType.LUCK,
// 		// 	coords: {
// 		// 		x: 8,
// 		// 		y: 8
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 15,
// 		// 	prev: [10],
// 		// 	next: [16],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 6,
// 		// 		y: 10
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 16,
// 		// 	prev: [15],
// 		// 	next: [17],
// 		// 	type: BoardPointType.DECISION,
// 		// 	coords: {
// 		// 		x: 7,
// 		// 		y: 10
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 17,
// 		// 	prev: [16],
// 		// 	next: [18],
// 		// 	type: BoardPointType.LUCK,
// 		// 	coords: {
// 		// 		x: 8,
// 		// 		y: 10
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 18,
// 		// 	prev: [17],
// 		// 	next: [14],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 8,
// 		// 		y: 9
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 19,
// 		// 	prev: [14],
// 		// 	next: [20],
// 		// 	type: BoardPointType.DECISION,
// 		// 	coords: {
// 		// 		x: 8,
// 		// 		y: 7
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 20,
// 		// 	prev: [19],
// 		// 	next: [21],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 8,
// 		// 		y: 6
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 21,
// 		// 	prev: [20],
// 		// 	next: [22],
// 		// 	type: BoardPointType.LUCK,
// 		// 	coords: {
// 		// 		x: 8,
// 		// 		y: 5
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 22,
// 		// 	prev: [21],
// 		// 	next: [23, 28],
// 		// 	type: BoardPointType.DECISION,
// 		// 	coords: {
// 		// 		x: 8,
// 		// 		y: 4
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 23,
// 		// 	prev: [22],
// 		// 	next: [24],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 7,
// 		// 		y: 4
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 24,
// 		// 	prev: [23],
// 		// 	next: [25],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 7,
// 		// 		y: 3
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 25,
// 		// 	prev: [24],
// 		// 	next: [26],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 7,
// 		// 		y: 2
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 26,
// 		// 	prev: [25],
// 		// 	next: [27],
// 		// 	type: BoardPointType.DECISION,
// 		// 	coords: {
// 		// 		x: 8,
// 		// 		y: 2
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 27,
// 		// 	prev: [26, 29],
// 		// 	next: [30, 36],
// 		// 	type: BoardPointType.LUCK,
// 		// 	coords: {
// 		// 		x: 9,
// 		// 		y: 2
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 28,
// 		// 	prev: [22],
// 		// 	next: [29],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 9,
// 		// 		y: 4
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 29,
// 		// 	prev: [28],
// 		// 	next: [27],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 9,
// 		// 		y: 3
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 30,
// 		// 	prev: [27],
// 		// 	next: [31],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 9,
// 		// 		y: 1
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 31,
// 		// 	prev: [30],
// 		// 	next: [32],
// 		// 	type: BoardPointType.DECISION,
// 		// 	coords: {
// 		// 		x: 9,
// 		// 		y: 0
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 32,
// 		// 	prev: [31],
// 		// 	next: [33],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 10,
// 		// 		y: 0
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 33,
// 		// 	prev: [32],
// 		// 	next: [34],
// 		// 	type: BoardPointType.LUCK,
// 		// 	coords: {
// 		// 		x: 11,
// 		// 		y: 0
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 34,
// 		// 	prev: [33],
// 		// 	next: [35],
// 		// 	type: BoardPointType.DECISION,
// 		// 	coords: {
// 		// 		x: 12,
// 		// 		y: 0
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 35,
// 		// 	prev: [34, 38],
// 		// 	next: [39],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 12,
// 		// 		y: 1
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 36,
// 		// 	prev: [27],
// 		// 	next: [37],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 10,
// 		// 		y: 2
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 37,
// 		// 	prev: [36],
// 		// 	next: [38],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 11,
// 		// 		y: 2
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 38,
// 		// 	prev: [37],
// 		// 	next: [35],
// 		// 	type: BoardPointType.DECISION,
// 		// 	coords: {
// 		// 		x: 12,
// 		// 		y: 2
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 39,
// 		// 	prev: [35],
// 		// 	next: [40],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 13,
// 		// 		y: 1
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 40,
// 		// 	prev: [39],
// 		// 	next: [41, 49],
// 		// 	type: BoardPointType.LUCK,
// 		// 	coords: {
// 		// 		x: 14,
// 		// 		y: 1
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 41,
// 		// 	prev: [40],
// 		// 	next: [42],
// 		// 	type: BoardPointType.DECISION,
// 		// 	coords: {
// 		// 		x: 15,
// 		// 		y: 1
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 42,
// 		// 	prev: [41],
// 		// 	next: [43],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 16,
// 		// 		y: 1
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 43,
// 		// 	prev: [42],
// 		// 	next: [44],
// 		// 	type: BoardPointType.LUCK,
// 		// 	coords: {
// 		// 		x: 17,
// 		// 		y: 1
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 44,
// 		// 	prev: [43],
// 		// 	next: [45],
// 		// 	type: BoardPointType.DECISION,
// 		// 	coords: {
// 		// 		x: 17,
// 		// 		y: 2
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 45,
// 		// 	prev: [44],
// 		// 	next: [46],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 17,
// 		// 		y: 3
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 46,
// 		// 	prev: [45],
// 		// 	next: [47],
// 		// 	type: BoardPointType.DECISION,
// 		// 	coords: {
// 		// 		x: 16,
// 		// 		y: 3
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 47,
// 		// 	prev: [46],
// 		// 	next: [48],
// 		// 	type: BoardPointType.LUCK,
// 		// 	coords: {
// 		// 		x: 15,
// 		// 		y: 3
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 48,
// 		// 	prev: [47, 49],
// 		// 	next: [50],
// 		// 	type: BoardPointType.DECISION,
// 		// 	coords: {
// 		// 		x: 14,
// 		// 		y: 3
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 49,
// 		// 	prev: [40],
// 		// 	next: [48],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 14,
// 		// 		y: 2
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 50,
// 		// 	prev: [48],
// 		// 	next: [51],
// 		// 	type: BoardPointType.LUCK,
// 		// 	coords: {
// 		// 		x: 14,
// 		// 		y: 4
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 51,
// 		// 	prev: [50],
// 		// 	next: [52],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 14,
// 		// 		y: 5
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 52,
// 		// 	prev: [51],
// 		// 	next: [53],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 14,
// 		// 		y: 6
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 53,
// 		// 	prev: [52],
// 		// 	next: [54],
// 		// 	type: BoardPointType.LUCK,
// 		// 	coords: {
// 		// 		x: 14,
// 		// 		y: 7
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 54,
// 		// 	prev: [53],
// 		// 	next: [55],
// 		// 	type: BoardPointType.DECISION,
// 		// 	coords: {
// 		// 		x: 14,
// 		// 		y: 8
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 55,
// 		// 	prev: [54],
// 		// 	next: [56],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 15,
// 		// 		y: 8
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 56,
// 		// 	prev: [55],
// 		// 	next: [57],
// 		// 	type: BoardPointType.LUCK,
// 		// 	coords: {
// 		// 		x: 16,
// 		// 		y: 8
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 57,
// 		// 	prev: [56],
// 		// 	next: [58],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 17,
// 		// 		y: 8
// 		// 	}
// 		// },
// 		// {
// 		// 	id: 58,
// 		// 	prev: [57],
// 		// 	next: [],
// 		// 	type: BoardPointType.NORMAL,
// 		// 	coords: {
// 		// 		x: 17,
// 		// 		y: 7
// 		// 	}
// 		// }
// 	]
// }

export const BOARD_MAP: BoardMap = {
	points: [
		{
			id: 0,
			prev: [],
			next: [1],
			type: BoardPointType.NORMAL,
			coords: {
				x: 0,
				y: 5
			}
		}, {
			id: 1,
			prev: [0],
			next: [2],
			type: BoardPointType.NORMAL,
			coords: {
				x: 1,
				y: 5
			}
		},
		{
			id: 2,
			prev: [1],
			next: [3],
			type: BoardPointType.DECISION,
			coords: {
				x: 2,
				y: 5
			}
		},
		{
			id: 3,
			prev: [2],
			next: [4],
			type: BoardPointType.LUCK,
			coords: {
				x: 3,
				y: 5
			}
		},
		{
			id: 4,
			prev: [3],
			next: [5],
			type: BoardPointType.NORMAL,
			coords: {
				x: 3,
				y: 6
			}
		},
		{
			id: 5,
			prev: [4],
			next: [6],
			type: BoardPointType.NORMAL,
			coords: {
				x: 3,
				y: 7
			}
		},
		{
			id: 6,
			prev: [5],
			next: [7],
			type: BoardPointType.LUCK,
			coords: {
				x: 3,
				y: 8
			}
		},
		{
			id: 7,
			prev: [6],
			next: [8],
			type: BoardPointType.NORMAL,
			coords: {
				x: 3,
				y: 9
			}
		},
		{
			id: 8,
			prev: [7],
			next: [9],
			type: BoardPointType.NORMAL,
			coords: {
				x: 4,
				y: 9
			}
		},
		{
			id: 9,
			prev: [8],
			next: [10, 11],
			type: BoardPointType.DECISION,
			coords: {
				x: 5,
				y: 9
			}
		},
		{
			id: 10,
			prev: [9],
			next: [15],
			type: BoardPointType.NORMAL,
			coords: {
				x: 5,
				y: 10
			}
		},
		{
			id: 11,
			prev: [9],
			next: [12],
			type: BoardPointType.NORMAL,
			coords: {
				x: 5,
				y: 8
			}
		},
		{
			id: 12,
			prev: [11],
			next: [13],
			type: BoardPointType.DECISION,
			coords: {
				x: 6,
				y: 8
			}
		},
		{
			id: 13,
			prev: [12],
			next: [14],
			type: BoardPointType.NORMAL,
			coords: {
				x: 7,
				y: 8
			}
		},
		{
			id: 14,
			prev: [13, 18],
			next: [19],
			type: BoardPointType.LUCK,
			coords: {
				x: 8,
				y: 8
			}
		},
		{
			id: 15,
			prev: [10],
			next: [16],
			type: BoardPointType.NORMAL,
			coords: {
				x: 6,
				y: 10
			}
		},
		{
			id: 16,
			prev: [15],
			next: [17],
			type: BoardPointType.DECISION,
			coords: {
				x: 7,
				y: 10
			}
		},
		{
			id: 17,
			prev: [16],
			next: [18],
			type: BoardPointType.LUCK,
			coords: {
				x: 8,
				y: 10
			}
		},
		{
			id: 18,
			prev: [17],
			next: [14],
			type: BoardPointType.NORMAL,
			coords: {
				x: 8,
				y: 9
			}
		},
		{
			id: 19,
			prev: [14],
			next: [20],
			type: BoardPointType.DECISION,
			coords: {
				x: 8,
				y: 7
			}
		},
		{
			id: 20,
			prev: [19],
			next: [21],
			type: BoardPointType.NORMAL,
			coords: {
				x: 8,
				y: 6
			}
		},
		{
			id: 21,
			prev: [20],
			next: [22],
			type: BoardPointType.LUCK,
			coords: {
				x: 8,
				y: 5
			}
		},
		{
			id: 22,
			prev: [21],
			next: [23, 28],
			type: BoardPointType.DECISION,
			coords: {
				x: 8,
				y: 4
			}
		},
		{
			id: 23,
			prev: [22],
			next: [24],
			type: BoardPointType.NORMAL,
			coords: {
				x: 7,
				y: 4
			}
		},
		{
			id: 24,
			prev: [23],
			next: [25],
			type: BoardPointType.NORMAL,
			coords: {
				x: 7,
				y: 3
			}
		},
		{
			id: 25,
			prev: [24],
			next: [26],
			type: BoardPointType.NORMAL,
			coords: {
				x: 7,
				y: 2
			}
		},
		{
			id: 26,
			prev: [25],
			next: [27],
			type: BoardPointType.DECISION,
			coords: {
				x: 8,
				y: 2
			}
		},
		{
			id: 27,
			prev: [26, 29],
			next: [30, 36],
			type: BoardPointType.LUCK,
			coords: {
				x: 9,
				y: 2
			}
		},
		{
			id: 28,
			prev: [22],
			next: [29],
			type: BoardPointType.NORMAL,
			coords: {
				x: 9,
				y: 4
			}
		},
		{
			id: 29,
			prev: [28],
			next: [27],
			type: BoardPointType.NORMAL,
			coords: {
				x: 9,
				y: 3
			}
		},
		{
			id: 30,
			prev: [27],
			next: [31],
			type: BoardPointType.NORMAL,
			coords: {
				x: 9,
				y: 1
			}
		},
		{
			id: 31,
			prev: [30],
			next: [32],
			type: BoardPointType.DECISION,
			coords: {
				x: 9,
				y: 0
			}
		},
		{
			id: 32,
			prev: [31],
			next: [33],
			type: BoardPointType.NORMAL,
			coords: {
				x: 10,
				y: 0
			}
		},
		{
			id: 33,
			prev: [32],
			next: [34],
			type: BoardPointType.LUCK,
			coords: {
				x: 11,
				y: 0
			}
		},
		{
			id: 34,
			prev: [33],
			next: [35],
			type: BoardPointType.DECISION,
			coords: {
				x: 12,
				y: 0
			}
		},
		{
			id: 35,
			prev: [34, 38],
			next: [39],
			type: BoardPointType.NORMAL,
			coords: {
				x: 12,
				y: 1
			}
		},
		{
			id: 36,
			prev: [27],
			next: [37],
			type: BoardPointType.NORMAL,
			coords: {
				x: 10,
				y: 2
			}
		},
		{
			id: 37,
			prev: [36],
			next: [38],
			type: BoardPointType.NORMAL,
			coords: {
				x: 11,
				y: 2
			}
		},
		{
			id: 38,
			prev: [37],
			next: [35],
			type: BoardPointType.DECISION,
			coords: {
				x: 12,
				y: 2
			}
		},
		{
			id: 39,
			prev: [35],
			next: [40],
			type: BoardPointType.NORMAL,
			coords: {
				x: 13,
				y: 1
			}
		},
		{
			id: 40,
			prev: [39],
			next: [41, 49],
			type: BoardPointType.LUCK,
			coords: {
				x: 14,
				y: 1
			}
		},
		{
			id: 41,
			prev: [40],
			next: [42],
			type: BoardPointType.DECISION,
			coords: {
				x: 15,
				y: 1
			}
		},
		{
			id: 42,
			prev: [41],
			next: [43],
			type: BoardPointType.NORMAL,
			coords: {
				x: 16,
				y: 1
			}
		},
		{
			id: 43,
			prev: [42],
			next: [44],
			type: BoardPointType.LUCK,
			coords: {
				x: 17,
				y: 1
			}
		},
		{
			id: 44,
			prev: [43],
			next: [45],
			type: BoardPointType.DECISION,
			coords: {
				x: 17,
				y: 2
			}
		},
		{
			id: 45,
			prev: [44],
			next: [46],
			type: BoardPointType.NORMAL,
			coords: {
				x: 17,
				y: 3
			}
		},
		{
			id: 46,
			prev: [45],
			next: [47],
			type: BoardPointType.DECISION,
			coords: {
				x: 16,
				y: 3
			}
		},
		{
			id: 47,
			prev: [46],
			next: [48],
			type: BoardPointType.LUCK,
			coords: {
				x: 15,
				y: 3
			}
		},
		{
			id: 48,
			prev: [47, 49],
			next: [50],
			type: BoardPointType.DECISION,
			coords: {
				x: 14,
				y: 3
			}
		},
		{
			id: 49,
			prev: [40],
			next: [48],
			type: BoardPointType.NORMAL,
			coords: {
				x: 14,
				y: 2
			}
		},
		{
			id: 50,
			prev: [48],
			next: [51],
			type: BoardPointType.LUCK,
			coords: {
				x: 14,
				y: 4
			}
		},
		{
			id: 51,
			prev: [50],
			next: [52],
			type: BoardPointType.NORMAL,
			coords: {
				x: 14,
				y: 5
			}
		},
		{
			id: 52,
			prev: [51],
			next: [53],
			type: BoardPointType.NORMAL,
			coords: {
				x: 14,
				y: 6
			}
		},
		{
			id: 53,
			prev: [52],
			next: [54],
			type: BoardPointType.LUCK,
			coords: {
				x: 14,
				y: 7
			}
		},
		{
			id: 54,
			prev: [53],
			next: [55],
			type: BoardPointType.DECISION,
			coords: {
				x: 14,
				y: 8
			}
		},
		{
			id: 55,
			prev: [54],
			next: [56],
			type: BoardPointType.NORMAL,
			coords: {
				x: 15,
				y: 8
			}
		},
		{
			id: 56,
			prev: [55],
			next: [57],
			type: BoardPointType.LUCK,
			coords: {
				x: 16,
				y: 8
			}
		},
		{
			id: 57,
			prev: [56],
			next: [58],
			type: BoardPointType.NORMAL,
			coords: {
				x: 17,
				y: 8
			}
		},
		{
			id: 58,
			prev: [57],
			next: [],
			type: BoardPointType.NORMAL,
			coords: {
				x: 17,
				y: 7
			}
		}
	]
}
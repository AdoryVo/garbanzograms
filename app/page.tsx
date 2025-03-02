"use client";
import { KeyboardEventHandler, useEffect, useState } from "react";

const IS_LETTER = /^[a-zA-Z]+$/;
const ARROW_KEYS = new Set(["ARROWLEFT", "ARROWRIGHT", "ARROWUP", "ARROWDOWN"]);
const DELETE_KEYS = new Set(["BACKSPACE", "DELETE"])
const ROWS = 10;
const COLS = 15;
const EMPTY_TILE = " "

const LETTER_DISTRIBUTION = {
	2: "JKQXZ",
	3: "BCFHMPVWY",
	4: "G",
	5: "L",
	6: "DSU",
	8: "N",
	9: "TR",
	11: "O",
	12: "I",
	13: "A",
	18: "E",
};
const LETTER_POOL = Object.keys(LETTER_DISTRIBUTION).flatMap((count) => {
	const intCount: keyof typeof LETTER_DISTRIBUTION = Number.parseInt(count);
	let letters: string[] = [];
	for (const char of LETTER_DISTRIBUTION[intCount]) {
		letters = letters.concat(Array(intCount).fill(char));
	}
	return letters;
});

interface Props {
	row: number;
	col: number;
	letter: string;
}

enum Direction {
	Vertical = "Vertical",
	Horizontal = "Horizontal"
}

export default function Game() {
	const [grid, setGrid] = useState(
		Array<string[]>(ROWS).fill(Array(COLS).fill(EMPTY_TILE)),
	);

	const [bench, setBench] = useState<string[]>([]);
	const [selectedTile, setSelectedTile] = useState([-1, -1]);
	const [editDirection, setEditDirection] = useState(Direction.Horizontal)

	useEffect(() => {
		// TODO: Note, this random choice allows for duplicate draws.
		setBench(LETTER_POOL.toSorted(() => 0.5 - Math.random()).slice(0, 10));
		document.body.style.overflow = "hidden"
	}, []);

	useEffect(() => {
		// TODO: Add dictionary verification

		function handleKeyDown(event: KeyboardEvent) {
			const keyPressed = event.key.toUpperCase();
			const [row, col] = selectedTile;

			console.debug(`Key pressed: ${keyPressed}`);

			if (
				row >= 0 &&
				col >= 0 &&
				IS_LETTER.test(keyPressed) &&
				bench.includes(keyPressed)
			) {
				// Make copies to prevent undesired behavior
				const newGrid = [...grid];
				const newRow = [...newGrid[row]];
				newRow[col] = keyPressed;
				newGrid[row] = newRow;
				setGrid(newGrid);

				const newBench = [...bench];
				const letter = grid[row][col];
				if (IS_LETTER.test(letter)) {
					newBench[newBench.indexOf(keyPressed)] = letter;
				} else {
					newBench.splice(newBench.indexOf(keyPressed), 1);
				}
				setBench(newBench);
			} else if (ARROW_KEYS.has(keyPressed)) {
				const newSelectedTile = [...selectedTile];

				switch (keyPressed) {
					case "ARROWUP":
						newSelectedTile[0] -= 1;
						break;
					case "ARROWDOWN":
						newSelectedTile[0] += 1;
						break;
					case "ARROWLEFT":
						newSelectedTile[1] -= 1;
						break;
					case "ARROWRIGHT":
						newSelectedTile[1] += 1;
						break;
					default:
						break;
				}

				if (
					0 <= newSelectedTile[0] &&
					newSelectedTile[0] < ROWS &&
					0 <= newSelectedTile[1] &&
					newSelectedTile[1] < COLS
				) {
					setSelectedTile(newSelectedTile);
				}
			} else if (DELETE_KEYS.has(keyPressed) && IS_LETTER.test(grid[row][col])) {
				const newBench = [...bench, grid[row][col]]
				setBench(newBench)

				const newGrid = [...grid];
				const newRow = [...newGrid[row]];
				newRow[col] = EMPTY_TILE;
				newGrid[row] = newRow;
				setGrid(newGrid);
			}
		}

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [grid, bench, selectedTile]);

	function Tile({ row, col, letter }: Props) {
		const isSelected = selectedTile[0] === row && selectedTile[1] === col;
		const hasLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(letter);
		const bg = isSelected ? "bg-yellow-400" : hasLetter ? "bg-yellow-100" : "";

		// TODO: useRef to blue upon unselect
		return (
			<button
				type="button"
				className={`p-4 ${bg} text-amber-950 font-bold rounded-md text-4xl w-16 h-16`}
				onClick={() => setSelectedTile([row, col])}
			>
				{letter}
			</button>
		);
	}

	return (
		<div>
			<div className="w-full place-items-center mb-10 text-center">
				<div className="grid auto-cols-max grid-flow-col gap-2 mb-2">
					{bench.map((letter, index) => (
						<div key={index} className="p-4 bg-yellow-100 text-amber-950 font-bold rounded-md text-4xl w-16 h-16">
							{letter}
						</div>
					))}
				</div>
				<span className="font-bold">Bench</span>
			</div>

			<div className="w-full place-items-center mb-4">
				<div>

				<b>Use mouse to select tiles and keyboard to interact:</b>
				<ul className="list-disc list-inside">
					<li>Type letters to use letters from bench</li>
					<li>Arrow keys to move selected tile</li>
					<li>Backspace/delete to clear selected tile</li>
					<li>WIP: Spacebar to control edit direction (horizontal/vertical)</li>
					<li>WIP: Enter to peel/verify board words</li>
				</ul>
				</div>
			</div>

			<div className="w-full place-items-center">
				<div className={`grid grid-rows-${ROWS} divide-y-3 divide-gray-500 `}>
					{grid.map((row, row_index) => (
						<div
							key={row_index}
							className={`grid auto-cols-max grid-flow-col divide-x-3 divide-gray-500`}
							// ${(selectedTile[0] === row_index && editDirection === Direction.Horizontal) && "bg-slate-500 bg-opacity-10"}
						>
							{row.map((col, col_index) => (
								<div key={`${row_index}_${col_index}`} className={``}>
									<Tile row={row_index} col={col_index} letter={col} />
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

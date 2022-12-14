/* eslint-disable no-undef */
import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

function App() {

const [grid, setGrid] = useState(null)
const [start, setStart] = useState(false)
const [intervalID, setintervalID] = useState(null)
const [numRows, setNumRows] = useState(20)
const [numColumns, setNumColumns] = useState(20)
const [gridSize, setGridSize] = useState(0)
const [color, setColor] = useState('grey')
const [cell, setCell] = useState(0)


const startRef = useRef(start)
startRef.current = start


// Neighbors variable determines x & y coordinates of each cells neighbors
const neighborPositions = [
    [0, 1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [1, 0],
    [1, -1],
    [1, 1],
]

// Function creates an array by looping through the number of rows and then pushes an array into each iteration with the number of columns
// The array that's pushed into each iteration contains the value 0 which will represent a dead cell
const generateBlankGrid = (rows, cols) => {
  let tempGrid = []
	for (let i = 0; i < rows; i++) {
		tempGrid.push(Array.from(Array(cols), () => 0))
	}
    setGrid(tempGrid)
}

// Same function as above. But, this time it generates a random grid of live and dead cells
const generateRandomGrid = (rows, cols) => {
  let tempGrid = []
	for (let i = 0; i < rows; i++) {
		tempGrid.push(Array.from(Array(cols), () => Math.floor(Math.random() * 2)))
	}
  setGrid(tempGrid)
}

// Function to run the simulation logic
const runSimulation = () => {
  if (!startRef.current) {
    return
  }

    setGrid((g) => {
    const mutatedGrid = g.map(array => [...array])

    for (let i = 0; i < numRows; i++){
        for (let j = 0; j < numColumns; j++){
            let cell = g[i][j]
            let neighbors = 0
            // Iterate through neighborPositions array and create new I & J variables to set boundaries
            // Take the values of the neighboring cells and add them to the neighbors variable
            neighborPositions.forEach(([x, y]) => {
                const newI = i + x
                const newJ = j + y
                if(newI >= 0 && newI < numRows && newJ >= 0 && newJ < numColumns){
                    neighbors += g[newI][newJ]
                }
            })
            // Logic for game rules checking if cell has amount of neighbors to alter its' life
            if(neighbors < 2 || neighbors > 3) {
                mutatedGrid[i][j] = 0
            } else if(cell === 0 && neighbors === 3){
                mutatedGrid[i][j] = 1
            }
        }
    }
    return mutatedGrid
})}

useEffect(() => {
  generateBlankGrid(numRows, numColumns)
}, [])

if(!grid) return <div>loading...</div>

  return (
    <div className="app">
      <h1>Conway's Game of Life</h1>
      <button 
      disabled={start}
      onClick={() => generateRandomGrid(numRows, numColumns)}>Generate Random Grid</button>
      <button 
      disabled={start}
      onClick={() => generateBlankGrid(numRows, numColumns)}>Clear Grid</button>
      <button 
      disabled={start}
      onClick={() => {
      setStart(!start)
            if (!start) {
              startRef.current = true
            }
      setintervalID(setInterval(() => runSimulation(), 600))
        }}>Start</button>
      <button 
      disabled={!start}
        onClick={() => {
        clearInterval(intervalID)
        setStart(!start)
            if (start) {
              startRef.current = false
            }
        }}>Pause</button>

      <div className='grid'
        style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numColumns}, 20px)`
      }}>
        {grid.map((rows, i) => rows.map((col, j) => {
        return (
        <div 
        key={`${i}-${j}`}
        style={{
          width: 20,
          height: 20,
          backgroundColor: grid[i][j] === 1 ? "pink" : 'grey',
          border: 'solid .5px black'
        }}
        >  
        </div>
        )}))}
      </div>
    </div>
  );
}

export default App;

import { useState } from 'react'
import './App.css'

const VEGETABLES = [
  'Tomato',
  'Eggplant',
  'Zucchini',
  'Bell Pepper',
  'Onion',
  'Garlic',
  'Artichoke',
  'Cucumber',
  'Spinach',
  'Olives',
]

function App() {
  const [amounts, setAmounts] = useState<Record<string, number>>(
    Object.fromEntries(VEGETABLES.map((v) => [v, 0]))
  )

  const change = (veg: string, delta: number) =>
    setAmounts((prev) => ({ ...prev, [veg]: Math.max(0, prev[veg] + delta) }))

  return (
    <>
      <h1>Grocery App</h1>
      <h2>Mediterranean Vegetables</h2>
      <div className="veg-list">
        {VEGETABLES.map((veg) => (
          <div key={veg} className="veg-row">
            <span className="veg-name">{veg}</span>
            <button onClick={() => change(veg, -1)} disabled={amounts[veg] === 0}>−</button>
            <span className="veg-amount">{amounts[veg]}</span>
            <button onClick={() => change(veg, +1)}>+</button>
          </div>
        ))}
      </div>
    </>
  )
}

export default App

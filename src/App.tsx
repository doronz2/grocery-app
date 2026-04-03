import { useState } from 'react'
import './App.css'

const VEGETABLES = [
  'Tomato',
  'Eggplant',
  'Bell Pepper',
  'Onion',
  'Garlic',
  'Cucumber',
  'Olives',
]

type Amounts = Record<string, number>

function VegSection({ name }: { name: string }) {
  const [amounts, setAmounts] = useState<Amounts>(
    Object.fromEntries(VEGETABLES.map((v) => [v, 0]))
  )

  const change = (veg: string, delta: number) =>
    setAmounts((prev) => ({ ...prev, [veg]: Math.max(0, prev[veg] + delta) }))

  return (
    <div className="section">
      <h2>{name}</h2>
      <div className="veg-list">
        {VEGETABLES.map((veg) => (
          <div key={veg} className="veg-row">
            <button onClick={() => change(veg, -1)} disabled={amounts[veg] === 0}>−</button>
            <button onClick={() => change(veg, +1)}>+</button>
            <span className="veg-amount">{amounts[veg]}</span>
            <span className="veg-name">{veg}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <h1>The Zarchy's Grocery App</h1>
      <VegSection name="Yonatan" />
      <VegSection name="Uri" />
    </>
  )
}

export default App

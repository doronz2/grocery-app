import { useState } from 'react'
import './App.css'

const VEGETABLES = [
  'Tomato', 'Eggplant', 'Bell Pepper', 'Onion', 'Red Onion', 'Garlic',
  'Cucumber', 'Olives', 'Carrot', 'Cabbage', 'Green Onion',
  'Cauliflower', 'Broccoli', 'Avocado',
]

const FRUITS = [
  'Orange', 'Apple', 'Kiwi', 'Banana', 'Melon', 'Mango',
]

const BASICS = [
  'Eggs', 'Milk', 'Rice', 'Pasta', 'Olive Oil',
  'Tomato Sauce', 'Hummus', 'Yogurt', 'Tuna',
]

const URI_YONATAN_ITEMS = [
  'Mashke Boker', 'Daniella', 'Cheese 9%', 'Cheese 28%',
  'Butter', 'Bread', 'Cornflakes',
]

type Amounts = Record<string, number>

function initAmounts(items: string[]): Amounts {
  return Object.fromEntries(items.map((v) => [v, 0]))
}

function ItemRow({
  name,
  amount,
  onChange,
}: {
  name: string
  amount: number
  onChange: (delta: number) => void
}) {
  return (
    <div className="veg-row">
      <button onClick={() => onChange(-1)} disabled={amount === 0}>−</button>
      <button onClick={() => onChange(+1)}>+</button>
      <span className="veg-amount">{amount}</span>
      <span className="veg-name">{name}</span>
    </div>
  )
}

function ItemGroup({ title, items }: { title: string; items: string[] }) {
  const [amounts, setAmounts] = useState<Amounts>(initAmounts(items))
  const change = (item: string, delta: number) =>
    setAmounts((prev) => ({ ...prev, [item]: Math.max(0, prev[item] + delta) }))

  return (
    <div className="item-group">
      <h3>{title}</h3>
      <div className="veg-list">
        {items.map((item) => (
          <ItemRow
            key={item}
            name={item}
            amount={amounts[item]}
            onChange={(d) => change(item, d)}
          />
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <>
      <h1>The Zarchy's Grocery App</h1>

      <div className="section">
        <h2>Zarchy</h2>
        <ItemGroup title="Vegetables" items={VEGETABLES} />
        <ItemGroup title="Fruits" items={FRUITS} />
        <ItemGroup title="Basics" items={BASICS} />
      </div>

      <div className="section">
        <h2>Uri & Yonatan</h2>
        <ItemGroup title="" items={URI_YONATAN_ITEMS} />
      </div>
    </>
  )
}

export default App

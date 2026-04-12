import { useState, useEffect } from 'react'
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

const SARA_PHONE = '972506285696' // Sara's WhatsApp number (IL)

type Amounts = Record<string, number>

type HistoryEntry = {
  id: number
  date: string
  items: string[]
  amounts: { veggies: Amounts; fruits: Amounts; basics: Amounts; uriYonatan: Amounts }
}

function initAmounts(items: string[]): Amounts {
  return Object.fromEntries(items.map((v) => [v, 0]))
}

function ItemRow({
  name, amount, onChange,
}: {
  name: string; amount: number; onChange: (delta: number) => void
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

function ItemGroup({
  title, items, amounts, onChange,
}: {
  title: string; items: string[]; amounts: Amounts; onChange: (item: string, delta: number) => void
}) {
  return (
    <div className="item-group">
      {title && <h3>{title}</h3>}
      <div className="veg-list">
        {items.map((item) => (
          <ItemRow
            key={item}
            name={item}
            amount={amounts[item]}
            onChange={(d) => onChange(item, d)}
          />
        ))}
      </div>
    </div>
  )
}

function formatSection(label: string, items: string[], amounts: Amounts): string | null {
  const selected = items.filter((i) => amounts[i] > 0).map((i) => `${i} ×${amounts[i]}`)
  if (selected.length === 0) return null
  return `${label}: ${selected.join(', ')}`
}

function App() {
  const [veggies, setVeggies] = useState<Amounts>(initAmounts(VEGETABLES))
  const [fruits, setFruits] = useState<Amounts>(initAmounts(FRUITS))
  const [basics, setBasics] = useState<Amounts>(initAmounts(BASICS))
  const [uriYonatan, setUriYonatan] = useState<Amounts>(initAmounts(URI_YONATAN_ITEMS))
  const [approvedList, setApprovedList] = useState<string[] | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])

  // Load history from the database on startup
  useEffect(() => {
    fetch('/api/history')
      .then((r) => r.json())
      .then(setHistory)
      .catch(() => {}) // silently ignore if offline / dev without DB
  }, [])

  const change = (setter: React.Dispatch<React.SetStateAction<Amounts>>) =>
    (item: string, delta: number) =>
      setter((prev) => ({ ...prev, [item]: Math.max(0, prev[item] + delta) }))

  const handleReset = () => {
    setVeggies(initAmounts(VEGETABLES))
    setFruits(initAmounts(FRUITS))
    setBasics(initAmounts(BASICS))
    setUriYonatan(initAmounts(URI_YONATAN_ITEMS))
    setApprovedList(null)
  }

  const handleApprove = async () => {
    const sections = [
      formatSection('Basics', BASICS, basics),
      formatSection('Fruits', FRUITS, fruits),
      formatSection('Veggies', VEGETABLES, veggies),
      formatSection('Uri & Yonatan', URI_YONATAN_ITEMS, uriYonatan),
    ].filter(Boolean) as string[]
    const items = sections.length > 0 ? sections : ['(nothing selected)']
    const date = new Date().toLocaleString()
    const amounts = { veggies, fruits, basics, uriYonatan }

    setApprovedList(items)

    // Save to database
    const res = await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, items, amounts }),
    })
    if (res.ok) {
      const { id } = await res.json() as { id: number }
      setHistory((prev) => [{ id, date, items, amounts }, ...prev])
    }
  }

  const handleShare = () => {
    if (!approvedList) return
    const text = encodeURIComponent(approvedList.join('\n'))
    window.open(`https://wa.me/${SARA_PHONE}?text=${text}`, '_blank')
  }

  const handlePreviousOrder = () => {
    if (history.length === 0) return
    const last = history[0]
    setVeggies(last.amounts.veggies)
    setFruits(last.amounts.fruits)
    setBasics(last.amounts.basics)
    setUriYonatan(last.amounts.uriYonatan)
    setApprovedList(null)
  }

  return (
    <>
      <h1>The Zarchy's Grocery App</h1>

      <div className="approve-bar">
        <button className="approve-btn" onClick={handleApprove}>Approve</button>
        <button className="reset-btn" onClick={handleReset}>Reset</button>
        {history.length > 0 && (
          <button className="prev-btn" onClick={handlePreviousOrder}>Previous Order</button>
        )}
      </div>

      <div className="section">
        <h2>Zarchy</h2>
        <ItemGroup title="Vegetables" items={VEGETABLES} amounts={veggies} onChange={change(setVeggies)} />
        <ItemGroup title="Fruits" items={FRUITS} amounts={fruits} onChange={change(setFruits)} />
        <ItemGroup title="Basics" items={BASICS} amounts={basics} onChange={change(setBasics)} />
      </div>

      <div className="section">
        <h2>Uri & Yonatan</h2>
        <ItemGroup title="" items={URI_YONATAN_ITEMS} amounts={uriYonatan} onChange={change(setUriYonatan)} />
      </div>

      {approvedList && (
        <div className="approved-list">
          <h2>Shopping List</h2>
          {approvedList.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <button className="share-btn" onClick={handleShare}>Share with Sara</button>
        </div>
      )}

      {history.length > 1 && (
        <div className="history">
          <h2>History</h2>
          {history.slice(1).map((entry) => (
            <div key={entry.id} className="history-entry">
              <p className="history-date">{entry.date}</p>
              {entry.items.map((line) => (
                <p key={line} className="history-line">{line}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default App

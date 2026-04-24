import { useState } from 'react'
import './App.css'

const VEGETABLES = [
  'Tomato', 'Eggplant', 'Bell Pepper', 'Onion', 'Red Onion', 'Garlic',
  'Cucumber', 'Olives', 'Carrot', 'Cabbage', 'Green Onion',
  'Cauliflower', 'Broccoli', 'Avocado', 'Edamame', 'Mushrooms',
]

const FRUITS = [
  'Orange', 'Apple', 'Kiwi', 'Banana', 'Melon', 'Mango',
]

const BASICS = [
  'Eggs', 'Milk', 'Rice', 'Pasta', 'Olive Oil',
  'Tomato Sauce', 'Hummus', 'Yogurt', 'Tuna',
  'Actimel', 'Smoked Salmon', 'Fresh Salmon', 'Sardines', 'Light Bread',
]

const URI_YONATAN_ITEMS = [
  'Mashke Boker', 'Daniella', 'Cheese 9%', 'Cheese 28%', 'Bulgarit Cheese',
  'Butter', 'Bread', 'Cornflakes',
]

const CLEANING_ITEMS = [
  'Soap', 'Toothbrush', 'Scotch', 'Cloth',
]

const SHARE_CONTACTS = [
  { name: 'Doron', phone: '972547452353' },
  { name: 'Sara', phone: '972506285696' },
]

const ORDERS_API = '/api/orders'

type Lang = 'en' | 'he'
type Amounts = Record<string, number>

interface Order {
  id: number
  created_at: string
  items: string
}

const PRODUCT_HE: Record<string, string> = {
  'Tomato': 'עגבנייה', 'Eggplant': 'חציל', 'Bell Pepper': 'פלפל',
  'Onion': 'בצל', 'Red Onion': 'בצל סגול', 'Garlic': 'שום',
  'Cucumber': 'מלפפון', 'Olives': 'זיתים', 'Carrot': 'גזר',
  'Cabbage': 'כרוב', 'Green Onion': 'בצל ירוק', 'Cauliflower': 'כרובית',
  'Broccoli': 'ברוקולי', 'Avocado': 'אבוקדו', 'Edamame': 'אדמאמה', 'Mushrooms': 'פטריות',
  'Orange': 'תפוז', 'Apple': 'תפוח', 'Kiwi': 'קיווי',
  'Banana': 'בננה', 'Melon': 'מלון', 'Mango': 'מנגו',
  'Eggs': 'ביצים', 'Milk': 'חלב', 'Rice': 'אורז', 'Pasta': 'פסטה',
  'Olive Oil': 'שמן זית', 'Tomato Sauce': 'רסק עגבניות', 'Hummus': 'חומוס',
  'Yogurt': 'יוגורט', 'Tuna': 'טונה', 'Actimel': 'אקטימל',
  'Smoked Salmon': 'סלמון מעושן', 'Fresh Salmon': 'סלמון טרי',
  'Sardines': 'סרדינים', 'Light Bread': 'לחם קל',
  'Mashke Boker': 'משקה בוקר', 'Daniella': 'דניאלה',
  'Cheese 9%': 'גבינה 9%', 'Cheese 28%': 'גבינה 28%', 'Bulgarit Cheese': 'גבינה בולגרית',
  'Butter': 'חמאה', 'Bread': 'לחם', 'Cornflakes': 'קורנפלקס',
  'Soap': 'סבון', 'Toothbrush': 'מברשת שיניים', 'Scotch': 'סקוטש', 'Cloth': 'מטלית',
}

const UI = {
  en: {
    appTitle: "The Zarchy's Grocery App",
    approve: 'Approve', reset: 'Reset', history: 'History', hideHistory: 'Hide History', share: 'Share',
    zarchiSection: 'Zarchy', uriYonatanSection: 'Uri & Yonatan', cleaningSection: 'Cleaning',
    vegetables: 'Vegetables', fruits: 'Fruits', basics: 'Basics',
    shoppingList: 'Shopping List', postPrompt: 'Post this order to history?',
    yesPost: 'Yes, post order', no: 'No',
    savedMsg: '✓ Order saved to history', errorMsg: '✗ Failed to save. Try again.',
    loading: 'Loading...', orderHistory: 'Order History', noOrders: 'No orders yet.',
    nothingSelected: '(nothing selected)', groceryListHeader: '🛒 Grocery List:',
  },
  he: {
    appTitle: "האפליקציה של זרצ'י",
    approve: 'אישור', reset: 'איפוס', history: 'היסטוריה', hideHistory: 'הסתר היסטוריה', share: 'שתף',
    zarchiSection: "זרצ'י", uriYonatanSection: 'אורי ויונתן', cleaningSection: 'ניקיון',
    vegetables: 'ירקות', fruits: 'פירות', basics: 'בסיסיים',
    shoppingList: 'רשימת קניות', postPrompt: 'לשמור הזמנה בהיסטוריה?',
    yesPost: 'כן, שמור', no: 'לא',
    savedMsg: '✓ ההזמנה נשמרה', errorMsg: '✗ שגיאה בשמירה. נסה שוב.',
    loading: 'טוען...', orderHistory: 'היסטוריית הזמנות', noOrders: 'אין הזמנות עדיין.',
    nothingSelected: '(לא נבחר כלום)', groceryListHeader: '🛒 רשימת קניות:',
  },
}

function initAmounts(items: string[]): Amounts {
  return Object.fromEntries(items.map((v) => [v, 0]))
}

function parseOrderItems(items: string): string[] {
  try {
    return JSON.parse(items) as string[]
  } catch {
    return []
  }
}

function formatSection(label: string, items: string[], amounts: Amounts, tp: (i: string) => string): string | null {
  const selected = items.filter((i) => amounts[i] > 0).map((i) => `${tp(i)} ×${amounts[i]}`)
  if (selected.length === 0) return null
  return `${label}: ${selected.join(', ')}`
}

function ItemRow({
  label, amount, onChange,
}: {
  label: string; amount: number; onChange: (delta: number) => void
}) {
  return (
    <div className="veg-row">
      <button onClick={() => onChange(-1)} disabled={amount === 0}>−</button>
      <button onClick={() => onChange(+1)}>+</button>
      <span className="veg-amount">{amount}</span>
      <span className="veg-name">{label}</span>
    </div>
  )
}

function ItemGroup({
  title, items, amounts, onChange, tp,
}: {
  title: string; items: string[]; amounts: Amounts
  onChange: (item: string, delta: number) => void
  tp: (item: string) => string
}) {
  return (
    <div className="item-group">
      {title && <h3>{title}</h3>}
      <div className="veg-list">
        {items.map((item) => (
          <ItemRow
            key={item}
            label={tp(item)}
            amount={amounts[item]}
            onChange={(d) => onChange(item, d)}
          />
        ))}
      </div>
    </div>
  )
}

function App() {
  const [lang, setLang] = useState<Lang>('en')
  const [veggies, setVeggies] = useState<Amounts>(initAmounts(VEGETABLES))
  const [fruits, setFruits] = useState<Amounts>(initAmounts(FRUITS))
  const [basics, setBasics] = useState<Amounts>(initAmounts(BASICS))
  const [uriYonatan, setUriYonatan] = useState<Amounts>(initAmounts(URI_YONATAN_ITEMS))
  const [cleaning, setCleaning] = useState<Amounts>(initAmounts(CLEANING_ITEMS))
  const [approvedList, setApprovedList] = useState<string[] | null>(null)
  const [showPostPrompt, setShowPostPrompt] = useState(false)
  const [history, setHistory] = useState<Order[] | null>(null)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [saved, setSaved] = useState<'idle' | 'saved' | 'error'>('idle')
  const [showShareMenu, setShowShareMenu] = useState(false)

  const t = (key: keyof typeof UI.en) => UI[lang][key]
  const tp = (product: string) => lang === 'he' ? (PRODUCT_HE[product] ?? product) : product

  const change = (setter: React.Dispatch<React.SetStateAction<Amounts>>) =>
    (item: string, delta: number) =>
      setter((prev) => ({ ...prev, [item]: Math.max(0, prev[item] + delta) }))

  const handleReset = () => {
    setVeggies(initAmounts(VEGETABLES))
    setFruits(initAmounts(FRUITS))
    setBasics(initAmounts(BASICS))
    setUriYonatan(initAmounts(URI_YONATAN_ITEMS))
    setCleaning(initAmounts(CLEANING_ITEMS))
    setApprovedList(null)
    setShowPostPrompt(false)
    setSaved('idle')
  }

  const handleApprove = () => {
    const sections = [
      formatSection(t('basics'), BASICS, basics, tp),
      formatSection(t('fruits'), FRUITS, fruits, tp),
      formatSection(t('vegetables'), VEGETABLES, veggies, tp),
      formatSection(t('uriYonatanSection'), URI_YONATAN_ITEMS, uriYonatan, tp),
      formatSection(t('cleaningSection'), CLEANING_ITEMS, cleaning, tp),
    ].filter(Boolean) as string[]
    const list = sections.length > 0 ? sections : [t('nothingSelected')]
    setApprovedList(list)
    setShowPostPrompt(true)
    setSaved('idle')
  }

  const handlePostOrder = async () => {
    if (!approvedList) return
    try {
      const res = await fetch(ORDERS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: approvedList }),
      })
      if (!res.ok) throw new Error()
      setShowPostPrompt(false)
      setSaved('saved')
    } catch {
      setSaved('error')
    }
  }

  const handleShare = (phone: string) => {
    const text = encodeURIComponent(t('groceryListHeader') + '\n' + (approvedList ?? []).join('\n'))
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
    setShowShareMenu(false)
  }

  const handleShowHistory = async () => {
    if (history !== null) {
      setHistory(null)
      return
    }
    setLoadingHistory(true)
    try {
      const res = await fetch(ORDERS_API)
      if (!res.ok) throw new Error()
      const data = await res.json() as Order[]
      setHistory(data)
    } catch {
      setHistory([])
    } finally {
      setLoadingHistory(false)
    }
  }

  return (
    <div dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <h1>{t('appTitle')}</h1>

      <div className="approve-bar">
        <button className="approve-btn" onClick={handleApprove}>{t('approve')}</button>
        <button className="reset-btn" onClick={handleReset}>{t('reset')}</button>
        <button className="history-btn" onClick={handleShowHistory} disabled={loadingHistory}>
          {history !== null ? t('hideHistory') : t('history')}
        </button>
        {approvedList && (
          <div className="share-wrap">
            <button className="share-btn" onClick={() => setShowShareMenu((v) => !v)}>{t('share')}</button>
            {showShareMenu && (
              <div className="share-menu">
                {SHARE_CONTACTS.map((c) => (
                  <button key={c.phone} className="share-menu-item" onClick={() => handleShare(c.phone)}>
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <button
          className="lang-btn"
          onClick={() => setLang((l) => l === 'en' ? 'he' : 'en')}
        >
          {lang === 'en' ? 'עברית' : 'English'}
        </button>
      </div>

      <div className="section">
        <h2>{t('zarchiSection')}</h2>
        <ItemGroup title={t('vegetables')} items={VEGETABLES} amounts={veggies} onChange={change(setVeggies)} tp={tp} />
        <ItemGroup title={t('fruits')} items={FRUITS} amounts={fruits} onChange={change(setFruits)} tp={tp} />
        <ItemGroup title={t('basics')} items={BASICS} amounts={basics} onChange={change(setBasics)} tp={tp} />
      </div>

      <div className="section">
        <h2>{t('uriYonatanSection')}</h2>
        <ItemGroup title="" items={URI_YONATAN_ITEMS} amounts={uriYonatan} onChange={change(setUriYonatan)} tp={tp} />
      </div>

      <div className="section">
        <h2>{t('cleaningSection')}</h2>
        <ItemGroup title="" items={CLEANING_ITEMS} amounts={cleaning} onChange={change(setCleaning)} tp={tp} />
      </div>

      {approvedList && (
        <div className="approved-list">
          <h2>{t('shoppingList')}</h2>
          {approvedList.map((line) => (
            <p key={line}>{line}</p>
          ))}
          {showPostPrompt && (
            <div className="post-order-bar">
              <p className="post-order-prompt">{t('postPrompt')}</p>
              <button className="post-btn" onClick={handlePostOrder}>{t('yesPost')}</button>
              <button className="skip-btn" onClick={() => setShowPostPrompt(false)}>{t('no')}</button>
            </div>
          )}
          {saved === 'saved' && <p className="saved-msg">{t('savedMsg')}</p>}
          {saved === 'error' && <p className="error-msg">{t('errorMsg')}</p>}
        </div>
      )}

      {loadingHistory && <p className="history-loading">{t('loading')}</p>}

      {history !== null && !loadingHistory && (
        <div className="history-list">
          <h2>{t('orderHistory')}</h2>
          {history.length === 0 && <p>{t('noOrders')}</p>}
          {history.map((order) => (
            <div key={order.id} className="history-item">
              <p className="history-date">{new Date(order.created_at).toLocaleString()}</p>
              {parseOrderItems(order.items).map((line) => (
                <p key={line} className="history-line">{line}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App

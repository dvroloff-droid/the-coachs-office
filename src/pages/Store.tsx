import PageShell from '../components/PageShell'
import { useLocalState } from '../storage'

interface Lesson { id: string; title: string; desc: string; price: number }

const LESSONS: Lesson[] = [
  { id: 'l1', title: 'Fundamentals Private Lesson', desc: '60-minute one-on-one session covering core skills and technique.', price: 50 },
  { id: 'l2', title: 'Game IQ Film Session', desc: 'Break down game film together to sharpen decision making.', price: 40 },
  { id: 'l3', title: 'Small Group Clinic', desc: '90-minute clinic for 3-5 players focused on team concepts.', price: 30 },
  { id: 'l4', title: 'Fantasy Football Strategy Consult', desc: 'Draft and weekly lineup strategy for your league.', price: 25 },
  { id: 'l5', title: 'Lesson 5-Pack', desc: 'Five private lessons at a discount. Use anytime.', price: 220 },
]

type Cart = Record<string, number>

export default function Store() {
  const [cart, setCart] = useLocalState<Cart>('cart', {})
  const [done, setDone] = useLocalState<boolean>('cart-done', false)

  const add = (id: string) => { setDone(false); setCart({ ...cart, [id]: (cart[id] ?? 0) + 1 }) }
  const setQty = (id: string, q: number) => {
    const next = { ...cart }
    if (q <= 0) delete next[id]
    else next[id] = q
    setCart(next)
  }
  const lines = LESSONS.filter((l) => cart[l.id])
  const total = lines.reduce((s, l) => s + l.price * cart[l.id], 0)

  return (
    <PageShell title="Web Store">
      <h2>Coaching Lessons</h2>
      <div className="grid">
        {LESSONS.map((l) => (
          <article key={l.id} className="card static">
            <h2>{l.title}</h2>
            <p>{l.desc}</p>
            <strong>${l.price.toFixed(2)}</strong>
            <button className="primary" onClick={() => add(l.id)}>Add to cart</button>
          </article>
        ))}
      </div>
      <h2>Cart</h2>
      {done && <p className="notice ok" role="status">Thanks! Your request was noted. Online payment is not connected yet — the coach will follow up.</p>}
      {lines.length === 0 ? <p className="muted">Your cart is empty.</p> : (
        <>
          <ul className="list">
            {lines.map((l) => (
              <li key={l.id} className="row">
                <span>{l.title}</span>
                <span className="actions">
                  <button aria-label={`Decrease ${l.title}`} onClick={() => setQty(l.id, cart[l.id] - 1)}>−</button>
                  {cart[l.id]}
                  <button aria-label={`Increase ${l.title}`} onClick={() => setQty(l.id, cart[l.id] + 1)}>+</button>
                  <strong>${(l.price * cart[l.id]).toFixed(2)}</strong>
                  <button className="danger" onClick={() => setQty(l.id, 0)}>Remove</button>
                </span>
              </li>
            ))}
          </ul>
          <p><strong>Total: ${total.toFixed(2)}</strong></p>
          <button className="primary" onClick={() => { setCart({}); setDone(true) }}>Checkout</button>
        </>
      )}
    </PageShell>
  )
}

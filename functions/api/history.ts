interface Env {
  DB: D1Database
}

// GET /api/history — return all entries newest first
export async function onRequestGet({ env }: { env: Env }) {
  const { results } = await env.DB.prepare(
    'SELECT id, date, items, amounts FROM history ORDER BY id DESC'
  ).all()

  const entries = results.map((row) => ({
    id: row.id,
    date: row.date,
    items: JSON.parse(row.items as string),
    amounts: JSON.parse(row.amounts as string),
  }))

  return Response.json(entries)
}

// POST /api/history — save a new entry
export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  const { date, items, amounts } = await request.json() as {
    date: string
    items: string[]
    amounts: Record<string, Record<string, number>>
  }

  const { meta } = await env.DB.prepare(
    'INSERT INTO history (date, items, amounts) VALUES (?, ?, ?)'
  )
    .bind(date, JSON.stringify(items), JSON.stringify(amounts))
    .run()

  return Response.json({ id: meta.last_row_id }, { status: 201 })
}

/**
 * Netlify Function – proxy a la API de Udemy Affiliate.
 * Se llama desde el front como: GET /.netlify/functions/courses?q=ansiedad
 *
 * Variables de entorno necesarias en Netlify:
 *   UDEMY_CLIENT_ID      → tu Client ID de https://www.udemy.com/user/edit-api-clients/
 *   UDEMY_CLIENT_SECRET  → tu Client Secret del mismo formulario
 */

type HandlerEvent = {
  queryStringParameters?: Record<string, string> | null
  httpMethod: string
}

export interface UdemyCourse {
  id: string
  source: 'Udemy'
  title: string
  headline: string
  url: string
  image: string | null
  rating: string | null
  num_reviews: number
  is_paid: boolean
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
}

export const handler = async (event: HandlerEvent) => {
  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  }

  const clientId = process.env.UDEMY_CLIENT_ID
  const clientSecret = process.env.UDEMY_CLIENT_SECRET

  // Si no hay credenciales devolvemos un flag claro (no error)
  if (!clientId || !clientSecret) {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ configured: false, courses: [] }),
    }
  }

  const raw = event.queryStringParameters?.q ?? 'psicología clínica terapia cognitiva'
  // Enriquecemos la query con términos clínicos si viene una etiqueta corta
  const query = raw.length < 20 ? `${raw} psicología terapia` : raw

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const fields = [
    'title',
    'url',
    'image_480x270',
    'rating',
    'num_reviews',
    'headline',
    'is_paid',
  ].join(',')

  const apiUrl =
    `https://www.udemy.com/api-2.0/courses/` +
    `?search=${encodeURIComponent(query)}` +
    `&page_size=12` +
    `&ordering=relevance` +
    `&fields[course]=${fields}`

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Authorization: `Basic ${credentials}`,
        Accept: 'application/json, */*',
      },
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Udemy error', res.status, text)
      return {
        statusCode: res.status,
        headers: CORS_HEADERS,
        body: JSON.stringify({ configured: true, courses: [], error: `Udemy ${res.status}` }),
      }
    }

    const data = (await res.json()) as { results?: Record<string, unknown>[] }

    const courses: UdemyCourse[] = (data.results ?? []).map((c) => ({
      id: `udemy-${c['id']}`,
      source: 'Udemy',
      title: String(c['title'] ?? ''),
      headline: String(c['headline'] ?? ''),
      url: `https://www.udemy.com${c['url'] ?? ''}`,
      image: (c['image_480x270'] as string | null) ?? null,
      rating: c['rating'] != null ? Number(c['rating']).toFixed(1) : null,
      num_reviews: Number(c['num_reviews'] ?? 0),
      is_paid: Boolean(c['is_paid']),
    }))

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ configured: true, courses }),
    }
  } catch (err) {
    console.error('courses function error', err)
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ configured: true, courses: [], error: 'fetch failed' }),
    }
  }
}

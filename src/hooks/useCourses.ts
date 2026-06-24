import { useCallback, useEffect, useRef, useState } from 'react'

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

interface CoursesResult {
  courses: UdemyCourse[]
  loading: boolean
  /** true cuando las credenciales no están configuradas en Netlify */
  notConfigured: boolean
  error: string | null
  refetch: (q: string) => void
}

export function useCourses(initialQuery: string): CoursesResult {
  const [courses, setCourses] = useState<UdemyCourse[]>([])
  const [loading, setLoading] = useState(false)
  const [notConfigured, setNotConfigured] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetch_ = useCallback(async (q: string) => {
    if (!q) return
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `/.netlify/functions/courses?q=${encodeURIComponent(q)}`,
        { signal: ctrl.signal },
      )

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json() as { configured: boolean; courses: UdemyCourse[]; error?: string }

      if (!data.configured) {
        setNotConfigured(true)
        setCourses([])
      } else {
        setNotConfigured(false)
        setCourses(data.courses ?? [])
        if (data.error) setError(data.error)
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      // En local dev sin Netlify CLI la function no existe — no es un error fatal
      setNotConfigured(true)
      setCourses([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch_(initialQuery)
    return () => abortRef.current?.abort()
  }, [fetch_, initialQuery])

  return { courses, loading, notConfigured, error, refetch: fetch_ }
}

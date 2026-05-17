'use client'
import { useRouter, useSearchParams } from 'next/navigation'

interface Category {
    id: string
    name: string
    slug: string
}

const PLATFORMS = ['shopee', 'tokopedia', 'tiktok', 'lazada', 'blibli']

export default function CategoryFilter({ categories }: { categories: Category[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const activePlatform = searchParams.get('platform')

    function setFilter(key: string, value: string | null) {
        const params = new URLSearchParams(searchParams.toString())
        if (value) params.set(key, value)
        else params.delete(key)
        router.push(`/?${params.toString()}`)
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                <button onClick={() => setFilter('platform', null)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition
            ${!activePlatform ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                    Semua
                </button>
                {PLATFORMS.map(p => (
                    <button key={p} onClick={() => setFilter('platform', p)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border capitalize transition
              ${activePlatform === p ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                        {p}
                    </button>
                ))}
            </div>
        </div>
    )
}
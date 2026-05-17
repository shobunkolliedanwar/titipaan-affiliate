import Link from 'next/link'

interface Product {
    id: string
    name: string
    description: string | null
    image_url: string | null
    original_price: number | null
    discount_price: number | null
    short_slug: string
    platform: string
    categories: { name: string; slug: string } | null
}

const PLATFORM_COLORS: Record<string, string> = {
    shopee: 'bg-orange-100 text-orange-700',
    tokopedia: 'bg-green-100 text-green-700',
    tiktok: 'bg-pink-100 text-pink-700',
    lazada: 'bg-blue-100 text-blue-700',
    blibli: 'bg-sky-100 text-sky-700',
}

export default function ProductCard({ product }: { product: Product }) {
    const discount = product.original_price && product.discount_price
        ? Math.round((1 - product.discount_price / product.original_price) * 100)
        : null

    return (
        <Link href={`/go/${product.short_slug}`} target="_blank"
            className="group block bg-white rounded-xl border hover:shadow-lg transition overflow-hidden">
            <div className="aspect-square bg-gray-100 overflow-hidden">
                {product.image_url ? (
                    <img src={product.image_url} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🛍️</div>
                )}
            </div>
            <div className="p-3 space-y-1">
                <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${PLATFORM_COLORS[product.platform] ?? 'bg-gray-100 text-gray-600'}`}>
                        {product.platform}
                    </span>
                    {discount && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                            -{discount}%
                        </span>
                    )}
                </div>
                <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{product.name}</p>
                <div className="flex items-baseline gap-2">
                    {product.discount_price && (
                        <span className="text-base font-bold text-gray-900">
                            Rp{product.discount_price.toLocaleString('id-ID')}
                        </span>
                    )}
                    {product.original_price && product.discount_price && (
                        <span className="text-xs text-gray-400 line-through">
                            Rp{product.original_price.toLocaleString('id-ID')}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
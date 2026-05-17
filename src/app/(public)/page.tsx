import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/ProductCard'
import CategoryFilter from '@/components/CategoryFilter'

export default async function HomePage({
    searchParams,
}: {
    searchParams: Promise<{
        kategori?: string
        platform?: string
    }>
}) {
    const supabase = await createClient()

    const params = await searchParams

    let query = supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (params.platform) {
        query = query.eq('platform', params.platform)
    }

    const { data: products } = await query

    const { data: categories } = await supabase
        .from('categories')
        .select('*')

    return (
        <main className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">
                Produk Terbaik Untukmu 🔥
            </h1>

            <CategoryFilter categories={categories ?? []} />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                {products?.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </main>
    )
}
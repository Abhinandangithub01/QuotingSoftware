import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Search } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { formatCurrency } from '@/lib/utils'

const categories = ['Cabinets', 'Quartz', 'Flooring', 'Faucets', 'Sinks']

export function CatalogDrawer({ open, onOpenChange, onSelectProduct }) {
  const [activeTab, setActiveTab] = useState('Cabinets')
  const [search, setSearch] = useState('')
  const products = useStore((state) => state.products)

  const filteredProducts = products.filter(p => {
    const matchesCategory = p.category === activeTab
    const matchesSearch = search === '' || 
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleSelect = (product) => {
    onSelectProduct(product)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Product Catalog</SheetTitle>
          <SheetDescription>
            Browse and select products to add to your quote
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="text-xs">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((cat) => (
              <TabsContent key={cat} value={cat} className="mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]"
                      onClick={() => handleSelect(product)}
                    >
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-mono text-xs text-muted-foreground">{product.code}</p>
                            <h3 className="font-semibold text-sm mt-1 truncate">{product.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{product.finish}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{formatCurrency(product.price)}</p>
                            <p className="text-xs text-muted-foreground">/{product.uom}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant={product.stock > 20 ? 'success' : 'warning'} className="text-xs">
                            {product.stock} in stock
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}

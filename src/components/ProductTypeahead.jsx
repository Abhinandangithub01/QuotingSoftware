import { useState, useEffect, useRef } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useStore } from '@/store/useStore'

export function ProductTypeahead({ value, onSelect, onOpenCatalog }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const products = useStore((state) => state.products)
  const recentProducts = useStore((state) => state.recentProducts)
  const addRecentProduct = useStore((state) => state.addRecentProduct)

  const filteredProducts = products.filter(p => 
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (product) => {
    onSelect(product)
    addRecentProduct(product)
    setOpen(false)
    setSearch('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start text-left font-normal"
        >
          {value ? (
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {value.code} - {value.name}
            </span>
          ) : (
            <span className="text-muted-foreground">Search products...</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search by code or name..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No products found.</CommandEmpty>
            
            {recentProducts.length > 0 && (
              <>
                <CommandGroup heading="Recent">
                  {recentProducts.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.id}
                      onSelect={() => handleSelect(product)}
                      className="flex items-center gap-3 py-3"
                    >
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{product.code}</span>
                          {product.stock < 20 && (
                            <Badge variant="warning" className="text-xs">Low Stock</Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.finish}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatCurrency(product.price)}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}
            
            <CommandGroup heading="All Products">
              {filteredProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.id}
                  onSelect={() => handleSelect(product)}
                  className="flex items-center gap-3 py-3"
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{product.code}</span>
                      {product.stock < 20 && (
                        <Badge variant="warning" className="text-xs">Low Stock</Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.finish}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatCurrency(product.price)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          
          <div className="border-t p-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-primary"
              onClick={() => {
                setOpen(false)
                onOpenCatalog?.()
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Catalog
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

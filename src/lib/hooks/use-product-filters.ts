'use client'

import { useUrlParams } from './use-url-params'
import { FilterOption, SortOption, ActiveFilter } from '@/lib/types'

// 排序选项
export const sortOptions: SortOption[] = [
  { label: '推荐', value: 'featured' },
  { label: '价格: 低到高', value: 'price-asc' },
  { label: '价格: 高到低', value: 'price-desc' },
  { label: '最新上架', value: 'latest' },
  { label: '最受欢迎', value: 'popular' },
]

// 定义筛选选项
export const brands: FilterOption[] = [
  { label: 'Apple', value: 'apple', count: 124 },
  { label: 'Samsung', value: 'samsung', count: 98 },
  { label: 'Google', value: 'google', count: 67 },
  { label: 'OnePlus', value: 'oneplus', count: 54 },
  { label: 'Xiaomi', value: 'xiaomi', count: 42 },
  { label: 'OPPO', value: 'oppo', count: 35 },
  { label: 'Vivo', value: 'vivo', count: 29 },
  { label: 'Huawei', value: 'huawei', count: 22 },
]

export const colors: FilterOption[] = [
  { label: '黑色', value: 'black', count: 156 },
  { label: '白色', value: 'white', count: 143 },
  { label: '蓝色', value: 'blue', count: 89 },
  { label: '红色', value: 'red', count: 72 },
  { label: '绿色', value: 'green', count: 54 },
  { label: '金色', value: 'gold', count: 47 },
  { label: '银色', value: 'silver', count: 41 },
  { label: '紫色', value: 'purple', count: 29 },
]

export const sizes: FilterOption[] = [
  { label: '64GB', value: '64gb', count: 87 },
  { label: '128GB', value: '128gb', count: 143 },
  { label: '256GB', value: '256gb', count: 112 },
  { label: '512GB', value: '512gb', count: 76 },
  { label: '1TB', value: '1tb', count: 39 },
]

export function useProductFilters() {
  const { 
    getParam, 
    getArrayParam, 
    updateParams, 
    debouncedUpdateParams, 
    resetParams 
  } = useUrlParams()
  
  // 获取URL参数
  const currentSort = getParam('sort') || ''
  const currentMinPrice = getParam('minPrice')
  const currentMaxPrice = getParam('maxPrice')
  const currentInStock = getParam('inStock') === 'true'
  const selectedBrands = getArrayParam('brands')
  const selectedColors = getArrayParam('colors')
  const selectedSizes = getArrayParam('sizes')
  
  // 处理品牌切换
  const handleBrandToggle = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand]
    
    updateParams(
      { brands: newBrands.length ? newBrands.join(',') : null },
      { preserveScroll: true }
    )
  }
  
  // 处理颜色切换
  const handleColorToggle = (color: string) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color]
    
    updateParams(
      { colors: newColors.length ? newColors.join(',') : null },
      { preserveScroll: true }
    )
  }
  
  // 处理尺寸切换
  const handleSizeToggle = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size]
    
    updateParams(
      { sizes: newSizes.length ? newSizes.join(',') : null },
      { preserveScroll: true }
    )
  }
  
  // 处理价格变化
  const handlePriceChange = (min: number, max: number) => {
    debouncedUpdateParams(
      {
        minPrice: min.toString(),
        maxPrice: max.toString()
      },
      { preserveScroll: true }
    )
  }
  
  // 处理排序变化
  const handleSortChange = (value: string) => {
    updateParams({ sort: value || null }, { preserveScroll: true })
  }
  
  // 处理库存状态变化
  const handleInStockChange = (checked: boolean) => {
    updateParams({ inStock: checked ? 'true' : null }, { preserveScroll: true })
  }
  
  // 获取活动的筛选器数量
  const getActiveFiltersCount = () => {
    let count = 0
    if (currentSort) count++
    if (currentMinPrice || currentMaxPrice) count++
    if (currentInStock) count++
    if (selectedBrands.length) count++
    if (selectedColors.length) count++
    if (selectedSizes.length) count++
    return count
  }
  
  // 构建活动过滤器列表
  const activeFilters: ActiveFilter[] = [
    ...(currentSort ? [{
      id: 'sort',
      label: sortOptions.find(o => o.value === currentSort)?.label || currentSort,
      onRemove: () => updateParams({ sort: null }, { preserveScroll: true })
    }] : []),
    ...((currentMinPrice || currentMaxPrice) ? [{
      id: 'price',
      label: `价格: ¥${currentMinPrice || 0} - ¥${currentMaxPrice || 0}`,
      onRemove: () => updateParams({ minPrice: null, maxPrice: null }, { preserveScroll: true })
    }] : []),
    ...selectedBrands.map(brand => ({
      id: `brand-${brand}`,
      label: brands.find(b => b.value === brand)?.label || brand,
      onRemove: () => handleBrandToggle(brand)
    })),
    ...selectedColors.map(color => ({
      id: `color-${color}`,
      label: colors.find(c => c.value === color)?.label || color,
      onRemove: () => handleColorToggle(color)
    })),
    ...selectedSizes.map(size => ({
      id: `size-${size}`,
      label: sizes.find(s => s.value === size)?.label || size,
      onRemove: () => handleSizeToggle(size)
    })),
    ...(currentInStock ? [{
      id: 'inStock',
      label: '仅显示有货',
      onRemove: () => updateParams({ inStock: null }, { preserveScroll: true })
    }] : [])
  ]
  
  return {
    // 状态
    currentSort,
    currentMinPrice,
    currentMaxPrice,
    currentInStock,
    selectedBrands,
    selectedColors,
    selectedSizes,
    
    // 处理函数
    handleBrandToggle,
    handleColorToggle,
    handleSizeToggle,
    handlePriceChange,
    handleSortChange,
    handleInStockChange,
    resetParams,
    
    // 辅助函数和数据
    getActiveFiltersCount,
    activeFilters
  }
} 
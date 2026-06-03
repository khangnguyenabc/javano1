import { categories } from '../data/categories'

export function useCategories() {
  return categories
}

export function useCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug)
}

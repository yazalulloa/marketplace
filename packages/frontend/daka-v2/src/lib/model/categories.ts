

export interface Category {
  id: string
  tenant_id: string
  name: string
  description: string
  image: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}
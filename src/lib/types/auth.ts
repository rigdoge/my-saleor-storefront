export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  isActive: boolean
  avatar?: string | null
}

export interface AuthData {
  user: User | null
  token: string | null
  loading: boolean
  error: Error | null
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput extends LoginInput {
  firstName?: string
  lastName?: string
} 
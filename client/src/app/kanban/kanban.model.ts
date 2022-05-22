export interface User {
  uid?: string
  username?: string
  role?: 'admin' | 'manager' | 'dev' | 'submittor'
  manage: Project[]
}

export interface Project {
  pid?: string
  title?: string
  description?: string
  issues?: Issue[]
  participants: User[]
}

export interface Issue {
  iid?: string
  description?: string
  priority?: number
  complexity?: 1 | 2 | 3
  active?: boolean
  messages?: Message[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Message {
  content?: string
  createdAt?: Date
  author?: User
}
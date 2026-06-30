// src/context/AuthContext.jsx
import { onAuthStateChanged } from '@/firebase/auth'
import { getDocument } from '@/firebase/firestore'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      console.log('--- Auth state changed ---')
      console.log('firebaseUser:', firebaseUser?.email || 'null')

      if (firebaseUser) {
        console.log('UID:', firebaseUser.uid)
        console.log('Looking for admins/' + firebaseUser.uid + ' in Firestore...')

        try {
          const adminDoc = await getDocument('admins', firebaseUser.uid)
          console.log('adminDoc result:', adminDoc)
          console.log('isAdmin will be:', !!adminDoc)
          setUser(firebaseUser)
          setIsAdmin(!!adminDoc)
        } catch (err) {
          console.error('Error fetching admin doc:', err)
          setUser(firebaseUser)
          setIsAdmin(false)
        }
      } else {
        console.log('No user signed in')
        setUser(null)
        setIsAdmin(false)
      }

      console.log('Setting loading to false')
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
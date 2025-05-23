import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import { doc, deleteDoc } from "firebase/firestore"

export const useDeleteDocument = (docCollection) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [cancelled, setCancelled] = useState(false)

  const checkCancelBeforeDispatch = (action) => {
    if (!cancelled) {
      action()
    }
  }

  const deleteDocument = async (id) => {
    checkCancelBeforeDispatch(() => {
      setLoading(true)
      setError(null)
    })

    try {
      await deleteDoc(doc(db, docCollection, id))

      checkCancelBeforeDispatch(() => {
        setLoading(false)
      })
    } catch (error) {
      checkCancelBeforeDispatch(() => {
        console.error(error)
        setError(error.message)
        setLoading(false)
      })
    }
  }

  useEffect(() => {
    return () => setCancelled(true)
  }, [])

  return { deleteDocument, loading, error }
}
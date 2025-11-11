import { useState, useEffect } from "react"
import { db } from "../firebase/config"
import { doc, deleteDoc } from "firebase/firestore"
import api from "../services/apiClient"

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
      if (docCollection === 'eventos') {
        await api.del(`/eventos/${id}`)
      } else if (docCollection === 'posts') {
        await api.del(`/posts/${id}`)
      } else if (docCollection === 'agendamentos') {
        await api.del(`/agendamentos/${id}`)
      } else {
        await deleteDoc(doc(db, docCollection, id))
      }

      checkCancelBeforeDispatch(() => {
        setLoading(false)
      })
      
      // Retornar true para indicar sucesso
      return true;
    } catch (error) {
      checkCancelBeforeDispatch(() => {
        console.error(error)
        setError(error.message)
        setLoading(false)
      })
      
      // Propagar o erro para ser tratado pelo chamador
      throw error;
    }
  }

  useEffect(() => {
    return () => setCancelled(true)
  }, [])

  return { deleteDocument, loading, error }
}
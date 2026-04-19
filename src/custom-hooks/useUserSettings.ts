'use client'

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { setRegion, setCurrency, type Region, type Currency } from '@/lib/redux/slices/settingsSlice'
import { useState, useTransition } from 'react'
import { setLocationAction } from '../location-utils'
import { showAlert } from '@/lib/redux/slices/alertSlice'



export function useUserSettings() {
  
  const dispatch = useAppDispatch()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const region = useAppSelector(state => state.settings.region)
  const currency = useAppSelector(state => state.settings.currency)

  const updateRegion = async (newRegion: Region) => {
    setError(null)
    
    dispatch(setRegion(newRegion))
    
    startTransition(async () => {

      const result = await setLocationAction({ region: newRegion })
      
      if (result) {
        dispatch(showAlert({
          title: "Region Updated",
          description: "Your app region  is now updated!",
          variant: "default"
        }))
        
      } else {
        dispatch(showAlert({
          title: "Region Updated Failed",
          description: "Failed to update app region",
          variant: "default"
        }))
        setError('Failed to update region')
      }
    })
  }

  const updateCurrency = async (newCurrency: Currency) => {
    setError(null)
    
    // Optimistic update
    dispatch(setCurrency(newCurrency))
    
    startTransition(async () => {
      const result = await setLocationAction({ currency: newCurrency })
      
      if (result) {
        dispatch(showAlert({
          title: "Currency Updated",
          description: "Your app currency is now updated!",
          variant: "default"
        }))
      } 
      else {
        dispatch(showAlert({
          title: "Currency Updated Failed",
          description: "Failed to update app currency",
          variant: "default"
        }))
        setError('Failed to update currency')
      }
    })
  }

  return {
    region,
    currency,
    updateRegion,
    updateCurrency,
    isPending,
    error
  }
}
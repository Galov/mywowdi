'use client'
import { Button } from '@/components/ui/button'
import { useCurrentLocale } from '@/i18n/useCurrentLocale'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AddressForm } from '@/components/forms/AddressForm'
import { Address } from '@/payload-types'
import { DefaultDocumentIDType } from 'payload'

type Props = {
  addressID?: DefaultDocumentIDType
  initialData?: Partial<Omit<Address, 'country'>> & { country?: string }
  buttonText?: string
  modalTitle?: string
  callback?: (address: Partial<Address>) => void
  skipSubmission?: boolean
  disabled?: boolean
}

export const CreateAddressModal: React.FC<Props> = ({
  addressID,
  initialData,
  buttonText,
  modalTitle,
  callback,
  skipSubmission,
  disabled,
}) => {
  const locale = useCurrentLocale()
  const [open, setOpen] = useState(false)
  const localizedButtonText =
    buttonText ||
    (
      {
        bg: 'Добави нов адрес',
        de: 'Neue Adresse hinzufugen',
        en: 'Add a new address',
        es: 'Agregar una nueva direccion',
        fr: 'Ajouter une nouvelle adresse',
        it: 'Aggiungi un nuovo indirizzo',
      } as const
    )[locale]

  const localizedModalTitle =
    modalTitle ||
    (
      {
        bg: 'Добавяне на нов адрес',
        de: 'Neue Adresse hinzufugen',
        en: 'Add a new address',
        es: 'Agregar una nueva direccion',
        fr: 'Ajouter une nouvelle adresse',
        it: 'Aggiungi un nuovo indirizzo',
      } as const
    )[locale]

  const localizedDescription =
    (
      {
        bg: 'Този адрес ще бъде свързан с Вашия акаунт.',
        de: 'Diese Adresse wird mit Ihrem Konto verknupft.',
        en: 'This address will be connected to your account.',
        es: 'Esta direccion se vinculara a su cuenta.',
        fr: 'Cette adresse sera associee a votre compte.',
        it: 'Questo indirizzo verra collegato al tuo account.',
      } as const
    )[locale]

  const handleOpenChange = (state: boolean) => {
    setOpen(state)
  }

  const closeModal = () => {
    setOpen(false)
  }

  const handleCallback = (data: Partial<Address>) => {
    closeModal()

    if (callback) {
      callback(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild disabled={disabled}>
        <Button variant={'outline'}>{localizedButtonText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{localizedModalTitle}</DialogTitle>
          <DialogDescription>{localizedDescription}</DialogDescription>
        </DialogHeader>

        <AddressForm
          addressID={addressID}
          initialData={initialData}
          callback={handleCallback}
          skipSubmission={skipSubmission}
        />
      </DialogContent>
    </Dialog>
  )
}

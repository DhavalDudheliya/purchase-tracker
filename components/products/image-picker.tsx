"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, ImageIcon, Images, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/context"

type Props = {
  /** Current value: a newly picked File, an existing image URL, or null. */
  value: File | string | null
  onChange: (value: File | null) => void
}

/**
 * Product image picker. Offers Camera (rear camera on mobile) and Gallery.
 * Shows a preview and lets the user remove the image.
 */
export function ImagePicker({ value, onChange }: Props) {
  const { t } = useI18n()
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  // Managing the object-URL lifecycle (create on mount/change, revoke on
  // cleanup) is a genuine external-resource sync — setState here is intended.
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreview(typeof value === "string" ? value : null)
  }, [value])

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) onChange(file)
    // reset so picking the same file again still fires onChange
    event.target.value = ""
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt=""
            className="size-28 rounded-lg border object-cover"
          />
          <Button
            type="button"
            size="icon-sm"
            variant="destructive"
            className="absolute -top-2 -right-2"
            onClick={() => onChange(null)}
          >
            <X />
          </Button>
        </div>
      ) : (
        <div className="flex size-28 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
          <ImageIcon className="size-8" />
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => cameraRef.current?.click()}
        >
          <Camera />
          {t.products.camera}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => galleryRef.current?.click()}
        >
          <Images />
          {t.products.gallery}
        </Button>
      </div>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleFile}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFile}
      />
    </div>
  )
}

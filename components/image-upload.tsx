'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/ui/icons'

interface ImageUploadProps {
  initialImage?: string
  onImageChange: (base64: string) => void
}

export function ImageUpload({ initialImage, onImageChange }: ImageUploadProps) {
  const [preview, setPreview] = useState(initialImage)
  const [loading, setLoading] = useState(false)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      setLoading(true)
      try {
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          setPreview(base64String)
          onImageChange(base64String)
          setLoading(false)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Error reading file:', error)
        setLoading(false)
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={preview} />
          <AvatarFallback>
            {loading ? <Icons.spinner className="h-4 w-4 animate-spin" /> : 'Upload'}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-0 right-0 rounded-full"
          onClick={() => document.getElementById('imageInput')?.click()}
          disabled={loading}
        >
          <Icons.camera className="h-4 w-4" />
        </Button>
      </div>
      <input
        id="imageInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  )
}

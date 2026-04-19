'use client'

import { isValidUrl } from '@/helper-fns/isValidUrl'
import { cn } from '@/lib/utils'

interface MapProps {
  location: string
  className?: string
  height?: string
  width?: string
  zoom?: number
  allowFullScreen?: boolean
}

export default function MapEmbed({
  location,
  className,
  height = '400px',
  width = '100%',
  allowFullScreen = true
}: MapProps) {
    
    const src = isValidUrl(location)
    ? location
    : `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`


    return (
        <div className={cn('overflow-hidden rounded-3xl', className)}>
            <iframe
                src={src}
                width={width}
                height={height}
                style={{ border: 0, filter: 'grayscale(100%)' }}
                allowFullScreen={allowFullScreen}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map of ${location}`}
                className="w-full"
            />
        </div>
    )
}
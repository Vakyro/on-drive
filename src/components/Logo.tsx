import Image from 'next/image'

interface LogoProps {
  size?: number
}

export function Logo({ size = 40 }: LogoProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src="/logo.svg"
        alt="TruckApp Logo"
        width={size}
        height={size}
        className="rounded-full bg-black p-2"
      />
    </div>
  )
}


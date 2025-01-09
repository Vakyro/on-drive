import Image from 'next/image'

interface LogoProps {
  size?: number
}

export function Logo({ size = 40 }: LogoProps) {
  return (
    <div className="relative rounded-full border-2 border-black p-2" style={{ width: size, height: size }}>
      <Image
        src="/logo.svg"
        alt="TruckApp Logo"
        width={size}
        height={size}
      />
    </div>
  )
}


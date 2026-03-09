'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import DropdownItem from './DropdownItem'
import FeaturedCard from './FeaturedCard'

const dropdownVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] }
    },
    exit: {
        opacity: 0,
        y: -4,
        scale: 0.98,
        transition: { duration: 0.1 }
    }
}

export default function NavDropdown({ item, activeDropdown, openDropdown, closeDropdown }) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    if (activeDropdown !== item.dropdown) return null

    return (
        <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseEnter={() => openDropdown(item.dropdown)}
            onMouseLeave={closeDropdown}
            onMouseMove={handleMouseMove}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1"
            style={{
                background: `radial-gradient(300px at ${mousePos.x}px ${mousePos.y}px, rgba(155,110,255,0.06), transparent 80%), rgba(10, 10, 18, 0.97)`,
                border: '1px solid rgba(155, 110, 255, 0.12)',
                borderRadius: '16px',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(155,110,255,0.05)',
                minWidth: '560px',
                zIndex: 100
            }}
        >
            {/* Purple gradient top border */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#9B6EFF]/40 to-transparent rounded-t-2xl" />

            <div className="p-5 flex gap-8">
                {/* Sections */}
                <div className="flex-[2] flex gap-8">
                    {item.sections.map(section => (
                        <div key={section.title} className="flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#555] mb-3 px-3">
                                {section.title}
                            </p>
                            <div className="space-y-0.5">
                                {section.items.map(subItem => (
                                    <DropdownItem key={subItem.href} item={subItem} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Featured card — right side */}
                {item.featured && <FeaturedCard card={item.featured} />}
            </div>
        </motion.div>
    )
}

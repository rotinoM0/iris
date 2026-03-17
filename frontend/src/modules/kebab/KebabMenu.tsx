import { EllipsisVertical, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import "./KebabMenu.css"
import axios from "axios";
import config from "../../config";
import addHistory from "../../services/historyService";

function KebabMenu({ options, id }: { options: { label: React.ReactNode; action: () => void }[]; id: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null)
    
    const deleteItem = async () => {
        try {
            const item = await axios.get(`${config.dev.apiUrl}/items/${id}`).then(res => res.data.data)
            await addHistory({
                item: `${item.catProduto} ${item.catModelo} ${item.codigo}`,
                tipo: "removido",
                quantidade: 0
            })
            await axios.delete(`${config.dev.apiUrl}/items/${id}`)
            window.dispatchEvent(new CustomEvent('itemsUpdated'))
        } catch (err) {
            (window as unknown as Window).dispatchEvent(new CustomEvent('itemsUpdated'))
        }
    }
    
    useEffect(() => {
        const handleClickOut = (e: { target: unknown; }) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node))
                setIsOpen(false);
        }
        if (isOpen)
            document.addEventListener("mousedown", handleClickOut)
        return () => {
            document.addEventListener("mousedown", handleClickOut)
        }
    }, [isOpen])

    return (
        <div className="kebab-container">
            <button onClick={(e) => {e.stopPropagation(); setIsOpen(!isOpen)}} className="kebab-icon"><EllipsisVertical /></button>
            <div className="relative" ref={menuRef}>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        {options.map((option, index) => (
                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                                key={index} 
                                onClick={() => { option.action(); setIsOpen(false); }}>
                                {option.label}
                            </button>
                        ))}

                        <button
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                            onClick={() => {setIsOpen(false); deleteItem()} }
                        >
                            <Trash width={15} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            Deletar
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default KebabMenu
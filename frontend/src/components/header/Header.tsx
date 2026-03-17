import Produto from "../../modules/modals/addProduto/Produto"
import Categoria from "../../modules/modals/categoria/Categoria"

// import logo from "../../../assets/logo.png"
import "./Header.css"
import { useNavigate } from "react-router-dom"
import { useRef, useState } from "react"
import { DoorOpen, Scroll, User, Home } from "lucide-react"
import Histórico from "../../modules/modals/historico/Historico"

import logoText from "/logo-text.svg"

export default function Header() {
    const navigate = useNavigate()

    const [currentMenu, setCurrentMenu] = useState("")
    const menuRef = useRef<HTMLDivElement>(null)

    const toggleMenu = (menu: string) => {
        if (currentMenu === menu) {
            setCurrentMenu("")
        } else {
            setCurrentMenu(menu)
        }
    }

    return (
        <div className="transition fixed z-100 top-0 left-0 right-0 w-screen justify-between font-sans">
            <div className="flex flex-1 w-full px-10 py-2 items-center justify-between bg-gray-200 text-lg">
                <a href="/" className="flex w-full gap-5 justify-start items-center">
                    {/* <img src={logo} alt="" className="logo" /> */}
                    <img src={logoText} alt="logo iris" className="w-15  h-auto" />
                </a>

                <nav className="gap-8 flex w-full items-center justify-end">

                    <button className="font-bold text-gray-800 header-btn" onClick={() => navigate("/")}><span><Home /></span> Início</button>

                    <div className="flex relative">
                        <button className="font-bold text-gray-800 header-btn" onClick={() => toggleMenu("registro")}> <span><Scroll /></span> Registro</button>
                        {currentMenu === "registro" && (
                            <div className="border border-gray-200 bg-white rounded-md dropdown" ref={menuRef}>
                                <Produto />
                                <Categoria />
                                <button className="flex gap-2 items-center text-gray-700 font-bold header-btn" onClick={() => navigate("/estoque")}><Scroll /> Gerenciar estoque</button>
                            </div>
                        )}
                    </div>

                    <div className="flex relative">
                        <Histórico />
                    </div>

                    <div className="flex relative">
                        <span><User /></span> 
                        <button className="flex font-bold text-gray-800 header-btn" onClick={() => toggleMenu("usuario")}>
                            {JSON.parse(localStorage.getItem("user") || '{}').nome}
                        </button>
                        {currentMenu === "usuario" && (
                            <div className="border border-gray-200 p-2 bg-white rounded-md dropdown" ref={menuRef}>
                                {JSON.parse(localStorage.getItem("user") || '{}').cargo === "admin" && (
                                    <button className="flex gap-2 items-center text-gray-700 font-bold hover:text-blue-600 header-btn" onClick={() => {}}>Gerenciar usuários</button>
                                )}
                                <button className="flex gap-2 items-center text-gray-700 font-bold hover:text-red-600 header-btn" onClick={() => navigate("/login")}><DoorOpen /> Sair</button>
                            </div>
                        )}
                    </div>

                </nav>

            </div>
        </div>
    )
}
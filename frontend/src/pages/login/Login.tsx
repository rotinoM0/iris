import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import axios from "axios"
import config from "../../config"

import Footer from "../../components/Footer/Footer"

import "./Login.css"

import logoText from "/logo-text.svg"

export default function Login() {
    const Navigate = useNavigate();

    const [userInput, setUserInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("user")
    }, [])

    const Submit = async () => {
        try {
            const res = await axios.post(`${config.dev.apiUrl}/auth/login`, { nome: userInput, senha: passwordInput })
            if (res.data.success) {
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("user", JSON.stringify(res.data.user))
                
                setErrorMessage("")
                Navigate("/main")
            } else {
                setErrorMessage(res.data.message || "Erro ao fazer login")
                localStorage.removeItem("token")
                localStorage.removeItem("user")
            }

        } catch (error) {
            console.error(error)
            localStorage.removeItem("token")

            if (axios.isAxiosError(error)) {
                if (error.response)
                    setErrorMessage("Erro ao fazer login: " + error.response.data.error)
                else
                    setErrorMessage("Erro ao fazer login: " + error.message)
            } else {
                setErrorMessage("Erro ao fazer login: " + error)
            }
        }
    }

    return (
        <>
            <div className="bg-zinc-900 font-sans flex flex-col justify-center items-center gap-5 h-screen w-screen overflow-hidden">
                <div className="text-zinc-800 bg-zinc-100 rounded-4xl shadow-xl p-10 w-1/2 flex flex-col justify-center items-center gap-5">
                    <div className="w-full justify-center items-center flex flex-col gap-5">
                        <img src={logoText} alt="logo iris" className="w-30 h-auto" />
                        <p>Faça login para continuar</p>
                    </div>
                    <div className="justify-center w-1/2 flex flex-col gap-5 items-center">
                        <div className="flex flex-col w-full justify-center gap-4 items-center">
                            <input type="text" name="Usuário" id="user" className="text-gray-700 rounded-lg inline-flex flex-1 w-full px-5 py-2 border-2 border-gray-300" onChange={(e) => setUserInput(e.target.value)} placeholder="Usuário" />
                            <input type="password" name="Senha" id="password" className="text-gray-700 rounded-lg inline-flex flex-1 w-full px-5 py-2 border-2 border-gray-300" onChange={(e) => setPasswordInput(e.target.value)} placeholder="Senha" />
                            <a className="text-blue-700 w-full">Esqueceu a senha?</a>
                            {errorMessage && <h4 className="text-red-500 text-center">{errorMessage}</h4>}
                        </div>

                        <div className="flex flex-col w-full items-center">
                            <button type="button" className="w-full text-white input-button" onClick={Submit}>Entrar</button>
                        </div>
                    </div>
                    <p>não tem uma conta? <a onClick={() => Navigate("/register")} className="text-blue-700">Crie uma</a></p>
                </div>
                <Footer />
            </div>
        </>
    )
}
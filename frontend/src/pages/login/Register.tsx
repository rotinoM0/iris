import { useNavigate } from "react-router-dom"

import "./Login.css"
// import logo from "../../assets/logo.png"
import { useState } from "react"
import axios, { isAxiosError } from "axios"
import config from "../../config"
import Footer from "../../components/Footer/Footer"

export default function Register() {
    const Navigate = useNavigate();

    const [userInput, setUserInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const Submit = async () => {
        try {
            const res = await axios.post(`${config.dev.apiUrl}/auth/register`, {nome: userInput, senha: passwordInput})
            if (res.data.success) {
                localStorage.setItem("token", res.data.token)
                Navigate("/login")
            } else {
                setErrorMessage(res.data.message)
            }
        } catch (error) {
            console.log(error)
            if (isAxiosError(error)) {
                if (!error.response) {
                    setErrorMessage("Erro de conexão com o servidor.")
                    return
                }
                setErrorMessage("Erro ao fazer login: " + error.response.data.message)
                return
            }
        }
    }

    return(
        <>
        <div className="bg-zinc-900 font-sans flex flex-col justify-center items-center gap-5 h-screen w-screen overflow-hidden">
            <div className="text-zinc-800 bg-zinc-100 rounded-4xl shadow-xl p-10 w-1/2 flex flex-col justify-center items-center gap-5">
                <div className="w-full justify-center items-center flex flex-col gap-5">
                    {/* <img src={logo} alt="" className="logo"/> */}
                    <h1 className="text-4xl font-bold">Crie uma conta</h1>
                </div>
                <div className="justify-center w-1/2 flex flex-col gap-5 items-center">
                    <div className="flex flex-col w-full justify-center gap-4 items-center">
                        <input type="text" name="Usuário" id="user" className="text-gray-700 rounded-lg inline-flex flex-1 w-full px-5 py-2 border-2 border-gray-300" onChange={(e) => setUserInput(e.target.value)} placeholder="Usuário" />
                        <input type="password" name="Senha" id="password" className="text-gray-700 rounded-lg inline-flex flex-1 w-full px-5 py-2 border-2 border-gray-300" onChange={(e) => setPasswordInput(e.target.value)} placeholder="Senha" />
                        <input type="password" name="Confirmar senha" id="confirm" className="text-gray-700 rounded-lg inline-flex flex-1 w-full px-5 py-2 border-2 border-gray-300" onChange={(e) => setPasswordInput(e.target.value)} placeholder="Confirme sua senha" />
                        {errorMessage && <h4 className="text-red-500 text-center">{errorMessage}</h4>}
                    </div>

                    <div className="flex gap-2">
                        <input type="checkbox" name="checkbox" id="checkbox" className="check"></input>
                        <p>Eu li e aceito os <a className="text-blue-700">termos de uso</a></p>
                    </div>

                    <div className="flex flex-col w-full items-center">
                        <button type="button" className="w-full text-white input-button" onClick={Submit}>Criar conta</button>
                        <p>Já tem uma conta? <a onClick={() => Navigate("/login")} className="text-blue-700">Login</a></p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
        </>
    )
}
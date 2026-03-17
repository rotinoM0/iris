import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Init() {
    const Navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            Navigate("/main")
        } else {
            Navigate("/login")
        }
    }, [Navigate])

    return (
        <>
        <pre></pre>
        </>
    )
}
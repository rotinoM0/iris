import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Init() {
    const Navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return;
        if (user) {
            Navigate("/main")
        } else {
            Navigate("/login")
        }
    }, [loading, user, Navigate])

    return (
        <>
        <pre></pre>
        </>
    )
}
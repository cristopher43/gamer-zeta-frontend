import type { Route } from "./+types/home";
import { Navigate } from "react-router";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Gamer Zeta - Sistema POS" },
        { name: "description", content: "Sistema de punto de venta" },
    ];
}

export default function Home() {
    return <Navigate to="/login" replace />;
}
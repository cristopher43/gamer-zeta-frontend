import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),

    layout("components/templates/cashier-layout.tsx", [
        route("cashier", "routes/cashier/CashierHome.tsx"),
    ]),

    layout("components/templates/admin-layout.tsx", [
        route("admin/dashboard", "routes/admin/Dashboard.tsx"),
        route("admin/sales", "routes/admin/Sales.tsx"),

        route("admin/products", "routes/admin/products/Products.tsx"),
        route("admin/products/new", "routes/admin/products/ProductForm.tsx", { id: "product-new" }),
        route("admin/products/edit/:id", "routes/admin/products/ProductForm.tsx", { id: "product-edit" }),

        route("admin/users", "routes/admin/users/Users.tsx"),
        route("admin/users/new", "routes/admin/users/UserForm.tsx", { id: "user-new" }),
        route("admin/users/edit/:id", "routes/admin/users/UserForm.tsx", { id: "user-edit" }),
    ]),
] satisfies RouteConfig;
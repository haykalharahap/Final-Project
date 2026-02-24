import { createBrowserRouter } from "react-router";
import { MainLayout } from "./layouts/MainLayout";
import { HomePage } from "./pages/HomePage";
import { MenuPage } from "./pages/MenuPage";
import { FoodDetailPage } from "./pages/FoodDetailPage";
import { CartPage } from "./pages/CartPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProfilePage } from "./pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "menu", Component: MenuPage },
      { path: "food/:id", Component: FoodDetailPage },
      { path: "cart", Component: CartPage },
      { path: "profile", Component: ProfilePage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
    ],
  },
]);

import { Home, Chat, Game, Settings, Profile, Logout } from "./assets/icons";

export const Routes = [
  {
    name: "home",
    icon: { Home },
    link: "/",
  },
  {
    name: "chat",
    icon: { Chat },
    link: "/chat",
  },
  {
    name: "game",
    icon: { Game },
    link: "/game",
  },
  {
    name: "profile",
    icon: { Profile },
    link: "/profile",
  },
  {
    name: "settings",
    icon: { Settings },
    link: "/settings",
  },
  {
    name: "logout",
    icon: { Logout },
    link: "",
  },
];

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { Input } from "@/components/ui/input";

import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatState } from "@/context/ChatProvider";
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'
const Navigation = () => {
  const {user, token} = ChatState();
  const navigate = useNavigate();
  const handleProfile = () => {
    if(token) {
      alert("In profile")
    } else {
      toast.warn('Oops, You are not loggedIn, Please login', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });

        setTimeout(() => {
          navigate('/login');
        }, 1500);
    }
  }

  const handleGossip = () => {
    navigate('/');
    if(token) {
      toast.success('Enjoy gossiping', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
        setTimeout(() => {
          
          document?.getElementById("gossipID")?.click()
        }, 100);
    } else {
      toast.warn('Oops, Please login for gossiping', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });

        setTimeout(() => {
          navigate('/login');
        }, 1500);
    }    
  }
  return (
    <NavigationMenu className="max-w-100 flex items-center justify-around max-h-20 p-3">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink>
              <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-3xl">
                Razón
              </h1>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList className="p-1">
        <NavigationMenuItem>
          <Menubar className="flex gap-5">
            <MenubarMenu>
              <MenubarTrigger>About Us</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Contact Us</MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger
                onClick={handleGossip}
              >
                Gossip here
              </MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        <Input placeholder="search..." className="pr-20" />
      </NavigationMenuList>
      <NavigationMenuItem className="flex items-center gap-5">
        <ModeToggle />
        <Avatar className="cursor-pointer" onClick={handleProfile}>
          <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} />
          <AvatarFallback className="flex items-center text-center text-xl font-bold">{user?.username?.substring(0,2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </NavigationMenuItem>
    </NavigationMenu>
  );
};

export default Navigation;

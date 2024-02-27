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
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useState } from "react";
const Navigation = () => {
  const { user, token } = ChatState();
  const navigate = useNavigate();
  const handleProfile = () => {
    if(token) {
      navigate(`/profile/${user.username}`)
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
    if (token) {
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


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
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


      {/* desktop view */}
      <div className="hidden w-4/5 md:flex justify-between">


        <NavigationMenuList className="p-1 ">
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
            <AvatarFallback className="flex items-center text-center text-xl font-bold">{user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </NavigationMenuItem>
      </div>


      {/* mobile view */}
      <div className="flex md:hidden" onClick={toggleMobileMenu}>

        svgs

      </div>


      {isMobileMenuOpen && (
        <div className="fixed inset-0 dark:bg-black bg-white  bg-opacity-1 z-50">
          {/* Mobile menu content */}
          <div className="absolute top-0 right-0 mt-4 mr-4">
            {/* Close button */}
            <button onClick={toggleMobileMenu} className="dark:text-white text-black">
              close
            </button>
          </div>

          {/* Mobile menu items */}
          <div className="flex flex-col justify-center items-center mt-20">
            {/* Your mobile menu items */}
            <NavigationMenuList className="p-1 flex-col ">
              <NavigationMenuItem>
                <Menubar className="flex gap-5 flex-col h-30 w-30">
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
            <NavigationMenuItem className="flex items-center gap-5">
          <ModeToggle />
          <Avatar className="cursor-pointer" onClick={handleProfile}>
            <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} />
            <AvatarFallback className="flex items-center text-center text-xl font-bold">{user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </NavigationMenuItem>
            {/* Add more mobile menu items as needed */}
          </div>
        </div>
      )}
    </NavigationMenu>
  );
};

export default Navigation;

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { Input } from "@/components/ui/input";

import { Link } from "@radix-ui/react-navigation-menu";
import { ModeToggle } from "./mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navigation = () => {
  return (
    <NavigationMenu className="max-w-100 flex items-center justify-around max-h-20 p-3">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/">
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
              <MenubarContent>
                <MenubarItem>
                  New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>New Window</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Share</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Print</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Gossip here</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>New Window</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Share</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Print</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        <Input placeholder="search..." className="pr-20" />
      </NavigationMenuList>
      <NavigationMenuItem className="flex items-center gap-5">
        <ModeToggle />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </NavigationMenuItem>
    </NavigationMenu>
  );
};

export default Navigation;

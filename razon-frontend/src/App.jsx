import ChatSection from "./components/ChatSection";
import MainSection from "./components/MainSection";

import Navigation from "./components/Navigation";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MessageCircleHeart } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

import "./App.css";
const App = () => {

  return (
    <div className="h-[100vh]">
      <Toaster />

      <Navigation />
      <MainSection />
      <Drawer>
        <DrawerTrigger className="fixed p-3 w-70 border-2 rounded bottom-5 right-5 items-center flex gap-3 justify-center">
          <MessageCircleHeart className="mb-1.5" />
          <p className="text-xl font-semibold font-mono">Gossip</p>
        </DrawerTrigger>
        <DrawerContent>
          <ChatSection />
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default App;

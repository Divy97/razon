import ChatSection from "./components/ChatSection";
import MainSection from "./components/MainSection";

import Navigation from "./components/Navigation";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { MessageCircleHeart } from "lucide-react";

import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import "./App.css";
import { ChatState } from "./context/ChatProvider";
const App = () => {
  const {token} = ChatState();
  const navigate = useNavigate();

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
        // setTimeout(() => {
        //   document?.getElementById("gossipID")?.click()
        // }, 100);
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
    <div className="h-[100vh]">
      <Navigation />
      <MainSection />
      <Drawer>
        <DrawerTrigger
          id="gossipID"
          className="cursor-pointer fixed p-3 w-70 border-2 rounded bottom-5 right-5 items-center flex gap-3 justify-center"
        >
          <MessageCircleHeart className="mb-1.5" />
          <p className="text-xl font-semibold font-mono" onClick={handleGossip}>Gossip</p>
        </DrawerTrigger>
        <DrawerContent>
          <ChatSection />
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default App;

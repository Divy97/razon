import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Input } from "@/components/ui/input";

import { Image, Link } from "lucide-react";
import { Link as NavLink } from "react-router-dom";
import { ChatState } from "@/context/ChatProvider";


const CreatePost = () => {
  const { user } = ChatState();

  
  return (
    <NavLink to="/create-post" className="mx-auto">
      <div className="h-[10vh] w-[70vw] rounded-md border justify-between mx-auto flex items-center pl-5 pr-5 gap-8">
        <Avatar>
          <AvatarImage
            className="w-[4rem] h-[4rem]"
            style={{
              borderRadius: "50%",
              border: "2px solid gray",
            }}
            src={user?.avatar || "https://github.com/shadcn.png"}
          />
          <AvatarFallback className="flex items-center text-center text-xl font-bold">{user?.username?.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <Input
          className="w-[70rem] h-[3rem] text-xl font-bold border-2 border-gray-400 focus:border-0 pl-5"
          placeholder="Post your thoughts..."
        />
        <div className="flex gap-4 items-center">
          <Image width={30} />
          <Link width={30} />
        </div>
      </div>
    </NavLink>
  );
};

export default CreatePost;

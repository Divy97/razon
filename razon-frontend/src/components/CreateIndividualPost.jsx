import { Separator } from "@radix-ui/react-menubar";
import Navigation from "./Navigation";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { Toaster } from "./ui/toaster";
import { ChatState } from "@/context/ChatProvider";
import { SERVER } from "../constants.js";
import {useNavigate} from 'react-router-dom';

const CreateIndividualPost = () => {
  const { token } = ChatState();

  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  function handleChange(e) {
    setImage(e.target.files[0]);
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  const [tag, setTag] = useState("");
  const [tagsArray, setTagsArray] = useState([]);
  const addTag = (e) => {
    if (e.key == "Enter" && tag) {
      setTagsArray([...tagsArray, tag]);
      setTag("");
    }
  };

  console.log(tagsArray);

  const handleDelete = (tag) => {
    let newTagsArrays = tagsArray?.filter((t) => tag !== t);
    setTagsArray(newTagsArrays);
  };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const handleCreatePost = async () => {
    if (!title) {
      toast.warn('Fill the details', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
      return;
    }

    try {
      const apiEndpoint = `${SERVER}/posts/create-post`;
      const data = new FormData();
      data.append("title", title);
      data.append("content", content);
      data.append("tags", tagsArray);
      data.append("avatar", image);

      console.log("data:", data);

      const myHeaders = new Headers({
        Authorization: `Bearer ${token}`,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: data,
      };

      const response = await fetch(apiEndpoint, requestOptions);
      const result = await response.json();

      console.log("API Response:", result);
      if(result.message == "jwt malformed") {
        toast.warn('Oops, You have to login to post', {
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
          return;
      }
      toast.success('Yayy, Posted', {
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
          navigate('/');
        }, 1500);
        return;
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  console.log(title);

  return (
    <div>
      <Toaster />
      <Navigation />
      <div className="border-2 w-[60vw] h-[auto] ml-[9rem] mt-10 mb-5 flex flex-col p-5">
        <div className="flex mt-5">
          <h1 className="text-4xl font-mono font-extrabold">Create a Post</h1>
        </div>
        <Separator className="my-2 border-2" />
        <Input
          placeholder="Type a title...."
          className="h-[3rem] text-2xl font-extrabold  mt-6 pl-5 border-spacing-3 border-black dark:border-white focus:border-0"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Content"
          className="h-[8rem] mt-8 pl-5 border-spacing-3 text-xl font-semibold border-black dark:border-white focus:border-0"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="mt-5">
          <div className="flex items-center w-100 gap-6">
            <h1 className="text-3xl font-mono font-extrabold">Upload Image</h1>
            <label
              htmlFor="fileInput"
              className="border-2 w-[10rem] text-center p-1 text-xl font-bold rounded cursor-pointer"
            >
              SELECT
            </label>
            <input
              id="fileInput"
              type="file"
              onChange={handleChange}
              className="hidden"
            />
          </div>
          <div className="flex items-center justify-center">
            {file && (
              <img
                src={file}
                alt="uploadImage"
                className="m-3 w-[40rem] h-[20rem] rounded"
              />
            )}
          </div>
          <div className="flex items-center w-100 gap-24 mt-5">
            <h1 className="text-3xl font-mono font-extrabold">Add tags</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-2 w-[10rem] text-center p-1 text-xl font-bold rounded cursor-pointer"
                >
                  <p className="text-lg font-bold font-mono">TAGS</p>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    ADD SOME COOL TAGS
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Input
                      id="tags"
                      defaultValue="Add Users..."
                      className="col-span-3 border-2 border-black dark:border-white focus:border-0"
                      onKeyDown={addTag}
                      onChange={(e) => setTag(e.target.value)}
                      value={tag}
                      placeholder="write tag name"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {tagsArray && tagsArray?.map((tag, i) => {
                    return (
                      <Badge
                        key={i}
                        className="flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <p className="text-md font-mono">{tag}</p>{" "}
                        <X size={14} onClick={() => handleDelete(tag)} />
                      </Badge>
                    );
                  })}
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => {
                      document?.getElementById("dialogClose")?.click();
                    }}
                    className="w-[6rem] text-lg font-bold rounded-lg"
                  >
                    Done
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex mt-2 justify-end">
            <Button
              className="w-[10rem] text-xl font-bold rounded-lg"
              onClick={() => handleCreatePost()}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateIndividualPost;

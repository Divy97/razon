import { Separator } from "@radix-ui/react-menubar";
import Navigation from "./Navigation";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

const CreateIndividualPost = () => {
  const { token } = ChatState();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [keyword, setKeyword] = useState("");

  const handleChange = (e) => {
    setImage(e.target.files[0]);
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  const [tag, setTag] = useState("");
  const [tagsArray, setTagsArray] = useState([]);
  const addTag = (e) => {
    if (e.key === "Enter" && tag) {
      setTagsArray([...tagsArray, tag]);
      setTag("");
    }
  };

  const handleDelete = (tag) => {
    let newTagsArrays = tagsArray?.filter((t) => tag !== t);
    setTagsArray(newTagsArrays);
  };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreatePost = async () => {
    if (!title) {
      toast.warn("Fill the details", {
        /* toast configuration */
      });
      return;
    }

    try {
      const apiEndpoint = `${SERVER}/posts/create-post`;
      const data = new FormData();
      data.append("title", title);
      data.append("content", content);
      tagsArray.forEach((tag) => data.append("tags[]", tag));

      if (image) {
        data.append("avatar", image);
      } else if (file) {
        const response = await fetch(file);
        const blob = await response.blob();
        const unsplashImage = new File([blob], "unsplash-image.jpg", {
          type: blob.type,
        });
        data.append("avatar", unsplashImage);
      }

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

      if (response.ok) {
        toast.success("Yayy, Posted", {
          /* toast configuration */
        });
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        console.error("Error creating post:", result);
        if (result.message === "jwt malformed") {
          toast.warn("Oops, You have to login to post", {
            /* toast configuration */
          });
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        } else {
          toast.error("Something went wrong while creating a post", {
            /* toast configuration */
          });
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong while creating a post", {
        /* toast configuration */
      });
    }
  };

  const fetchDogPhotos = async (keyword) => {
    const UNSPLASH_ACCESS_KEY = "zdUpu6J1Oeva0HAPlvrka2ibR70JetL8AUsSFRjD2t8"; // Replace with your actual Unsplash Access Key
    const apiEndpoint = `https://api.unsplash.com/search/photos?query=${keyword}&client_id=${UNSPLASH_ACCESS_KEY}`;

    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const slicedPhotos = data.results.slice(0, 3);
      setPhotos(slicedPhotos);
    } catch (error) {
      console.error("Failed to fetch photos from Unsplash:", error);
      setPhotos([]);
    }
  };

  useEffect(() => {
    fetchDogPhotos();
  }, []);

  const selectImage = (url) => {
    setFile(url); // Set the selected image URL
    setImage(null); // Reset local file input
  };

  return (
    <div>
      <Toaster />
      <Navigation />
      <div className="border-2 sm:w-[60vw] h-[auto] mx-auto w-[90vw] mt-10 mb-5 flex flex-col p-5">
        <div className="flex mt-5">
          <h1 className="text-2xl md:text-4xl font-mono font-extrabold">
            Create a Post
          </h1>
        </div>
        <Separator className="my-2 border-2" />
        <Input
          placeholder="Type a title...."
          className="md:h-[3rem] md:text-2xl font-extrabold mt-6 pl-5 border-spacing-3 border-black dark:border-white focus:border-0"
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
            <h1 className="md:text-3xl font-mono font-extrabold w-full md:w-auto">
              Upload Image
            </h1>
            <label
              htmlFor="fileInput"
              className="border-2 w-[10rem] text-center p-1 md:text-xl font-bold rounded cursor-pointer"
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
          <div className="flex items-center w-100 gap-6 mt-5">
            <h1 className="md:text-3xl font-mono font-extrabold w-full md:w-auto">
              OR
            </h1>
          </div>
          <div className="mt-5">
            <Input
              placeholder="Enter keyword to search images..."
              className="md:h-[3rem] md:text-2xl font-extrabold pl-5 border-spacing-3 border-black dark:border-white focus:border-0"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button
              className="mt-4 w-full md:w-[10rem] md:text-xl font-bold rounded-lg"
              onClick={() => fetchDogPhotos(keyword)}
            >
              Search Images
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="cursor-pointer aspect-w-1 aspect-h-1"
                  onClick={() => selectImage(photo.urls.small)}
                >
                  <img
                    src={photo.urls.small}
                    alt={photo.alt_description}
                    className="object-cover w-[500px] h-[300px] rounded"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center w-100 gap-24 mt-5">
            <h1 className="md:text-3xl font-mono md:font-extrabold w-full md:w-auto">
              Add tags
            </h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-2 w-[10rem] text-center p-1 md:text-xl font-bold rounded cursor-pointer"
                >
                  <p className="md:text-lg font-bold font-mono">TAGS</p>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] w-[80vw]">
                <DialogHeader>
                  <DialogTitle className="md:text-2xl">
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
                  {tagsArray &&
                    tagsArray?.map((tag, i) => (
                      <Badge
                        key={i}
                        className="flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <p className="text-md font-mono">{tag}</p>
                        <X size={14} onClick={() => handleDelete(tag)} />
                      </Badge>
                    ))}
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => {
                      document?.getElementById("dialogClose")?.click();
                    }}
                    className="w-[6rem] text-lg font-bold rounded-lg"
                    size={"sm"}
                  >
                    Done
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex mt-2 justify-end">
            <Button
              className="w-[5rem] md:w-[10rem] md:text-xl font-bold rounded-lg"
              onClick={handleCreatePost}
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

import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { toast } from "react-toastify";
import {useNavigate} from 'react-router-dom'
const AuthPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  function handleChange(e) {
    setAvatar(e.target.files[0]);
  }

  const handleRegistration = () => {
    setLoading(true);
    let data = new FormData();
    data.append("username", username);
    data.append("password", password);
    data.append("bio", bio);
    data.append("avatar", avatar);

    let requestOptions = {
      method: "POST",
      body: data,
      redirect: "follow",
    };

    fetch("http://localhost:8080/api/v1/users/register", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setLoading(false)
        if (result.success) {
          toast.success("Registered Successfully", {
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
          }, 1000);
          return;
        } else {
          toast.error(`${result.message}`, {
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
      })
      .catch((error) => {
        toast.error(`${error.message}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  return (
    <div className="w-[100vw] overflow-hidden h-[100vh] flex flex-row">
      <div className="w-[50%] border-2 bg-[#18181b] lg:flex hidden">
        <Link to="/">
          <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-3xl ml-16 mt-16">
            Razón
          </h1>
        </Link>
      </div>
      <div className="flex items-center flex-col w-[100%] lg:w-[50%]">
        <Link to="/login" className=" w-[100%] lg:w-[100%] flex justify-end">
          <Button
            variant="outline"
            className="scroll-m-20 text-2xl font-extrabold tracking-tight mr-16 mt-16"
          >
            Login
          </Button>
        </Link>
        <div className="flex items-start mx-auto flex-col mt-32 gap-5">
          <div className="flex items-center flex-col">
            <h1 className="text-4xl font-mono font-extrabold">
              Create an account
            </h1>
            <h1 className="text-2xl font-mono font-normal">
              Enter your username below to create your account
            </h1>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <Label htmlFor="picture" className="text-xl">
                Avatar
              </Label>
              <Input
                id="picture"
                type="file"
                className="h-[3rem] w-[35vw] lg:w-[35vw] text-black dark:text-white "
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="Username" className="text-xl">
                Username
              </Label>
              <Input
                type="text"
                id="Username"
                placeholder="Username"
                className="h-[3rem] w-[35vw] lg:w-[35vw]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="Password" className="text-xl">
                Password
              </Label>
              <Input
                type="password"
                id="Password"
                placeholder="Password"
                className="h-[3rem] w-[35vw] lg:w-[35vw]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="bio" className="text-xl">
                Bio
              </Label>
              <Textarea
                type="text"
                id="bio"
                placeholder="Write something about yourself..."
                className="h-[3rem] w-[35vw] lg:w-[35vw]"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>
        </div>
        <Button
          className="flex items-start mx-auto mt-8 font-bold text-lg w-[35vw] lg:w-[35vw]"
          onClick={handleRegistration}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Register'}
        </Button>
      </div>
    </div>
  );
};

export default AuthPage;

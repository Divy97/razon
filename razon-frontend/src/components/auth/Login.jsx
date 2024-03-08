import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ChatState } from "@/context/ChatProvider";
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setToken, setUser } = ChatState();
  const handleRegistration = () => {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log(username, password);
    setLoading(true);
    let raw = JSON.stringify({
      username: username,
      password: password,
    });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://16.16.82.71:9000/api/v1/users/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setLoading(false);
        if (result.success) {
            localStorage.setItem("userinfo", JSON.stringify(result?.data?.user))
            localStorage.setItem("token", result?.data?.accessToken);
            setToken(result?.data.accessToken);
            setUser(result?.data);
          toast.success("Login Successful, Enjoy Razon", {
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
            navigate("/");
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
        <Link to="/auth" className="w-[100%] lg:w-[100%] flex justify-end">
          <Button
            variant="outline"
            className="scroll-m-20 text-2xl font-extrabold tracking-tight mr-16 mt-16"
          >
            Register
          </Button>
        </Link>
        <div className="flex items-center mx-auto flex-col mt-32 gap-5">
          <div className="flex items-center flex-col">
            <h1 className="text-4xl font-mono font-extrabold">Login</h1>
            <h1 className="text-2xl font-mono font-normal">
              Enter your username and password
            </h1>
          </div>
          <div className="flex flex-col gap-3 mt-10">
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
          </div>
        </div>
        <Button
          className={`flex items-start mx-auto mt-8 font-bold text-lg w-[35vw] lg:w-[35vw]`}
          onClick={handleRegistration}
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </Button>
      </div>
    </div>
  );
};

export default Login;

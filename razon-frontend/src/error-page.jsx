import { useRouteError } from "react-router-dom";
import Navigation from "./components/Navigation";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page" className="">
      <Navigation />
      <div className="flex flex-col items-center justify-center h-[90vh]">
        <h1 className="text-3xl font-mono font-extrabold">Oops!</h1>
        <p className="text-2xl mt-2 font-mono font-extrabold">
          Sorry, Page Not Found.
        </p>
      </div>
    </div>
  );
}

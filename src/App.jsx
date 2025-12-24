import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { useEffect, useState } from "react";
import Home from "./Pages/Home";
import Second from "./Pages/Second";
import Third from "./Pages/Third";
import Fourth from "./Pages/Fourth";
import Fifth from "./Pages/Fifth";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/*" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const Main = () => {
  const navigate = useNavigate();
  const [isCollapsed,setIsCollapsed] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  useEffect(() => {
    checkUser();
  }, []);

  const toggleCollapsed = () =>[
    setIsCollapsed(!isCollapsed)
  ]
  // const checkUser = async () => {
  //   const isLoggedIn = await apiService.isLoggedIn();
  //   console.log(isLoggedIn);
  //   if (!isLoggedIn) {
  //     navigate("/login");
  //   }
  //   setIsUserLoggedIn(true)
  // };
  const checkUser = () => {
    setIsUserLoggedIn(true);
  };
  return (
    <>
      <div className="w-full">
        {/* <Sidenav isCollapsed={isCollapsed} toggleCollapsed={toggleCollapsed} /> */}
        <Routes>
          <Route path="/1" element={<Home isCollapsed={isCollapsed}/>} />
          <Route path="/2" element={<Second isCollapsed={isCollapsed}/>} />
          <Route path="/3" element={<Third isCollapsed={isCollapsed}/>} />
          <Route path="/" element={<Fourth isCollapsed={isCollapsed}/>} />
          <Route path="/5" element={<Fifth isCollapsed={isCollapsed}/>} />
        </Routes>
      </div>
    </>
  );
};

export default App;

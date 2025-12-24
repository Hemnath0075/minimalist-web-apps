import React, { useState } from "react";
import UniLeverLogo from "../Assets/unilever.svg";
import HeroImage from "../Assets/login.png";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apiService } from "../Services/apiService";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit ,formState: { errors } } = useForm();
  const onSubmit = async(data) => {
    try{
      setIsLoading(true)
      // API LOGIC HERE
      console.log(data)
      const res = await apiService.login(data.email, data.password);
      console.log(res)
      if(res.status === 200){
        setIsLoading(false)
        navigate('/home');
      }
      else if (res.status === 401){
        setIsLoading(false)
        setInvalidCred(true)
        setTimeout(()=>{
          setInvalidCred(false)
        },3000)
      }
    }
    catch(err){
      // catch error from responsec
      console.log(err)
    }
  }


  const [invalidCreds,setInvalidCred]=useState(false);

  return (
    <div className="flex flex-row h-[100vh] w-[100vw] gap-8 bg-primary">
      {isLoading && <Spin
        // spinning={isLoading}
        size="large"
        indicator={
          <LoadingOutlined
            style={{
              fontSize: 34,
            }}
            spin
          />
        }
        className="spinning_indicator"
      />}
      <div className="basis-[30%]  flex flex-col bg-primary text-white ml-6 mt-8 mb-8">
        <div className="basis-[35%]">
          <img src={UniLeverLogo} alt="" />
        </div>
        <div className="basis-[50%]">
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-white text-4xl font-medium">
              Login to Continue
            </h2>
            <div className="mt-8 flex flex-col">
              <label htmlFor="" className="text-lg">
                Email
              </label>
              <input
                type="text"
                className="border-[#CDD5DF] border-[2px] py-4 px-4 rounded-[10px] text-lg mt-2 custom-input"
                placeholder="Enter your Email ID"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-[#DD0F0F]">This field is required</span>
              )}
            </div>
            <div className="mt-8 flex flex-col">
              <label htmlFor="" className="text-lg">
                Password
              </label>
              <input
                type="password"
                className="border-[#CDD5DF] border-[2px] py-4 px-4 rounded-[10px] text-lg mt-2 custom-input"
                placeholder="Enter your Password"
                {...register("password", { required: true, maxLength: 20 })}
              />
              {errors.password && (
                <span className="text-[#DD0F0F]">This field is required</span>
              )}
            </div>
            {invalidCreds && (
                <span className="text-[#DD0F0F] text-lg mt-4">Incorrect Credentials. Please try again</span>
            )}
            <div className="mt-8 flex flex-col">
              <input
                type="submit"
                value="Login"
                className=" py-4 px-4 rounded-[10px] text-lg mt-2 cursor-pointer bg-[#0F00D1] text-white"
                placeholder="Enter your Password"
              />
            </div>
          </form>
        </div>
      </div>
      <div className="basis-[65%] bg-secondary ml-4  mt-4 mb-4 rounded-[20px] flex flex-col justify-start pl-8 pt-8 pb-8 mr-4">
        <div className="ml-12">
          <h3 className="text-5xl text-[#ffffff] font-[600] leading-[57px]">
            Advanced Quality <br />
            Inspection Platform
          </h3>
        </div>
        <div className="ml-12 mt-8 overflow-hidden heroimage rounded-md border-t-[6px] border-b-[6px] border-l-[6px] border-primary">
          <img src={HeroImage} alt="" className="w-full"/>
        </div>
      </div>
    </div>
  );
}

export default Login;

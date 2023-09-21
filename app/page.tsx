"use client";
import { useState } from "react";
import { getPayment } from "./_broker";
import Toast from "./components/Toast";
import { useRouter, useSearchParams } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userType, setUserType] = useState("guest")
  const [actionFeedback, setActionFeedback] = useState({
    status: "", message: ""
  } as { status: string; message?: string, data?: Object });

  const [guestData, setGuestData] = useState({
    mbway_number: "",
    time: "",
  })

  const [hostData, setHostData] = useState({
    username: "",
    password: "",
  })

  const handleLogin = async () => { 

    if (userType === "guest") {
      const payment = await getPayment(guestData);

      if (payment.status !== "success") {
        setActionFeedback(payment);
        return;
      }

      router.push(`/tickets/${payment.data._id}` ?? "/");
      router.refresh();
    }

    if (userType === "host") {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(hostData),
      });
      const parsedResponse = await res.json();

      console.log(parsedResponse)

      if (parsedResponse.status === "success") {
        router.push("/host");
        router.refresh();
      } else {
        // Make your shiny error handling with a great user experience
        setActionFeedback(parsedResponse);
      }
    }
  }

  return (
    <div className="w-full max-w-screen min-h-screen bg-base-200 text-left p-8">
      <Toast actionFeedback={actionFeedback}/>
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="flex-col lg:flex-row-reverse -mt-72">
        <div className="text-center">
          <h1 className="text-5xl font-bold -mt-5">Bilheteira Online</h1>
          <p className="py-6"> - Insere os dados de pagamento abaixo - </p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            {userType === "guest" ? (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Número telefone</span>
                </label>
                <input placeholder="960123123" maxLength={9} className="input input-bordered"
                  onChange={(e) => setGuestData({
                    ...guestData, ...{
                      mbway_number: e.target.value
                    }
                  })}
                  />
                <label className="label">
                  <span className="label-text">Hora da transação</span>
                </label>
                <input type="text" placeholder="00:00" maxLength={5} className="input input-bordered" 
                  onChange={(e) => setGuestData({ ...guestData, ...{ time: e.target.value}})} 
                  />
                <label className="label">
                  <a onClick={() => setUserType("host")} className="label-text-alt link link-hover">És um host?</a>
                </label>
              </div>
            ):(
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Host</span>
                </label>
                <input type="text" placeholder="unicornio123" className="input input-bordered" 
                  onChange={(e) => setHostData({...hostData, ...{username: e.target.value}})}
                  />
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input type="password" placeholder="quack321" className="input input-bordered" 
                  onChange={(e) => setHostData({ ...hostData, ...{ password: e.target.value } })}
                  />
                <label className="label">
                  <a onClick={() => setUserType("guest")} className="label-text-alt link link-hover">És um guest?</a>
                </label>
              </div>
            )}
            <div className="form-control">
              <button className="btn btn-primary" onClick={() => handleLogin()}>Entrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Home
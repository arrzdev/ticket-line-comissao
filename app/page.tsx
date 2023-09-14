"use client";
import { useState } from "react";
import { createTodoAction } from "./_broker";

const Home = () => {

  const [userType, setUserType] = useState("guest")

  const GuestForm = () => (
    <>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Número telefone</span>
        </label>
        <input type="text" placeholder="960123123" className="input input-bordered" />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Hora da transação</span>
        </label>
        <input type="text" placeholder="00:00" className="input input-bordered" />
        <label className="label">
          <a onClick={() => setUserType("host")} className="label-text-alt link link-hover">És um host?</a>
        </label>
      </div>
    </>
  )
  const HostForm = () => (
    <>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Host</span>
        </label>
        <input type="text" placeholder="unicornio123" className="input input-bordered" />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input type="password" placeholder="quack321" className="input input-bordered" />
        <label className="label">
          <a onClick={() => setUserType("guest")} className="label-text-alt link link-hover">És um guest?</a>
        </label>
      </div>
    </>
  )

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Ticket Line</h1>
          <p className="py-6"> - Insere os dados de pagamento abaixo - </p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            {userType === "guest" && <GuestForm/>}
            {userType === "host" && <HostForm/>}
            <div className="form-control mt-6">
              <button className="btn btn-primary">Entrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
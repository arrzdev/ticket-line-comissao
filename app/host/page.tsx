"use client";
import { useEffect, useState } from "react";
import { QrReader } from 'react-qr-reader';
import Toast from "../components/Toast";
import { registerPayment, getPayments, getEventInfo, changeTicketsVisibility, validateTicket, updateEvent } from "../_broker";
import type { EventInterface, PaymentInterface } from "../types";
import { set } from "mongoose";

const Host = () => {
  const [data, setData] = useState('No result');

  //stores the feedback of the last action
  const  [actionFeedback, setActionFeedback] = useState({
    status: "", message: ""
  } as {status: string; message?: string, data?: Object} )

  //stores the new payment to be created
  const [newPayment, setNewPayment] = useState({
    mbway_number: "",
    time: "",
    amount: ""
  });

  const [payments, setPayments] = useState([] as PaymentInterface[]);
  const [eventInfo, setEventInfo] = useState({} as EventInterface);
  const [loadingPage, setloadingPage] = useState(true);
  const [qrOpen, setQrOpen] = useState(false);

  //fetch initial data
  useEffect(() =>{
    (async () => {
      //fetch event info
      const eventInfo = await getEventInfo();
      if (eventInfo.status != "success") {
        setActionFeedback(eventInfo);
        return;
      }
      
      //fetch payments
      const payments = await getPayments();
      if (payments.status != "success") {
        setActionFeedback(payments);
        return;
      }
  
      setPayments(payments.data);
      setEventInfo(eventInfo.data);
      
      setloadingPage(false);
    })();
  }, []);

  const addPayment = async () => {
    const result = await registerPayment(newPayment);
    setActionFeedback(result);
    if (result.status === "success") {
      setPayments([...payments, newPayment as PaymentInterface]);
    }
  }

  const updateEventInfo = async () => {
    console.log(eventInfo);
    const result = await updateEvent(eventInfo);
    setActionFeedback(result);
  }

  const toggleTickets = async () => {
    const result = await changeTicketsVisibility(eventInfo.tickets_delivered);

    setActionFeedback(result);
    if (result.status === "success") {
      setEventInfo({...eventInfo, ...{
        tickets_delivered: !eventInfo.tickets_delivered
      }})
    }
  }
  
  const handleQReader = async (result: any, error: any) => {
    if (error){console.info(error);}
    if (result && result?.text) {
      //if result is not a mongo_id return
      if (result?.text.length != 24) {
        setActionFeedback({status: "warning", message: "O código lido não é um bilhete válido"});
        return;
      }

      const validTicket = await validateTicket(result?.text);
      setActionFeedback(validTicket);

      if (validTicket.status != "success") {
        return;
      }
      
      //if ticket is valid, close the modal
      setQrOpen(false);
    }
  }

  //handle modal based on qrOpen state
  useEffect(() => {
    if (qrOpen) {
      // @ts-ignore
      document.getElementById('qr_modal')?.showModal();
    } else {
      // @ts-ignore
      document.getElementById('qr_modal')?.close();
    }
  }, [qrOpen])

  return (
    <div className="w-full max-w-screen min-h-screen bg-base-200 text-left p-8">
      <Toast actionFeedback={actionFeedback}/>
      {/* QR CODE READER MODAL */}
      <dialog id="qr_modal" className="modal">
        <div className="modal-box h-min text-center">
          <h3 className="font-bold text-lg">Validar bilhete</h3>
            {/* show the qrreader component only ig the modal is open */}
            {qrOpen && (
              <QrReader
              constraints={{ facingMode: 'environment' }}
              scanDelay={500}
              onResult={(result, error) => handleQReader(result, error)}
              // @ts-ignore
              style={{ width: '100%' }}
              />
            )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setQrOpen(false)}>close</button>
        </form>
      </dialog>
        
      <div className="space-y-16">
        {/* EVENT MANAGMENT SECTION */}
        <div className="space-y-2">
        <h1 className="text-4xl font-bold pb-2">Gestão do Evento</h1>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nome do Evento</span>
            </label>
            <input defaultValue={eventInfo.name} className="input input-bordered"
              onChange={(e) => setEventInfo({ ...eventInfo, ...{ name: e.target.value } })}/>
            <label className="label">
              <span className="label-text">Data do Evento</span>
            </label>
            <input type="text" maxLength={10} defaultValue={eventInfo.date} className="input input-bordered" 
              onChange={(e) => setEventInfo({...eventInfo, ...{date: e.target.value}})}/>
            <label className="label">
              <span className="label-text">Hora do Evento</span>
            </label>
            <input type="text" maxLength={5} defaultValue={eventInfo.time} className="input input-bordered"
              onChange={(e) => setEventInfo({ ...eventInfo, ...{time: e.target.value}})}/>
            <label className="label">
              <span className="label-text">Preço do bilhete</span>
            </label>
            <input type="text" defaultValue={String(eventInfo.price)}  className="input input-bordered mb-4"
              onChange={(e) => setEventInfo({ ...eventInfo, ...{price: e.target.value}})}/>
          </div>
          <button className="btn btn-outline w-full" onClick={() => updateEventInfo()}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Atualizar Informações
          </button>
          <button className="btn btn-outline w-full" onClick={() => toggleTickets()}>
            {eventInfo.tickets_delivered ? 
              (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
                Esconder Bilhetes
              </>):(
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Mostrar Bilhetes
              </>)}
          </button>
          <button className="btn btn-outline w-full" onClick={() => {setQrOpen(true)}}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="gray" viewBox="0 0 448 512" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M0 80C0 53.5 21.5 32 48 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80zM64 96v64h64V96H64zM0 336c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336zm64 16v64h64V352H64zM304 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H304c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48zm80 64H320v64h64V96zM256 304c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s7.2-16 16-16s16 7.2 16 16v96c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s-7.2-16-16-16s-16 7.2-16 16v64c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V304zM368 480a16 16 0 1 1 0-32 16 16 0 1 1 0 32zm64 0a16 16 0 1 1 0-32 16 16 0 1 1 0 32z" /></svg>
            Ler Bilhete
          </button>
        </div>

        {/* ADD PAYMENT SECTION */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold pb-2">Adicionar Pagamento</h1>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Número de telefone</span>
            </label>
            <input placeholder="960123123" maxLength={9} className="input input-bordered" 
              onChange={(e) => setNewPayment({...newPayment, ...{
                mbway_number: e.target.value
              }})}
            />
            <label className="label">
              <span className="label-text">Hora da transferencia</span>
            </label>
            <input type="text" maxLength={5} placeholder="00:00" className="input input-bordered"
              onChange={(e) => setNewPayment({...newPayment, ...{
                  time: e.target.value
                }
              })}
            />
            <label className="label">
              <span className="label-text">Valor</span>
            </label>
            <input type="text" placeholder="3.5" className="input input-bordered mb-4"
              onChange={(e) => setNewPayment({
                ...newPayment, ...{
                  amount: e.target.value
                }
              })}
            />
            
          </div>
          <button className="btn btn-outline w-full" onClick={() => addPayment()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            Adicionar
          </button>
        </div>

        {/* PAYMENT LIST SECTION */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold pb-2">Lista de pagamentos</h1>
          <div className="overflow-x-auto p-1">
            <table className="table table-xs pt-1">
              <thead>
                <tr>
                  <th></th>
                  <th>Telefone</th>
                  <th>Hora</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody> 
                {/* tailwind pulse class */}
                {loadingPage ? Array.from({ length: 5 }, (_, index) => (
                <tr key={index} className="animate-pulse">
                  <th><div className="rounded-full bg-slate-700 h-2 w-2"></div></th>
                  <td><div className="h-2 bg-slate-700 rounded w-16"></div></td>
                  <td><div className="h-2 bg-slate-700 rounded w-8"></div></td>
                  <td><div className="h-2 bg-slate-700 rounded w-4"></div></td>
                </tr>)):
                  [...payments].reverse().map((payment, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{payment.mbway_number}</td>
                      <td>{payment.time}</td>
                      <td>{payment.amount}</td>
                    </tr>
                  ))
                }
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th>Telefone</th>
                  <th>Hora</th>
                  <th>Valor</th>
                </tr>
              </tfoot>
            </table>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Host
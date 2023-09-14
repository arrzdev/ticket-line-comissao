"use client";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { getTickets } from "../_broker";
import { TicketInterface } from "../types";
import Toast from "../components/Toast";

const Tickets = ({ searchParams }: {searchParams: any}) => {
  const {mbway_number, time} = searchParams; //destructure searchParams

  const [loadingPage, setloadingPage] = useState(true);

  const [tickets, setTickets] = useState([] as any[]);

  //stores the feedback of the last action
  const [actionFeedback, setActionFeedback] = useState({
    status: "", message: ""
  } as { status: string; message?: string, data?: Object });


  //fetch tickets and event info
  useEffect(() => {
    (async () => {
      const userTickets = await getTickets({ mbway_number, time });
  
      if (userTickets.status != "success") {
        setActionFeedback(userTickets);
        return;
      }

      console.log("tickets got", userTickets.data)
      setTickets(userTickets.data);
    })();

  }, [mbway_number, time]);

  console.log(searchParams)

  return (
    <div className="w-full max-w-screen min-h-screen bg-base-200 text-left p-8">
      <Toast actionFeedback={actionFeedback} />
      <div className="space-y-2">
      <h1 className="text-4xl font-bold pb-2">Bilhetes</h1>
      {tickets.map((ticket, index) => (
        <div key={index} className="form-control w-full flex-auto bg-white rounded-xl items-center h-full p-8" >
          <QRCode value={ticket._id} size={250}/>
          {ticket.used && <p className="text-center text-2xl font-bold text-black">Bilhete já utilizado</p>}
        </div>
      ))}
      </div>
    </div>
  )
}

export default Tickets;
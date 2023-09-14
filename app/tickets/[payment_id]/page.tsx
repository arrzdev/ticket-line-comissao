"use client";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { getEventInfo, getPayment, getTickets } from "../../_broker";
import Toast from "../../components/Toast";

const Tickets = ({ params }: { params: { payment_id: string } }) => {
  const [loadingPage, setloadingPage] = useState(true);

  const [tickets, setTickets] = useState([] as any[]);
  const [eventInfo, setEventInfo] = useState({} as any);

  //stores the feedback of the last action
  const [actionFeedback, setActionFeedback] = useState({
    status: "", message: ""
  } as { status: string; message?: string, data?: Object });


  //fetch tickets and event info
  useEffect(() => {
    (async () => {
      //fetch event info
      const eventInfo = await getEventInfo();
      setEventInfo(eventInfo.data);

      if (eventInfo.status !== "success") {
        setActionFeedback(eventInfo);
        return;
      }
      
      try {
        var tickets = await getTickets({ payment_id: params.payment_id });
      } catch (error) {
        setActionFeedback({ status: "error", message: "Id de pagamento inválido"});  
        return;
      }

      if (tickets.status !== "success") {
        setActionFeedback(tickets);
        return;
      }

      setTickets(tickets.data);
      setloadingPage(false);
    })();
  }, [params.payment_id]);

  return (
    <div className="w-full max-w-screen min-h-screen bg-base-200 text-center p-8">
      <Toast actionFeedback={actionFeedback} />
      <div className="space-y-2">
        <h1 className="text-6xl font-bold pb-4">Bilhetes</h1>
        <div className="space-y-8">
          {loadingPage && Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="form-control w-full flex-auto bg-gray-800 rounded-xl items-center h-96"></div>
          </div>)) 
          }
          {tickets.map((ticket, index) => (
            <div key={index} className="form-control w-full flex-auto bg-gray-800 rounded-xl items-center h-full p-10 space-y-2">
              <h1 className="text-xl font-bold">{eventInfo.name}</h1>
              <h2 className="text-md font-bold ">{`${eventInfo.time} // ${eventInfo.date}`}</h2>
              <QRCode value={ticket._id} size={300} className="border-white border-4"/>
              <p className="text-center text-sm font-bold">{ticket._id}</p>
              {ticket.used && <p className="text-center text-xl font-bold text-red-500">Bilhete já validado</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Tickets;
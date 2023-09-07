"use client";
import { useState } from "react";
import QRCode from "react-qr-code";
const Tickets = () => {
  //fetch tickets from api
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-base-200 text-center p-8">
      <h1 className="text-4xl font-bold mb-8">Bilhetes</h1>
      <div className="w-full h-ful flex items-center justify-center">
        {isOpen ? (
          <div className="carousel max-w-md p-4 space-x-4 bg-neutral rounded-box w-full h-max">
            {Array.from({ length: 20 }, (v, i) => (
              <div className="flex-auto border-red pl-8 w-96" key={i}>
                <QRCode value={`key${i}`} size={150} />
                <h2 className="text-lg pt-4">Bilhete {i}</h2>
              </div>
            ))}
          </div>
        ) : (
          <h1 className="text-2xl">O organizador do evento ainda não disponibilizou os bilhetes, volte mais tarde.</h1>
        )}
      </div>
    </div>
  )
}

export default Tickets;
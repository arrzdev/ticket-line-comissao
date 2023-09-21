"use server";

import connectDB from "./lib/connect-db";

import Payment from "./models/Payment"
import Ticket from "./models/Ticket"
import Event from "./models/Event"

import type { PaymentInterface, TicketInterface, EventInterface } from "./types";


// import { revalidatePath } from "next/cache";


//the action bellow will be called from the client and runned on the server
//revalidatePath will revalidate the path on the server and client so that we can abuse the cache

export async function registerPayment({mbway_number, time, amount}: PaymentInterface){
  //validate parameters
  if (!mbway_number || !time || !amount){
    return {
      status: "warning",
      message: "Parámetros de pagamento em falta"
    }
  }

  //mbway_number should be 9 digits
  if(mbway_number.length !== 9){
    return {
      status: "warning",
      message: "Número de telemóvel inválido"
    }
  }

  //amount should be a number
  const nAmount = parseInt(amount)
  if(!nAmount){
    return {
      status: "warning",
      message: "Valor inválido"
    }
  }

  //time should be in format HH:MM and HH should be between 00 and 23 and MM should be between 00 and 59
  const timeRegex = new RegExp("^([0-9]|0[0-9]|1[0-9]|2[0-3])?(:([0-5]|[0-5][0-9])?)?$");
  if(!timeRegex.test(time)){
    return {
      status: "warning",
      message: "Hora inválida"
    }
  }
  
  //create connection with database
  await connectDB();

  //get event info
  const event = await Event.findOne();
  if(!event){
    return {
      status: "warning",
      message: "Evento não encontrado"
    }
  }

  //calculate number of tickets
  const numTickets = Math.floor(nAmount/event.price);
  if (numTickets <= 0){
    return {
      status: "warning",
      message: `Valor insuficiente, o custo de cada bilhete é ${event.price}€`
    }
  }

  //generate the tickets
  const tickets = [];
  for(let i = 0; i < numTickets; i++){
    //insert ticket into db
    const ticket = new Ticket({
      mbway_number,
      used: false,
      read_on: null
    });

    tickets.push(ticket);
  }

  //insert payment into db
  const savedPayment = await Payment.create({
    mbway_number,
    time,
    amount
  });

  if (!savedPayment){
    return {
      status: "error",
      message: "Erro ao registar pagamento"
    }
  }

  //if payment saved successfully, save tickets
  let nCreatedTickets = 0;
  for (let i = 0; i < tickets.length; i++){
    const savedTicket = await tickets[i].save();
    if(savedTicket){
      nCreatedTickets++;
    }
  }

  return {
    status: "success",
    message: `Pagamento registado com sucesso. Foram gerados ${nCreatedTickets}/${tickets.length} bilhetes`,
    
  }
}


export async function getPayments(){
  //create connection with database
  await connectDB();

  //get all payments
  const payments = await Payment.find();

  if (!payments){
    return {
      status: "error",
      message: "Erro ao obter pagamentos"
    }
  }

  return {
    status: "success",
    data: await JSON.parse(JSON.stringify(payments))
  }
}

export async function getEventInfo(){
  //create connection with database
  await connectDB();

  //get event info
  const event = await Event.findOne();

  if (!event){
    return {
      status: "error",
      message: "Erro ao obter evento"
    }
  }

  return {
    status: "success",
    data: await JSON.parse(JSON.stringify(event))
  }
}

export async function getTickets({payment_id}: {payment_id: string}){
  //create connection with database
  await connectDB();

  //check if there is a payment with the given mbway_number and time
  const payment = await Payment.findOne({_id: payment_id});

  if (!payment){
    return {
      status: "error",
      message: `Não foram encontrados bilhetes com o id de pagamento: ${payment_id}`,
      redirect: "/"
    }
  }

  //check if ticket were already delivered
  const event = await Event.findOne();
  if(!event){
    return {
      status: "error",
      message: "Evento não encontrado",
      redirect: "/"
    }
  }

  if(event.tickets_delivered === false){
    return {
      status: "warning",
      message: "Os bilhetes ainda não foram entregues pelo host, volta mais tarde",
      persist: true
    }
  }

  //get tickets based on mbway_number and time
  const tickets = await Ticket.find({mbway_number: payment.mbway_number});

  if (!tickets){
    return {
      status: "error",
      message: "Erro ao obter bilhetes",
      persist: true
    }
  }

  return {
    status: "success",
    data: await JSON.parse(JSON.stringify(tickets))
  }
}

export async function getPayment({mbway_number, time}: {mbway_number: string, time: string}){
  //create connection with database
  await connectDB();

  //verify parameters
  if (!mbway_number || !time){
    return {
      status: "error",
      message: "Introduza corretamente os dados de pagamento"
    }
  }

  //check if there is a payment with the given mbway_number and time
  const payment = await Payment.findOne({mbway_number, time});

  if (!payment){
    return {
      status: "error",
      message: "Não foi encontrado um pagamento com os dados fornecidos. Confirme os dados de pagamento ou aguarde que o host do evento valide o pagamento",
      persist: true
    }
  }

  return {
    status: "success",
    data: await JSON.parse(JSON.stringify(payment))
  }
}

export async function changeTicketsVisibility(tickets_delivered: boolean){
  //create connection with database
  await connectDB();
  
  //change event.ticket_delivered
  const event = await Event.findOneAndUpdate({}, {tickets_delivered: !tickets_delivered});

  if (!event){
    return {
      status: "error",
      message: "Erro ao atualizar evento"
    }
  }

  return {
    status: "success",
    message: tickets_delivered ? "Os bilhetes foram escondidos" : "Os bilhetes estão agora visíveis"
  }
}

export async function validateTicket(id: string){
  //create connection with database
  await connectDB();

  //validate id
  const ticket = await Ticket.findById(id);
  if(!ticket){
    return {
      status: "error",
      message: "Bilhete não encontrado"
    }
  }

  //validate if ticket is already used
  if(ticket.used){
    return {
      status: "warning",
      message: `Bilhete já utilizado: ${ticket._id}`
    }
  }

  //update ticket
  const updatedTicket = await Ticket.findByIdAndUpdate(id, {used: true, read_on: new Date()});

  if (!updatedTicket){
    return {
      status: "warning",
      message: "Erro ao validar bilhete, tente novamente"
    }
  }

  return {
    status: "success",
    message: `Bilhete validado com sucesso: ${id}`
  }
}

export async function updateEvent({name, date, time, price}: {name:string, date:string, time:string, price:string}){
  //create connection with database
  await connectDB();

  //validate parameters
  if (!name || !date || !time || !price){
    return {
      status: "warning",
      message: "Parâmetros em falta"
    }
  }

  //validate date
  const dateRegex = new RegExp("^(0[1-9]|[12][0-9]|3[01])[-](0[1-9]|1[012])[-](20[0-9][0-9])$");

  if(!dateRegex.test(date)){
    return {
      status: "warning",
      message: "Data inválida"
    }
  }

  //validate time
  const timeRegex = new RegExp("^([0-9]|0[0-9]|1[0-9]|2[0-3])?(:([0-5]|[0-5][0-9])?)?$");
  if(!timeRegex.test(time)){
    return {
      status: "warning",
      message: "Hora inválida"
    }
  }

  //validate price
  const nPrice = parseInt(price)
  if(!nPrice){
    return {
      status: "warning",
      message: "Preço inválido"
    }
  }

  //update event
  const event = await Event.findOneAndUpdate({}, {name, date, time, price: nPrice});

  if (!event){
    return {
      status: "error",
      message: "Erro ao atualizar evento"
    }
  }

  return {
    status: "success",
    message: "Informações do evento atualizadas com sucesso",
    data: event
  }
}
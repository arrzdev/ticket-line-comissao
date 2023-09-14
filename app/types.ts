//interfaces
export interface PaymentInterface {
  mbway_number: string, //owner of the ticket
  time: string,
  amount: string
}

export interface TicketInterface {
  mbway_number: string, //owner of the ticket
  used: boolean,
  read_on: Date
}

export interface EventInterface {
  name: string,
  date: string,
  time: string,
  location: string,
  price: number,
  tickets_delivered: boolean
}
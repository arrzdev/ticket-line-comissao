import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Payment from "./app/models/Payment"

export async function GET(request: NextRequest) {
  
  const mongo_uri = process.env.MONGO_URI || "";  
  let client;

  try {
    client = await mongoose.connect(mongo_uri);
    console.log("DB connected");
  } catch (error) {
    console.log("There was an error connection to the DB", error);
  }

  Payment.create({telephone: "123456789", date: "2021-10-10", time: "10:00", quantity: 2});

  // const body = await request.json();
  //fetch from the server the event information to handle the amount of tickets that should be created


  //create a payment entry in the database
  // const { telephone, date, time, quantity } = await request.body.json();
  return NextResponse.json({ message: "Payment created" });
}

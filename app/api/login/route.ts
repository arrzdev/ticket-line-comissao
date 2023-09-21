import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { getJwtSecretKey } from "@/app/lib/auth";
import connectDB from "@/app/lib/connect-db";

import Host from "@/app/models/Host"


export async function POST(request: NextRequest) {
  const {username, password} = await request.json();

  if (!username || !password){
    return {
      status: "warning",
      message: "Credenciais em falta!"
    }
  }

  await connectDB(); //connect db

  const host = await Host.findOne({
    username,
    password
  })

  // Make that below if condition as your own backend api call to validate user
  if (host) {
    const token = await new SignJWT({
      username,
      role: "host",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()  
      .setExpirationTime("3600s")
      .sign(getJwtSecretKey());

    const response = NextResponse.json(
      { status: "success" },
      { status: 200, headers: { "content-type": "application/json" } }
    );

    response.cookies.set({
      name: "t",
      value: token,
      path: "/",
    });

    return response;
  }

  return NextResponse.json({ status: "error", message: "As credenciais estão erradas!"});
}

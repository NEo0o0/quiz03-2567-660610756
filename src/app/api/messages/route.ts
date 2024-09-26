import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { Database,Payload } from "@lib/type";

export const GET = async (request: NextRequest) => {
  readDB();
  const roomId = request.nextUrl.searchParams.get("roomId");
  let filtered = (<Database>DB).rooms;
  if (roomId !== null) {
    filtered = filtered.filter((std) => std.roomId === roomId);
  }
  if(roomId === null) {
    return NextResponse.json(
     {
        ok: false,
        message: `Room is not found`,
     },
     { status: 404 }
   );
  }else{
    return NextResponse.json(
      {
         ok: true,
         message:filtered ,
      },{status:200});
  }
  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: `Room is not found`,
  //   },
  //   { status: 404 }
  // );
};

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const { db } = body;
  const roomId = db.roomId;
  const messageText = db.messageText;

  const foundRoom =  (<Database>DB).rooms.find(roomId);
  if(!foundRoom) {
   return NextResponse.json(
     {
       ok: false,
       message: `Room is not found`,
     },
     { status: 404 }
   );}

  const messageId = nanoid();
  if(foundRoom) {
    (<Database>DB).messages.push({ roomId,messageId, messageText });
  }

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId:messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  let role = null;
  try {
    const payload = checkToken();
    role = (<Payload>payload).role;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  
  if(role !== "SUPER_ADMIN"){
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  
  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Invalid token",
  //   },
  //   { status: 401 }
  // );
  const body = await request.json();
  const { messageId } = body;
  readDB();
  const foundMessage =  (<Database>DB).messages.findIndex(messageId);
  if(foundMessage === -1){
     return NextResponse.json(
     {
       ok: false,
       message: "Message is not found",
     },
     { status: 404 }
   );
  }
  (<Database>DB).messages.splice(foundMessage, 1);

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Message is not found",
  //   },
  //   { status: 404 }
  // );

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};

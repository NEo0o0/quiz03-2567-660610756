import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { Database,Payload } from "@lib/type";

export const GET = async () => {
  readDB();
  let dbs=(<Database>DB).rooms;
  

  return NextResponse.json({
    ok: true,
    rooms:dbs,
    totalRooms:dbs.length,
  });
};

export const POST = async (request: NextRequest) => {
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
   
  readDB();
 
  const body = await request.json();
  const { roomName } = body;
  const duplename = (<Database>DB).rooms.find((x) => x.roomName === roomName);
  if(duplename){
     return NextResponse.json(
     {
      ok: false,
       message: `Room ${"replace this with room name"} already exists`,
     },
     { status: 400 }
   );
  }
  
  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: `Room ${"replace this with room name"} already exists`,
  //   },
  //   { status: 400 }
  // );
  
  const roomId = nanoid();
  if(role === "ADMIN" || role === "SUPER_ADMIN"){
    (<Database>DB).rooms.push({
      roomName,
      roomId,
    });
    writeDB();

    return NextResponse.json({
      ok: true,
      //roomId,
      message: `Room ${roomName} has been created`,
    });
  }

  //call writeDB after modifying Database
 
};

import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Nathdanai Thipdonjun",
    studentId: "660610756",
  });
};

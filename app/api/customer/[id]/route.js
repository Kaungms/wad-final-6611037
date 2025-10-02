import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";

// GET /api/customer/[id] - Read specific customer
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const customer = await Customer.findById(params.id);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

// PUT /api/customer/[id] - Update customer
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const customer = await Customer.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

// DELETE /api/customer/[id] - Delete customer
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const customer = await Customer.findByIdAndDelete(params.id);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
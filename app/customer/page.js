"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";

export default function CustomerPage() {

  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { 
      field: 'dateOfBirth', 
      headerName: 'Date of Birth', 
      width: 150,
      renderCell: (params) => {
        return new Date(params.value).toLocaleDateString();
      }
    },
    { field: 'memberNumber', headerName: 'Member Number', width: 150 },
    { field: 'interests', headerName: 'Interests', width: 200 },
    {
      field: 'Action', headerName: 'Action', width: 150,
      renderCell: (params) => {
        return (
          <div>
            <button onClick={() => startEditMode(params.row)}>📝</button>
            <button onClick={() => deleteCustomer(params.row)}>🗑️</button>
            <Link href={`/customer/${params.row._id}`}>
              <button>👁️</button>
            </Link>
          </div>
        )
      }
    },
  ]

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

  const [customerList, setCustomerList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  async function fetchCustomers() {
    const data = await fetch(`${API_BASE}/api/customer`);
    const customers = await data.json();
    const customersWithId = customers.map((customer) => {
      return {
        ...customer,
        id: customer._id
      }
    })
    setCustomerList(customersWithId);
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function handleCustomerFormSubmit(data) {
    if (editMode) {
      // Updating a customer
      await fetch(`${API_BASE}/api/customer/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      stopEditMode();
      fetchCustomers();
      return;
    }

    // Creating a new customer
    await fetch(`${API_BASE}/api/customer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    fetchCustomers();
    reset();
  }

  function startEditMode(customer) {
    // Format date for input field
    const formattedCustomer = {
      ...customer,
      dateOfBirth: new Date(customer.dateOfBirth).toISOString().split('T')[0]
    };
    reset(formattedCustomer);
    setEditMode(true);
  }

  function stopEditMode() {
    reset({
      name: '',
      dateOfBirth: '',
      memberNumber: '',
      interests: ''
    })
    setEditMode(false)
  }

  async function deleteCustomer(customer) {
    if (!confirm(`Are you sure you want to delete customer [${customer.name}]?`)) return;

    const id = customer._id
    await fetch(`${API_BASE}/api/customer/${id}`, {
      method: "DELETE"
    })
    fetchCustomers()
  }

  return (
    <main>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
        
        <form onSubmit={handleSubmit(handleCustomerFormSubmit)}>
          <div className="grid grid-cols-2 gap-4 w-fit m-4 border border-gray-800 p-4 rounded">
            <div>Customer Name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter customer name"
              />
            </div>

            <div>Date of Birth:</div>
            <div>
              <input
                name="dateOfBirth"
                type="date"
                {...register("dateOfBirth", { required: true })}
                className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>

            <div>Member Number:</div>
            <div>
              <input
                name="memberNumber"
                type="number"
                {...register("memberNumber", { required: true })}
                className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Enter member number"
              />
            </div>

            <div>Interests:</div>
            <div>
              <input
                name="interests"
                type="text"
                {...register("interests", { required: true })}
                className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="e.g. movies, football, gym, gaming"
              />
            </div>

            <div className="col-span-2 text-right">
              {editMode ?
                <>
                  <input
                    type="submit"
                    className="italic bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                    value="Update" />
                  <button
                    type="button"
                    onClick={() => stopEditMode()}
                    className="italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                  >Cancel
                  </button>
                </>
                :
                <input
                  type="submit"
                  value="Add Customer"
                  className="italic bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                />
              }
            </div>
          </div>
        </form>

        <div className="mx-4">
          <h2 className="text-xl font-semibold mb-2">All Customers ({customerList.length})</h2>
          <DataGrid
            rows={customerList}
            columns={columns}
            pageSize={10}
            disableRowSelectionOnClick
            autoHeight
          />
        </div>
      </div>
    </main>
  );
}
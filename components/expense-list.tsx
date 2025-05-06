"use client";

export const ExpenseList = () => {
  const mockExpenses = [
    {
      id: 1,
      merchant_name: "Amazon",
      amount: 0.5
    },
    {
      id: 2,
      merchant_name: "Starbucks",
      amount: 0.1
    },
    {
      id: 3,
      merchant_name: "Uber",
      amount: 0.3
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 pb-3 border-b border-gray-200 text-gray-800">Expense Management</h2>
      
      {/* Search Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium text-gray-700">Search Expense ID</label>
          <input 
            type="number" 
            placeholder="Enter expense ID to search" 
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            disabled
          />
        </div>
        <div className="flex items-end gap-2 mt-2 md:mt-0">
          <button 
            type="button" 
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 focus:ring-2 focus:ring-blue-300 shadow-sm"
            disabled
          >
            Search
          </button>
          <button 
            type="button" 
            className="bg-gray-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-gray-700 transition-all disabled:opacity-50 focus:ring-2 focus:ring-gray-300 shadow-sm"
            disabled
          >
            Refresh All
          </button>
        </div>
      </div>
      
      {/* Expenses List */}
      <div className="mt-6 rounded-lg border border-gray-200 overflow-hidden">
        {mockExpenses.length > 0 ? (
          <div>
            {/* List Header */}
            <div className="bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 border-b border-gray-200 grid grid-cols-12">
              <div className="col-span-5">Merchant</div>
              <div className="col-span-3">ID</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            
            {/* List Items */}
            {mockExpenses.map((expense) => (
              <div 
                key={expense.id} 
                className="grid grid-cols-12 items-center px-4 py-3 border-b border-gray-200 hover:bg-gray-50 transition-all"
              >
                <div className="col-span-5 font-medium text-gray-800">{expense.merchant_name}</div>
                <div className="col-span-3 text-gray-600">#{expense.id}</div>
                <div className="col-span-2 text-right font-medium text-red-600">{expense.amount} SOL</div>
                <div className="col-span-2 flex justify-end gap-2">
                  <button 
                    className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-sm font-medium hover:bg-blue-200 transition-all disabled:opacity-50"
                    disabled
                  >
                    Edit
                  </button>
                  <button 
                    className="bg-red-100 text-red-700 px-2.5 py-1 rounded-md text-sm font-medium hover:bg-red-200 transition-all disabled:opacity-50"
                    disabled
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No expenses found</div>
        )}
      </div>
    </div>
  );
}; 
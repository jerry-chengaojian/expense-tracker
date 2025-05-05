export default function Home() {
  return (
    <div className="px-4 sm:px-8 py-8">
      <div className="container">
        <header className="bg-gradient-to-r from-purple-600 to-red-600 text-white py-5 text-center rounded-lg shadow-md mb-8">
          <h1 className="text-4xl mb-2">Expense Tracker</h1>
          <p className="text-lg opacity-80">Solana Blockchain-based Expense Management System</p>
        </header>
        
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex justify-between items-center">
          <div>
            <p>Wallet Status: <span>Not Connected</span></p>
            <p className="text-gray-600 text-sm break-all">Wallet Address: Please connect wallet</p>
          </div>
          <button className="bg-blue-500 text-white px-5 py-2 rounded font-bold hover:bg-blue-700 transition-all">Connect Wallet</button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl mb-5 pb-2 border-b border-gray-200">Add New Expense</h2>
          <form>
            <div className="mb-5">
              <label className="block mb-2 font-bold text-gray-600">Expense ID</label>
              <input type="number" placeholder="Enter expense ID" className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"/>
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-bold text-gray-600">Merchant Name</label>
              <input type="text" placeholder="Enter merchant name" className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"/>
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-bold text-gray-600">Amount (SOL)</label>
              <input type="number" placeholder="Enter amount" className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"/>
            </div>
            <div className="flex gap-3">
              <button type="button" className="bg-blue-500 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition-all">Create Expense</button>
            </div>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl mb-5 pb-2 border-b border-gray-200">Expense Management</h2>
          <div className="mb-5">
            <label className="block mb-2 font-bold text-gray-600">Search Expense ID</label>
            <input type="number" placeholder="Enter expense ID to search" className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"/>
          </div>
          <div className="flex gap-3 mb-5">
            <button type="button" className="bg-blue-500 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition-all">Search</button>
          </div>
          
          <div className="mt-5">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-all">
              <div className="flex-1">
                <div className="font-bold text-lg">Coffee Shop</div>
                <div>ID: 1001</div>
              </div>
              <div className="text-red-500 text-xl font-bold">0.05 SOL</div>
              <div className="flex gap-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold">Edit</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">Delete</button>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-all">
              <div className="flex-1">
                <div className="font-bold text-lg">Supermarket</div>
                <div>ID: 1002</div>
              </div>
              <div className="text-red-500 text-xl font-bold">0.25 SOL</div>
              <div className="flex gap-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold">Edit</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">Delete</button>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-all">
              <div className="flex-1">
                <div className="font-bold text-lg">Restaurant</div>
                <div>ID: 1003</div>
              </div>
              <div className="text-red-500 text-xl font-bold">0.15 SOL</div>
              <div className="flex gap-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold">Edit</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold">Delete</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl mb-5 pb-2 border-b border-gray-200">Edit Expense</h2>
          <form>
            <div className="mb-5">
              <label className="block mb-2 font-bold text-gray-600">Expense ID</label>
              <input type="number" placeholder="Enter expense ID to edit" className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"/>
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-bold text-gray-600">Merchant Name</label>
              <input type="text" placeholder="Enter new merchant name" className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"/>
            </div>
            <div className="mb-5">
              <label className="block mb-2 font-bold text-gray-600">Amount (SOL)</label>
              <input type="number" placeholder="Enter new amount" className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"/>
            </div>
            <div className="flex gap-3">
              <button type="button" className="bg-blue-500 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition-all">Update Expense</button>
            </div>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl mb-5 pb-2 border-b border-gray-200">Delete Expense</h2>
          <form>
            <div className="mb-5">
              <label className="block mb-2 font-bold text-gray-600">Expense ID</label>
              <input type="number" placeholder="Enter expense ID to delete" className="w-full p-3 border border-gray-300 rounded focus:border-blue-500 outline-none"/>
            </div>
            <div className="flex gap-3">
              <button type="button" className="bg-red-500 text-white px-6 py-3 rounded font-bold hover:bg-red-700 transition-all">Delete Expense</button>
            </div>
          </form>
        </div>
        
        <footer className="text-center mt-12 py-5 text-gray-500 text-sm">
          <p>Expense Tracker &copy; 2023 | Powered by Solana Blockchain</p>
        </footer>
      </div>
    </div>
  );
}

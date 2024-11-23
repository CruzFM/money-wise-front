import { useState } from "react";
import { Plus, Filter, Trash2, Edit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const ExpenseTracker = () => {
    const [transactions, setTransactions] = useState([]);
    const [view, setView] = useState('all'); // all, expenses, incomes
    const [isAdding, setIsAdding] = useState(false);
    
    const mockTransactions = [
      { id: 1, type: 'expense', amount: 50.00, description: 'Groceries', date: '2024-03-15' },
      { id: 2, type: 'income', amount: 1000.00, description: 'Salary', date: '2024-03-10' },
      { id: 3, type: 'expense', amount: 30.00, description: 'Gas', date: '2024-03-08' },
    ];
  
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header with Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$920.00</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">$1000.00</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">$80.00</p>
            </CardContent>
          </Card>
        </div>
  
        {/* Actions Bar */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-lg ${view === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
              onClick={() => setView('all')}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${view === 'expenses' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
              onClick={() => setView('expenses')}
            >
              Expenses
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${view === 'incomes' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
              onClick={() => setView('incomes')}
            >
              Income
            </button>
          </div>
          <button 
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={20} /> Add Transaction
          </button>
        </div>
  
        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.map(transaction => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${transaction.type === 'expense' ? 'bg-red-500' : 'bg-green-500'}`} />
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-medium ${transaction.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                      {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toFixed(2)}
                    </p>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
  
        {/* Add Transaction Modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add Transaction</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select className="w-full p-2 border rounded-lg">
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input type="number" className="w-full p-2 border rounded-lg" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input type="text" className="w-full p-2 border rounded-lg" placeholder="Enter description" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input type="date" className="w-full p-2 border rounded-lg" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="px-4 py-2 bg-gray-100 rounded-lg"
                      onClick={() => setIsAdding(false)}
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                      Add Transaction
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };
  
  export default ExpenseTracker;
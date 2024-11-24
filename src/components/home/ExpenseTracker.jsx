import { useEffect, useState } from "react";
import {
  Plus,
  Filter,
  Trash2,
  Edit2,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import AddTransaction from "./AddTransaction";

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState([]);

  const incomes = () => {
    let filtered = transactions.filter((item) => item?.type === "income");
    if (!filtered) {
      console.log("no se encontro expense, wachin.");
    }
    return filtered;
  };

  const expenses = () => {
    let filtered = transactions.filter((item) => item?.type === "expense");
    if (!filtered) {
      console.log("no se encontro expense, wachin.");
    }
    return filtered;
  };

  const calculateAmount = (array) => {
    let total = 0;
    if (array.length !== 0) {
      array.forEach((element) => {
        total = total + element.amount;
        console.log("aca el amount fue: ", element.amount)
      });
    }
    return total;
  };

  const calculateBalance = () => {
    let totalIncomesAmount = calculateAmount(incomes());
    let totalExpensesAmount = calculateAmount(expenses());
    return totalIncomesAmount - totalExpensesAmount;
  };

  const apiUrl = import.meta.env.VITE_API_URL;
  const authToken = sessionStorage.getItem("auth_token");

  const [view, setView] = useState("all"); // all, expenses, incomes
  const [isAdding, setIsAdding] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const handleAddTransaction = async ( value ) => {
    try {
        let response = await axios.post(`${apiUrl}transactions/new`, value,  {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }, 
        })
        if(response){ console.log( response ) }
        getAllTransactions();
    } catch (error) {
        console.error(error);
    }
  };

  const getAllTransactions = async () => {
    const response = await axios.get(`${apiUrl}transactions/all`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    setTransactions(response.data);
    console.log(response.data);
  };

  useEffect(() => {
    getAllTransactions();
    let testIncomes = incomes()
    console.log("testIncomes es: ", testIncomes)
    let calculatedIncomes = calculateAmount( testIncomes )
    console.log("el calculo dio: ", calculatedIncomes)
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header with Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${calculateBalance()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${calculateAmount( incomes() )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              ${calculateAmount( expenses() )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-lg ${
              view === "all" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => setView("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              view === "expenses" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => setView("expenses")}
          >
            Expenses
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              view === "incomes" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => setView("incomes")}
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
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      transaction.type === "expense"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className={`font-medium ${
                      transaction.type === "expense"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {transaction.type === "expense" ? "-" : "+"}$
                    {transaction.amount.toFixed(2)}
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
        <AddTransaction 
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          handleAddTransaction={handleAddTransaction}
        />
      )}
    </div>
  );
};

export default ExpenseTracker;

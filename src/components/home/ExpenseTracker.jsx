import { useEffect, useState } from "react";
import {
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddTransaction from "./AddTransaction";
import TransactionsGrid from "./TransactionsGrid";
import Navbar from "./Navbar";

const ExpenseTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [view, setView] = useState("all");
  const [isAdding, setIsAdding] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const authToken = sessionStorage.getItem("auth_token");
  const navigate = useNavigate();

  //Gets a single transaction array of Obj based on a string parameter
  const getTransaction = async ( transactionType, functionSetter ) => {
    try {
      const transaction = await axios.get(`${apiUrl}/transactions/${transactionType}`,{
        headers: {
          Authorization: `Bearer ${authToken}`
        } 
      });
      functionSetter(transaction.data);
    } catch (error) {
      if(error.response?.status === 401){
        console.error("Token has expired, redirecting to login...");
        sessionStorage.removeItem("auth_token");
        navigate('/login');
      } else {
        console.error("Error in obtaining the data: ", error);
      }
    }
  }
  
  //Calculates amount for each transaction
  const calculateAmount = (array) => {
    let total = 0;
    if (array.length !== 0) {
      array.forEach((element) => {
        total = total + element.amount;
      });
    }
    return total;
  };

  //Calculates balance
  const calculateBalance = () => {
    let totalIncomesAmount = calculateAmount(incomes);
    let totalExpensesAmount = calculateAmount(expenses);
    return totalIncomesAmount - totalExpensesAmount;
  };


  const handleAddTransaction = async ( value ) => {
    try {
        let response = await axios.post(`${apiUrl}/transactions/new`, value,  {
            headers: {
                Authorization: `Bearer ${authToken}`,
            }, 
        })
        if(response){ console.log( "Transaction added successfully: ", response ) }
        getAllTransactions();
    } catch (error) {
      if(error.response?.status === 401){
        console.error("Token has expired, redirecting to login...");
        sessionStorage.removeItem("auth_token");
        navigate('/login');
      } else{
        console.error("Error obtaining the data, redirecting to login...");
      }
    }
  };

  // Gets all transactions
  const getAllTransactions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/transactions/all`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      if(error.response?.status === 401){
        console.error("Token has expired, redirecting to login...");
        sessionStorage.removeItem("auth_token");
        navigate('/login');
      } else{
        console.error("Error obtaining the data, redirecting to login...");
      }
    }
  };

  const deleteTransaction = ( id ) => {
    axios.delete(`${apiUrl}/transactions/${id}`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then( (res)=>{
        getAllTransactions();
        getTransaction("incomes", setIncomes);
        getTransaction("expenses", setExpenses);
        console.log("transaction deleted successfully ", res.data)
      })
      .catch(error => {
        if(error.response?.status === 401){
          console.error("Token has expired, redirecting to login...");
          sessionStorage.removeItem("auth_token");
          navigate('/login');
        } else {
          console.error("Error obtaining the data, redirecting to login...");
        }
      })
  }

  const updateTransaction = (id, value) => {
    axios.patch(`${apiUrl}/transactions/${id}`, value, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
    .then( ()=>{
      getAllTransactions();
      getTransaction("incomes", setIncomes);
      getTransaction("expenses", setExpenses);
    })
    .catch(error =>{
      if(error.response?.status === 401){
        console.error("Token has expired, redirecting to login...");
        sessionStorage.removeItem("auth_token");
        navigate('/login');
      } else {
        console.error("Error obtaining the data, redirecting to login...");
      }
    })
  }

  //When the component is mounted, it gets all transactions and incomes and expenses
  useEffect(() => {
    getAllTransactions();
    getTransaction("incomes", setIncomes);
    getTransaction("expenses", setExpenses);
  }, []);

  
  return (
    <>
    <Navbar />
    <div className="py-4 max-w-4xl mx-auto px-0 sm:p-4 space-y-6">
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
              ${calculateAmount( incomes )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              ${calculateAmount( expenses )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center px-2 sm:px-0">
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
            onClick={() =>{ 
              setView("incomes")
            }}
          >
            Income
          </button>
        </div>
        <button
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={() => setIsAdding(true)}
        >
          <Plus size={20} /> Add
        </button>
      </div>

      {/* Transactions Grid */}
      <TransactionsGrid
        transactions={transactions}
        incomes={incomes}
        expenses={expenses}
        view={view}
        deleteTransaction={deleteTransaction}
        updateTransaction={updateTransaction}
      />

      {/* Add Transaction Modal */}
      {isAdding && (
        <AddTransaction 
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          handleAddTransaction={handleAddTransaction}
          getAllTransactions={getAllTransactions}
          setIncomes={setIncomes}
          setExpenses={setExpenses}
          getTransaction={getTransaction}
        />
      )}
    </div>
    </>
  );
};

export default ExpenseTracker;

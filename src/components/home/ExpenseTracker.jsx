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

  // Add transaction
  const TransactionTypeSelector = ({ onSelect, onCancel }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-center mb-6">
        Select Transaction Type
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onSelect("income")}
          className="flex flex-col items-center justify-center p-6 border-2 border-green-500 rounded-lg hover:bg-green-50 transition-colors"
        >
          <ArrowUpCircle className="w-12 h-12 text-green-500 mb-2" />
          <span className="font-medium text-green-700">Income</span>
        </button>
        <button
          onClick={() => onSelect("expense")}
          className="flex flex-col items-center justify-center p-6 border-2 border-red-500 rounded-lg hover:bg-red-50 transition-colors"
        >
          <ArrowDownCircle className="w-12 h-12 text-red-500 mb-2" />
          <span className="font-medium text-red-700">Expense</span>
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const TransactionForm = ({ type, onSubmit, onCancel }) => {
    const validationSchema = Yup.object({
      amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be positive")
        .typeError("Amount must be a number"),
      description: Yup.string()
        .required("Description is required")
        .max(100, "Description is too long"),
      date: Yup.date()
        .required("Date is required")
        .max(new Date(), "Date cannot be in the future"),
    });
    const initialValues = {
      type,
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await onSubmit(values);
          } catch (error) {
            console.error("Error submitting form:", error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <Field
                name="amount"
                type="number"
                step="0.01"
                className={`w-full p-2 border rounded-lg ${
                  errors.amount && touched.amount ? "border-red-500" : ""
                }`}
                placeholder="0.00"
              />
              {errors.amount && touched.amount && (
                <div className="text-red-500 text-sm mt-1">{errors.amount}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Field
                name="description"
                type="text"
                className={`w-full p-2 border rounded-lg ${
                  errors.description && touched.description
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter description"
              />
              {errors.description && touched.description && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.description}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Field
                name="date"
                type="date"
                className={`w-full p-2 border rounded-lg ${
                  errors.date && touched.date ? "border-red-500" : ""
                }`}
              />
              {errors.date && touched.date && (
                <div className="text-red-500 text-sm mt-1">{errors.date}</div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-100 rounded-lg"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 ${
                  type === "income" ? "bg-green-500" : "bg-red-500"
                } text-white rounded-lg ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Adding..." : "Add Transaction"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  };
  //----------------

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

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {!selectedType
                  ? "New Transaction"
                  : `New ${
                      selectedType.charAt(0).toUpperCase() +
                      selectedType.slice(1)
                    }`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedType ? (
                <TransactionTypeSelector
                  onSelect={(type) => setSelectedType(type)}
                  onCancel={() => setIsAdding(false)}
                />
              ) : (
                <TransactionForm
                  type={selectedType}
                  onSubmit={async (values) => {
                    try {
                      setIsAdding(false);
                      setSelectedType(null);
                      console.log(values);
                      handleAddTransaction(values)
                    } catch (error) {
                      console.error("Error adding transaction:", error);
                    }
                  }}
                  onCancel={() => {
                    setSelectedType(null);
                    setIsAdding(false);
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;

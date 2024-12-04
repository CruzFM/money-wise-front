import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function AddTransaction({
  setIsAdding,
  handleAddTransaction,
  getAllTransactions,
  setIncomes,
  setExpenses,
  getTransaction,
}) {
  const [selectedType, setSelectedType] = useState(null);
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
        .max(25, "Description is too long"),
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {!selectedType
              ? "New Transaction"
              : `New ${
                  selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
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
                  handleAddTransaction(values);
                  getAllTransactions();
                  getTransaction("incomes", setIncomes);
                  getTransaction("expenses", setExpenses);
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
  );
}

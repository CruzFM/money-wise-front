import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Edit2 } from "lucide-react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

export default function EditTransactionButton({
  transaction,
  updateTransaction,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    type: transaction.type,
    amount: transaction.amount.toString(),
    description: transaction.description,
    date: transaction.date,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateTransaction(transaction._id, values);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating transaction: ", error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <button className="p-1 hover:bg-gray-200 rounded">
          <Edit2 size={16} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Transaction</AlertDialogTitle>
          <AlertDialogDescription>
            Update the details of your transaction
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
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
                  <div className="text-red-500 text-sm mt-1">
                    {errors.amount}
                  </div>
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
                  placeholder="Transaction description"
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

              <AlertDialogFooter>
                <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                <AlertDialogAction type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Transaction"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </Form>
          )}
        </Formik>
      </AlertDialogContent>
    </AlertDialog>
  );
}

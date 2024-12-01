import { Edit2 } from "lucide-react"
import DeleteTransactionButton from "./DeleteTransactionButton";
import EditTransactionButton from "./EditTransactionButton";


export default function TransactionCard({ transaction, deleteTransaction, updateTransaction }) {
    
    return (
    <div
      key={transaction.id}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-2 h-2 rounded-full ${
            transaction.type === "expense" ? "bg-red-500" : "bg-green-500"
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
            transaction.type === "expense" ? "text-red-500" : "text-green-500"
          }`}
        >
          {transaction.type === "expense" ? "-" : "+"}$
          {transaction.amount.toFixed(2)}
        </p>
        <EditTransactionButton 
          transaction={transaction}
          updateTransaction={updateTransaction}
        />
        <DeleteTransactionButton 
            transactionId={transaction._id}
            onDelete={deleteTransaction}
        />
      </div>
      
    </div>
  );
}

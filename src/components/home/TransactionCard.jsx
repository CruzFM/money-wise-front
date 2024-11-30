import { Edit2, Trash2 } from "lucide-react"

export default function TransactionCard({ transaction }) {
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
        <button className="p-1 hover:bg-gray-200 rounded">
          <Edit2 size={16} />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

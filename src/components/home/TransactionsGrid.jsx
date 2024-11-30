import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Edit2, Trash2 } from "lucide-react"
import TransactionCard from "./TransactionCard"


export default function TransactionsGrid({ transactions, incomes, expenses, view}){
    
    const renderView = () =>{
        if(view === "all"){
            return transactions.map( (transaction) => (
                <TransactionCard
                    transaction={transaction}
                    key={transaction._id}
                />
            ))
        } else if (view === "incomes") {
            return incomes.map( (income) => (
                <TransactionCard
                    transaction={income}
                    key={income._id}
                />
            ))
        } else if (view === "expenses"){
            return expenses.map( (expense) => (
                <TransactionCard
                    transaction={expense}
                    key={expense._id}
                />
            ))
        }
    }

    return(
        <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            { renderView() }
          </div>
        </CardContent>
      </Card>
    )
}
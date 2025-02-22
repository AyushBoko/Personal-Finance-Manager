import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, LogOut, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CATEGORIES = [
  'Food & Drinks',
  'Shopping',
  'Housing',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Salary & Wages',
  'Debt Repayments',
  'Stock Market Investments',
  'Other',
];

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'];

interface Transaction {
  id: string;
  date: Date;
  title: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

// Function to format amount in Indian Rupees
const formatIndianRupees = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    title: '',
    amount: '',
    category: CATEGORIES[0],
    type: 'expense' as const,
    date: new Date(),
  });

  const handleAddTransaction = () => {
    if (editingTransaction) {
      // Update existing transaction
      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id 
          ? {
              ...t,
              title: newTransaction.title,
              amount: parseFloat(newTransaction.amount),
              category: newTransaction.category,
              type: newTransaction.type,
              date: newTransaction.date,
            }
          : t
      ));
      toast.success('Transaction updated successfully!');
    } else {
      // Add new transaction
      const transaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        date: newTransaction.date,
        title: newTransaction.title,
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        type: newTransaction.type,
      };
      setTransactions([transaction, ...transactions]);
      toast.success('Transaction added successfully!');
    }

    // Reset form and close dialog
    setIsAddingTransaction(false);
    setEditingTransaction(null);
    setNewTransaction({
      title: '',
      amount: '',
      category: CATEGORIES[0],
      type: 'expense',
      date: new Date(),
    });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast.success('Transaction deleted successfully!');
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      title: transaction.title,
      amount: transaction.amount.toString(),
      category: transaction.category,
      type: transaction.type,
      date: transaction.date,
    });
    setIsAddingTransaction(true);
  };

  // Calculate summary data for charts
  const summaryData = useMemo(() => {
    const categoryData = CATEGORIES.map(category => ({
      name: category,
      value: transactions
        .filter(t => t.category === category && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
    })).filter(d => d.value > 0);

    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = format(transaction.date, 'MMM');
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expense += transaction.amount;
      }
      return acc;
    }, {} as Record<string, { income: number; expense: number }>);

    const barData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      Income: data.income,
      Expense: data.expense
    }));

    return { categoryData, barData };
  }, [transactions]);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button size="lg" onClick={() => logout()}>
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Balance Left</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatIndianRupees(totalIncome - totalExpense)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{formatIndianRupees(totalIncome)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{formatIndianRupees(totalExpense)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summaryData.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {summaryData.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatIndianRupees(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summaryData.barData}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${value}`} />
                  <Tooltip formatter={(value) => formatIndianRupees(value as number)} />
                  <Legend />
                  <Bar dataKey="Income" fill="#4ade80" />
                  <Bar dataKey="Expense" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Transactions</h1>
          <Dialog open={isAddingTransaction} onOpenChange={(open) => {
            if (!open) {
              setEditingTransaction(null);
              setNewTransaction({
                title: '',
                amount: '',
                category: CATEGORIES[0],
                type: 'expense',
                date: new Date(),
              });
            }
            setIsAddingTransaction(open);
          }}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={newTransaction.title}
                    onChange={(e) =>
                      setNewTransaction({ ...newTransaction, title: e.target.value })
                    }
                    placeholder="Transaction title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Amount (₹)</Label>
                  <Input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) =>
                      setNewTransaction({ ...newTransaction, amount: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={newTransaction.category}
                    onValueChange={(value) =>
                      setNewTransaction({ ...newTransaction, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={newTransaction.type}
                    onValueChange={(value: 'income' | 'expense') =>
                      setNewTransaction({ ...newTransaction, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(newTransaction.date, 'PPP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newTransaction.date}
                        onSelect={(date) =>
                          setNewTransaction({ ...newTransaction, date: date || new Date() })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleAddTransaction}
                  disabled={!newTransaction.title || !newTransaction.amount}
                >
                  {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Date</TableHead>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead className="w-[150px]">Amount</TableHead>
                <TableHead className="w-[200px]">Category</TableHead>
                <TableHead className="w-[150px]">Type</TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="h-16">
                  <TableCell className="font-medium">{format(transaction.date, 'PP')}</TableCell>
                  <TableCell>{transaction.title}</TableCell>
                  <TableCell>
                    <span
                      className={
                        transaction.type === 'income'
                          ? 'text-green-500 font-semibold'
                          : 'text-red-500 font-semibold'
                      }
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatIndianRupees(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                     
                      size="sm"
                      onClick={() => handleEditTransaction(transaction)}
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                    <Button
                    
                      size="sm"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No transactions yet. Add your first transaction!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
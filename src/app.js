(app => {
    const entry = document.querySelector("#entry");

    const initHTML = () => {
        return `
        <div class="balance-container">
            <p>Balance: $<span class="balance">0.00</span></p>
        </div>

        <div class="profit-expense-container">
            <div class="profit-container">
                <p class="profit-heading">Profit: </p>
                <p class="profitWrap">$<span class="profit">0.00</span></p>
            </div>
            <div class="expense-container">
                <p class="expense-heading">Expense: </p>
                <p class="expenseWrap">-$<span class="expense">0.00</span></p>
            </div>

        </div>
        <div class="transactionHistory">
            <p>Transaction History</p>
            <ul class="transactions-list">
            </ul>
        </div>
        <form class="myForm">
            <legend>Add New Transaction</legend>
            <p>
                <label for="inputText">Transaction: </label>
                <input type="text" placeholder="New Transaction" id="inputText">
            </p>
            <p>
                <label for="inputAmount">Amount: </label>
                <input type="text" placeholder="0.00" id="inputAmount">
            </p>
            <p>
                <button>Enter</button>
            </p>
        </form>
        `
    }

    const createTransactionItem = ({ name, amount, id }) => {
        const list = document.createElement("li")
        list.className = `transaction-list--item ${amount < 0 ? "expense" : "profit"}`;
        list.setAttribute("data-id", id)
        list.innerHTML = `
            <p class="transaction-name">
                ${name}
            </p>
            <p class="transaction-amount">
                ${amount > 0 ? "$" + amount : "-$" + Math.abs(amount)}
            </p>
            <p><button class="delete">X</button></p>
        `
        return list;
    }
    let transactions = [];

    const updateBalance = (balance) => {
        const balanceContainer = entry.querySelector(".balance");
        balanceContainer.textContent = balance.toFixed(2);
    }
    const updateProfit = (profit) => {
        const profitContainer = entry.querySelector(".profit");
        profitContainer.textContent = profit.toFixed(2);
    }
    const updateExpense = (expense) => {
        const expenseContainer = entry.querySelector(".expense");
        expenseContainer.textContent = Math.abs(expense).toFixed(2);
    }

    const updateTransaction = (newTransactionsArray) => {
        const profit = newTransactionsArray.reduce((acc, curr) => {
            if (curr.amount && curr.amount > 0) {
                acc += curr.amount
            }
            return acc;
        }, 0);
        const expense = newTransactionsArray.reduce((acc, curr) => {
            if (curr.amount && curr.amount < 0) {
                acc += curr.amount
            }
            return acc;
        }, 0);
        const balance = profit + expense;
        updateProfit(profit);
        updateExpense(expense);
        updateBalance(balance);
    }
    const addTransaction = (amount, text) => {
        const id = crypto.randomUUID();
        const newTransaction = { id, amount, name: text };
        transactions.push(newTransaction);
        updateTransaction(transactions)

        entry.querySelector(".transactions-list").appendChild(createTransactionItem(newTransaction));
    }
    const deleteTransaction = (id) => {
        const newArray = transactions.filter(transaction => transaction.id !== id);
        transactions = [...newArray];
        updateTransaction(transactions)
        entry.querySelector(`.transaction-list--item[data-id="${id}"]`).remove();
    }

    entry.innerHTML = initHTML();

    entry.querySelector(".myForm").addEventListener("submit", e => {
        e.preventDefault();
        const name = entry.querySelector("#inputText").value;
        const amount = +entry.querySelector("#inputAmount").value;

        addTransaction(amount, name)
        entry.querySelector(".myForm").reset()
    })

    entry.addEventListener("click", e => {
        if (!e.target.classList.contains("delete")) return;
        console.log(e.target.closest("li").dataset.id);
        deleteTransaction(e.target.closest("li").dataset.id)
    })
})()

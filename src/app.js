(app => {
    const entry = document.querySelector("#entry");

    const initHTML = () => {
        return `
        <div class="balance-container">
            <p>Balance: ₱<span class="balance">0.00</span></p>
        </div>

        <div class="profit-expense-container">
            <div class="profit-container">
                <p class="profit-heading">Profit: </p>
                <p class="profitWrap">₱<span class="profit">0.00</span></p>
            </div>
            <div class="expense-container">
                <p class="expense-heading">Expense: </p>
                <p class="expenseWrap">-₱<span class="expense">0.00</span></p>
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
                <label for="inputText">Name: </label>
                <input type="text" placeholder="New Transaction" id="inputText" required>
            </p>
            <p>
                <label for="inputAmount">Amount: </label>
                <input type="text" placeholder="0.00" id="inputAmount" required>
            </p>
            <p>
                <button class="submitBtn">Enter</button>
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
                ${amount > 0 ? "₱" + amount : "-₱" + Math.abs(amount)}
            </p>
            <p><button class="delete">X</button></p>
        `
        return list;
    }
    let transactions = JSON.parse(localStorage.getItem("expense-tracker")) || [];

    const updateBalance = (balance) => {
        const balanceContainer = entry.querySelector(".balance");
        balanceContainer.classList.toggle("expense", balance < 0)
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
        localStorage.setItem("expense-tracker", JSON.stringify(transactions));
        updateTransaction(transactions)

        entry.querySelector(".transactions-list").appendChild(createTransactionItem(newTransaction));
    }
    const deleteTransaction = (id) => {
        const newArray = transactions.filter(transaction => transaction.id !== id);
        transactions = [...newArray];
        localStorage.setItem("expense-tracker", JSON.stringify(transactions));
        updateTransaction(transactions)
        entry.querySelector(`.transaction-list--item[data-id="${id}"]`).remove();
    }

    const disableBtn = (isDisabled) => {
        const btn = entry.querySelector(".submitBtn");
        console.log(isDisabled)
        if (isDisabled) {
            btn.disabled = true;
        } else {
            btn.disabled = false;
        }
    }

    entry.innerHTML = initHTML();
    entry.querySelector(".myForm").addEventListener("submit", e => {
        e.preventDefault();
        const name = entry.querySelector("#inputText").value;
        const amount = entry.querySelector("#inputAmount").value;
        if (isNaN(Number(amount))) {
            return;
        };

        addTransaction(+amount, name)
        entry.querySelector(".myForm").reset()
        entry.querySelector("#inputText").focus()
    })

    entry.querySelector("#inputAmount").addEventListener("input", e => {
        disableBtn(isNaN(Number(e.target.value)));
    })

    entry.addEventListener("click", e => {
        if (!e.target.classList.contains("delete")) return;
        deleteTransaction(e.target.closest("li").dataset.id)
    })

    // get data on local storage and update display on initial load.
    window.addEventListener("load", () => {
        updateTransaction(transactions)
        for (const transaction of transactions) {
            entry.querySelector(".transactions-list").appendChild(createTransactionItem(transaction))
        }
    })
})()

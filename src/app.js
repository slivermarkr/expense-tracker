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

    const createTransactionItem = (name, amount) => {
        const list = document.createElement("li")
        list.className = `transaction-list--item ${amount < 0 ? "expense" : "profit"}`;
        list.innerHTML = `
            <p class="transaction-name">
                ${name}
            </p>
            <p class="transaction-amount">
                ${amount > 0 ? "$" + amount : "-$" + Math.abs(amount)}
            </p>
        `
        return list;
    }
    let currBalance = 0, currProfit = 0, currExpense = 0;
    const updateBalance = (balance) => {
        const balanceContainer = entry.querySelector(".balance");
        balanceContainer.textContent = balance;
    }
    const updateProfit = (profit) => {
        const profitContainer = entry.querySelector(".profit");
        profitContainer.textContent = profit;
    }
    const updateExpense = (expense) => {
        const expenseContainer = entry.querySelector(".expense");
        expenseContainer.textContent = Math.abs(expense);
    }

    const updateDigits = (amount) => {
        if (amount > 0) {
            //profit
            currProfit += amount
            updateProfit(currProfit)
        } else {
            //expense
            console.log(amount)
            currExpense += amount
            updateExpense(currExpense)
        }
        currBalance = currProfit + currExpense;
        console.log(currBalance, currProfit, currExpense)
        updateBalance(currBalance);
    }

    entry.innerHTML = initHTML();

    entry.querySelector(".myForm").addEventListener("submit", e => {
        e.preventDefault();
        const name = entry.querySelector("#inputText").value;
        const amount = +entry.querySelector("#inputAmount").value;

        entry.querySelector(".transactions-list").appendChild(createTransactionItem(name, amount))
        updateDigits(amount)

        entry.querySelector(".myForm").reset()
    })
})()

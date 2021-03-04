const Modal = {
    open(){
        document.querySelector('.modal-overlay').classList.add('active')
    },
    close(){
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("hmoney:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("hmoney:transactions", JSON.stringify(transactions))
        //Transformei o array em uma string e levei para o localStorage
    }
}

const Transaction = {
    all: Storage.get(), //Refatorando algo para facilitar a alteraçãoo depois

    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        //Pega o index do array e remova só 1

        App.reload()
    },

    incomes() {
        //Somar as entradas
        let income = 0
        // pegar todas as transações
        // para cada transação
        Transaction.all.forEach(function(transaction) {
            // verificar se a transação é maior que zero

            if (transaction.amount > 0) {
                 // Se for maior que zero somar a uma variavel e
                 income += transaction.amount
            }
        })
        // retornar a variavel
        return income
    },

    expenses() {
        //Somar as saídas
        let expense = 0
        // pegar todas as transações
        // para cada transação
        Transaction.all.forEach(function(transaction) {
            // verificar se a transação é maior que zero

            if (transaction.amount < 0) {
                 // Se for maior que zero somar a uma variavel e
                 expense += transaction.amount
            }
        })
        // retornar a variavel
        return expense
    },

    total() {
        // incomes - expenses
        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTmlTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionContainer.appendChild(tr)
    },

    innerHTmlTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <tr>
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/img/minus.svg" alt="Remover transação">
            </td>
        </tr>
        `

        return html
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransaction(){
        DOM.transactionContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value){
        value = Number(value) * 100
        return Math.round(value)
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency (value) {
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        
        value =  Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateField() {
        const { description, amount , date } = Form.getValues()

        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
        throw new Error("Por favor, preencha todos os campos.")
        }
    },

    formatValues() {
        let { description, amount , date } = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return {
            description,
            amount,
            date
        }
    },

    saveTransaction(transaction) {
        Transaction.add(transaction)
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()

        try {
            Form.validateField()
            const transaction = Form.formatValues()
            Form.saveTransaction(transaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
        
    }
}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        DOM.updateBalance();
        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransaction()
        App.init()
    }
}

App.init()

let total_panel = Transaction.total() * 0.3;
let cota_value_mes = (total_panel / 57.90) / 100;
let total_inves = (cota_value_mes * 0.5) * 12; //Quanto eu ganho a cada mês e quando eu vou ter depois dos 12 meses
let total_ano = total_panel * 12; //Sem investir
calc_investiment = Math.round(total_ano + (total_inves * 100));

function formatValueInvens (value) {
    const signal = Number(value) < 0 ? "-" : ""
    value = String(value).replace(/\D/g, "")
    
    value =  Number(value) / 100

    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    return signal + value
}

if(total_panel > 0){
    document.getElementById('total_thiry').innerHTML = formatValueInvens(total_panel);
    document.getElementById('cota_value').innerHTML = Math.round(cota_value_mes);
    document.getElementById('value_year').innerHTML = formatValueInvens(total_ano);
    document.getElementById('total_year_inves').innerHTML = formatValueInvens(calc_investiment);
}else{
    document.getElementById('value_year').innerHTML = "R$ 0,00";
    document.getElementById('total_year_inves').innerHTML = "R$ 0,00";
}

console.log(total_inves)
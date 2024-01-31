interface IBankClient {
    firstName: string;
    lastName: string
}

class BankClient implements IBankClient {

    public get accountNumber(): string {
        if (!this._accountNumber) throw new Error("New client")

        return this._accountNumber
    }

    public set accountNumber(num: string) {
        this._accountNumber = num
    }

    public get age (): number {
        return new Date().getFullYear() - this._birthYear
    }

    public get firstName (): string {
        return this._firstName
    }

    public get lastName (): string {
        return this._lastName
    }

    constructor(
        private readonly _firstName: string,
        private readonly _lastName: string,
        private readonly _birthYear: number,
        private _accountNumber: string | null = null
    ) {}
}

class BankAccount {
    iban!: string

    get holderName(): string {
        return `${this.holder.firstName} ${this.holder.lastName}`
    }

    get info (): string {
        return `${this.currency}${this.balance}`
    }

    public get number (): string {
        return this.iban
    }

    constructor(
        private readonly holder: IBankClient,
        public balance = 0,
        public readonly currency: string
    ) {}

    public deposit (amount: number) {
        this.balance += amount
    }

    public withdraw (amount: number) {
        this.balance >= amount ? this.balance - amount : new Error (`${this.holder}, you don't have enough money to withdraw`)
    }
}

class Bank {

    private readonly accounts = new Map<BankAccount["holderName"], BankAccount[]>()

    private readonly salaryProvider = new SalaryProvider()
    private readonly creditHistoryProvider = new CreditHistoryProvider()
    private readonly policeDBProvider = new PoliceDBProvider()

    private constructor () {}

    public addAccount (account: BankAccount): void {

        const bankClient = this.accounts.get(account.holderName)

        if (bankClient) {
            bankClient.push(account)
            this.accounts.set(account.holderName, bankClient)
        } else {
            this.accounts.set(account.holderName, new Array(account))
        }
    }

    public deleteAccount (account: BankAccount): void {

        const bankClient = this.accounts.get(account.holderName)

        if (!bankClient) throw new Error("Client doesn't exist")

        bankClient.filter(wallet => wallet.iban !== account.iban)

        this.accounts.set(account.holderName, bankClient)
    }

    public getClient (holder: BankAccount["holderName"]): BankAccount[] {
        const client = this.accounts.get(holder)

        if (!client) throw new Error("Client doesn't exist")

        return client
    }

    public getAllClients (): Map<BankAccount["holderName"], BankAccount[]> {
        return this.accounts
    }

    public deposit(client: BankClient, amount: number, iban: string): void {
        const bankClient = this.accounts.get(`${client.firstName} ${client.lastName}`)

        if (!bankClient) throw new Error("Client doesn't exist")

        const bankAccount = bankClient.find(account => account.iban === iban)

        if (!bankAccount) throw new Error("Account doesn't exist")

        bankAccount.deposit(amount)
    }

    public withdraw (client: BankClient, amount: number, iban: string): void {
        const bankClient = this.accounts.get(`${client.firstName} ${client.lastName}`)

        if (!bankClient) throw new Error("Client doesn't exist")

        const bankAccount = bankClient.find(account => account.iban === iban)

        if (!bankAccount) throw new Error("Account doesn't exist")

        if (bankAccount.balance < amount) throw new Error(`Sorry ${client.firstName}, you haven't enough money`)

        bankAccount.withdraw(amount)
    }

    public getCreditDecision(client: BankClient, amount: number, duration: number): boolean {
        const salary = this.salaryProvider.getAnnualSalary(client.firstName, client.lastName, 12)
        const creditrating = this.creditHistoryProvider.getCreditrating(client.accountNumber)
        const criminalRecord = this.policeDBProvider.isCriminal(client.firstName, client.lastName)

        return true
    }


    // private readonly salaryProvider = new SalaryProvider()
    // private readonly creditHistoryProvider = new CreditHistoryProvider()
    // private readonly policeDBProvider = new PoliceDBProvider()

    // private readonly accounts = new Map<BankAccount["number"], BankAccount>()

    // public addAccount (account: BankAccount): void {
    //     this.accounts.set(account.number, account)
    // }

    // public removeAccount (id: BankAccount['number']): BankAccount {
    //     let account = this.accounts.get(id)

    //     if (account) {
    //         this.accounts.delete(id)
    //         return account
    //     } else throw new Error("Account doesn't exist")
    // }

    // public getAccount (id: BankAccount["number"]): BankAccount {
    //     let account = this.accounts.get(id)

    //     if (!account) throw new Error("Account doesn't exist")

    //     return account
    // }

    // public deposit(client: BankClient, amount: number): void {
    //     this.accounts.get(client.accountNumber)
    // }

    // public withdraw(client: BankClient, amount: number): void {
    //     try {
    //         this.accounts.get(client.accountNumber)?.withdraw(amount)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // public getCreditDecision(client: BankClient, amount: number, duration: number): boolean {
    //     const salary = this.salaryProvider.getAnnualSalary(client.firstName, client.lastName, 12)
    //     const creditrating = this.creditHistoryProvider.getCreditrating(client.accountNumber)
    //     const criminalRecord = this.policeDBProvider.isCriminal(client.firstName, client.lastName)

    //     return true
    // }
}

class SalaryProvider {
    public getAnnualSalary(firstName: string, lastName: string, duration: number): number {
        const accounts = Bank.getAllClients

        return 50
    }
}

class CreditHistoryProvider {
    public getCreditrating(bankAccountNumber: string): number {
        return 100
    }
}

class PoliceDBProvider {
    public isCriminal(firstName: string, lastName: string): boolean {
        return false
    }
}
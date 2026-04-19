interface BankAccount {
    account_name: string;
    bank_name: string;
    bank_icon: string;
    account_number: string;
}

interface SocialLinks {
    website?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
}

interface PayoutTransaction {
    id: string;
    paymentId: string;
    bankAccount: {
        name: string;
        bank: string;
        bankLogo: string
    }
    amount: number;
    payoutDate: string;
    payoutTime: string;
    status: 'processing' | 'completed' | 'failed' | 'pending';
}

interface AuthUser {
    readonly id: string
    readonly full_name: string,
    readonly email: string,
    readonly phone_number: string
    readonly profile_picture: string
    readonly country: string,
    readonly state: string,
    readonly city: string,
    readonly currency: string,
    readonly role: string
}

interface Host extends AuthUser {
    business_name: string;
    bank_accounts: BankAccount[];
    social_links: SocialLinks;
    allow_auto_payout: boolean;
    status: 'active' | 'suspended' | 'banned';
}
interface AuthUser {
    readonly id: string
    readonly full_name: string,
    readonly email: string,
    readonly phone: string
    readonly profile_img: string
    readonly address: string
}

interface Host extends AuthUser {
    business_name: string;
    bank_accounts: BankAccount[];
    social_links: SocialLinks;
    allow_auto_payout: boolean;
    status: 'active' | 'suspended' | 'banned';
}
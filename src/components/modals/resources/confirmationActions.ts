export const CONFIRMATION_ACTION_TYPES = {
    SUSPEND_USER: 'SUSPEND_USER',
    BAN_USER: 'BAN_USER',
    RESET_SETTINGS: 'RESET_SETTINGS',
    SUSPEND_HOST: 'SUSPEND_HOST',
    GIFT_BADGE: 'GIFT_BADGE',
    APPROVE_HOST: 'APPROVE_HOST',
    DECLINE_HOST: 'DECLINE_HOST',
    FORCE_PAYOUT: 'FORCE_PAYOUT',
    SUSPEND_EVENT: 'SUSPEND_EVENT',
    DELETE_EVENT: 'DELETE_EVENT',
    UNSUSPEND_EVENT: 'UNSUSPEND_EVENT',
    APPROVE_PAYOUT: 'APPROVE_PAYOUT',
    DECLINE_PAYOUT: 'DECLINE_PAYOUT',
    TOGGLE_AUTO_PAYOUT: 'TOGGLE_AUTO_PAYOUT',
    TRANSFER_TICKET: 'TRANSFER_TICKET',
} as const;

export type ConfirmationActionType = keyof typeof CONFIRMATION_ACTION_TYPES;

/**
 * Returns the executable action for user management confirmations.
 * * @param type - The action type (SUSPEND_USER | BAN_USER)
 * @param data - Contextual data, usually the user object or ID
 */
export const getConfirmationAction = (
    type: ConfirmationActionType,
    data?: { id: string; name?: string }
) => {
    switch (type) {
        case 'SUSPEND_USER':
            return () => {
                // You can replace these logs with your API call logic
                console.log(`Suspending user: ${data?.name || data?.id}`);
            }

        case 'BAN_USER':
            return () => {
                console.log(`Permanently banning user: ${data?.name || data?.id}`);
            }

        case 'RESET_SETTINGS':
            return () => {
                console.log(`Reseting User Settings: ${data?.id}`);
            }

        default:
            return () => {
                console.warn(`No action handler found for type: ${type}`);
            }
    }
}
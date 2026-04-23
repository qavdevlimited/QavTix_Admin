"use client";

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeConfirmation, confirmAction, resetConfirmationStatus } from '@/lib/redux/slices/confirmationSlice';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AnimatedDialog } from '../custom-utils/dialogs/AnimatedDialog';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { getConfirmationAction } from './resources/confirmationActions';
import ActionButton2 from '../custom-utils/buttons/ActionBtn2';
import ActionButton1 from '../custom-utils/buttons/ActionBtn1';

export default function ConfirmationModal() {
    const dispatch = useAppDispatch()
    const pathName = usePathname()

    const { isOpen, title, description, confirmText, cancelText, actionType, isPerforming } = useAppSelector(
        (state) => state.confirmation
    )

    const handleConfirm = () => {
        if (actionType) {
            const action = getConfirmationAction(actionType)
            action()
            dispatch(confirmAction())
        } else {
            dispatch(closeConfirmation())
        }
    }

    useEffect(() => {
        if (isOpen) {
            dispatch(closeConfirmation())
            dispatch(resetConfirmationStatus())
        }
    }, [pathName])

    return (
        <AnimatedDialog open={isOpen} showCloseButton={false} className='md:max-w-sm! py-2'>
            <DialogHeader className="text-center flex justify-center items-center">
                <DialogTitle className="text-lg font-bold text-brand-secondary-9">
                    {title}
                </DialogTitle>
                <DialogDescription className="text-sm text-center text-brand-secondary-9">
                    {description}
                </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-6 justify-center flex-row gap-3 sm:gap-3">
                <ActionButton2
                    buttonText={cancelText || "Cancel"}
                    action={() => dispatch(closeConfirmation())}
                    className="w-full"
                    isDisabled={isPerforming}
                />
                <ActionButton1
                    buttonText={isPerforming ? "Processing..." : (confirmText || "Yes, I am")}
                    action={handleConfirm}
                    className="w-full text-xs! md:text-sm!"
                    disabled={isPerforming}
                    isLoading={isPerforming}
                />
            </DialogFooter>
        </AnimatedDialog>
    )
}
import Image from "next/image";

export function BankItem({ icon, name, bank }: { icon: string, name: string, bank: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="size-7.5 rounded-sm bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                <Image src="/images/demo-images/bank-logo.png" alt="" width={50} height={50} />
            </div>
            <div className="flex flex-col overflow-hidden">
                <p className="text-brand-secondary-7 font-medium text-xs leading-tight truncate">{name}</p>
                <p className="text-brand-neutral-7 text-[10px]">{bank}</p>
            </div>
        </div>
    )
}
export default function ErrorPara({ error }: { error: string }) {
    return (
        <p className="text-xs text-red-500 mt-1.5 ml-1">
            {error}
        </p>
    )
}
export const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            alert('Text copied to clipboard!');
        })
        .catch(err => {
            alert('Failed to copy text. Try manually.');
            console.error('Failed to copy text: ', err);
        });
};

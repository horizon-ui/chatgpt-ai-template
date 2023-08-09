export const handleCommands = (commandText: string): void => {
    const commandName = commandText.split(' ')[1];
    
    switch (commandName) {
        case 'CommandName1':
            console.log('Executing CommandName1');
            break;
        case 'CommandName2':
            console.log('Executing CommandName2');
            break;
        // ... add more cases as required
        default:
            console.log('Unknown command');
    }
};

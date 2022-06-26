export const colorCharacteFind = (textClass) => {
    if(textClass === 'card_4') return '917ab1';
    if(textClass === 'card_5') return 'de9552';
    if(textClass === 'card_5a') return 'DA4F55';
}

export const randomPrice = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
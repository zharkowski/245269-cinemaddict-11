const getFilmsAmountElement = (amount) => {
  return (
    `<p>${amount} movie${amount !== 1 ? `s` : ``} inside</p>`
  );
};

export default getFilmsAmountElement;

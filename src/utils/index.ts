const getSelectData = (select: String[]) => {
  return Object.fromEntries(select.map(item => [item, 1]));
};

const unGetSelectData = (select: String[]) => {
  return Object.fromEntries(select.map(item => [item, 0]));
};
export { getSelectData, unGetSelectData };

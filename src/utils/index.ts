const getSelectData = (select: String[]) => {
  return Object.fromEntries(select.map(item => [item, 1]));
};

const unGetSelectData = (select: String[]) => {
  return Object.fromEntries(select.map(item => [item, 0]));
};

const removeUndefinedObject = obj => {
  Object.keys(obj).forEach(key => (obj[key] === undefined || obj[key] === null) && delete obj[key]);
  return obj;
};

const updateNestedObject = obj => {
  console.log('123', obj);
  const final = {};
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const response = updateNestedObject(obj[key]);
      Object.keys(response).forEach(k => {
        final[`${key}.${k}`] = response[k];
      });
    } else {
      final[key] = obj[key];
    }
  });
  return final;
};

export { getSelectData, unGetSelectData, removeUndefinedObject, updateNestedObject };

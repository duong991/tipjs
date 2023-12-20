import { Types } from 'mongoose';

/**
 * @description Returns an object with the value of each key is 1
 * @param {String[]} select
 * @return {Object} eg. ['a', 'b'] => {a: 1, b: 1}
 * */
const getSelectData = (select: String[]) => {
  return Object.fromEntries(select.map(item => [item, 1]));
};

/**
 * @description Returns an object with the value of each key is 0
 * @param {String[]} select
 * @return {Object} eg. ['a', 'b'] => {a: 0, b: 0}
 * */
const unGetSelectData = (select: String[]) => {
  return Object.fromEntries(select.map(item => [item, 0]));
};

/**
 * @description This function removes undefined value from object
 * @param obj Object to remove undefined value
 * @return Object eg. Object {a: 1, b: undefined} => Object {a: 1}
 * */
const removeUndefinedObject = obj => {
  Object.keys(obj).forEach(key => (obj[key] === undefined || obj[key] === null) && delete obj[key]);
  return obj;
};

/**
 * @description This function converts object to nested object
 * @param obj Object to convert
 * @return String eg. {"a": 1, "b": {"c": 2}} => {"a": 1, "b.c": 2}
 * */
const updateNestedObject = obj => {
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

/**
 * @description This function converts string to ObjectId
 * @param ids String to convert
 * @return ObjectId eg. "5f5b9e0e8d2b3f0b5a0c5c9c" => ObjectId("5f5b9e0e8d2b3f0b5a0c5c9c")
 * */
const convertToObjetId = (ids: string) => new Types.ObjectId(ids);

export { getSelectData, convertToObjetId, unGetSelectData, removeUndefinedObject, updateNestedObject };

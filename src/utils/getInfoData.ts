import _ from 'lodash';

export default function getDataInfo({
  fields = [],
  object = {},
}: {
  fields: string[];
  object: Object;
}) {
  return _.pick(object, fields);
}

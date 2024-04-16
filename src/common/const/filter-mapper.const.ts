import {
  Any,
  ArrayContainedBy,
  ArrayOverlap,
  Between,
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
} from 'typeorm';

/**
 * where__id__not
 *
 * {
 *  where: {
 *    id: Nor(value)
 *  }
 * }
 */
export const FILTER_MAPPER = {
  any: Any,
  array_contains_by: ArrayContainedBy,
  array_overlap: ArrayOverlap,
  between: Between,
  equal: Equal,
  i_like: ILike,
  in: In,
  is_null: IsNull,
  less_than: LessThan,
  less_than_or_equal: LessThanOrEqual,
  like: Like,
  more_than: MoreThan,
  more_than_or_equal: MoreThanOrEqual,
  not: Not,
};

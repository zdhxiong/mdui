let id = 0;

/**
 * 返回一个唯一ID
 */
export const uniqueId = (): number => {
  return ++id;
};

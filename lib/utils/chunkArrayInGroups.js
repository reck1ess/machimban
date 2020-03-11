const chunkArrayInGroups = (arr, size) => {
  const group = [];
  for (let i = 0; i < arr.length; i += size) {
    group.push(arr.slice(i, i + size));
  }
  return group;
};

export default chunkArrayInGroups;

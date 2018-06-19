export default {
  test: 'test',
  list: {
    month: [
      `January`,
      `February`,
      `March`,
      `April`,
      `May`,
      `June`,
      `July`,
      `August`,
      `September`,
      `October`,
      `November`,
      `December`,
    ],
    day: (max => {
      const list = [];
      for (let i = 1; i <= max; i++) {
        list.push(i);
      }
      return list;
    })(31),
    year: ((min, max) => {
      const list = [];
      while (min <= max) {
        list.push(min);
        min++;
      }
      return list;
    })(1990, 2018),
  },
};

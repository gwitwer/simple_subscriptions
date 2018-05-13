module.exports = d => {
  const tString = d.toString().split(' ')[4];
  const yString = d.toString().split(' ')[3];
  const gmtString = d.toString().split(' ').slice(5,6)[0].slice(3);
  const mString = ((d.getMonth() + 1) / 100).toFixed(2).toString().slice(2);
  const dString = ((d.getDate()) / 100).toFixed(2).toString().slice(2);

  return [ [yString, mString, dString].join('-'), (tString + gmtString) ].join('T');
};

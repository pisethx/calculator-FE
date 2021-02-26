export const formatName = (str, key = "-") => {
  if (typeof str !== "string") return str;

  return str
    .split(key)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
};

export const randomizers = [
  {
    name: "team-generator",
    type: 2,
    quantityLabel: "Groups",
  },
  {
    name: "custom-list",
    type: 3,
    quantityLabel: "Quantity",
  },
  { name: "name-picker" },
  { name: "yes-or-no" },
  { name: "decision-maker" },
  { name: "random-picker" },
];

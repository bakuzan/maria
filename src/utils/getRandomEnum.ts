export default function randomValueOfEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.keys(anEnum).map((k) => anEnum[k]) as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  const randomEnumValue = enumValues[randomIndex];

  return randomEnumValue;
}

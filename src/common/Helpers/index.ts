import copy from 'clipboard-copy';

export const underscoreCaseToWords = (str: any) => {
  return str
    .split("_")
    .map((word: string) => word.replace(word.charAt(0), word.charAt(0).toUpperCase()))
    .join(" ");
};

// const camelCaseToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
// const camelCaseToWords = str => underscoreCaseToWords(camelCaseToSnakeCase(str))

export const stringToCamelCase = (str: any) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m: any, chr: any) => chr.toUpperCase());
};

export const camelCaseToString = (camelCasedStr: any) => {
  const temp = camelCasedStr.replace(/([A-Z])/g, " $1");
  return temp.charAt(0).toUpperCase() + temp.slice(1);
};

export function copyToClipboard(text: string) {
 return copy(text).then((res) => {
    if (text.length > 15) {
      text = `${text?.slice(0, 15)}...`;
    }
  }).catch((err) => console.log('Could not copy text to clipboard'));
}
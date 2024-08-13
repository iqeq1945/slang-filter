import { Slang } from "./slang.json";

interface Option {
  list: string[];
  exclude: string[];
  splitRegex: any;
  placeHolder?: any;
  regex: any;
  replaceRegex: any;
  emptyList: boolean;
  placeholder?: string;
}

const initialState: Option = {
  list: [],
  exclude: [],
  splitRegex: /\s/,
  placeHolder: "*",
  regex: /[^a-zA-Z0-9|$|@]|^/g,
  replaceRegex: /\w/g,
  emptyList: false,
};

class Filter {
  options: Option;
  /**
   * Filter constructor.
   * @constructor
   * @param {object} options - Filter instance options
   * @param {boolean} options.emptyList - Instantiate filter with no blacklist
   * @param {array} options.list - Instantiate filter with custom list
   * @param {string} options.placeHolder - Character used to replace profane words.
   * @param {string} options.regex - Regular expression used to sanitize words before comparing them to blacklist.
   * @param {string} options.replaceRegex - Regular expression used to replace profane words with placeHolder.
   * @param {string} options.splitRegex - Regular expression used to split a string into words.
   */
  constructor(options = initialState) {
    this.options = {
      list: options.emptyList ? [] : [...Slang, ...(options.list || [])],
      exclude: options.exclude || [],
      splitRegex: options.splitRegex || /\s/,
      placeHolder: options.placeHolder || "*",
      regex: options.regex || /[^a-zA-Z0-9|$|@]|^/g,
      replaceRegex: options.replaceRegex || /\w/g,
      emptyList: options.emptyList,
    };
  }

  /**
   * Determine if a string contains slang words.
   * 비속어 인지 확인 해주는 함수
   * @param {keyword} string - String to evaluate for slang.
   */
  isInSlang(keyword: string) {
    const { exclude, list } = this.options;

    return list.some((word) => {
      const wordExp = new RegExp(word.trim(), "g");
      return !exclude.includes(word) && wordExp.test(keyword);
    });
  }

  /**
   * Replace a word with placeHolder characters;
   * 정해둔 placeholder 값으로 수정하여 출력
   * @param {keyword} string - String to replace.
   */
  replaceWord(keyword: string) {
    const { regex, replaceRegex, placeHolder } = this.options;

    return keyword
      .replace(regex, placeHolder)
      .replace(replaceRegex, placeHolder);
  }

  /**
   * Evaluate a string for slang and return an edited version.
   * 비속어를 가지고 있는지 확인하고, 비속어가 있을시 수정하여 반환해줌.
   * @param {sentence} string - Sentence to filter.
   */
  clean(sentence: string) {
    const { splitRegex } = this.options;

    return sentence
      .split(splitRegex)
      .map((word) => (this.isInSlang(word) ? this.replaceWord(word) : word))
      .join(" ");
  }

  /**
   * Add word(s) to blacklist filter / remove words from whitelist filter
   * 비속어 추가 및 화이트리스트에 있던 경우, 삭제
   * @param {string[]} word - Word(s) to add to blacklist
   */
  addWords(...words: string[]) {
    const { list, exclude } = this.options;

    list.push(...words);
    words.forEach((word) => {
      const index = exclude.indexOf(word);
      if (index !== -1) {
        exclude.splice(index, 1);
      }
    });
  }

  /**
   * Add words to whitelist filter
   * 화이트 리스트에 추가
   * @param {...slang} word - slang(s) to add to whitelist.
   */
  removeWords(...slang: string[]) {
    const { exclude } = this.options;

    exclude.push(...slang.map((word) => word.toLowerCase()));
  }
}

export default Filter;

/* eslint-disable @typescript-eslint/no-shadow */
// noinspection JSUnusedGlobalSymbols,UnnecessaryLocalVariableJS,DuplicatedCode

import { afterAll, test } from '@jest/globals';

class BddError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssertionError';
  }
}

class Context {
  example: TableValues;
  private _table: MultipleTableValues;

  constructor(example: TableValues, _table: MultipleTableValues) {
    this.example = example;
    this._table = _table;
  }

  table(tableName: string): TableRows {
    return new TableRows(this._table.row(tableName));
  }
}

class TableRows {
  private readonly _values: TableValues[];

  constructor(values: TableValues[]) {
    this._values = values;
  }

  /**
   * Example:
   * ctx.table('notifications').row(0).val('read') as bool;
   */
  row(index: number): TableValues {
    if (index < 0 || index >= this._values.length)
      throw new BddError(
        `You can't get table row(${index}), since range is 0..${this._values.length}.`,
      );
    else
      return this._values[index];
  }

  /**
   * Return the first row it finds with the given name/value pair. Example:
   * ctx.table('notifications').rowWhere(name: 'property', value: 'lastPrice').val('market') as Money;
   * If no name/value pair is found, an error is thrown.
   */
  rowWhere(name: string, value?: object): TableValues {
    const foundRow = this._values.find(
      (btv) => btv.val(name) === value,
    );

    if (!foundRow) {
      throw new BddError(
        `There is no table with name:"${name}" and value: "${value}".`,
      );
    }

    return foundRow;
  }

  /**
   * Example:
   * ctx.table('notifications').rows;
   */
  get rows(): TableValues[] {
    return [...this._values];
  }

  toString(): string {
    return `BddTableRows{${this._values}}`;
  }
}


class MultipleTableValues {
  private _tables: Map<string, TableValues[]>;

  constructor(tables: Map<string, TableValues[]>) {
    this._tables = tables;
  }

  static from(tableTerms: TableTerm[]): MultipleTableValues {
    let _tables: Map<string, TableValues[]> = new Map();
    tableTerms.forEach((_table) => {
      let tableValues = _table.rows.map((r) => TableValues.from(r.values));
      _tables.set(_table.tableName, tableValues);
    });
    return new MultipleTableValues(_tables);
  }

  row(tableName: string): TableValues[] {
    const table = this._tables.get(tableName);
    if (table === undefined)
      throw new BddError(`There is no table named "${tableName}".`);
    return table;
  }

  toString(): string {
    let str = '';
    this._tables.forEach((value, key) => {
      str += `${key}: ${JSON.stringify(value)}, `;
    });
    return str;
  }
}

export class TableValues {
  private _map: Map<string, any>;

  constructor(map: Map<string, any>) {
    this._map = map;
  }

  static from(exampleRow: Iterable<Val> | null): TableValues {
    let _map = new Map<string, any>();
    exampleRow = exampleRow || [];
    for (const _val of exampleRow) {
      _map.set(_val.name, _val.value);
    }
    return new TableValues(_map);
  }

  val(name: string): any {
    return this._map.get(name) ?? null;
  }

  toString(): string {
    return this._map.toString();
  }
}

/**
 * This interface helps to format values in Examples and Tables.
 * If a value implements the [BddDescribe] interface, or if it has a
 * [describe] method, it will be used to format the value.
 */
interface Describe {
  describe(): any;
}

export function Bdd(feature?: Feature): BDD {
  return new BDD(feature);
}

export function row(v1: Val, v2?: Val, v3?: Val, v4?: Val, v5?: Val, v6?: Val, v7?: Val, v8?: Val,
                    v9?: Val, v10?: Val, v11?: Val, v12?: Val, v13?: Val, v14?: Val, v15?: Val, v16?: Val): Row {
  return new Row(v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16);
}

class Row {
  values: Val[];

  constructor(
    v1: Val, v2?: Val, v3?: Val, v4?: Val, v5?: Val, v6?: Val, v7?: Val, v8?: Val,
    v9?: Val, v10?: Val, v11?: Val, v12?: Val, v13?: Val, v14?: Val, v15?: Val, v16?: Val,
  ) {
    const values = [v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, v16];
    this.values = values.filter((v): v is Val => v !== undefined && v !== null);
  }
}

export function val(name: string, _: any): Val {
  return new Val(name, _);
}

class Val {
  name: string;
  value: any;

  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }

  /**
   * These 3 steps will be applied to format a value in Examples and Tables:
   *
   * 1) If a [Config.transformDescribe] was provided, it will be used to format the value.
   *
   * 2) Next, if the value implements the [BddDescribe] interface, or if it has a
   * [describe] method, it will be used to format the value.
   *
   * 3) Last, we'll call the value's [toString] method.
   */
  toString(config: Config = Config._default): string {
    let _value = this.value;

    // 1)
    if (config.transformDescribe) {
      _value = config.transformDescribe(this.value) || _value;
    }

    // 2)
    if ((<Describe>_value).describe) {
      let description = (<Describe>_value).describe();
      return (description === null) ? 'NULL' : description.toString();
    }

    // 3)
    else return (_value === null) ? 'NULL' : _value.toString();
  }
}

class Keywords {
  feature: string;
  scenario: string;
  scenarioOutline: string;
  given: string;
  when: string;
  then: string;
  and: string;
  but: string;
  comment: string;
  examples: string;
  table: string;

  static readonly empty = new Keywords({
    feature: '',
    scenario: '',
    scenarioOutline: '',
    given: '',
    when: '',
    then: '',
    and: '',
    but: '',
    comment: '',
    examples: '',
    table: '',
  });

  constructor({
                feature = 'Feature:',
                scenario = 'Scenario:',
                scenarioOutline = 'Scenario Outline:',
                given = 'Given',
                when = 'When',
                then = 'Then',
                and = 'And',
                but = 'But',
                comment = '#',
                examples = 'Examples:',
                table = '',
              }) {
    this.feature = feature;
    this.scenario = scenario;
    this.scenarioOutline = scenarioOutline;
    this.given = given;
    this.when = when;
    this.then = then;
    this.and = and;
    this.but = but;
    this.comment = comment;
    this.examples = examples;
    this.table = table;
  }
}

class Config {
  /** The keywords themselves. */
  keywords: Keywords;

  /**
   * The [prefix] is after the keywords and before the term.
   * The [suffix] is after the term.
   */
  prefix: Keywords;
  suffix: Keywords;

  /**
   * The [keywordPrefix] is before the keyword.
   * The [keywordSuffix] is after the keyword.
   */
  keywordPrefix: Keywords;
  keywordSuffix: Keywords;

  indent: number;
  rightAlignKeywords: boolean;
  padChar: string;
  endOfLineChar: string;
  tableDivider: string;
  space: string;

  /**
   * In tables and examples the output of values to feature files is done with toString().
   * However, this can be overridden here for your business classes.
   * Note: If you return `null` the values won't be changed.
   *
   * Example:
   * ```
   * Object? transformDescribe(Object? obj) {
   *   if (obj is User) return obj.userName;
   * }
   * ```
   */
  transformDescribe: ((obj: any) => any) | null;

  static readonly _default = new Config({});

  constructor({
                keywords = new Keywords({}),
                prefix = Keywords.empty,
                suffix = Keywords.empty,
                keywordPrefix = Keywords.empty,
                keywordSuffix = Keywords.empty,
                indent = 2,
                rightAlignKeywords = false,
                padChar = ' ',
                endOfLineChar = '\n',
                tableDivider = '|',
                space = ' ',
                transformDescribe = null,
              }) {
    this.keywords = keywords;
    this.prefix = prefix;
    this.suffix = suffix;
    this.keywordPrefix = keywordPrefix;
    this.keywordSuffix = keywordSuffix;
    this.indent = indent;
    this.rightAlignKeywords = rightAlignKeywords;
    this.padChar = padChar;
    this.endOfLineChar = endOfLineChar;
    this.tableDivider = tableDivider;
    this.space = space;
    this.transformDescribe = transformDescribe;
  }

  get spaces(): string {
    return this.padChar.repeat(this.indent);
  }
}

abstract class _BaseTerm {
  bdd: BDD;

  protected constructor(bdd: BDD) {
    this.bdd = bdd;
    bdd.terms.push(this);
  }
}

enum _Variation {
  term,
  and,
  but,
  note,
}

abstract class Term extends _BaseTerm {
  readonly text: string;
  readonly variation: _Variation;

  protected constructor(bdd: BDD, text: string, variation: _Variation) {
    super(bdd);
    this.text = text;
    this.variation = variation;
  }

  abstract spaces(config: Config): string;

  abstract keyword(config: Config): string;

  abstract keywordPrefix(config: Config): string;

  abstract keywordSuffix(config: Config): string;

  abstract prefix(config: Config): string;

  abstract suffix(config: Config): string;

  protected _keywordVariation(config: Config): string | null {
    return (this.variation === _Variation.and)
      ? config.keywords.and
      : (this.variation === _Variation.but)
        ? config.keywords.but
        : (this.variation === _Variation.note)
          ? config.keywords.comment
          : null;
  }

  protected _keywordPrefixVariation(config: Config): string | null {
    return (this.variation === _Variation.and)
      ? config.keywordPrefix.and
      : (this.variation === _Variation.but)
        ? config.keywordPrefix.but
        : (this.variation === _Variation.note)
          ? config.keywordPrefix.comment
          : null;
  }

  protected _keywordSuffixVariation(config: Config): string | null {
    return (this.variation === _Variation.and)
      ? config.keywordSuffix.and
      : (this.variation === _Variation.but)
        ? config.keywordSuffix.but
        : (this.variation === _Variation.note)
          ? config.keywordSuffix.comment
          : null;
  }

  protected _prefixVariation(config: Config): string | null {
    return (this.variation === _Variation.and)
      ? config.prefix.and
      : (this.variation === _Variation.but)
        ? config.prefix.but
        : (this.variation === _Variation.note)
          ? config.prefix.comment
          : null;
  }

  protected _suffixVariation(config: Config): string | null {
    return (this.variation === _Variation.and)
      ? config.suffix.and
      : (this.variation === _Variation.but)
        ? config.suffix.but
        : (this.variation === _Variation.note)
          ? config.suffix.comment
          : null;
  }

  protected _padSize(config: Config): number {
    return Math.max(
      Math.max(
        Math.max(
          Math.max(config.keywords.given.length, config.keywords.then.length),
          config.keywords.when.length,
        ),
        config.keywords.and.length,
      ),
      config.keywords.but.length,
    );
  }

  protected _keyword(config: Config = Config._default): string {
    let term = this.keyword(config);
    let result = this._keyword_unpadded(term, config);
    if (config.rightAlignKeywords) {
      let padSize = this._padSize(config);
      result = result.padStart(padSize, config.padChar);
    }
    return result;
  }

  protected _keyword_unpadded(term: string, config: Config): string {
    if (this.variation === _Variation.term)
      return term;
    else if (this.variation === _Variation.and)
      return config.keywords.and;
    else if (this.variation === _Variation.but)
      return config.keywords.but;
    else if (this.variation === _Variation.note)
      return config.keywords.comment;
    else
      throw new BddError(this.variation);
  }

  protected _capitalize(text: string): string {
    if (this.variation === _Variation.note) {
      const characters = Array.from(text);
      return characters[0].toUpperCase() + characters.slice(1).join('');
    } else {
      return text;
    }
  }

  toString(config: Config = Config._default): string {
    return this.keywordPrefix(config) +
      this.spaces(config) +
      this._keyword(config) +
      this.keywordSuffix(config) +
      ' ' +
      this.prefix(config) +
      this._capitalize(this.text) +
      this.suffix(config);
  }
}

abstract class CodeTerm extends _BaseTerm {
  codeRun: CodeRun;

  protected constructor(bdd: BDD, codeRun: CodeRun) {
    super(bdd);
    this.codeRun = codeRun;
  }
}

class BDD {
  feature?: Feature;
  terms: _BaseTerm[];
  _timeout?: number;
  _skip: boolean;
  codeRuns: CodeRun[];

  /**
   * Nulls means the test was not run yet.
   * True means it passed.
   * False means it did not pass.
   */
  passed: boolean[];

  constructor(feature?: Feature) {
    this.feature = feature;
    this.terms = [];
    this._timeout = undefined;
    this._skip = false;
    this.codeRuns = [];
    this.passed = [];
  }

  addCode(code: CodeRun): void {
    this.codeRuns.push(code);
  }

  /** Example: `List<Given> = bdd.allTerms<Given>().toList();` */
  allTerms<T extends Term>(type: { new(...args: any[]): T }): Iterable<T> {
    return this.terms.filter(term => term instanceof type) as Iterable<T>;
  }

  /** The BDD description is its Scenario (or blank if there is no Scenario). */
  description(): string {
    const scenarioIterator = this.allTerms<Scenario>(Scenario)[Symbol.iterator]();
    const scenario = scenarioIterator.next().value;
    return scenario ? scenario.text : '';
  }

  /** A Bdd may have 0 or 1 examples. */
  example(): Example | undefined {
    const exampleIterator = this.allTerms<Example>(Example)[Symbol.iterator]();
    return exampleIterator.next().value;
  }

  /** A Bdd may have 0, 1, or more tables (which are not examples). */
  tables(): TableTerm[] {
    return Array.from(this.allTerms<TableTerm>(TableTerm));
  }

  /** The example, if it exists, may have any number of rows. */
  exampleRow(count: number | null): Set<Val> | null {
    return (count === null) ? null : (this.example()?.rows[count] ?? null);
  }

  numberOfExamples(): number {
    const example = this.example();
    return example ? example.rows.length : 0;
  }

  get skip(): BDD {
    this._skip = true;
    return this;
  }

  /** Timeout in milliseconds */
  timeout(duration?: number): BDD {
    this._timeout = duration;
    return this;
  }

  /** Timeout in seconds */
  timeoutSec(seconds: number): BDD {
    return this.timeout(seconds * 1000); // Convert seconds to milliseconds
  }

  /**
   * The high-level description of a test case in Gherkin. It describes a
   * particular functionality or feature of the system being tested.
   */
  scenario(text: string): Scenario {
    return new Scenario(this, text);
  }

  /**
   * This keyword starts a step that sets up the initial context of the
   * scenario. It's used to describe the state of the world before you begin
   * the behavior you're specifying in this scenario. For example,
   * "Given I am logged into the website" sets the scene for the actions that follow.
   *
   * Note the use of `_` as some of the variables names, because we don't want
   * IDE editors to show them as "Parameter Name Hints".
   */
  given(_: string): Given {
    return new Given(this, _);
  }

  get textTerms(): Iterable<Term> {
    return this.terms.filter(term => term instanceof Term) as Iterable<Term>;
  }

  get codeTerms(): Iterable<CodeTerm> {
    return this.terms.filter(term => term instanceof CodeTerm) as Iterable<CodeTerm>;
  }

  toMap(config: Config): string[] {
    return Array.from(this.textTerms).map(term => term.toString(config));
  }

  toString(config: Config = Config._default, withFeature: boolean = false): string {
    const featureString = withFeature ? this.feature?.toString(config) ?? '' : '';
    const termsString = this.toMap(config).join(config.endOfLineChar);
    return featureString + termsString + config.endOfLineChar;
  }
}

class Scenario extends Term {
  constructor(bdd: BDD, text: string) {
    super(bdd, text, _Variation.term);
  }

  get containsExample(): boolean {
    return this.bdd.terms.some((term) => term instanceof Example);
  }

  spaces(config: Config): string {
    return config.spaces;
  }

  keyword(config: Config): string {
    return this.containsExample
      ? config.keywords.scenarioOutline
      : config.keywords.scenario;
  }

  keywordPrefix(config: Config): string {
    return this.containsExample
      ? config.keywordPrefix.scenarioOutline
      : config.keywordPrefix.scenario;
  }

  keywordSuffix(config: Config): string {
    return this.containsExample
      ? config.keywordSuffix.scenarioOutline
      : config.keywordSuffix.scenario;
  }

  prefix(config: Config): string {
    return this.containsExample
      ? config.prefix.scenarioOutline
      : config.prefix.scenario;
  }

  suffix(config: Config): string {
    return this.containsExample
      ? config.suffix.scenarioOutline
      : config.suffix.scenario;
  }

  /**
   * This keyword starts a step that sets up the initial context of the
   * scenario. It's used to describe the state of the world before you begin
   * the behavior you're specifying in this scenario. For example,
   * "Given I am logged into the website" sets the scene for the actions that follow.
   *
   * Note the use of `_` as some of the variables names, because we don't want
   * IDE editors to show them as "Parameter Name Hints".
   */
  given(_: string): Given {
    return new Given(this.bdd, _);
  }

  /**
   * Often used informally in comments within a Gherkin document to provide
   * additional information, clarifications, or explanations about the scenario
   * or steps. Comments in Gherkin are usually marked with a hashtag (#) and
   * are ignored when the tests are executed. A "Note" can be useful for
   * giving context or explaining the rationale behind a certain test scenario,
   * making it easier for others to understand the purpose and scope of the test.
   */
  note(_: string): Given {
    return new Given(this.bdd, _, _Variation.note);
  }

  toString(config: Config = Config._default): string {
    return super.toString(config);
  }
}

class Given extends Term {
  constructor(bdd: BDD, text: string, variation: _Variation = _Variation.term) {
    super(bdd, text, variation);
  }

  static _internal(bdd: BDD, text: string, variation: _Variation): Given {
    return new Given(bdd, text, variation);
  }

  spaces(config: Config): string {
    return config.spaces + config.spaces;
  }

  keyword(config: Config): string {
    return this._keywordVariation(config) ?? config.keywords.given;
  }

  keywordPrefix(config: Config): string {
    return this._keywordPrefixVariation(config) ?? config.keywordPrefix.given;
  }

  keywordSuffix(config: Config): string {
    return this._keywordSuffixVariation(config) ?? config.keywordSuffix.given;
  }

  prefix(config: Config): string {
    return this._prefixVariation(config) ?? config.prefix.given;
  }

  suffix(config: Config): string {
    return this._suffixVariation(config) ?? config.suffix.given;
  }

  /**
   * A table must have a name and rows. The name is necessary if you want to
   * read the values from it later (if not, just pass an empty string).
   * Example: `ctx.table('notifications').row(0).val('read') as bool`.
   */
  table(tableName: string, row1: Row, row2?: Row, row3?: Row, row4?: Row, row5?: Row, row6?: Row, row7?: Row, row8?: Row, row9?: Row, row10?: Row, row11?: Row, row12?: Row, row13?: Row, row14?: Row, row15?: Row, row16?: Row): GivenTable {
    return new GivenTable(this.bdd, tableName, row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12, row13, row14, row15, row16);
  }

  /**
   * This keyword is used to extend a 'Given', 'When', or 'Then' step.
   * It allows you to add multiple conditions or actions in the same step
   * without having to repeat the 'Given', 'When', or 'Then' keyword.
   * For example, "And I should see a confirmation message" could follow
   * a 'Then' step to further specify the expected outcomes.
   */
  and(_: string): Given {
    return Given._internal(this.bdd, _, _Variation.and);
  }

  /**
   * This keyword is used similarly to "And," but it is typically used for
   * negative conditions or to express a contrast with the previous step.
   * It's a way to extend a "Given," "When," or "Then" step with an additional
   * condition that contrasts with what was previously stated. For example,
   * after a "Then" step, you might have "But I should not be logged out."
   * This helps in creating more comprehensive scenarios by covering both
   * what should happen and what should not happen under certain conditions.
   */
  but(_: string): Given {
    return Given._internal(this.bdd, _, _Variation.but);
  }

  /**
   * Often used informally in comments within a Gherkin document to provide
   * additional information, clarifications, or explanations about the scenario
   * or steps. Comments in Gherkin are usually marked with a hashtag (#) and
   * are ignored when the tests are executed. A "Note" can be useful for
   * giving context or explaining the rationale behind a certain test scenario,
   * making it easier for others to understand the purpose and scope of the test.
   */
  note(_: string): Given {
    return Given._internal(this.bdd, _, _Variation.note);
  }

  /**
   * This keyword indicates the specific action taken by the user or the system.
   * It's the trigger for the behavior that you're specifying. For instance,
   * "When I click the 'Submit' button" describes the action taken after the
   * initial context is set by the 'Given' step.
   */
  when(_: string): When {
    return new When(this.bdd, _);
  }

  /**
   * This keyword is used to describe the expected outcome or result after the
   * 'When' step is executed. It's used to assert that a certain outcome should
   * occur, which helps to validate whether the system behaves as expected.
   * An example is, "Then I should be redirected to the dashboard".
   */
  then(_: string): Then {
    return new Then(this.bdd, _);
  }

  code(code: CodeRun): _GivenCode {
    return new _GivenCode(this.bdd, code);
  }

  toString(config: Config = Config._default): string {
    return super.toString(config);
  }
}

class _GivenCode extends CodeTerm {

  constructor(bdd: BDD, code: CodeRun) {
    super(bdd, code);
  }

  /**
   * A table must have a name and rows. The name is necessary if you want to
   * read the values from it later (if not, just pass an empty string).
   * Example: `ctx.table('notifications').row(0).val('read') as bool`.
   */
  table(tableName: string, row1: Row, row2?: Row, row3?: Row, row4?: Row): GivenTable {
    return new GivenTable(this.bdd, tableName, row1, row2, row3, row4);
  }

  /**
   * This keyword is used to extend a 'Given', 'When', or 'Then' step.
   * It allows you to add multiple conditions or actions in the same step
   * without having to repeat the 'Given', 'When', or 'Then' keyword.
   * For example, "And I should see a confirmation message" could follow
   * a 'Then' step to further specify the expected outcomes.
   */
  and(_: string): Given {
    return Given._internal(this.bdd, _, _Variation.and);
  }

  /**
   * This keyword is used similarly to "And," but it is typically used for
   * negative conditions or to express a contrast with the previous step.
   * It's a way to extend a "Given," "When," or "Then" step with an additional
   * condition that contrasts with what was previously stated. For example,
   * after a "Then" step, you might have "But I should not be logged out."
   * This helps in creating more comprehensive scenarios by covering both
   * what should happen and what should not happen under certain conditions.
   */
  but(_: string): Given {
    return Given._internal(this.bdd, _, _Variation.but);
  }

  /**
   * Often used informally in comments within a Gherkin document to provide
   * additional information, clarifications, or explanations about the scenario
   * or steps. Comments in Gherkin are usually marked with a hashtag (#) and
   * are ignored when the tests are executed. A "Note" can be useful for
   * giving context or explaining the rationale behind a certain test scenario,
   * making it easier for others to understand the purpose and scope of the test.
   */
  note(_: string): Given {
    return Given._internal(this.bdd, _, _Variation.note);
  }

  /**
   * This keyword indicates the specific action taken by the user or the system.
   * It's the trigger for the behavior that you're specifying. For instance,
   * "When I click the 'Submit' button" describes the action taken after the
   * initial context is set by the 'Given' step.
   */
  when(_: string): When {
    return new When(this.bdd, _);
  }

  code(code: CodeRun): _GivenCode {
    return new _GivenCode(this.bdd, code);
  }
}

class When extends Term {
  constructor(bdd: BDD, text: string, variation: _Variation = _Variation.term) {
    super(bdd, text, variation);
  }

  static _internal(bdd: BDD, text: string, variation: _Variation): When {
    return new When(bdd, text, variation);
  }

  spaces(config: Config): string {
    return config.spaces + config.spaces;
  }

  keyword(config: Config): string {
    return this._keywordVariation(config) ?? config.keywords.when;
  }

  keywordPrefix(config: Config): string {
    return this._keywordPrefixVariation(config) ?? config.keywordPrefix.when;
  }

  keywordSuffix(config: Config): string {
    return this._keywordSuffixVariation(config) ?? config.keywordSuffix.when;
  }

  prefix(config: Config): string {
    return this._prefixVariation(config) ?? config.prefix.when;
  }

  suffix(config: Config): string {
    return this._suffixVariation(config) ?? config.suffix.when;
  }

  /**
   * A table must have a name and rows. The name is necessary if you want to
   * read the values from it later (if not, just pass an empty string).
   * Example: `ctx.table('notifications').row(0).val('read') as bool`.
   */
  table(tableName: string, row1: Row, row2?: Row, row3?: Row, row4?: Row): WhenTable {
    return new WhenTable(this.bdd, tableName, row1, row2, row3, row4);
  }

  /**
   * This keyword is used to extend a 'Given', 'When', or 'Then' step.
   * It allows you to add multiple conditions or actions in the same step
   * without having to repeat the 'Given', 'When', or 'Then' keyword.
   * For example, "And I should see a confirmation message" could follow
   * a 'Then' step to further specify the expected outcomes.
   */
  and(_: string): When {
    return When._internal(this.bdd, _, _Variation.and);
  }

  /**
   * This keyword is used similarly to "And," but it is typically used for
   * negative conditions or to express a contrast with the previous step.
   * It's a way to extend a "Given," "When," or "Then" step with an additional
   * condition that contrasts with what was previously stated. For example,
   * after a "Then" step, you might have "But I should not be logged out."
   * This helps in creating more comprehensive scenarios by covering both
   * what should happen and what should not happen under certain conditions.
   */
  but(_: string): When {
    return When._internal(this.bdd, _, _Variation.but);
  }

  /**
   * Often used informally in comments within a Gherkin document to provide
   * additional information, clarifications, or explanations about the scenario
   * or steps. Comments in Gherkin are usually marked with a hashtag (#) and
   * are ignored when the tests are executed. A "Note" can be useful for
   * giving context or explaining the rationale behind a certain test scenario,
   * making it easier for others to understand the purpose and scope of the test.
   */
  note(_: string): When {
    return When._internal(this.bdd, _, _Variation.note);
  }

  /**
   * This keyword is used to describe the expected outcome or result after the
   * 'When' step is executed. It's used to assert that a certain outcome should
   * occur, which helps to validate whether the system behaves as expected.
   * An example is, "Then I should be redirected to the dashboard".
   */
  then(_: string): Then {
    return new Then(this.bdd, _);
  }

  code(code: CodeRun): _WhenCode {
    return new _WhenCode(this.bdd, code);
  }

  run(code: CodeRun): void {
    new _Run().run(this.bdd, code);
  }

  toString(config: Config = Config._default): string {
    return super.toString(config);
  }
}

class _WhenCode extends CodeTerm {
  constructor(bdd: BDD, code: CodeRun) {
    super(bdd, code);
  }

  /**
   * A table must have a name and rows. The name is necessary if you want to
   * read the values from it later (if not, just pass an empty string).
   * Example: `ctx.table('notifications').row(0).val('read') as bool`.
   */
  table(tableName: string, row1: Row, row2?: Row, row3?: Row, row4?: Row): WhenTable {
    return new WhenTable(this.bdd, tableName, row1, row2, row3, row4);
  }

  /**
   * This keyword is used to extend a 'Given', 'When', or 'Then' step.
   * It allows you to add multiple conditions or actions in the same step
   * without having to repeat the 'Given', 'When', or 'Then' keyword.
   * For example, "And I should see a confirmation message" could follow
   * a 'Then' step to further specify the expected outcomes.
   */
  and(_: string): When {
    return When._internal(this.bdd, _, _Variation.and);
  }

  /**
   * This keyword is used similarly to "And," but it is typically used for
   * negative conditions or to express a contrast with the previous step.
   * It's a way to extend a "Given," "When," or "Then" step with an additional
   * condition that contrasts with what was previously stated. For example,
   * after a "Then" step, you might have "But I should not be logged out."
   * This helps in creating more comprehensive scenarios by covering both
   * what should happen and what should not happen under certain conditions.
   */
  but(_: string): When {
    return When._internal(this.bdd, _, _Variation.but);
  }

  /**
   * Often used informally in comments within a Gherkin document to provide
   * additional information, clarifications, or explanations about the scenario
   * or steps. Comments in Gherkin are usually marked with a hashtag (#) and
   * are ignored when the tests are executed. A "Note" can be useful for
   * giving context or explaining the rationale behind a certain test scenario,
   * making it easier for others to understand the purpose and scope of the test.
   */
  note(_: string): When {
    return When._internal(this.bdd, _, _Variation.note);
  }

  /**
   * This keyword is used to describe the expected outcome or result after the
   * 'When' step is executed. It's used to assert that a certain outcome should
   * occur, which helps to validate whether the system behaves as expected.
   * An example is, "Then I should be redirected to the dashboard".
   */
  then(_: string): Then {
    return new Then(this.bdd, _);
  }

  code(code: CodeRun): _WhenCode {
    return new _WhenCode(this.bdd, code);
  }
}

class Then extends Term {
  constructor(bdd: BDD, text: string, variation: _Variation = _Variation.term) {
    super(bdd, text, variation);
  }

  protected static _internal(bdd: BDD, text: string, variation: _Variation): Then {
    return new Then(bdd, text, variation);
  }

  spaces(config: Config): string {
    return config.spaces + config.spaces;
  }

  keyword(config: Config): string {
    return this._keywordVariation(config) ?? config.keywords.then;
  }

  keywordPrefix(config: Config): string {
    return this._keywordPrefixVariation(config) ?? config.keywordPrefix.then;
  }

  keywordSuffix(config: Config): string {
    return this._keywordSuffixVariation(config) ?? config.keywordSuffix.then;
  }

  prefix(config: Config): string {
    return this._prefixVariation(config) ?? config.prefix.then;
  }

  suffix(config: Config): string {
    return this._suffixVariation(config) ?? config.suffix.then;
  }

  /**
   * A table must have a name and rows. The name is necessary if you want to
   * read the values from it later (if not, just pass an empty string).
   * Example: `ctx.table('notifications').row(0).val('read') as bool`.
   */
  table(tableName: string, row1: Row, row2?: Row, row3?: Row, row4?: Row): ThenTable {
    return new ThenTable(this.bdd, tableName, row1, row2, row3, row4);
  }

  /**
   * This keyword is used to extend a 'Given', 'When', or 'Then' step.
   * It allows you to add multiple conditions or actions in the same step
   * without having to repeat the 'Given', 'When', or 'Then' keyword.
   * For example, "And I should see a confirmation message" could follow
   * a 'Then' step to further specify the expected outcomes.
   */
  and(_: string): Then {
    return Then._internal(this.bdd, _, _Variation.and);
  }

  /**
   * This keyword is used similarly to "And," but it is typically used for
   * negative conditions or to express a contrast with the previous step.
   * It's a way to extend a "Given," "When," or "Then" step with an additional
   * condition that contrasts with what was previously stated. For example,
   * after a "Then" step, you might have "But I should not be logged out."
   * This helps in creating more comprehensive scenarios by covering both
   * what should happen and what should not happen under certain conditions.
   */
  but(_: string): Then {
    return Then._internal(this.bdd, _, _Variation.but);
  }

  /**
   * Often used informally in comments within a Gherkin document to provide
   * additional information, clarifications, or explanations about the scenario
   * or steps. Comments in Gherkin are usually marked with a hashtag (#) and
   * are ignored when the tests are executed. A "Note" can be useful for
   * giving context or explaining the rationale behind a certain test scenario,
   * making it easier for others to understand the purpose and scope of the test.
   */
  note(_: string): Then {
    return Then._internal(this.bdd, _, _Variation.note);
  }

  /**
   * Examples are used in the context of Scenario Outlines. A Scenario Outline
   * is a template for multiple tests, and the "Examples" section provides
   * concrete values to be substituted into the template for each test run.
   * This approach allows for the specification of multiple scenarios using the
   * same pattern of action but with different sets of data.
   *
   * Here’s how it works:
   *
   * Scenario Outline: This is a kind of scenario that is run multiple times
   * with different data. It includes variables in the Given-When-Then steps,
   * which are indicated with angle brackets, like <variable>.
   *
   * Examples: This keyword introduces a table right below the Scenario Outline.
   * Each row in this table (except the header) represents a set of values that
   * will be passed into the Scenario Outline’s variables. The header row
   * defines the names of these variables.
   *
   * For example, if you have a Scenario Outline describing the login process,
   * you might have variables for username and password. The Examples table
   * will then list different combinations of usernames and passwords to test
   * various login scenarios.
   *
   * This approach is particularly useful for testing the same feature or
   * functionality under different conditions and with different inputs,
   * making your tests more comprehensive and robust. It also keeps your
   * Gherkin feature files DRY (Don't Repeat Yourself), as you avoid writing
   * multiple scenarios that differ only in the data they use.
   *
   * ```
   *   Bdd(feature)
   *       .scenario('Buying and Selling stocks changes the average price.')
   *       .given('The user has <Quantity> shares of <Ticker> at <At> dollars each.')
   *       .when('The user <BuyOrSell> <How many> of these stock at <Price> for each share.')
   *       .then('The number of shares becomes <Quantity> plus/minus <How many>.')
   *       .and('The average price for the stock becomes <Average Price>.')
   *       .example(
   *         val('Ticker', 'IBM'),
   *         val('Quantity', 10),
   *         val('At', 100.00),
   *         val('BuyOrSell', BuyOrSell.buy),
   *         val('How many', 2),
   *         val('Price', 50.00),
   *         val('Average Price', 91.67),
   *       )
   *       .example(
   *         val('Ticker', 'IBM'),
   *         val('Quantity', 8),
   *         val('At', 200.00),
   *         val('BuyOrSell', BuyOrSell.sell),
   *         val('How many', 3),
   *         val('Price', 30.00),
   *         val('Average Price', 302.00),
   *       )
   *       .run((ctx) async { ...
   * ```
   */
  example(v1: Val, v2?: Val, v3?: Val, v4?: Val, v5?: Val, v6?: Val, v7?: Val, v8?: Val, v9?: Val, v10?: Val, v11?: Val, v12?: Val, v13?: Val, v14?: Val, v15?: Val): Example {
    return new Example(this.bdd, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15);
  }

  code(code: CodeRun): _ThenCode {
    return new _ThenCode(this.bdd, code);
  }

  run(code: CodeRun): void {
    new _Run().run(this.bdd, code);
  }

  testRun(code: CodeRun, reporter: BddReporter): BDD {
    new _TestRun(code, reporter).run(this.bdd);
    return this.bdd;
  }

  toString(config: Config = Config._default): string {
    return super.toString(config);
  }
}

class _ThenCode extends CodeTerm {
  constructor(bdd: BDD, code: CodeRun) {
    super(bdd, code);
  }

  /**
   * A table must have a name and rows. The name is necessary if you want to
   * read the values from it later (if not, just pass an empty string).
   * Example: `ctx.table('notifications').row(0).val('read') as bool`.
   */
  table(tableName: string, row1: Row, row2?: Row, row3?: Row, row4?: Row): ThenTable {
    return new ThenTable(this.bdd, tableName, row1, row2, row3, row4);
  }

  /**
   * Examples are used in the context of Scenario Outlines. A Scenario Outline
   * is a template for multiple tests, and the "Examples" section provides
   * concrete values to be substituted into the template for each test run.
   * This approach allows for the specification of multiple scenarios using the
   * same pattern of action but with different sets of data.
   *
   * Here’s how it works:
   *
   * Scenario Outline: This is a kind of scenario that is run multiple times
   * with different data. It includes variables in the Given-When-Then steps,
   * which are indicated with angle brackets, like <variable>.
   *
   * Examples: This keyword introduces a table right below the Scenario Outline.
   * Each row in this table (except the header) represents a set of values that
   * will be passed into the Scenario Outline’s variables. The header row
   * defines the names of these variables.
   *
   * For example, if you have a Scenario Outline describing the login process,
   * you might have variables for username and password. The Examples table
   * will then list different combinations of usernames and passwords to test
   * various login scenarios.
   *
   * This approach is particularly useful for testing the same feature or
   * functionality under different conditions and with different inputs,
   * making your tests more comprehensive and robust. It also keeps your
   * Gherkin feature files DRY (Don't Repeat Yourself), as you avoid writing
   * multiple scenarios that differ only in the data they use.
   *
   * ```
   *   Bdd(feature)
   *       .scenario('Buying and Selling stocks changes the average price.')
   *       .given('The user has <Quantity> shares of <Ticker> at <At> dollars each.')
   *       .when('The user <BuyOrSell> <How many> of these stock at <Price> for each share.')
   *       .then('The number of shares becomes <Quantity> plus/minus <How many>.')
   *       .and('The average price for the stock becomes <Average Price>.')
   *       .example(
   *         val('Ticker', 'IBM'),
   *         val('Quantity', 10),
   *         val('At', 100.00),
   *         val('BuyOrSell', BuyOrSell.buy),
   *         val('How many', 2),
   *         val('Price', 50.00),
   *         val('Average Price', 91.67),
   *       )
   *       .example(
   *         val('Ticker', 'IBM'),
   *         val('Quantity', 8),
   *         val('At', 200.00),
   *         val('BuyOrSell', BuyOrSell.sell),
   *         val('How many', 3),
   *         val('Price', 30.00),
   *         val('Average Price', 302.00),
   *       )
   *       .run((ctx) async { ...
   * ```
   */
  example(v1: Val, v2?: Val, v3?: Val, v4?: Val, v5?: Val, v6?: Val, v7?: Val, v8?: Val, v9?: Val, v10?: Val, v11?: Val, v12?: Val, v13?: Val, v14?: Val, v15?: Val): Example {
    return new Example(this.bdd, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15);
  }

  /**
   * This keyword is used to extend a 'Given', 'When', or 'Then' step.
   * It allows you to add multiple conditions or actions in the same step
   * without having to repeat the 'Given', 'When', or 'Then' keyword.
   * For example, "And I should see a confirmation message" could follow
   * a 'Then' step to further specify the expected outcomes.
   */
  and(_: string): When {
    return When._internal(this.bdd, _, _Variation.and);
  }

  /**
   * This keyword is used similarly to "And," but it is typically used for
   * negative conditions or to express a contrast with the previous step.
   * It's a way to extend a "Given," "When," or "Then" step with an additional
   * condition that contrasts with what was previously stated. For example,
   * after a "Then" step, you might have "But I should not be logged out."
   * This helps in creating more comprehensive scenarios by covering both
   * what should happen and what should not happen under certain conditions.
   */
  but(_: string): When {
    return When._internal(this.bdd, _, _Variation.but);
  }

  /**
   * Often used informally in comments within a Gherkin document to provide
   * additional information, clarifications, or explanations about the scenario
   * or steps. Comments in Gherkin are usually marked with a hashtag (#) and
   * are ignored when the tests are executed. A "Note" can be useful for
   * giving context or explaining the rationale behind a certain test scenario,
   * making it easier for others to understand the purpose and scope of the test.
   */
  note(_: string): When {
    return When._internal(this.bdd, _, _Variation.note);
  }

  code(code: CodeRun): _ThenCode {
    return new _ThenCode(this.bdd, code);
  }

  run(code: CodeRun): void {
    new _Run().run(this.bdd, code);
  }

  testRun(code: CodeRun, reporter: BddReporter): BDD {
    new _TestRun(code, reporter).run(this.bdd);
    return this.bdd;
  }
}

class TableTerm extends Term {
  tableName: string;
  rows: Row[] = [];

  constructor(bdd: BDD, tableName: string) {
    super(bdd, '', _Variation.term);
    this.tableName = tableName;
  }

  run(code: CodeRun): void {
    new _Run().run(this.bdd, code);
  }

  /**
   * Here we have something like:
   * [
   * { (number;123), (password;ABC) }
   * { (number;456), (password;XYZ) }
   * ]
   */
  formatTable(config: Config): string {
    let sizes: { [key: string]: number } = {};
    for (let _row of this.rows) {
      for (let value of _row.values) {
        let maxValue1: number | undefined = sizes[value.name];
        let maxValue2: number = Math.max(value.name.length, value.toString(config).length);
        let maxValue: number = (maxValue1 === undefined) ? maxValue2 : Math.max(maxValue1, maxValue2);

        sizes[value.name] = maxValue;
      }
    }

    let spaces: string = config.spaces;
    let space: string = config.space;
    let endOfLineChar: string = config.endOfLineChar;
    let tableDivider: string = config.tableDivider;

    let rightAlignPadding: string = spaces +
      spaces +
      spaces +
      ((config.rightAlignKeywords) ? config.padChar.repeat(4) : '');

    let header: string = rightAlignPadding +
      `${tableDivider}${space}` +
      this.rows[0].values.map(value => {
        let length: number = sizes[value.name] ?? 50;
        return value.name.padEnd(length, space);
      }).join(`${space}${tableDivider}${space}`) +
      `${space}${tableDivider}`;

    let rowsStr: string[] = this.rows.map(row => {
      return rightAlignPadding +
        `${tableDivider}${space}` +
        row.values.map(value => {
          let length: number = sizes[value.name] ?? 50;
          return value.toString(config).padEnd(length, space);
        }).join(`${space}${tableDivider}${space}`) +
        `${space}${tableDivider}`;
    });

    let result: string = `${header}${endOfLineChar}` +
      `${rowsStr.join(endOfLineChar)}`;

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  spaces(config: Config): string {
    return '';
  }

  keyword(config: Config): string {
    return config.keywords.table;
  }

  keywordPrefix(config: Config): string {
    return config.keywordPrefix.table;
  }

  keywordSuffix(config: Config): string {
    return config.keywordSuffix.table;
  }

  prefix(config: Config): string {
    return config.prefix.table;
  }

  suffix(config: Config): string {
    return config.suffix.table;
  }

  toString(config: Config = Config._default): string {
    return this.keywordPrefix(config) +
      this.keyword(config) +
      this.keywordSuffix(config) +
      this.prefix(config) +
      this.formatTable(config) +
      this.suffix(config);
  }
}

class Example extends Term {

  // Rows is an array of Set objects containing values.
  rows: Set<Val>[] = [];

  constructor(
    bdd: BDD,
    v1: Val,
    v2?: Val,
    v3?: Val,
    v4?: Val,
    v5?: Val,
    v6?: Val,
    v7?: Val,
    v8?: Val,
    v9?: Val,
    v10?: Val,
    v11?: Val,
    v12?: Val,
    v13?: Val,
    v14?: Val,
    v15?: Val,
  ) {
    super(bdd, '', _Variation.term);
    const set =
      new Set([v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15]
        .filter(v => (v !== undefined) && (v !== null))) as Set<Val>;
    this.rows.push(set);
  }

  run(code: CodeRun): void {
    new _Run().run(this.bdd, code);
  }

  /**
   * Here we have something like:
   * [
   * { (number;123), (password;ABC) }
   * { (number;456), (password;XYZ) }
   * ]
   */
  formatExampleTable(config: Config): string {
    let sizes: { [key: string]: number } = {};

    this.rows.forEach(row => {
      row.forEach(value => {
        let maxValue1 = sizes[value.name];
        let maxValue2 = Math.max(value.name.length, value.toString(config).length);
        let maxValue = (maxValue1 === undefined) ? maxValue2 : Math.max(maxValue1, maxValue2);
        sizes[value.name] = maxValue;
      });
    });

    const { spaces, space, endOfLineChar, tableDivider, padChar, rightAlignKeywords } = config;
    const rightAlignPadding = spaces + spaces + spaces + (rightAlignKeywords ? padChar.repeat(4) : '');

    const header = rightAlignPadding + tableDivider + space +
      Array.from(this.rows.values().next().value as Set<Val>).map((value: Val) => {
        const length = sizes[value.name] ?? 50;
        return value.name.padEnd(length, space);
      }).join(space + tableDivider + space) + space + tableDivider;

    const rowsStr = this.rows.map((row) => {
      return rightAlignPadding + tableDivider + space +
        Array.from(row).map((value: Val) => {
          const length = sizes[value.name] ?? 50;
          return value.toString(config).padEnd(length, space);
        }).join(space + tableDivider + space) + space + tableDivider;
    });

    return header + endOfLineChar + rowsStr.join(endOfLineChar);
  }

  spaces(config: Config): string {
    return config.spaces + config.spaces;
  }

  keyword(config: Config): string {
    return this._keywordVariation(config) ?? config.keywords.examples;
  }

  keywordPrefix(config: Config): string {
    return this._keywordPrefixVariation(config) ?? config.keywordPrefix.examples;
  }

  keywordSuffix(config: Config): string {
    return this._keywordSuffixVariation(config) ?? config.keywordSuffix.examples;
  }

  prefix(config: Config): string {
    return this._prefixVariation(config) ?? config.prefix.examples;
  }

  suffix(config: Config): string {
    return this._suffixVariation(config) ?? config.suffix.examples;
  }

  /**
   * Examples are used in the context of Scenario Outlines. A Scenario Outline
   * is a template for multiple tests, and the "Examples" section provides
   * concrete values to be substituted into the template for each test run.
   * This approach allows for the specification of multiple scenarios using the
   * same pattern of action but with different sets of data.
   *
   * Here’s how it works:
   *
   * Scenario Outline: This is a kind of scenario that is run multiple times
   * with different data. It includes variables in the Given-When-Then steps,
   * which are indicated with angle brackets, like <variable>.
   *
   * Examples: This keyword introduces a table right below the Scenario Outline.
   * Each row in this table (except the header) represents a set of values that
   * will be passed into the Scenario Outline’s variables. The header row
   * defines the names of these variables.
   *
   * For example, if you have a Scenario Outline describing the login process,
   * you might have variables for username and password. The Examples table
   * will then list different combinations of usernames and passwords to test
   * various login scenarios.
   *
   * This approach is particularly useful for testing the same feature or
   * functionality under different conditions and with different inputs,
   * making your tests more comprehensive and robust. It also keeps your
   * Gherkin feature files DRY (Don't Repeat Yourself), as you avoid writing
   * multiple scenarios that differ only in the data they use.
   *
   * ```
   *   Bdd(feature)
   *       .scenario('Buying and Selling stocks changes the average price.')
   *       .given('The user has <Quantity> shares of <Ticker> at <At> dollars each.')
   *       .when('The user <BuyOrSell> <How many> of these stock at <Price> for each share.')
   *       .then('The number of shares becomes <Quantity> plus/minus <How many>.')
   *       .and('The average price for the stock becomes <Average Price>.')
   *       .example(
   *         val('Ticker', 'IBM'),
   *         val('Quantity', 10),
   *         val('At', 100.00),
   *         val('BuyOrSell', BuyOrSell.buy),
   *         val('How many', 2),
   *         val('Price', 50.00),
   *         val('Average Price', 91.67),
   *       )
   *       .example(
   *         val('Ticker', 'IBM'),
   *         val('Quantity', 8),
   *         val('At', 200.00),
   *         val('BuyOrSell', BuyOrSell.sell),
   *         val('How many', 3),
   *         val('Price', 30.00),
   *         val('Average Price', 302.00),
   *       )
   *       .run((ctx) async { ...
   * ```
   */
  example(
    v1: Val,
    v2?: Val,
    v3?: Val,
    v4?: Val,
    v5?: Val,
    v6?: Val,
    v7?: Val,
    v8?: Val,
    v9?: Val,
    v10?: Val,
    v11?: Val,
    v12?: Val,
    v13?: Val,
    v14?: Val,
    v15?: Val,
  ): Example {
    const set = new Set([v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15]
      .filter(v => (v !== undefined) && (v !== null))) as Set<Val>;
    this.rows.push(set);
    return this;
  }

  // Visible for testing.
  testRun(code: CodeRun, reporter: BddReporter): BDD {
    new _TestRun(code, reporter).run(this.bdd);
    return this.bdd;
  }

  // Examples have a special toString treatment.
  toString(config: Config = Config._default): string {
    return this.keywordPrefix(config) +
      this.spaces(config) +
      this.keyword(config) +
      this.keywordSuffix(config) +
      ' ' +
      this.prefix(config) +
      config.endOfLineChar +
      this.formatExampleTable(config) +
      this.suffix(config);
  }
}

class GivenTable extends TableTerm {
  constructor(
    bdd: BDD,
    tableName: string,
    row1: Row, row2?: Row, row3?: Row, row4?: Row, row5?: Row, row6?: Row, row7?: Row, row8?: Row, row9?: Row, row10?: Row, row11?: Row, row12?: Row, row13?: Row, row14?: Row, row15?: Row, row16?: Row,
  ) {
    super(bdd, tableName);

    this.rows.push(...[
      row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12, row13, row14, row15, row16,
    ].filter(row => (row !== null) && (row !== undefined)) as Row[]);
  }

  /**
   * This keyword is used to extend a 'Given', 'When', or 'Then' step.
   * It allows you to add multiple conditions or actions in the same step
   * without having to repeat the 'Given', 'When', or 'Then' keyword.
   * For example, "And I should see a confirmation message" could follow
   * a 'Then' step to further specify the expected outcomes.
   */
  and(_: string): Given {
    return new Given(this.bdd, _, _Variation.and);
  }

  /**
   * This keyword is used similarly to "And," but it is typically used for
   * negative conditions or to express a contrast with the previous step.
   * It's a way to extend a "Given," "When," or "Then" step with an additional
   * condition that contrasts with what was previously stated. For example,
   * after a "Then" step, you might have "But I should not be logged out."
   * This helps in creating more comprehensive scenarios by covering both
   * what should happen and what should not happen under certain conditions.
   */
  but(_: string): Given {
    return new Given(this.bdd, _, _Variation.but);
  }

  /**
   * Often used informally in comments within a Gherkin document to provide
   * additional information, clarifications, or explanations about the scenario
   * or steps. Comments in Gherkin are usually marked with a hashtag (#) and
   * are ignored when the tests are executed. A "Note" can be useful for
   * giving context or explaining the rationale behind a certain test scenario,
   * making it easier for others to understand the purpose and scope of the test.
   */
  note(_: string): Given {
    return new Given(this.bdd, _, _Variation.note);
  }

  /**
   * This keyword indicates the specific action taken by the user or the system.
   * It's the trigger for the behavior that you're specifying. For instance,
   * "When I click the 'Submit' button" describes the action taken after the
   * initial context is set by the 'Given' step.
   */
  when(_: string): When {
    return new When(this.bdd, _);
  }

  code(code: CodeRun): _GivenCode {
    return new _GivenCode(this.bdd, code);
  }

  toString(config: Config = Config._default): string {
    return super.toString(config);
  }
}

class WhenTable extends TableTerm {
  // Constructor with optional parameters
  constructor(
    bdd: BDD,
    tableName: string,
    row1: Row, row2?: Row, row3?: Row, row4?: Row, row5?: Row, row6?: Row, row7?: Row, row8?: Row, row9?: Row, row10?: Row, row11?: Row, row12?: Row, row13?: Row, row14?: Row, row15?: Row, row16?: Row,
  ) {
    super(bdd, tableName);

    this.rows.push(...[
      row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12, row13, row14, row15, row16,
    ].filter(row => (row !== null) && (row !== undefined)) as Row[]);
  }

  /**
   * This keyword is used to extend a 'Given', 'When', or 'Then' step.
   * It allows you to add multiple conditions or actions in the same step
   * without having to repeat the 'Given', 'When', or 'Then' keyword.
   * For example, "And I should see a confirmation message" could follow
   * a 'Then' step to further specify the expected outcomes.
   */
  and(_: string): When {
    return When._internal(this.bdd, _, _Variation.and);
  }

  /**
   * This keyword is used similarly to "And," but it is typically used for
   * negative conditions or to express a contrast with the previous step.
   * It's a way to extend a "Given," "When," or "Then" step with an additional
   * condition that contrasts with what was previously stated. For example,
   * after a "Then" step, you might have "But I should not be logged out."
   * This helps in creating more comprehensive scenarios by covering both
   * what should happen and what should not happen under certain conditions.
   */
  but(_: string): When {
    return When._internal(this.bdd, _, _Variation.but);
  }

  /**
   * Often used informally in comments within a Gherkin document to provide
   * additional information, clarifications, or explanations about the scenario
   * or steps. Comments in Gherkin are usually marked with a hashtag (#) and
   * are ignored when the tests are executed. A "Note" can be useful for
   * giving context or explaining the rationale behind a certain test scenario,
   * making it easier for others to understand the purpose and scope of the test.
   */
  note(_: string): When {
    return When._internal(this.bdd, _, _Variation.note);
  }

  /**
   * This keyword is used to describe the expected outcome or result after the
   * 'When' step is executed. It's used to assert that a certain outcome should
   * occur, which helps to validate whether the system behaves as expected.
   * An example is, "Then I should be redirected to the dashboard".
   */
  then(_: string): Then {
    return new Then(this.bdd, _);
  }

  code(code: CodeRun): _WhenCode {
    return new _WhenCode(this.bdd, code);
  }

  // Overriding the toString method
  toString(config: Config = Config._default): string {
    return super.toString(config);
  }
}

class ThenTable extends TableTerm {

  constructor(
    bdd: BDD,
    tableName: string,
    row1: Row, row2?: Row, row3?: Row, row4?: Row, row5?: Row, row6?: Row, row7?: Row, row8?: Row, row9?: Row, row10?: Row, row11?: Row, row12?: Row, row13?: Row, row14?: Row, row15?: Row, row16?: Row,
  ) {
    super(bdd, tableName);

    this.rows.push(...[
      row1, row2, row3, row4, row5, row6, row7, row8, row9, row10, row11, row12, row13, row14, row15, row16,
    ].filter(row => (row !== null) && (row !== undefined)) as Row[]);
  }

  /**
   * This keyword is used to extend a 'Given', 'When', or 'Then' step.
   * It allows you to add multiple conditions or actions in the same step
   * without having to repeat the 'Given', 'When', or 'Then' keyword.
   * For example, "And I should see a confirmation message" could follow
   * a 'Then' step to further specify the expected outcomes.
   */
  and(_: string): Then {
    return new Then(this.bdd, _, _Variation.and);
  }

  /**
   * This keyword is used similarly to "And," but it is typically used for
   * negative conditions or to express a contrast with the previous step.
   * It's a way to extend a "Given," "When," or "Then" step with an additional
   * condition that contrasts with what was previously stated. For example,
   * after a "Then" step, you might have "But I should not be logged out."
   * This helps in creating more comprehensive scenarios by covering both
   * what should happen and what should not happen under certain conditions.
   */
  but(_: string): Then {
    return new Then(this.bdd, _, _Variation.but);
  }

  /**
   * Often used informally in comments within a Gherkin document to provide
   * additional information, clarifications, or explanations about the scenario
   * or steps. Comments in Gherkin are usually marked with a hashtag (#) and
   * are ignored when the tests are executed. A "Note" can be useful for
   * giving context or explaining the rationale behind a certain test scenario,
   * making it easier for others to understand the purpose and scope of the test.
   */
  note(_: string): Then {
    return new Then(this.bdd, _, _Variation.note);
  }

  /**
   * Examples are used in the context of Scenario Outlines. A Scenario Outline
   * is a template for multiple tests, and the "Examples" section provides
   * concrete values to be substituted into the template for each test run.
   * This approach allows for the specification of multiple scenarios using the
   * same pattern of action but with different sets of data.
   *
   * Here’s how it works:
   *
   * Scenario Outline: This is a kind of scenario that is run multiple times
   * with different data. It includes variables in the Given-When-Then steps,
   * which are indicated with angle brackets, like <variable>.
   *
   * Examples: This keyword introduces a table right below the Scenario Outline.
   * Each row in this table (except the header) represents a set of values that
   * will be passed into the Scenario Outline’s variables. The header row
   * defines the names of these variables.
   *
   * For example, if you have a Scenario Outline describing the login process,
   * you might have variables for username and password. The Examples table
   * will then list different combinations of usernames and passwords to test
   * various login scenarios.
   *
   * This approach is particularly useful for testing the same feature or
   * functionality under different conditions and with different inputs,
   * making your tests more comprehensive and robust. It also keeps your
   * Gherkin feature files DRY (Don't Repeat Yourself), as you avoid writing
   * multiple scenarios that differ only in the data they use.
   *
   * ```
   *   Bdd(feature)
   *       .scenario('Buying and Selling stocks changes the average price.')
   *       .given('The user has <Quantity> shares of <Ticker> at <At> dollars each.')
   *       .when('The user <BuyOrSell> <How many> of these stock at <Price> for each share.')
   *       .then('The number of shares becomes <Quantity> plus/minus <How many>.')
   *       .and('The average price for the stock becomes <Average Price>.')
   *       .example(
   *         val('Ticker', 'IBM'),
   *         val('Quantity', 10),
   *         val('At', 100.00),
   *         val('BuyOrSell', BuyOrSell.buy),
   *         val('How many', 2),
   *         val('Price', 50.00),
   *         val('Average Price', 91.67),
   *       )
   *       .example(
   *         val('Ticker', 'IBM'),
   *         val('Quantity', 8),
   *         val('At', 200.00),
   *         val('BuyOrSell', BuyOrSell.sell),
   *         val('How many', 3),
   *         val('Price', 30.00),
   *         val('Average Price', 302.00),
   *       )
   *       .run((ctx) async { ...
   * ```
   */
  example(v1: Val, v2?: Val, v3?: Val, v4?: Val, v5?: Val, v6?: Val, v7?: Val, v8?: Val, v9?: Val, v10?: Val, v11?: Val, v12?: Val, v13?: Val, v14?: Val, v15?: Val): Example {
    return new Example(this.bdd, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15);
  }

  code(code: CodeRun): _ThenCode {
    return new _ThenCode(this.bdd, code);
  }

  toString(config: Config = Config._default): string {
    return super.toString(config);
  }

  run(code: CodeRun): void {
    new _Run().run(this.bdd, code);
  }

  testRun(code: CodeRun, reporter: BddReporter): BDD {
    new _TestRun(code, reporter).run(this.bdd);
    return this.bdd;
  }
}

export class TestResult {
  private _bdd: BDD;

  constructor(bdd: BDD) {
    this._bdd = bdd;
  }

  get terms(): Iterable<Term> {
    return this._bdd.textTerms;
  }

  toMap(config: Config = Config._default): string[] {
    return this._bdd.toMap(config);
  }

  toString(config: Config = Config._default): string {
    return this._bdd.toString(config);
  }

  get wasSkipped(): boolean {
    return this._bdd._skip;
  }

  /**
   * Empty means the test was not run yet.
   * If the Bdd has no examples, the result will be a single value.
   * Otherwise, it will have one result for each example.
   *
   * For each value:
   * True values means it passed.
   * False values means it did not pass.
   */
  get passed(): boolean[] {
    return this._bdd.passed;
  }
}

export class Feature {
  readonly title: string;
  readonly description?: string;
  private readonly _bdds: BDD[];

  constructor(title: string, description?: string) {
    this.title = title;
    this.description = description;
    this._bdds = [];
  }

  get bdds(): BDD[] {
    return [...this._bdds];
  }

  get isEmpty(): boolean {
    return this.title.length === 0;
  }

  get isNotEmpty(): boolean {
    return this.title.length > 0;
  }

  get testResults(): TestResult[] {
    return this._bdds.map(bdd => new TestResult(bdd));
  }

  add(bdd: BDD): void {
    this._bdds.push(bdd);
  }

  toString(config: Config = Config._default): string {
    let result = config.keywordPrefix.feature +
      config.keywords.feature +
      config.keywordSuffix.feature +
      ' ' +
      config.prefix.feature +
      this.title +
      config.suffix.feature +
      config.endOfLineChar;

    if (this.description) {
      const parts = this.description.trim().split('\n');
      result += config.spaces +
        config.prefix.feature +
        parts.join(config.endOfLineChar + config.spaces) +
        config.suffix.feature +
        config.endOfLineChar;
    }

    return result;
  }
}

class _RunInfo {
  totalTestCount: number = 0;
  testCount: number = 0;
  skipCount: number = 0;
  passedCount: number = 0;
  failedCount: number = 0;
}

export function reporter(r1?: BddReporter, r2?: BddReporter, r3?: BddReporter, r4?: BddReporter, r5?: BddReporter): void {
  BddReporter.set(r1, r2, r3, r4, r5);
}

/**
 * Example:
 *
 * ```
 * void main() async {
 *   BddReporter.set(ConsoleReporter(), FeatureFileReporter());
 *   group('favorites_test', favorites_test.main);
 *   group('search_test', search_test.main);
 *   await BddReporter.reportAll();
 * }
 * ```
 */
export abstract class BddReporter {

  /** Subclasses must implement this. */
  abstract report(): Promise<void>;

  static runInfo = new _RunInfo();
  private static _emptyFeature = new Feature('');
  public static _reporters: BddReporter[] = [];
  static yellow: string = '\x1B[38;5;226m';
  static reset: string = '\u001b[0m';

  // Static method to set reporters.
  static set(r1?: BddReporter, r2?: BddReporter, r3?: BddReporter, r4?: BddReporter, r5?: BddReporter): void {
    BddReporter._reporters = [r1, r2, r3, r4, r5].filter(_reporter => _reporter !== undefined) as BddReporter[];
    BddReporter._reportAll();
  }

  private static _reportAll() {

    afterAll(async () => {

      // TODO: Move this to a Jest Custom Reporter?
      // console.log(
      //   `${this.yellow}\n` +
      //   'RESULTS ════════════════════════════════════════════════\n' +
      //   `TOTAL: ${this.runInfo.totalTestCount} tests (${this.runInfo.testCount} BDDs)\n` +
      //   `PASSED: ${this.runInfo.passedCount} tests\n` +
      //   `FAILED: ${this.runInfo.failedCount} tests\n` +
      //   `SKIPPED: ${this.runInfo.skipCount} tests\n` +
      //   `══════════════════════════════════════════════════════${this.reset}\n\n`,
      // );

      for (const _reporter of this._reporters) {

        // TODO: Move this to a Jest Custom Reporter?
        // console.log(`Running the ${_reporter.constructor.name}...\n`);

        await _reporter.report();
      }
    });
  }

  features: Set<Feature> = new Set();

  public _addBdd(bdd: BDD): void {

    // Use the feature, if provided. Otherwise, use the "empty feature".
    let _feature = bdd.feature ?? BddReporter._emptyFeature;

    // We must find out if we already have a feature with the given title.
    // If we do, use the one we already have.
    let feature = Array.from(this.features).find(f => f.title === _feature.title);

    // If we don't, use the new one provided, and put it in the features set.
    if (feature === undefined) {
      feature = _feature;
      this.features.add(feature);
    }

    // Add the bdd to the feature.
    feature.add(bdd);
  }

  /** Keeps A-Z 0-9, make it lowercase, and change spaces into underline. */
  normalizeFileName(name: string): string {
    return name.trim().split('').map(char => {
      if (char === ' ') return '_';
      if (!/[A-Za-z0-9]/.test(char)) return '';
      return char.toLowerCase();
    }).join('');
  }
}


type CodeRun = ((ctx: Context) => Promise<void> | void) | undefined;

/** This will run with the global reporter/runInfo. */
class _Run {
  run(bdd: BDD, code: CodeRun): void {

    // Add the code to the BDD, as a ThenCode.
    // eslint-disable-next-line no-new
    new _ThenCode(bdd, code);

    BddReporter._reporters.forEach((_reporter) => {
      _reporter._addBdd(bdd);
    });

    const numberOfExamples = bdd.numberOfExamples();
    BddReporter.runInfo.testCount++;

    if (numberOfExamples === 0) {
      this._runTheTest(bdd, null);
    } else {
      for (let i = 0; i < numberOfExamples; i++) {
        this._runTheTest(bdd, i);
      }
    }
  }

  static readonly red = '\x1B[38;5;9m';
  static readonly blue = '\x1B[38;5;45m';
  static readonly yellow = '\x1B[38;5;226m';
  static readonly grey = '\x1B[38;5;246m';
  static readonly bold = '\u001b[1m';
  static readonly italic = '\u001b[3m';
  static readonly boldItalic = _Run.bold + _Run.italic;
  static readonly boldOff = '\u001b[22m';
  static readonly italicOff = '\u001b[23m';
  static readonly boldItalicOff = _Run.boldOff + _Run.italicOff;
  static readonly reset = '\u001b[0m';

  static readonly config: Config = new Config({
    keywords: new Keywords({
      feature: `${_Run.boldItalic}Feature:${_Run.boldItalicOff}`,
      scenario: `${_Run.boldItalic}Scenario:${_Run.boldItalicOff}`,
      scenarioOutline: `${_Run.boldItalic}Scenario Outline:${_Run.boldItalicOff}`,
      given: `${_Run.boldItalic}Given${_Run.boldItalicOff}`,
      when: `${_Run.boldItalic}When${_Run.boldItalicOff}`,
      then: `${_Run.boldItalic}Then${_Run.boldItalicOff}`,
      and: `${_Run.boldItalic}And${_Run.boldItalicOff}`,
      but: `${_Run.boldItalic}But${_Run.boldItalicOff}`,
      comment: `${_Run.boldItalic}#${_Run.boldItalicOff}`,
      examples: `${_Run.boldItalic}Examples:${_Run.boldItalicOff}`,
    }),
    keywordPrefix: new Keywords({
      feature: '',
      scenario: '\n',
      scenarioOutline: '\n',
      given: '\n',
      when: '\n',
      then: '\n',
      and: '',
      but: '',
      comment: _Run.grey,
      examples: '\n',
      table: '',
    }),
    suffix: new Keywords({
      feature: '',
      scenario: '',
      scenarioOutline: '',
      given: '',
      when: '',
      then: '',
      and: '',
      but: '',
      comment: _Run.blue,
      examples: '',
      table: '',
    }),
  });

  subscript(index: number): string {
    let result = '';
    const x = index.toString();
    for (let i = 0; i < x.length; i++) {
      const char = x[i];
      result += {
        '0': '₀',
        '1': '₁',
        '2': '₂',
        '3': '₃',
        '4': '₄',
        '5': '₅',
        '6': '₆',
        '7': '₇',
        '8': '₈',
        '9': '₉',
      }[char];
    }
    return result;
  }

  /**  Returns something like: "4₁₂" */
  private testCountStr(testCount: number, exampleNumber: number | null): string {
    return `${testCount}${exampleNumber === null ? '' : this.subscript(exampleNumber + 1)}`;
  }

  /**
   * If the Bdd has examples, this method will be called once for each example, with
   * [exampleNumber] starting in 0.
   *
   * If the Bdd does NOT have examples, this method will run once, with [exampleNumber] null.
   */
  private _runTheTest(bdd: BDD, exampleNumber: number | null): void {

    BddReporter.runInfo.totalTestCount++;

    let currentExecution = 0;
    const bddStr = bdd.toString(_Run.config, true);
    const testCount = BddReporter.runInfo.testCount;

    const _testCountStr = this.testCountStr(testCount, exampleNumber);
    const _testName = `${_testCountStr} ${bdd.description()}`;

    // Test is skipped.
    if (bdd._skip) {
      BddReporter.runInfo.skipCount++;

      // eslint-disable-next-line jest/no-disabled-tests
      test.skip(
        _testName,
        async () => {
        },
      );
    }
      //
    // Test is NOT skipped.
    else {

      // We delegate to Jest to actually run the test.
      test(
        //
        // Test name:
        _testName,
        //
        // Test code:
        async () => {
          currentExecution++;

          console.log((currentExecution === 1)
            ? `\n${this._header(bdd._skip, _testCountStr)}${_Run.blue}${bddStr}${_Run.boldOff}`
            : `\n${_Run.red}Retry ${currentExecution}.\n${_Run.boldOff}`);

          const example = TableValues.from(bdd.exampleRow(exampleNumber));
          const tables = MultipleTableValues.from(bdd.tables());
          const ctx = new Context(example, tables);

          try {
            for (const codeTerm of bdd.codeTerms) {
              if (codeTerm.codeRun) {
                await codeTerm.codeRun(ctx);
              }
            }
          } catch (error) {
            bdd.passed.push(false);
            BddReporter.runInfo.failedCount++;
            throw error;
          }

          bdd.passed.push(true);
          BddReporter.runInfo.passedCount++;
        },
        //
        // Timeout:
        bdd._timeout);
    }
  }

  _header(skip: boolean, testNumberStr: string): string {
    return `${_Run.yellow}${_Run.italic}TEST ${testNumberStr} ${skip ? 'SKIPPED' : ''} ${_Run.italicOff}══════════════════════════════════════════════════${_Run.reset}\n\n`;
  }
}

/** This is for testing the BDD framework only. */
class _TestRun {
  private readonly code: CodeRun;
  private readonly reporter?: BddReporter;

  constructor(code: CodeRun, reporter?: BddReporter) {
    this.code = code;
    this.reporter = reporter;
  }

  run(bdd: BDD): void {
    // Add the code to the BDD, as a ThenCode.
    // eslint-disable-next-line no-new
    new _ThenCode(bdd, this.code);

    if (this.reporter) {
      this.reporter._addBdd(bdd);
    }

    const numberOfExamples = bdd.numberOfExamples();

    if (numberOfExamples === 0) {
      this._runTheTest(bdd, null);
    } else {
      for (let i = 0; i < numberOfExamples; i++) {
        this._runTheTest(bdd, i);
      }
    }
  }

  private _runTheTest(bdd: BDD, exampleNumber: number | null): void {
    const example = TableValues.from(bdd.exampleRow(exampleNumber));
    const tables = MultipleTableValues.from(bdd.tables());
    const ctx = new Context(example, tables);

    if (!bdd.skip) {
      try {
        // Run all bdd code.
        const codeRuns: (CodeRun | undefined)[] =
          Array.from(bdd.codeTerms).map((codeTerm: CodeTerm) => codeTerm.codeRun);

        for (const codeRun of codeRuns) {
          if (codeRun) {
            codeRun(ctx);
          }
        }

        bdd.passed.push(true);
      } catch (error) {
        bdd.passed.push(false);
      }
    }
  }
}

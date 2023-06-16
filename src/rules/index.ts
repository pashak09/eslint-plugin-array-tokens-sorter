import { Rule } from 'eslint';
import { ArrayExpression } from 'estree';

import { Rules } from '../enums/Rules';
import { Options } from '../index';

import { alphabeticalOrderArrayRule } from './alphabeticalOrderArrayRule';
import { uniqueAlphabeticalOrderArrayRule } from './uniqueAlphabeticalOrderArrayRule';

type Callback = (node: ArrayExpression, context: Rule.RuleContext, options: Options) => void;

const ruleCallbackMapper: Record<Rules, Callback> = {
  [Rules.ALPHABETICAL_ORDER]: alphabeticalOrderArrayRule,
  [Rules.UNIQUE_ALPHABETICAL_ORDER]: uniqueAlphabeticalOrderArrayRule,
};

export function arrayTokesRules(node: ArrayExpression, context: Rule.RuleContext, rule: Rules, options: Options): void {
  ruleCallbackMapper[rule](node, context, options);
}

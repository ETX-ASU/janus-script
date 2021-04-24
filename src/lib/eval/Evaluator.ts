import { ArrayLiteral } from '../ast/ArrayLiteral';
import { BlockStatement } from '../ast/BlockStatement';
import { BooleanLiteral } from '../ast/BooleanLiteral';
import { CallExpression } from '../ast/CallExpression';
import { DeleteStatement } from '../ast/DeleteStatement';
import { ExpressionStatement } from '../ast/ExpressionStatement';
import { FunctionLiteral } from '../ast/FunctionLiteral';
import { HashLiteral } from '../ast/HashLiteral';
import { Identifier } from '../ast/Identifier';
import { IfExpression } from '../ast/IfExpression';
import { IndexExpression } from '../ast/IndexExpression';
import { InfixExpression } from '../ast/InfixExpression';
import { LetStatement } from '../ast/LetStatement';
import { AstNode, AstNodeType, Expression } from '../ast/node';
import { NumberLiteral } from '../ast/NumberLiteral';
import { PrefixExpression } from '../ast/PrefixExpression';
import { Program } from '../ast/Program';
import { ReturnStatement } from '../ast/ReturnStatement';
import { StringLiteral } from '../ast/StringLiteral';
import { ArrayObj } from '../env/ArrayObj';
import { BoolObj } from '../env/BoolObj';
import { BuiltInFunctionObj } from '../env/BuiltinFunction';
import { Environment } from '../env/Environment';
import { ErrorObj } from '../env/ErrorObj';
import { FunctionObj } from '../env/FunctionObj';
import { Hashable, hashKey, HashObj, HashPair } from '../env/Hash';
import { NullObj } from '../env/NullObj';
import { NumberObj } from '../env/NumberObj';
import { EnvObj, EnvObjType } from '../env/obj';
import { ReturnValueObj } from '../env/ReturnValueObj';
import { StringObj } from '../env/StringObj';
import { builtins, FALSE, NULL, TRUE, UNDEFINED } from './builtin';

export class Evaluator {
    public eval(node: AstNode, env: Environment): EnvObj {
        switch (node.nodeType) {
            case AstNodeType.Program:
                return this.evalProgram(node as Program, env);
            case AstNodeType.ExpressionStatement:
                return this.eval((node as ExpressionStatement).Expression, env);

            case AstNodeType.NumberLiteral: {
                const num = new NumberObj();
                num.Value = (node as NumberLiteral).Value;
                return num;
            }
            case AstNodeType.StringLiteral: {
                const str = new StringObj();
                str.Value = (node as StringLiteral).Value;
                return str;
            }
            case AstNodeType.BooleanLiteral:
                return (node as BooleanLiteral).Value ? TRUE : FALSE;
            case AstNodeType.PrefixExpression: {
                const exprNode = node as PrefixExpression;
                const right = this.eval(exprNode.Right as AstNode, env);
                if (this.isError(right)) {
                    return right;
                }
                return this.evalPrefixExpression(
                    exprNode.Operator as string,
                    right
                );
            }
            case AstNodeType.InfixExpression: {
                const exprNode = node as InfixExpression;
                const left = this.eval(exprNode.Left as AstNode, env);
                if (this.isError(left)) {
                    return left;
                }
                const right = this.eval(exprNode.Right as AstNode, env);
                if (this.isError(right)) {
                    return right;
                }
                return this.evalInfixExpression(
                    exprNode.Operator as string,
                    left,
                    right
                );
            }
            case AstNodeType.BlockStatement:
                return this.evalBlockStatement(node as BlockStatement, env);
            case AstNodeType.IfExpression:
                return this.evalIfExpression(node as IfExpression, env);
            case AstNodeType.ReturnStatement:
                // eslint-disable-next-line no-case-declarations
                const value = this.eval(
                    (node as ReturnStatement).ReturnValue as AstNode,
                    env
                );
                if (this.isError(value)) {
                    return value;
                }
                return new ReturnValueObj(value);
            case AstNodeType.LetStatement: {
                const stmt = node as LetStatement;
                if (stmt.IsRef) {
                    if (env.isSet(stmt.Name.Value.toString())) {
                        // Get takes the store as precedence, so this we should overwrite
                        // by clearing first
                        env.Clear(stmt.Name.Value.toString());
                    }
                    env.Bind(stmt.Name.Value.toString(), stmt.Value.toString());
                } else {
                    if (env.isBound(stmt.Name.Value.toString())) {
                        return new ErrorObj(
                            `Identifier ${stmt.Name.Value} is a bound reference, cannot assign.`
                        );
                    }
                    const value = this.eval(stmt.Value as AstNode, env);
                    if (this.isError(value)) {
                        return value;
                    }
                    env.Set(stmt.Name?.Value as string, value);
                }
                return NULL;
            }
            case AstNodeType.DeleteStatement: {
                const stmt = node as DeleteStatement;
                return env.Clear(stmt.Name.Value.toString());
            }
            case AstNodeType.Identifier:
                return this.evalIdentifier(node as Identifier, env);
            case AstNodeType.FunctionLiteral: {
                const fnNode = node as FunctionLiteral;
                return new FunctionObj(fnNode.Parameters, fnNode.Body, env);
            }
            case AstNodeType.CallExpression: {
                const fn = this.eval((node as CallExpression).Function, env);
                if (this.isError(fn)) {
                    return fn;
                }
                const args = this.evalExpressions(
                    (node as CallExpression).Args,
                    env
                );
                if (args.length === 1 && this.isError(args[0])) {
                    return args[0];
                }
                return this.applyFunction(fn, args);
            }
            case AstNodeType.ArrayLiteral: {
                const elements = this.evalExpressions(
                    (node as ArrayLiteral).Elements,
                    env
                );
                if (elements.length === 1 && this.isError(elements[0])) {
                    return elements[0];
                }
                return new ArrayObj(elements);
            }
            case AstNodeType.IndexExpression: {
                const left = this.eval((node as IndexExpression).Left, env);
                if (this.isError(left)) {
                    return left;
                }
                const index = this.eval((node as IndexExpression).Index, env);
                if (this.isError(index)) {
                    return index;
                }
                return this.evalIndexExpression(left, index);
            }
            case AstNodeType.HashLiteral:
                return this.evalHashLiteral(node as HashLiteral, env);
        }

        return NULL;
    }

    evalExpressions(expressions: Expression[], env: Environment) {
        if (!Array.isArray(expressions)) {
            return [
                new ErrorObj(
                    `expressions error: ${JSON.stringify(expressions)}`
                ),
            ];
        }
        const result: EnvObj[] = [];
        for (const e of expressions) {
            const evaluated = this.eval(e, env);
            if (this.isError(evaluated)) {
                return [evaluated];
            }
            result.push(evaluated);
        }

        return result;
    }

    applyFunction(fn: EnvObj, args: EnvObj[]) {
        if (fn.Type() === EnvObjType.FUNCTION) {
            const fnEnv = this.extendFunctionEnv(fn as FunctionObj, args);
            const evaluated = this.eval(
                (fn as FunctionObj).Body as BlockStatement,
                fnEnv
            );
            return this.unwrapReturnValue(evaluated);
        }
        if (fn.Type() === EnvObjType.BUILTIN) {
            return (fn as BuiltInFunctionObj).Fn(...args);
        }
        return this.newError(`not a function! ${fn.Type()}`);
    }

    extendFunctionEnv(fn: FunctionObj, args: EnvObj[]) {
        const closureEnv = new Environment(fn.Env as Environment);
        fn.Parameters.forEach((p, index) => {
            closureEnv.Set(p.Value, args[index]);
        });
        return closureEnv;
    }

    unwrapReturnValue(obj: EnvObj) {
        if (obj.Type() === EnvObjType.RETURN_VALUE) {
            return (obj as ReturnValueObj).Value;
        }
        return obj;
    }

    evalProgram(program: Program, env: Environment): EnvObj {
        let result: EnvObj = new NullObj();
        for (const statement of program.Statements) {
            result = this.eval(statement, env);
            if (result.Type() === EnvObjType.RETURN_VALUE) {
                return (result as ReturnValueObj).Value;
            }
            if (result.Type() === EnvObjType.ERROR) {
                return result;
            }
        }

        return result;
    }

    evalIfExpression(ie: IfExpression, env: Environment) {
        const condition = this.eval(ie.Condition as Expression, env);
        if (this.isError(condition)) {
            return condition;
        }
        if (this.isTruthy(condition)) {
            return this.eval(ie.Consequence as AstNode, env);
        } else if (ie.Alternative) {
            return this.eval(ie.Alternative as AstNode, env);
        } else {
            return NULL;
        }
    }

    evalPrefixExpression(operator: string, right: EnvObj) {
        switch (operator) {
            case '!':
                return this.evalBangOperatorExpression(right);
            case '-':
                return this.evalMinusOperatorExpression(right);
            default:
                return this.newError(
                    `unknown operator: ${operator}${right.Type()}`
                );
        }
    }

    evalBangOperatorExpression(right: EnvObj) {
        switch (right) {
            case TRUE:
                return FALSE;
            case FALSE:
                return TRUE;
            case NULL:
                return TRUE;
            default:
                return FALSE;
        }
    }

    evalMinusOperatorExpression(right: EnvObj) {
        if (right.Type() !== EnvObjType.NUMBER) {
            return this.newError(`unknown operator: -${right.Type()}`);
        }
        const value = (right as NumberObj).Value;
        return new NumberObj(-value);
    }

    evalInfixExpression(operator: string, left: EnvObj, right: EnvObj) {
        if (
            left.Type() === EnvObjType.NUMBER &&
            right.Type() === EnvObjType.NUMBER
        ) {
            return this.evalNumberInfixExpression(
                operator,
                left as NumberObj,
                right as NumberObj
            );
        }
        if (operator === '==') {
            return this.nativeBoolToBooleanObj(this.isEqual(left, right));
        }
        if (operator === '!=') {
            return this.nativeBoolToBooleanObj(!this.isEqual(left, right));
        }
        if (left.Type() !== right.Type()) {
            return this.newError(
                `type mismatch ${left.Type()} ${operator} ${right.Type()}`
            );
        }
        if (left.Type() === EnvObjType.STRING) {
            return this.evalStringInfixExpression(
                operator,
                left as StringObj,
                right as StringObj
            );
        }
        return this.newError(
            `unknown operator: ${left.Type()} ${operator} ${right.Type()}`
        );
    }

    evalStringInfixExpression(
        operator: string,
        left: StringObj,
        right: StringObj
    ) {
        if (operator !== '+') {
            return this.newError(`unknown operator: string ${operator} string`);
        }
        return new StringObj(left.Value + right.Value);
    }

    evalNumberInfixExpression(
        operator: string,
        left: NumberObj,
        right: NumberObj
    ) {
        const leftVal = left.Value;
        const rightVal = right.Value;
        switch (operator) {
            case '+':
                return new NumberObj(leftVal + rightVal);
            case '-':
                return new NumberObj(leftVal - rightVal);
            case '*':
                return new NumberObj(leftVal * rightVal);
            case '/':
                return new NumberObj(leftVal / rightVal);
            case '<':
                return this.nativeBoolToBooleanObj(leftVal < rightVal);
            case '>':
                return this.nativeBoolToBooleanObj(leftVal > rightVal);
            case '==':
                return this.nativeBoolToBooleanObj(left.Equals(right));
            case '!=':
                return this.nativeBoolToBooleanObj(!left.Equals(right));
            default:
                return this.newError(
                    `unknown operator: number ${operator} number`
                );
        }
    }

    evalBlockStatement(block: BlockStatement, env: Environment) {
        let result: EnvObj = NULL;

        for (const statement of block.Statements) {
            result = this.eval(statement, env);
            if (result.Type() === EnvObjType.RETURN_VALUE) {
                return (result as ReturnValueObj).Value;
            }
            if (result.Type() === EnvObjType.ERROR) {
                return result;
            }
        }

        return result;
    }

    evalIdentifier(id: Identifier, env: Environment) {
        const value = env.Get(id.Value);
        if (value !== undefined) {
            return value;
        }

        const builtin = builtins[id.Value];
        if (builtin) {
            return builtin;
        }

        return UNDEFINED;
        // return this.newError(`identifier not found ${id.Value}`);
    }

    evalIndexExpression(left: EnvObj, index: EnvObj) {
        if (
            left.Type() === EnvObjType.ARRAY &&
            index.Type() === EnvObjType.NUMBER
        ) {
            return this.evalArrayIndexExpression(left, index);
        }
        if (left.Type() === EnvObjType.HASH) {
            return this.evalHashIndexExpression(left, index);
        }

        return this.newError(`index operator not supported: ${left.Type()}`);
    }

    evalArrayIndexExpression(array: EnvObj, index: EnvObj) {
        const i = (index as NumberObj).Value;
        const max = (array as ArrayObj).Elements.length - 1;

        if (i < 0 || i > max) {
            return NULL;
        }

        return (array as ArrayObj).Elements[i];
    }

    evalHashIndexExpression(hash: EnvObj, index: EnvObj) {
        if (!Hashable(index)) {
            return this.newError(`unusable as a hash key: ${index.Type()}`);
        }
        const pair = (hash as HashObj).Pairs.get(hashKey(index));
        if (!pair) {
            return NULL;
        }
        return pair.Value;
    }

    evalHashLiteral(hash: HashLiteral, env: Environment) {
        const pairs: Map<number, HashPair> = new Map();

        for (const [keyExpr, valueExpr] of hash.Pairs.entries()) {
            const key = this.eval(keyExpr, env);
            if (this.isError(key)) {
                return key;
            }
            if (!Hashable(key)) {
                return this.newError(`unusable as a hash key: ${key.Type()}`);
            }
            const value = this.eval(valueExpr, env);
            if (this.isError(value)) {
                return value;
            }

            pairs.set(hashKey(key), { Key: key, Value: value });
        }

        return new HashObj(pairs);
    }

    isEqual(obj1: EnvObj, obj2: EnvObj) {
        if (obj1 === obj2) {
            return true;
        }
        if (obj1.Type() === obj2.Type()) {
            return obj1.Equals(obj2);
        }
        return false;
    }

    nativeBoolToBooleanObj(value: boolean) {
        return value ? TRUE : FALSE;
    }

    newError(msg: string) {
        return new ErrorObj(msg);
    }

    isError(obj: EnvObj) {
        return obj && obj.Type() === EnvObjType.ERROR;
    }

    isTruthy(obj: EnvObj) {
        switch (obj.Type()) {
            case EnvObjType.NULL:
            case EnvObjType.UNDEFINED:
                return false;
            case EnvObjType.BOOLEAN:
                return (obj as BoolObj).Value;
            default:
                return true;
        }
    }
}

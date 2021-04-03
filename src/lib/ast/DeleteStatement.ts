import { Token } from '../lexer/tokens';
import { Identifier } from './Identifier';
import { AstNodeCategory, AstNodeType, Statement } from './node';

export class DeleteStatement implements Statement {
    constructor(private _token?: Token, private _name?: Identifier) {}
    nodeType: AstNodeType = AstNodeType.DeleteStatement;
    nodeCategory: AstNodeCategory = AstNodeCategory.Statement;

    get Token(): Token {
        return this._token as Token;
    }

    set Token(val: Token) {
        this._token = val;
    }

    get Name() {
        return this._name;
    }

    set Name(val) {
        this._name = val;
    }

    tokenLiteral(): string {
        return this._token?.literal || '';
    }

    toString(): string {
        return `${this.tokenLiteral()} ${this.Name?.toString()};`;
    }
}

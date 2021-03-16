export enum AstNodeType {
    Program,
    ExpressionStatement,
    LetStatement,
    NumberLiteral,
    StringLiteral,
    BooleanLiteral,
    PrefixExpression,
    InfixExpression,
    BlockStatement,
    IfExpression,
    ReturnStatement,
    Identifier,
    FunctionLiteral,
    CallExpression,
    ArrayLiteral,
    IndexExpression,
    HashLiteral,
}

export enum AstNodeCategory {
    Statement,
    Expression,
    Program,
}

export interface AstNode {
    nodeType: AstNodeType;
    nodeCategory: AstNodeCategory;
    tokenLiteral(): string;
    toString(): string;
}

export type Statement = AstNode;
export type Expression = AstNode;

import test from 'ava';
import { DeleteStatement } from '../ast/DeleteStatement';
import { LetStatement } from '../ast/LetStatement';
import { Lexer } from '../lexer/Lexer';
import { Parser } from './Parser';

test('let statements', (t) => {
    const lexer = new Lexer('let x = 1;');
    const parser = new Parser(lexer);

    const program = parser.parseProgram();

    t.assert(program.Statements.length === 1);
    t.assert(program.Statements[0].tokenLiteral() === 'let');
    const letStmt = program.Statements[0] as LetStatement;
    t.assert(letStmt.Name.Value === 'x');
});

test('let statment refs', (t) => {
    const script = `let y &= x;`;
    const lexer = new Lexer(script);
    const parser = new Parser(lexer);
    const prog = parser.parseProgram();

    t.assert(parser.errors.length === 0);

    t.assert(prog.Statements.length === 1);
    t.assert(prog.Statements[0].tokenLiteral() === 'let');
    const letStmt = prog.Statements[0] as LetStatement;
    t.assert(letStmt.Name.Value === 'y');
    t.assert(letStmt.Value.toString() === 'x');
    t.assert(letStmt.IsRef === true);
});

test('delete statements', (t) => {
    const script = 'delete x;';
    const lexer = new Lexer(script);
    const parser = new Parser(lexer);
    const prog = parser.parseProgram();

    t.assert(parser.errors.length === 0);

    t.assert(prog.Statements.length === 1);
    t.assert(prog.Statements[0].tokenLiteral() === 'delete');
    const deleteStmt = prog.Statements[0] as DeleteStatement;
    t.assert(deleteStmt.Name.Value === 'x');
});

test('nested arrays', (t) => {
    const script = 'let arr = [[1,2], [3,4]];';
    const lexer = new Lexer(script);
    const parser = new Parser(lexer);
    const prog = parser.parseProgram();

    t.assert(parser.errors.length === 0);
    const letStmt = prog.Statements[0] as LetStatement;
    t.assert(letStmt.Name.Value === 'arr');
    const expected = '[[1,2],[3,4]]';
    const actual = letStmt.Value.toString();
    t.assert(actual === expected, `expected ${expected} got ${actual}`);
});

test('multiple ifs', (t) => {
    const script = 'let ifs = fn(v) { if(v == 1) { return 2; } if (v == 2) { return 3; } return 4; };';
    const lexer = new Lexer(script);
    const parser = new Parser(lexer);
    const prog = parser.parseProgram();

    t.assert(parser.errors.length === 0);
    const letStmt = prog.Statements[0] as LetStatement;
    t.assert(letStmt.Name.Value === 'ifs');
});
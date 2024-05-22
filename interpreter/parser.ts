import {
  Statement,
  Program,
  Expression,
  BinaryExpr,
  NumericLiteral,
  Identifier,
} from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
  private tokens: Token[] = [];

  private at(): Token {
    return this.tokens[0] as Token;
  }
  private eat() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  private expect(type: TokenType, err: string){
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != type) {
        console.log("Error on parser:\n", err, prev, "- Expecting: ", type)
    }
  }
  private parseStatement(): Statement {
    return this.parseExpression();
  }
  private parseExpression(): Expression {
    return this.parseAdditiveExpression();
  }
  private parseAdditiveExpression(): Expression {
    let left = this.parseMultiplicativeExpression();
    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.eat().value;
      const right = this.parseMultiplicativeExpression();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }
    return left;
  }
  private parseMultiplicativeExpression(): Expression {
    let left = this.parsePrimitiveExpressions();
    while (
      this.at().value == "*" ||
      this.at().value == "/" ||
      this.at().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parsePrimitiveExpressions();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }
    return left;
  }

  private parsePrimitiveExpressions(): Expression {
    const tk = this.at().type;

    switch (tk) {
      case TokenType.IDENTIFIER:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;
      case TokenType.NUM:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;
      case TokenType.OPAREN:{
        this.eat();
        const value = this.parseExpression();
        this.expect(TokenType.CPAREN, "Parenthesis open, but not closed")
        return value;
      }
      default:
        console.error("Token inesperado");
        Deno.exit(1);
    }
  }

  private notEOF(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  public makeAST(srcCode: string): Program {
    this.tokens = tokenize(srcCode);

    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (this.notEOF()) {
      program.body.push(this.parseStatement());
    }
    return program;
  }
}

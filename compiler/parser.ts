import { Statement, Program, Expression, BinaryExpr, NumericLiteral, Identifier } from "../compiler/ast.ts";
import { tokenize, Token, TokenType} from "../compiler/lexer.ts";

export default class Parser{
    private tokens: Token[] = [];

    private at(): Token{
        return this.tokens[0] as Token;
    }
    private eat(){
        const prev = this.tokens.shift() as Token;
        return prev;

    }
    private parseStatement(): Statement{
        return this.parseExpression();
    }
    private parseExpression(): Expression{
        return this.parsePrimitiveExpressions()
    }
    private parsePrimitiveExpressions(): Expression{
      const tk = this.at().type;

      switch (tk) {
        case TokenType.IDENTIFIER:
            return { kind: "Identifier", symbol: this.eat().value} as Identifier;
        case TokenType.NUM:
             return { kind: "NumericLiteral", value: parseFloat(this.eat().value)} as NumericLiteral;
              
      
        default:
            console.error("Token inesperado")
            Deno.exit(1)
           
      }
    }

    private notEOF(): boolean{
        return this.tokens[0].type != TokenType.EOF;
    }

    public makeAST(srcCode: string): Program{
        this.tokens = tokenize(srcCode);

        const program: Program = {
            kind: "Program",
            body: []
        };
        
        while (this.notEOF()) {
            program.body.push(this.parseStatement())
        }
        return program;

    }
}
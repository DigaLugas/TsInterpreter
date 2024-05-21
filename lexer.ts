

export enum TokenType{
    NUM, 
    IDENTIFIER,
    EQUALS,
    OPAREN, CPAREN,
    BINARY_OPERATOR,
    LET,
}

const KEYWORDS: Record<string, TokenType> ={
    "let": TokenType.LET,
}
export interface Token{
    value : string;
    type: TokenType;
}
function tokenMaker(value = "", type: TokenType): Token{

    return {value, type};
}
function verifyString(x:string) {
    return x.toUpperCase() != x.toLowerCase();
}
function verifySkippable(x: string){
    return x == ' ' || x == '\n' || x == '\t'
}
function verifyInt(x: string){
const c = x.charCodeAt(0);
const z = ['0'.charCodeAt(0), '9'.charCodeAt(0)]
return (c > z[0] && c <= z[1])
}
export function tokenize(srcCode : string): Token[]{
    const tokens = new Array<Token>();
    const code = srcCode.split("");
    while(code.length > 0 ){
        if (code[0] == '(') {
            tokens.push(tokenMaker(code.shift(), TokenType.OPAREN))
        } else if(code[0] == ')'){
            tokens.push(tokenMaker(code.shift(), TokenType.CPAREN))
        } else if(code[0] == '+' || code[0] == '-' || code[0] == '*' || code[0] == '/'){
            tokens.push(tokenMaker(code.shift(), TokenType.BINARY_OPERATOR))
        } else if(code[0] == '='){
            tokens.push(tokenMaker(code.shift(), TokenType.EQUALS))
        }else{
            if(verifyInt(code[0])){
                let num = "";
                while (code.length>0 && verifyInt(code[0])) {
                    num+= code.shift();
                }
                tokens.push(tokenMaker(num, TokenType.NUM))
            } else if(verifyString(code[0])){
                let ident = "";
                while (code.length>0 && verifyString(code[0])) {
                    ident+= code.shift();
                }
                const reserved = KEYWORDS[ident]
                if (reserved == undefined) {
                    tokens.push(tokenMaker(ident, TokenType.IDENTIFIER));
                }
                else{
                    tokens.push(tokenMaker(ident, reserved));
                }
                
            } else if (verifySkippable(code[0])) {
                code.shift();
            }else{
                console.log("Comando não reconhecido em: ", code[0])
                Deno.exit(1)
            }
        }
    }

    return tokens;
}
const source = await Deno.readTextFile("./test.txt");
for(const tokens of tokenize(source)){
    console.log(tokens)
}
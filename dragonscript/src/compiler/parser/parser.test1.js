import RecursiveDescentParser from "./recursive_descent_parser";
import Scanner from "../scanner/token"

describe("Testing token scanning from parser", () => {
    it("should get correct tokens by advance", () => {
        const parser = new RecursiveDescentParser("1;")
        const numToken = parser.getToken()
        expect(numToken).toMatchObject({
            lexeme: "1",
            token: Scanner.NUMBER,
            line: 0,
        })
        parser.advance()
        const semiToken = parser.getToken()
        expect(semiToken).toMatchObject({
            lexeme: ";",
            token: Scanner.SEMICOLON,
            line: 0,
        })
    })

    it("should get correct token by previous", () => {
        const parser = new RecursiveDescentParser("1;")
        parser.advance()
        parser.advance()
        parser.previous()
        const numToken = parser.getToken()
        expect(numToken).toMatchObject({
            lexeme: "1",
            token: Scanner.NUMBER,
            line: 0,
        })
    })

    it("should get the last token when calling advance with times more than the count of token", () => {
        const parser = new RecursiveDescentParser("1;")
        parser.advance()
        parser.advance()
        parser.advance()
        parser.advance()
        const semiToken = parser.getToken()
        expect(semiToken).toMatchObject({
            lexeme: ";",
            token: Scanner.SEMICOLON,
            line: 0,
        })
    })

    it("should get the beginning token when calling previous with times more than the count of token", () => {
        const parser = new RecursiveDescentParser("1;")
        parser.advance()
        parser.previous()
        parser.previous()
        parser.previous()
        const numToken = parser.getToken()
        expect(numToken).toMatchObject({
            lexeme: "1",
            token: Scanner.NUMBER,
            line: 0,
        })
    })

    describe("Testing creation of abstract syntax tree", () => {
        it("should parse expression with only number or string", () => {
            let parser = new RecursiveDescentParser("1;")
            expect(parser.parse).not.toThrow()
            parser = new RecursiveDescentParser('"hello world";')
            expect(parser.parse).not.toThrow()
        })

        it("should parse expression with + and - operator", () => {
            let parser = new RecursiveDescentParser("1+2;")
            expect(parser.parse).not.toThrow()
            parser = new RecursiveDescentParser('"hello"+"world";')
            expect(parser.parse).not.toThrow()
            parser = new RecursiveDescentParser("4 - 3;")
            expect(parser.parse).not.toThrow()
        })

        it("should parse expression with + or - with unary operator prefix", () => {
            let parser = new RecursiveDescentParser("-1+2;")
            expect(parser.parse).not.toThrow()
            parser = new RecursiveDescentParser("1--2;")
            expect(parser.parse).not.toThrow()
            //!1 -> false, !-2 -> true
            parser = new RecursiveDescentParser("!1-!-2;")
            expect(parser.parse).not.toThrow()
        })

        it("should parse expression with +,-,! and key words", () => {
            let parser = new RecursiveDescentParser("!true;")
            expect(parser.parse).not.toThrow()
            parser = new RecursiveDescentParser("!false;")
            expect(parser.parse).not.toThrow()
            parser = new RecursiveDescentParser("false + !true;")
            expect(parser.parse).not.toThrow()

            /*
            !false -> true, -!false->-true->-1, "hello"+-1 in js-> "hello-1"
            */
            parser = new RecursiveDescentParser('"hello" + -!false;')
            expect(parser.parse).not.toThrow()

            parser = new RecursiveDescentParser('"hello" + -!nil;')
            expect(parser.parse).not.toThrow()
        })
    })

    it("should support operator * and /", () => {
        let parser = new RecursiveDescentParser("1*2+3;")
        expect(parser.parse).not.toThrow()
        parser = new RecursiveDescentParser("4/2 - 5;")
        expect(parser.parse).not.toThrow()
    })

    it("should support brackets in expression", () => {
        let parser = new RecursiveDescentParser("1*2+(4-2);")
        expect(parser.parse).not.toThrow()
        parser = new RecursiveDescentParser("!false + (8-2)/3;")
        expect(parser.parse).not.toThrow()
    })

    it("should support comparison operator", () => {
        let parser = new RecursiveDescentParser("1*2+(4-2) > (3+1)/2;")
        expect(parser.parse).not.toThrow()
        parser = new RecursiveDescentParser("1*2+(4-2) >= (3+1)/2;")
        expect(parser.parse).not.toThrow()
        parser = new RecursiveDescentParser("1*2+(4-2) <= (3+1)/2 + 4;")
        expect(parser.parse).not.toThrow()
        parser = new RecursiveDescentParser("1*2+(4-2) < (3+1)/2 + 4;")
        expect(parser.parse).not.toThrow()
    })

    it("should support equality operator", () => {
        let parser = new RecursiveDescentParser("1*2+(4-2) > (3+1)/2 == true;")
        expect(parser.parse).not.toThrow()
        parser = new RecursiveDescentParser("1*2+(4-2) > (3+1)/2 != false;")
        expect(parser.parse).not.toThrow()
    })
})
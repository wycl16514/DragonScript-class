import RecursiveDescentParser from "../parser/recursive_descent_parser";
import Intepreter from "./intepreter";
import TreeAdjustVisitor from "./tree_adjust_visitor";
import Resolver
    from "./resolver";
const createParsingTree = (code) => {
    const parser = new RecursiveDescentParser(code)
    const root = parser.parse()
    const treeAdjustVisitor = new TreeAdjustVisitor()
    root.accept(treeAdjustVisitor)
    let resolver = new Resolver()
    root.accept(resolver)
    return root
}

describe("Testing evaluation for expression", () => {

    it("should evaluate integer number successfully", () => {
        const root = createParsingTree("1234;")
        const intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "number",
            value: 1234,
        })
    })

    it("should evaluate float number successfully", () => {
        const root = createParsingTree("12.34;")
        const intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "number",
            value: 12.34,
        })
    })

    it("should evaluate string literal successfully", () => {
        const root = createParsingTree('"hello world!";')
        const intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "string",
            value: "hello world!",
        })
    })

    it("should evaluate string or number literal in parentheses", () => {
        let root = createParsingTree('(1.23);')
        let intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "number",
            value: 1.23,
        })

        root = createParsingTree('("hello world!");')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "string",
            value: "hello world!",
        })
    })

    it("should evaluate unary operator - for number literal", () => {
        let root = createParsingTree('-1.23;')
        let intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "number",
            value: -1.23,
        })
    })

    it("should evaluate unary operator ! for true and false boolean", () => {
        let root = createParsingTree('!true;')
        let intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "boolean",
            value: false,
        })

        root = createParsingTree('!false;')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "boolean",
            value: true,
        })
    })

    it("should evaluate to false for unary operator ! for expression not nil and false", () => {
        let root = createParsingTree('!1.23;')
        let intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "boolean",
            value: false,
        })

        root = createParsingTree('!"hello";')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "boolean",
            value: false,
        })

        root = createParsingTree('!nil;')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "boolean",
            value: true,
        })
    })

    it("should evaluate binary operator +, - correctly", () => {
        let root = createParsingTree('1.23+2.46;')
        let intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "number",
            value: 3.69,
        })

        root = createParsingTree('2.46-1.23;')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "number",
            value: 1.23,
        })
    })


    it("should evaluate binary operator * and / correctly", () => {
        let root = createParsingTree('1.23*2;')
        let intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "number",
            value: 2.46,
        })

        root = createParsingTree('2.46 / 2;')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "number",
            value: 1.23,
        })
    })

    it("should evaluate comparison operator correctly", () => {
        let root = createParsingTree('2.46 > 1.23;')
        let intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "boolean",
            value: true,
        })

        root = createParsingTree('1.23 >= 2.46;')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "boolean",
            value: false,
        })

        root = createParsingTree('2.46 < 1.23;')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "boolean",
            value: false,
        })

        root = createParsingTree('1.23 <= 2.46;')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "boolean",
            value: true,
        })
    })

    it("should evaluate equality operator correctly", () => {
        let root = createParsingTree('2.46 == 1.23;')
        let intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "boolean",
            value: false,
        })

        root = createParsingTree('2.46 != 1.23;')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "boolean",
            value: true,
        })

        root = createParsingTree('nil == nil;')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "boolean",
            value: true,
        })

        root = createParsingTree('"hello" == "hello";')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "boolean",
            value: true,
        })

        root = createParsingTree('"hello" != "world";')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "boolean",
            value: true,
        })
    })

    it("should support number and string for operator + and *", () => {
        let root = createParsingTree('3 + "hello,world!";')
        let intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "string",
            value: "3hello,world!",
        })

        root = createParsingTree('"hello,world!" + 3;')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "string",
            value: "hello,world!3",
        })

        root = createParsingTree('3 * "hello,";')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "string",
            value: "hello,hello,hello,",
        })

        root = createParsingTree('"hello," * 3;')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "string",
            value: "hello,hello,hello,",
        })
    })

    it("should report error for incompatible type operation", () => {
        let root = createParsingTree('"hello" - "world!";')
        let intepreter = new Intepreter()
        let runCode = () => {
            root.accept(intepreter)
        }
        expect(runCode).toThrow()

        root = createParsingTree('"hello" - 3;')
        intepreter = new Intepreter()
        runCode = () => {
            root.accept(intepreter)
        }
        expect(runCode).toThrow()

        root = createParsingTree('"hello" / "world!";')
        intepreter = new Intepreter()
        runCode = () => {
            root.accept(intepreter)
        }
        expect(runCode).toThrow()

        root = createParsingTree('"hello" * "world!";')
        intepreter = new Intepreter()
        runCode = () => {
            root.accept(intepreter)
        }
        expect(runCode).toThrow()

        root = createParsingTree('"hello" == 3;')
        intepreter = new Intepreter()
        runCode = () => {
            root.accept(intepreter)
        }
        expect(runCode).toThrow()

        root = createParsingTree('"hello" != 3;')
        intepreter = new Intepreter()
        runCode = () => {
            root.accept(intepreter)
        }
        expect(runCode).toThrow()

        root = createParsingTree('"hello" < 3;')
        intepreter = new Intepreter()
        runCode = () => {
            root.accept(intepreter)
        }
        expect(runCode).toThrow()

        root = createParsingTree('"hello" <=  3;')
        intepreter = new Intepreter()
        runCode = () => {
            root.accept(intepreter)
        }
        expect(runCode).toThrow()

        root = createParsingTree('"hello" >  3;')
        intepreter = new Intepreter()
        runCode = () => {
            root.accept(intepreter)
        }
        expect(runCode).toThrow()

        root = createParsingTree('"hello" >=  3;')
        intepreter = new Intepreter()
        runCode = () => {
            root.accept(intepreter)
        }
        expect(runCode).toThrow()

        root = createParsingTree('"hello" >=  "world";')
        intepreter = new Intepreter()
        runCode = () => {
            root.accept(intepreter)
        }
        expect(runCode).toThrow()

        root = createParsingTree('"hello" >  "world";')
        intepreter = new Intepreter()
        runCode = () => {
            root.accept(intepreter)
        }
        expect(runCode).toThrow()

        root = createParsingTree('"hello" <  "world";')
        intepreter = new Intepreter()
        runCode = () => {
            root.accept(intepreter)
        }
        expect(runCode).toThrow()

        root = createParsingTree('"hello" <=  "world";')
        intepreter = new Intepreter()
        runCode = () => {
            root.accept(intepreter)
        }
        expect(runCode).toThrow()
    })

    it("should evaluate a print statement", () => {
        let root = createParsingTree('print(1+2*3+4);')
        let intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "print",
            value: 11,
        })

        root = createParsingTree('print("hello");')
        intepreter = new Intepreter()
        root.accept(intepreter)
        expect(root.evalRes).toMatchObject({
            type: "print",
            value: "hello",
        })
    })

    it("should output content in print to console of runtime", () => {
        let code = `print(1+2*3+4);
       print("hello");
       print("world");`
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)

        const console = intepreter.runTime.console
        expect(console.length).toEqual(3)
        expect(console[0]).toEqual(11)
        expect(console[1]).toEqual("hello")
        expect(console[2]).toEqual("world")
    })

    it("should enable to parse variable declaration", () => {
        let code = `
        var a = 123;
        var b = "hello";
        var c;
        `
        let root = createParsingTree(code)
        expect(root).not.toBeNull()
    })

    it("should bind variable to value that it is assigned to", () => {
        let code = `
           var a = 1+2*3+4;
           print(a);
           var a = "hello";
           print(a);
           var c;
           print(c);
        `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        const console = intepreter.runTime.console
        expect(console.length).toEqual(3)
        expect(console[0]).toEqual(11)
        expect(console[1]).toEqual("hello")
        expect(console[2]).toEqual("null")
    })

    it("should enable parsing variable reassignment", () => {
        let code = `
        var a = 1+2*3+4;
        a = "hello";
        var b;
        a = b = "world!";
        `

        let root = createParsingTree(code)
        expect(root).not.toBeNull()
    })

    it("should throw exception for assignment to r value", () => {


        let code1 = `
        123 = "hello";
        `
        let codeToParse1 = () => {
            createParsingTree(code1)
        }
        expect(codeToParse1).toThrow()

        let code2 = `
         "hello" = 123;
        `
        let codeToParse2 = () => {
            createParsingTree(code2)
        }
        expect(codeToParse2).toThrow()
    })

    it("should evaluate assignement statement correctly", () => {
        let code = `
    var a = 1+2*3+4;
    print(a);
    a = "hello";
    print(a);
    var b;
    a = b = "world";
    print(a);
    print(b);
 `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        const console = intepreter.runTime.console
        expect(console.length).toEqual(4)
        expect(console[0]).toEqual(11)
        expect(console[1]).toEqual("hello")
        expect(console[2]).toEqual("world")
        expect(console[3]).toEqual("world")
    })

    it("should enable assigned variable in arithmetic expression", () => {
        let code = `
        var a;
        var b;
        a = 1;
        b = 2;
        var c = a + b;
        print(c);
        `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        const console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual(3)
    })

    it("should enable assigned variable in string expression", () => {
        let code = `
        var a;
        var b;
        a = "hello";
        b = ",world";
        var c = a + b;
        print(c);
        a = 3;
        b = "hello";
        var c;
        c = a + b;
        print(c);
        var d;
        d = a * b;
        print(d);
        `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        const console = intepreter.runTime.console
        expect(console.length).toEqual(3)
        expect(console[0]).toEqual("hello,world")
        expect(console[1]).toEqual("3hello");
        expect(console[2]).toEqual("hellohellohello")
    })


    it("should throw exception when assign to undefiend variable", () => {
        let code = `
        a = 123;
        `

        let codeToParse = () => {
            let root = createParsingTree(code)
            let intepreter = new Intepreter()
            root.accept(intepreter)
        }

        expect(codeToParse).toThrow()
    })

    it("should enable parsing statement block", () => {
        let code = `
            {
                var a =1;
                {
                    var b =2;
                }
            }

            {
                var c = 3;
            }
        `

        let root = createParsingTree(code)
        expect(root).not.toBeNull()
    })

    it("should eanble variable declared by let to have local scoping", () => {
        let code = `
            var a = 1;
            let b = 3;
            {
                let a = 2;
                print(a);
            }
            print(a);
            print(b);
        `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        const console = intepreter.runTime.console
        expect(console.length).toEqual(3)
        expect(console[0]).toEqual(2)
        expect(console[1]).toEqual(1)
        expect(console[2]).toEqual(3)
    })

    it("should restrict local variable in their own scope", () => {
        let code = `
         {
            let a = 1;
            print(a);
         }

         {
            let a = 2;
            print(a);
         }
    `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        const console = intepreter.runTime.console
        expect(console.length).toEqual(2)
        expect(console[0]).toEqual(1)
        expect(console[1]).toEqual(2)
    })

    it("should reference variable in outer socpe from inner scope", () => {
        let code = `
        {
            let a = 1;
            {
                let b = 2;
                {
                    print(a);
                    print(b);
                }
            }
        }
    `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        const console = intepreter.runTime.console
        expect(console.length).toEqual(2)
        expect(console[0]).toEqual(1)
        expect(console[1]).toEqual(2)
    })

    it("should throw exception for referencing local variable when out of its scope", () => {
        let code = `
            {
                let a = 1;
            }
            print(a);
        `

        const codeToParse = () => {
            let root = createParsingTree(code)
            let intepreter = new Intepreter()
            root.accept(intepreter)
        }

        expect(codeToParse).toThrow("undefined variable with name a")
    })
})

describe("parsing and evaluating the contrl statmenet", () => {
    const createParsingTree = (code) => {
        const parser = new RecursiveDescentParser(code)
        const root = parser.parse()
        const treeAdjustVisitor = new TreeAdjustVisitor()
        root.accept(treeAdjustVisitor)
        let resolver = new Resolver()
        root.accept(resolver)
        return root
    }

    it("should enable parsing if and else statement", () => {
        let code = `
            var a = 1;
            if (a > 0) {
                a = 2;
            } else {
                a = 3;
            }
        `
        const codeToParse = () => {
            createParsingTree(code)
        }

        expect(codeToParse).not.toThrow()
    })

    it("should evaluate if else statement correctly", () => {
        let code = `
        var a = 1;
        if (a > 0) {
            print(1);
        } else {
            print(2);
        }
        `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        let console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual(1)

        code = `
        var a = 0;
        if (a > 0) {
            print(1);
        } else {
            print(2);
        }
        `
        root = createParsingTree(code)
        intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual(2)
    })

    it("should enable to parse logic operator or and and", () => {
        let code = `
        var a = 1;
        var b = 2;
        var c = 3;
        var d = a > 0 and b > 1 or c != 0;
        `

        let codeToParse = () => {
            createParsingTree(code)
        }

        expect(codeToParse).not.toThrow()
    })

    it("should evaluate to the first expression of false otherwise evaluate to the last experssion for and", () => {
        let code = `
        var a = 1;
        var b = 2;
        var c = 3;
        if (a > 0 and b > 1 and c > 4) {
            print(1);
        }else {
            print(2);
        }
        `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        let console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual(2)

        code = `
        var a = 1;
        var b = 2;
        var c = 3;
        if (a > 0 and b > 1 and c > 2) {
            print(1);
        }else {
            print(2);
        }
        `
        root = createParsingTree(code)
        intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual(1)
    })

    /*
    var a = 0;
    var b = 0;
    var c = -2;
    var d = a or b or c; 
    d = -2
    */
    it("should evaluate to the first truth expression otherwise evaluate to the last expression of or", () => {
        let code = `
          var a = 1;
          var b = 2;
          var c = 3;
          if (a < 0 or b < 1 or c < 3) {
              print(1);
          }else {
            print(2);
          }
      `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        let console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual(2)

        code = `
          var a = 1;
          var b = 2;
          var c = 3;
          if (a < 0 or b == 2 or c < 3) {
              print(1);
          }else {
            print(2);
          }
      `
        root = createParsingTree(code)
        intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual(1)
    })

    /*
    while(a>0){}
    */
    it("should enable the parsing for the while loop", () => {
        let code = `
        var a = 3;
        while(a>0) {
            print(a);
            a = a - 1;
        }
        `
        let codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).not.toThrow()
    })

    it("should evaluate while loop correctly", () => {
        let code = `
        var a = 3;
        while(a>0) {
            print(a);
            a = a - 1;
        }
        `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        let console = intepreter.runTime.console
        expect(console.length).toEqual(3)
        expect(console[0]).toEqual(3)
        expect(console[1]).toEqual(2)
        expect(console[2]).toEqual(1)
    })

    it("should enable the parsing of for loop", () => {
        let code = `
        for (var i = 0; i < 10; i = i+1) {
            print(i);
        }
        `
        let codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).not.toThrow()

        code = `
        var i = 0;
        for (i = 0; i < 10; i = i+1) {
            print(i);
        }
        `
        codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).not.toThrow()

        code = `
        for (; ;) {
            print("hello");
        }
        `
        codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).not.toThrow()
    })

    it("should evaluate the for loop correctly", () => {
        let code = `
        for (var i = 0; i < 3; i = i+1) {
            print(i);
        }
        `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        let console = intepreter.runTime.console
        expect(console.length).toEqual(3);
        expect(console[0]).toEqual(0)
        expect(console[1]).toEqual(1)
        expect(console[2]).toEqual(2)
    })

    it("should enable break or continue from the loop", () => {
        let code = `
        for(var i = 0; i < 10; i = i+1) {
            if (i < 7) {
                {
                    continue;
                    if(i < 7) {
                        print(101);
                    }
                }
                print(200);
            }
            print(i);
        }
        `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        let console = intepreter.runTime.console
        expect(console.length).toEqual(3);
        expect(console[0]).toEqual(7)
        expect(console[1]).toEqual(8)
        expect(console[2]).toEqual(9)

        code = `
        var i = 0;
        while (i < 10) {
            if(i >= 4) {
               {
                 {
                     break;
                     print(101);
                 }
               }
            }
            print(i);
            i = i+1;
        }
     `
        root = createParsingTree(code)
        intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(4);
        expect(console[0]).toEqual(0)
        expect(console[1]).toEqual(1)
        expect(console[2]).toEqual(2)
        expect(console[3]).toEqual(3)
    })

    it("should only alllow break or continue in for or while", () => {
        let code = `
      var a = 1;
      if (a>0) {
        break;
      }
      var b = 2;
      `
        let codeToExecute = () => {
            let root = createParsingTree(code)
            let intepreter = new Intepreter()
            root.accept(intepreter)
        }
        expect(codeToExecute).toThrow()

        code = `
      var a = 1;
      if (a>0) {
        continue;
      }
      var b = 2;
      `
        codeToExecute = () => {
            let root = createParsingTree(code)
            let intepreter = new Intepreter()
            root.accept(intepreter)
        }
        expect(codeToExecute).toThrow()
    })

})

describe("parsing and evaluating function calls", () => {
    it("should enable the parsing of function call", () => {
        let code = `
        func getCallback(num1, num2, num3){}
        getCallback(1,2,3);
        `
        let codeToParse = () => {
            createParsingTree(code)
        }
        //fix Throw to toThrow
        expect(codeToParse).not.toThrow()

        code = `
        func getCallback(num1, num2, num3){}
        getCallback(1,2,3)(4,5,6);
        `
        codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).not.toThrow()

        code = `
        func getCallback(num1, num2, num3){}
        func getFirstArg(){}
        func getSecondArg(){}
        func getThirdArg(){}
        getCallback(getFirstArg(), getSecondArg(), getThirdArg());
        `
        codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).not.toThrow()
    })

    it("should only allow identifier as function name", () => {
        let code = `
        123(1,2,3);
        `
        let codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).toThrow()

        code = `
        "hello world!"(1,2,3);
        `
        codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).toThrow()

        code = `
        true(1,2,3);
        `
        codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).toThrow()

        code = `
        false(1,2,3);
        `
        codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).toThrow()

        code = `
        nil(1,2,3);
        `
        codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).toThrow()
    })

    it("should enable parsing function declaration", () => {
        let code = `
        func doSomething(a, b, c) {
            var d = a + b + c;
            print(d);
        }
        `
        let codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).not.toThrow()
    })

    it("should execute the given function correctly", () => {
        let code = `
        var a = 1;
        func addToa(b, c) {
            a = a + b + c;
        }
        addToa(2,3);
        print(a);
        `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual(6)
    })

    it("should not allow to assign value to function name", () => {
        let code = `
        func doSomething(){}
        doSomething = 1;
        `

        const executeCode = () => {
            let root = createParsingTree(code)
            let intepreter = new Intepreter()
            root.accept(intepreter)
        }

        expect(executeCode).toThrow()
    })

    it("should not allow the same name of variable and function", () => {
        let code = `
        func doSomething(){}
        var doSomething;
        `

        let executeCode = () => {
            let root = createParsingTree(code)
            let intepreter = new Intepreter()
            root.accept(intepreter)
        }

        expect(executeCode).toThrow()

        code = `
        var doSomething;
        func doSomething(){}
        `

        executeCode = () => {
            let root = createParsingTree(code)
            let intepreter = new Intepreter()
            root.accept(intepreter)
        }

        expect(executeCode).toThrow()
    })

    it("should not allow more than one function with the same name", () => {
        let code = `
        func doSomething(){}
        func doSomething(a,b){}
        `

        let executeCode = () => {
            let root = createParsingTree(code)
            let intepreter = new Intepreter()
            root.accept(intepreter)
        }

        expect(executeCode).toThrow()
    })

    it("should make sure arguments in calling match up to parameters in declaration", () => {
        let code = `
        var a = 1;
        func doSomething(){}
        doSomething(a);
        `

        let executeCode = () => {
            let root = createParsingTree(code)
            let intepreter = new Intepreter()
            root.accept(intepreter)
        }

        expect(executeCode).toThrow()

        code = `
        var a = 1;
        func doSomething(a, b){}
        doSomething(a);
        `

        executeCode = () => {
            let root = createParsingTree(code)
            let intepreter = new Intepreter()
            root.accept(intepreter)
        }

        expect(executeCode).toThrow()
    })

    it("should enable to parse return statement", () => {
        let code = `
        func getSomething(a, b) {return a+b;}
        `

        let parseCode = () => {
            createParsingTree(code)
        }

        expect(parseCode).not.toThrow()
    })

    it("should evaluate return statement correctly", () => {
        let code = `
        var a =1;
        func getSomething(b,c) {
            return b+c;
            a = 2;
        }
        var d = getSomething(1,2);
        print(d);
        print(a);
        `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(2)
        expect(console[0]).toEqual(3)
        expect(console[1]).toEqual(1)

        code = `
        var a = 1;
        func doSomething() {
            a = 2;
        }
        var d = doSomething();
        print(d);
        `
        root = createParsingTree(code)
        intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual("null")
    })

    it("should only allow return statement inside function body", () => {
        let code = `
        var a = 1;
        return a;
        var b =1;
        `

        let codeToExecute = () => {
            let root = createParsingTree(code)
            let intepreter = new Intepreter()
            root.accept(intepreter)
        }

        expect(codeToExecute).toThrow()
    })

    it("should evaluate function declared inside another function", () => {
        let code = `
        func makeCounter() {
            var i = 0;
            func count() {
                i = i+1;
            }
            count();
            return i;
        }

        var a = makeCounter();
        print(a);
        `

        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual(1)

        //handle the same problem for continue and break
    })

    it("should enable annonymous function to be assignable", () => {
        let code = `
        var a = func (b,c) {
            return b+c;
        };

        var b = a(1,2);
        print(b);
        `

        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual(3)
    })

    it("should not allow function to call on normal variable", () => {
        let code = `
        var a = 1;
        a(1,2);
        `
        let codeToExecute = () => {
            let root = createParsingTree(code)
            let intepreter = new Intepreter()
            root.accept(intepreter)
        }

        expect(codeToExecute).toThrow()
    })

    it("should evaluate anonymous function chain call", () => {
        let code = `
        var a = 1;
        var b = func (num) {
            a = a + num;
            return func (num1, num2) {
                a = a + num1 + num2;
                return func (num3) {
                    return a + num3;
                };
            };
        };
        var c = b(1)(2,3)(4);
        print(c);
        `

        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual(11)
    })

    it("should remember variable assignment before given function is declarated", () => {
        let code = `
        var a = "global";
        {
            func showA() {
                print(a);
            }

            let a = "local";
            showA();
        }
        `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual("global")
    })
})

describe("Tesing class", () => {
    it("should enable parser understand class definition", () => {
        let code = `
        class Bird {
            func fly(place) {
                print("The bird is flying at: ");
                print(place);
            }
        }
        `

        let codeToParse = () => {
            createParsingTree(code)
        }

        expect(codeToParse).not.toThrow()
    })

    it("should create class instance by using class name as function call", () => {
        let code = `
        class Bird {
            func fly(place) {
                print("The bird is flying at: ");
                print(place);
            }
        }

        var bird = Bird();
        print(bird);
        `

        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual("An instance of class Bird")
    })

    it("should enable parsing for setting and getting instance property", () => {
        let code = `
        class Bird {
            func fly(place) {
                print("The bird is flying at: ");
                print(place);
            }
        }

        var bird = Bird();
        bird.feather;
        bird.feather.color = "red";
        `

        let codeToParse = () => {
            createParsingTree(code)
        }

        expect(codeToParse).not.toThrow()
    })

    it("should execute code for setting and getting for different instance correctly", () => {
        let code = `
        class Bird {
            func fly(place) {
                print("The bird is flying at: ");
                print(place);
            }
        }

        var a = Bird();
        var b = Bird();
        print(a.feather);
        a.feather = "red";
        b.feather = "green";
        print(a.feather);
        print(b.feather);
        `

        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(3)
        expect(console[0]).toEqual("null")
        expect(console[1]).toEqual("red")
        expect(console[2]).toEqual("green")
    })

    it("should enable chainning of method call with field accessing", () => {
        let code = `
        class Bird {
            func fly() {
                print("bird is flying");
            }
        }

        func getBird() {
            return Bird();
        }
        
        var a = getBird;
        a().fly();
        `
        let codeToParse = () => {
            createParsingTree(code)
        }

        expect(codeToParse).not.toThrow()

        code = `
        class Bird {
            func fly() {
                print("bird is flying");
            }

            func win() {}

            func feather() {}
        }
        var bird = Bird();
        bird.wind().feather().color = "red";
        `

        codeToParse = () => {
            createParsingTree(code)
        }

        expect(codeToParse).not.toThrow()
    })

    it("should enable this for method call", () => {
        let code = `
        class Cake {
            func taste() {
                var adj = "delicious";
                var saying = "The " + this.flavor + " of the cake is " + adj;
                print(saying);
            }

            func getCallback() {
                return this.taste;
            }
        }

        var cake = Cake();
        cake.flavor = "chocolate";
        var callback = cake.getCallback();
        callback();
        `

        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual("The chocolate of the cake is delicious")
    })

    it("should enable class initializer", () => {
        let code = `
        class Cake {
            func init(flavor) {
                this.flavor = flavor;
                print(this.flavor);
            }

            func getFlavor() {
                return this.flavor;
            }
        }

        var cake = Cake("chocolate");
        var flavor = cake.getFlavor();
        print(flavor);
        `

        let root = createParsingTree(code)
        let interpreter = new Intepreter()
        root.accept(interpreter)
        console = interpreter.runTime.console
        expect(console.length).toEqual(2)
        expect(console[0]).toEqual("chocolate")
        expect(console[1]).toEqual("chocolate")
    })

    it("should only allow this keyword inside the class method", () => {
        let code = `
        this.a = 1;
        `
        let codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).toThrow()

        code = `
        func hello() {
            this.s = "hello";
        }
        `
        codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).toThrow()

        code = `
       class A {
        this.a = 1;
       }
        `
        codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).toThrow()

        code = `
        class A {
            func method1() {
                class B {
                    this.b = 1;
                }
            }
        }
        `
        codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).toThrow()

        code = `
        class A {
            func method_a() {
                class B {
                   func method_b() {
                    this.b = 1;
                   }
                }

                this.a = 2;
            }
        }
        `
        codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).not.toThrow()
    })

    it("should only allow class instance at the left of dot operator", () => {
        let code = `
        var a = 1;
        a.b = 2;
        `
        let codeToRun = () => {
            let root = createParsingTree(code)
            let interpreter = new Intepreter()
            root.accept(interpreter)
        }
        expect(codeToRun).toThrow()

        code = `
        var a = "hello";
        a.b = 2;
        `
        codeToRun = () => {
            let root = createParsingTree(code)
            let interpreter = new Intepreter()
            root.accept(interpreter)
        }
        expect(codeToRun).toThrow()

        code = `
        var a = true;
        a.b = 2;
        `
        codeToRun = () => {
            let root = createParsingTree(code)
            let interpreter = new Intepreter()
            root.accept(interpreter)
        }
        expect(codeToRun).toThrow()

        code = `
        var a = null;
        a.b = 2;
        `
        codeToRun = () => {
            let root = createParsingTree(code)
            let interpreter = new Intepreter()
            root.accept(interpreter)
        }
        expect(codeToRun).toThrow()
    })

    it("should not allow to use return inside class constructor", () => {
        let code = `
        class A {
            func init() {
                this.a = 1;
                return this.a;
            }
        }
        `
        let codeToParse = () => {
            createParsingTree(code)
        }
        expect(codeToParse).toThrow()
    })
})



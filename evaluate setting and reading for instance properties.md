In previous section, we enable our parser to understand code for getting and setting properties on given instance, from this section, we check how interpreter can exucte those code, we first give the test case:
```js
it("should execute code for setting and getting instance properties correctly", ()=> {
        let code =
            `
        class Bird {
            func fly(place ){
                print("The bird is flying at");
                print(place);
            }
        }
        var bird = Bird();
        bird.feather = "red";
        print(bird.feather);
        `
        let root = createParsingTree(code)
        let intepreter = new Intepreter()
        root.accept(intepreter)
        console = intepreter.runTime.console
        expect(console.length).toEqual(1)
        expect(console[0]).toEqual("red")
    })
```
Run the case and make sure it fails, and we will add code in interpreter to handle it. we need to handle instance like how we handle function. When interpreter visiting the class node, it save the class node 
with its name in the call map. When the code calling the class name as function, it will generate an instance and assign to the given variable. Then we should bind that variable with the class node. There is 
a problem, for code like following:

```js
var smallBird = Bird();
var bigBird = Bird();
```
Since we will bind variable smallBird and bigBird to the class node of Bird, then what is the different for smallBird and bigBird since there are binding to the same node? The solution here is, when we binding
class parsing node with given variable, we make a copy, then different varaible will bind to different copy of the class parsing node, the most important thing is, since there are env objects attach to nodes,
if we copy the parsing node, we copy the env node at the same time, then different variables will have different env object that's why we can save different value to property with the same name without confliction.

Therefore our code would like following, in runTime object we add the class node copying code:

```js

```

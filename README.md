# ngrx-enums
A small library that provides the base classes for for implementing @ngrx actions and reducers with ts-enums

## Motivation

[@ngrx/store](https://github.com/ngrx/store) is a very powerful utility for managing
the state of Angular apps, but some developers have criticized the [example app](https://github.com/ngrx/example-app)
for containing too much boilerplate (particularly in the action classes) and for having
large switch statements in the reducers. [ngrx-example-app-enums](https://github.com/LMFinney/ngrx-example-app-enums)
is a fork of the [example app](https://github.com/ngrx/example-app)
that uses [ts-enums](https://github.com/LMFinney/ts-enums) to encapsulate the actions and 
reducers, thereby reducing boilerplate and hiding the switch statement from view.

This library builds on [ts-enums](https://github.com/LMFinney/ts-enums) to provide
just the base files that [ngrx-example-app-enums](https://github.com/LMFinney/ngrx-example-app-enums)
uses so that they can be used separately in your apps.

## The basics

Install:

```text
npm install ngrx-enums
```

## More information

* The [test directory](test) contains examples.
* Some users get an error that looks something like this when compiling:
 
   ```ERROR in Error encountered resolving symbol values statically. Calling function 'ɵmakeDecorator', function calls are not supported. Consider replacing the function or lambda with a reference to an exported function, resolving symbol Injectable...```
   
   If you get this error, you might be able to fix the problem by adding a path of ```"@angular/*": ["../node_modules/@angular/*"]``` 
   to your ```tsconfig.app.json``` file ([more information](https://github.com/angular/angular/issues/15767#issuecomment-308476202)).
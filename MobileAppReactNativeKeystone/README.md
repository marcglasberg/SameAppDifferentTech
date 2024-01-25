# React Native with MobX Keystone

> This is part of the <a href='../README.md'>**Same App, Different Tech**</a>
> project.
>
> It contains the same simple but not trivial **mobile app** implemented using a variety of **different tech stacks**.

<br/>

I gave up implementing this, as I don't think Keystone is mature enough
(as of January 2024).

In my opinion it's not worth building any complex project with state management solutions
that are unable to provide clear error messages.

When using MobX Keystone, 
for most errors the app just crashes with a bad error message that doesn't explain the problem, 
or it explains the problem but doesn't say where the problem is located.

There's at least one issue complaining about this, open since November 2022:

https://github.com/xaviergonz/mobx-keystone/issues/487

> Would it be easy to add more data to runtime error messages? I'm finding with a large state tree that the current
> error messages give very little information to help locate the problem.
>
> For example when data doesn't match in fromSnapshot you get an error like [Error: TypeCheckError: [/statusEffectDocId]
> Expected: string] which doesn't contain enough information to effectively figure out what bit of data is wrong.
>
> I think errors on fields would be much more useful if they also contained the following:
>
> The invalid value. Currently, it's impossible to tell why a type check failed because the invalid value isn't
> included.
> The full path to the invalid value from the root of whatever is being instantiated. Most of the time these errors come
> up when instantiating large nested models from snapshots. For example the above /statusEffectDocId would be much more
> useful if it were something like (fromSnapshot: PlayerModel)
> /items/equippedLeftHand/activeStatusEffects/statusEffectDocId. Without the full path it's not possible to know exactly
> where the invalid value is.
> The full path up to the root store if assigning a value to a prop in an existing store fails
> Poking around the code I'm having trouble figuring out if any of this information is easily available to include in
> errors. Thoughts @xaviergonz ? Would this potentially be easy? The current error messages give so little context info
> that it takes a lot of time and effort to track down what's going wrong even though mobx-keystone likely has all that
> information internally.

## Another Example:

Take this error message for example:

```
LOG  Loading Portfolio...
LOG  Running "MobileAppReactNativeKeystone" with {"rootTag":11}
ERROR  Failed to load portfolio [Error: an object cannot be assigned a new parent when it already has one]
```

The stacktrace is useless, as it points to internal Mobx/Keystone code, not to my code.
The message explains the problem, but what's the object the error message is referring to?
My own debug message explains it `failed to load portfolio`, so I guess it could be a problem with a `Portfolio` object,
or with `Stock` and `CashBalances` objects used by the `Portfolio` object. I have no idea.

It would be very easy for Keystone's error message to print the object's type and other information,
but it simply doesn't.

## Another example:

Consider the following code:

```typescript
@model('AbTesting')
export class AbTesting extends Model({
  value: prop<string>()
}, {
  valueType: true
}) {

  static AUTO = new AbTesting({ value: 'AUTO' });
  static A = new AbTesting({ value: 'A' });
  static B = new AbTesting({ value: 'B' });
}
```

Here we get the following error:

```
Error: no model info for class AbTesting could be found - did you forget to add the @model decorator?, js engine: hermes

ERROR  Invariant Violation: "MobileAppReactNativeKeystone" has not been registered. This can happen if:
* Metro (the local dev server) is run from the wrong folder. Check if Metro is running, stop it and restart it in the current project.
* A module failed to load due to an error and `AppRegistry.registerComponent` wasn't called., js engine: hermes
```

Clearly, the `@model decorator` is there.
The error message doesn't say that at all, but the problem is, actually,
that you can't define static properties inline, in a class that extends `Model`.

The solution is to move the static properties outside the class, like this:

```typescript
@model('AbTesting')
export class AbTesting extends Model({
  value: prop<string>()
}, {
  valueType: true
}) {
  static AUTO: AbTesting;
  static A: AbTesting;
  static B: AbTesting;

  private static readonly id = Math.floor(Math.random() * 1000);
}

AbTesting.AUTO = new AbTesting({ value: 'AUTO' });
AbTesting.A = new AbTesting({ value: 'A' });
AbTesting.B = new AbTesting({ value: 'B' });
```

But again, no clear error message.

# Conclusion

While MobX Keystone seems an interesting project, that solves many of the problems of MobX State Tree,
I think it's not mature enough to be used in production **as of 2024**.

I strongly recommend you never migrate a pre-existing project to MobX Keystone,
as you will have to deal with a lot of errors at the same time,
and you will have no idea where the source of each problem is.

But if you are developing something from scratch,
or if you start with some code that's already working well with MobX Keystone,
I think the error messages being bad is not a complete deal-breaker.
If you just wrote some code and you are now getting some error,
you know at least that the error is in the code you just wrote.

Still, I think it's not worth it. Sometimes you will get errors with no context, that can be anywhere in your code,
and you may end up spending hours trying to figure out how to solve simple problems
that good error messages could help you solve in seconds.
 

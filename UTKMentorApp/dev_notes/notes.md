# Notes to frontend guys:
    Signup needs error messages
    Fix +1 on phone #

# Notes for backend guys:
    Need to un-hardcode posting info

# Found error messages:
    ## 1
    [19:11:13] [Unhandled promise rejection: TypeError: undefined is not an object (evaluating 'data.attributes.name')]
    * screens/HomeScreen.js:44:28 in <unknown>
    - node_modules/promise/setimmediate/core.js:37:14 in tryCallOne
    - node_modules/promise/setimmediate/core.js:123:25 in <unknown>
    - ... 8 more stack frames from framework internals

    ### To reproduce:
    Sign up and put a name down? Happens every time I sign in.
    Author=Cody

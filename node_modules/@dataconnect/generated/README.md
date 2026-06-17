# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListContactsByAccount*](#listcontactsbyaccount)
- [**Mutations**](#mutations)
  - [*CreateAccount*](#createaccount)
  - [*AddContactToAccount*](#addcontacttoaccount)
  - [*CreateDeal*](#createdeal)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListContactsByAccount
You can execute the `ListContactsByAccount` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listContactsByAccount(vars: ListContactsByAccountVariables, options?: ExecuteQueryOptions): QueryPromise<ListContactsByAccountData, ListContactsByAccountVariables>;

interface ListContactsByAccountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListContactsByAccountVariables): QueryRef<ListContactsByAccountData, ListContactsByAccountVariables>;
}
export const listContactsByAccountRef: ListContactsByAccountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listContactsByAccount(dc: DataConnect, vars: ListContactsByAccountVariables, options?: ExecuteQueryOptions): QueryPromise<ListContactsByAccountData, ListContactsByAccountVariables>;

interface ListContactsByAccountRef {
  ...
  (dc: DataConnect, vars: ListContactsByAccountVariables): QueryRef<ListContactsByAccountData, ListContactsByAccountVariables>;
}
export const listContactsByAccountRef: ListContactsByAccountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listContactsByAccountRef:
```typescript
const name = listContactsByAccountRef.operationName;
console.log(name);
```

### Variables
The `ListContactsByAccount` query requires an argument of type `ListContactsByAccountVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListContactsByAccountVariables {
  accountId: UUIDString;
}
```
### Return Type
Recall that executing the `ListContactsByAccount` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListContactsByAccountData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListContactsByAccountData {
  contacts: ({
    firstName: string;
    lastName: string;
    email: string;
    jobTitle?: string | null;
  })[];
}
```
### Using `ListContactsByAccount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listContactsByAccount, ListContactsByAccountVariables } from '@dataconnect/generated';

// The `ListContactsByAccount` query requires an argument of type `ListContactsByAccountVariables`:
const listContactsByAccountVars: ListContactsByAccountVariables = {
  accountId: ..., 
};

// Call the `listContactsByAccount()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listContactsByAccount(listContactsByAccountVars);
// Variables can be defined inline as well.
const { data } = await listContactsByAccount({ accountId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listContactsByAccount(dataConnect, listContactsByAccountVars);

console.log(data.contacts);

// Or, you can use the `Promise` API.
listContactsByAccount(listContactsByAccountVars).then((response) => {
  const data = response.data;
  console.log(data.contacts);
});
```

### Using `ListContactsByAccount`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listContactsByAccountRef, ListContactsByAccountVariables } from '@dataconnect/generated';

// The `ListContactsByAccount` query requires an argument of type `ListContactsByAccountVariables`:
const listContactsByAccountVars: ListContactsByAccountVariables = {
  accountId: ..., 
};

// Call the `listContactsByAccountRef()` function to get a reference to the query.
const ref = listContactsByAccountRef(listContactsByAccountVars);
// Variables can be defined inline as well.
const ref = listContactsByAccountRef({ accountId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listContactsByAccountRef(dataConnect, listContactsByAccountVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.contacts);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.contacts);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateAccount
You can execute the `CreateAccount` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createAccount(vars: CreateAccountVariables): MutationPromise<CreateAccountData, CreateAccountVariables>;

interface CreateAccountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAccountVariables): MutationRef<CreateAccountData, CreateAccountVariables>;
}
export const createAccountRef: CreateAccountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAccount(dc: DataConnect, vars: CreateAccountVariables): MutationPromise<CreateAccountData, CreateAccountVariables>;

interface CreateAccountRef {
  ...
  (dc: DataConnect, vars: CreateAccountVariables): MutationRef<CreateAccountData, CreateAccountVariables>;
}
export const createAccountRef: CreateAccountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAccountRef:
```typescript
const name = createAccountRef.operationName;
console.log(name);
```

### Variables
The `CreateAccount` mutation requires an argument of type `CreateAccountVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAccountVariables {
  name: string;
  industry: string;
}
```
### Return Type
Recall that executing the `CreateAccount` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAccountData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAccountData {
  account_insert: Account_Key;
}
```
### Using `CreateAccount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAccount, CreateAccountVariables } from '@dataconnect/generated';

// The `CreateAccount` mutation requires an argument of type `CreateAccountVariables`:
const createAccountVars: CreateAccountVariables = {
  name: ..., 
  industry: ..., 
};

// Call the `createAccount()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAccount(createAccountVars);
// Variables can be defined inline as well.
const { data } = await createAccount({ name: ..., industry: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAccount(dataConnect, createAccountVars);

console.log(data.account_insert);

// Or, you can use the `Promise` API.
createAccount(createAccountVars).then((response) => {
  const data = response.data;
  console.log(data.account_insert);
});
```

### Using `CreateAccount`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAccountRef, CreateAccountVariables } from '@dataconnect/generated';

// The `CreateAccount` mutation requires an argument of type `CreateAccountVariables`:
const createAccountVars: CreateAccountVariables = {
  name: ..., 
  industry: ..., 
};

// Call the `createAccountRef()` function to get a reference to the mutation.
const ref = createAccountRef(createAccountVars);
// Variables can be defined inline as well.
const ref = createAccountRef({ name: ..., industry: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAccountRef(dataConnect, createAccountVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.account_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.account_insert);
});
```

## AddContactToAccount
You can execute the `AddContactToAccount` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addContactToAccount(vars: AddContactToAccountVariables): MutationPromise<AddContactToAccountData, AddContactToAccountVariables>;

interface AddContactToAccountRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddContactToAccountVariables): MutationRef<AddContactToAccountData, AddContactToAccountVariables>;
}
export const addContactToAccountRef: AddContactToAccountRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addContactToAccount(dc: DataConnect, vars: AddContactToAccountVariables): MutationPromise<AddContactToAccountData, AddContactToAccountVariables>;

interface AddContactToAccountRef {
  ...
  (dc: DataConnect, vars: AddContactToAccountVariables): MutationRef<AddContactToAccountData, AddContactToAccountVariables>;
}
export const addContactToAccountRef: AddContactToAccountRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addContactToAccountRef:
```typescript
const name = addContactToAccountRef.operationName;
console.log(name);
```

### Variables
The `AddContactToAccount` mutation requires an argument of type `AddContactToAccountVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddContactToAccountVariables {
  firstName: string;
  lastName: string;
  email: string;
  accountId: UUIDString;
}
```
### Return Type
Recall that executing the `AddContactToAccount` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddContactToAccountData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddContactToAccountData {
  contact_insert: Contact_Key;
}
```
### Using `AddContactToAccount`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addContactToAccount, AddContactToAccountVariables } from '@dataconnect/generated';

// The `AddContactToAccount` mutation requires an argument of type `AddContactToAccountVariables`:
const addContactToAccountVars: AddContactToAccountVariables = {
  firstName: ..., 
  lastName: ..., 
  email: ..., 
  accountId: ..., 
};

// Call the `addContactToAccount()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addContactToAccount(addContactToAccountVars);
// Variables can be defined inline as well.
const { data } = await addContactToAccount({ firstName: ..., lastName: ..., email: ..., accountId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addContactToAccount(dataConnect, addContactToAccountVars);

console.log(data.contact_insert);

// Or, you can use the `Promise` API.
addContactToAccount(addContactToAccountVars).then((response) => {
  const data = response.data;
  console.log(data.contact_insert);
});
```

### Using `AddContactToAccount`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addContactToAccountRef, AddContactToAccountVariables } from '@dataconnect/generated';

// The `AddContactToAccount` mutation requires an argument of type `AddContactToAccountVariables`:
const addContactToAccountVars: AddContactToAccountVariables = {
  firstName: ..., 
  lastName: ..., 
  email: ..., 
  accountId: ..., 
};

// Call the `addContactToAccountRef()` function to get a reference to the mutation.
const ref = addContactToAccountRef(addContactToAccountVars);
// Variables can be defined inline as well.
const ref = addContactToAccountRef({ firstName: ..., lastName: ..., email: ..., accountId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addContactToAccountRef(dataConnect, addContactToAccountVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.contact_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.contact_insert);
});
```

## CreateDeal
You can execute the `CreateDeal` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createDeal(vars: CreateDealVariables): MutationPromise<CreateDealData, CreateDealVariables>;

interface CreateDealRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDealVariables): MutationRef<CreateDealData, CreateDealVariables>;
}
export const createDealRef: CreateDealRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createDeal(dc: DataConnect, vars: CreateDealVariables): MutationPromise<CreateDealData, CreateDealVariables>;

interface CreateDealRef {
  ...
  (dc: DataConnect, vars: CreateDealVariables): MutationRef<CreateDealData, CreateDealVariables>;
}
export const createDealRef: CreateDealRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createDealRef:
```typescript
const name = createDealRef.operationName;
console.log(name);
```

### Variables
The `CreateDeal` mutation requires an argument of type `CreateDealVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateDealVariables {
  title: string;
  stage: string;
  value: number;
  accountId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateDeal` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateDealData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateDealData {
  deal_insert: Deal_Key;
}
```
### Using `CreateDeal`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createDeal, CreateDealVariables } from '@dataconnect/generated';

// The `CreateDeal` mutation requires an argument of type `CreateDealVariables`:
const createDealVars: CreateDealVariables = {
  title: ..., 
  stage: ..., 
  value: ..., 
  accountId: ..., 
};

// Call the `createDeal()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createDeal(createDealVars);
// Variables can be defined inline as well.
const { data } = await createDeal({ title: ..., stage: ..., value: ..., accountId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createDeal(dataConnect, createDealVars);

console.log(data.deal_insert);

// Or, you can use the `Promise` API.
createDeal(createDealVars).then((response) => {
  const data = response.data;
  console.log(data.deal_insert);
});
```

### Using `CreateDeal`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createDealRef, CreateDealVariables } from '@dataconnect/generated';

// The `CreateDeal` mutation requires an argument of type `CreateDealVariables`:
const createDealVars: CreateDealVariables = {
  title: ..., 
  stage: ..., 
  value: ..., 
  accountId: ..., 
};

// Call the `createDealRef()` function to get a reference to the mutation.
const ref = createDealRef(createDealVars);
// Variables can be defined inline as well.
const ref = createDealRef({ title: ..., stage: ..., value: ..., accountId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createDealRef(dataConnect, createDealVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.deal_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.deal_insert);
});
```


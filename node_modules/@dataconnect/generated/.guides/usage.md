# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createAccount, addContactToAccount, createDeal, listContactsByAccount } from '@dataconnect/generated';


// Operation CreateAccount:  For variables, look at type CreateAccountVars in ../index.d.ts
const { data } = await CreateAccount(dataConnect, createAccountVars);

// Operation AddContactToAccount:  For variables, look at type AddContactToAccountVars in ../index.d.ts
const { data } = await AddContactToAccount(dataConnect, addContactToAccountVars);

// Operation CreateDeal:  For variables, look at type CreateDealVars in ../index.d.ts
const { data } = await CreateDeal(dataConnect, createDealVars);

// Operation ListContactsByAccount:  For variables, look at type ListContactsByAccountVars in ../index.d.ts
const { data } = await ListContactsByAccount(dataConnect, listContactsByAccountVars);


```
import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Account_Key {
  id: UUIDString;
  __typename?: 'Account_Key';
}

export interface AddContactToAccountData {
  contact_insert: Contact_Key;
}

export interface AddContactToAccountVariables {
  firstName: string;
  lastName: string;
  email: string;
  accountId: UUIDString;
}

export interface Contact_Key {
  id: UUIDString;
  __typename?: 'Contact_Key';
}

export interface CreateAccountData {
  account_insert: Account_Key;
}

export interface CreateAccountVariables {
  name: string;
  industry: string;
}

export interface CreateDealData {
  deal_insert: Deal_Key;
}

export interface CreateDealVariables {
  title: string;
  stage: string;
  value: number;
  accountId: UUIDString;
}

export interface Deal_Key {
  id: UUIDString;
  __typename?: 'Deal_Key';
}

export interface Interaction_Key {
  id: UUIDString;
  __typename?: 'Interaction_Key';
}

export interface ListContactsByAccountData {
  contacts: ({
    firstName: string;
    lastName: string;
    email: string;
    jobTitle?: string | null;
  })[];
}

export interface ListContactsByAccountVariables {
  accountId: UUIDString;
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

interface CreateAccountRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAccountVariables): MutationRef<CreateAccountData, CreateAccountVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAccountVariables): MutationRef<CreateAccountData, CreateAccountVariables>;
  operationName: string;
}
export const createAccountRef: CreateAccountRef;

export function createAccount(vars: CreateAccountVariables): MutationPromise<CreateAccountData, CreateAccountVariables>;
export function createAccount(dc: DataConnect, vars: CreateAccountVariables): MutationPromise<CreateAccountData, CreateAccountVariables>;

interface AddContactToAccountRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddContactToAccountVariables): MutationRef<AddContactToAccountData, AddContactToAccountVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddContactToAccountVariables): MutationRef<AddContactToAccountData, AddContactToAccountVariables>;
  operationName: string;
}
export const addContactToAccountRef: AddContactToAccountRef;

export function addContactToAccount(vars: AddContactToAccountVariables): MutationPromise<AddContactToAccountData, AddContactToAccountVariables>;
export function addContactToAccount(dc: DataConnect, vars: AddContactToAccountVariables): MutationPromise<AddContactToAccountData, AddContactToAccountVariables>;

interface CreateDealRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDealVariables): MutationRef<CreateDealData, CreateDealVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDealVariables): MutationRef<CreateDealData, CreateDealVariables>;
  operationName: string;
}
export const createDealRef: CreateDealRef;

export function createDeal(vars: CreateDealVariables): MutationPromise<CreateDealData, CreateDealVariables>;
export function createDeal(dc: DataConnect, vars: CreateDealVariables): MutationPromise<CreateDealData, CreateDealVariables>;

interface ListContactsByAccountRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListContactsByAccountVariables): QueryRef<ListContactsByAccountData, ListContactsByAccountVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListContactsByAccountVariables): QueryRef<ListContactsByAccountData, ListContactsByAccountVariables>;
  operationName: string;
}
export const listContactsByAccountRef: ListContactsByAccountRef;

export function listContactsByAccount(vars: ListContactsByAccountVariables, options?: ExecuteQueryOptions): QueryPromise<ListContactsByAccountData, ListContactsByAccountVariables>;
export function listContactsByAccount(dc: DataConnect, vars: ListContactsByAccountVariables, options?: ExecuteQueryOptions): QueryPromise<ListContactsByAccountData, ListContactsByAccountVariables>;


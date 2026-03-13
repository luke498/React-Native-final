import React, { createContext, useReducer, useEffect } from "react";
import { getCurrentUser } from "../storage/auth";
import * as txStorage from "../storage/transactions";
import * as catStorage from "../storage/categories";

const initialState = {
  user: null,
  transactions: [],
  categories: [],
  loading: true,
};

const actionTypes = {
  SET_USER: "SET_USER",
  SET_TRANSACTIONS: "SET_TRANSACTIONS",
  SET_CATEGORIES: "SET_CATEGORIES",
};

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, user: action.payload };
    case actionTypes.SET_TRANSACTIONS:
      return { ...state, transactions: action.payload };
    case actionTypes.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    default:
      return state;
  }
}

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      dispatch({ type: actionTypes.SET_USER, payload: user });
      if (user) {
        const txs = await txStorage.listTransactions(user.id);
        dispatch({ type: actionTypes.SET_TRANSACTIONS, payload: txs });
        const cats = await catStorage.getCategories(user.id); 
        dispatch({ type: actionTypes.SET_CATEGORIES, payload: cats });
      }
    })();
  }, []);

  const addTransaction = async (tx) => {
    const userId = state.user?.id;
    if (!userId) return;
    const newList = await txStorage.addTransaction(userId, tx);
    dispatch({ type: actionTypes.SET_TRANSACTIONS, payload: newList });
  };

  const updateTransaction = async (id, patch) => {
    const userId = state.user?.id;
    if (!userId) return;
    const newList = await txStorage.updateTransaction(userId, id, patch);
    dispatch({ type: actionTypes.SET_TRANSACTIONS, payload: newList });
  };

  const deleteTransaction = async (id) => {
    const userId = state.user?.id;
    if (!userId) return;
    const newList = await txStorage.deleteTransaction(userId, id);
    dispatch({ type: actionTypes.SET_TRANSACTIONS, payload: newList });
  };

  const refreshCategories = async () => {
    const userId = state.user?.id;
    if (!userId) return;
    const cats = await catStorage.getCategories(userId); 
    dispatch({ type: actionTypes.SET_CATEGORIES, payload: cats });
  };

  const refreshUser = async () => {
    const user = await getCurrentUser();
    dispatch({ type: actionTypes.SET_USER, payload: user });
    if (user) {
      const txs = await txStorage.listTransactions(user.id);
      dispatch({ type: actionTypes.SET_TRANSACTIONS, payload: txs });
      const cats = await catStorage.getCategories(user.id); 
      dispatch({ type: actionTypes.SET_CATEGORIES, payload: cats });
    } else {
      dispatch({ type: actionTypes.SET_TRANSACTIONS, payload: [] });
      dispatch({ type: actionTypes.SET_CATEGORIES, payload: [] });
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refreshCategories,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
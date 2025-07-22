import { create, StateCreator } from "zustand";
import {persist} from "zustand/middleware"

interface GlobalState {
  UserToken: null | string;
  setUserToken: (newToken: string|null) => void;
  addContactModle:boolean;
  setAddContactModle:(togle:boolean)=>void;
  selectedCategory :string,
  setSelectedCategory:(catId:string)=>void,
}

type SetState = (partial: Partial<GlobalState> | ((state: GlobalState) => Partial<GlobalState>)) => void;


const Store: StateCreator<
GlobalState,
  [['zustand/persist', unknown]],
  []
> = (set:SetState)=>({
  UserToken : null,
  setUserToken:(newToken)=>set(()=>({UserToken:newToken})),
  addContactModle:false,
  selectedCategory :"all",
  setSelectedCategory:(catId)=>set(()=>({selectedCategory:catId})),
  setAddContactModle:(togle)=>set(()=>({addContactModle:togle})),
})


export const useStore = create(persist(Store,{name:"setAlkelState"}))
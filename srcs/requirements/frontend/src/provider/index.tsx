import React from "react";
const Context: any = React.createContext(null);

function useProvider<Type = any>() {
  return React.useContext<Type>(Context);
}
interface Props {
  value: any;
  children?: React.ReactNode;
}
const Provider = ({ value, children }: Props) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export { useProvider, Provider };
export default Provider;

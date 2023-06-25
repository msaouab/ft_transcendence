import { ReactNode } from "react";

interface CustomInputProps {
  placeHolder?: string;
  type?: string;
  value?: string;
  onChange?: any;
  icon?: ReactNode;
  name?:string;
  className?:string;
  lenght?: number;
}

const CustomInput = (props: CustomInputProps) => {
  return (
    <div className="flex items-center rounded-lg shadow-sm bg-white border-1 border-gray-800 px-1 py-2">
      <div className="text-2xl">{props.icon}</div>
      <input
        className={`appearance-none bg-transparent  w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none `}
        type={props.type}
        placeholder={props.placeHolder}
        aria-label="Full name"
        value={props.value}
        onChange={props.onChange}
        name={props.name}
        maxLength={props.lenght}
        
      />
    </div>
  );
};

export default CustomInput;

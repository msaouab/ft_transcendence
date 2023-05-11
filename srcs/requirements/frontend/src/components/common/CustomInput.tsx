import { ReactNode } from "react";

interface CustomInputProps {
  placeHolder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  name?:string;
}

const CustomInput = (props: CustomInputProps) => {
  return (
    <div className="flex items-center rounded-lg bg-white border-teal-500 px-1 py-2">
      <div className="text-2xl">{props.icon}</div>
      <input
        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
        type={props.type}
        placeholder={props.placeHolder}
        aria-label="Full name"
        value={props.value}
        onChange={props.onChange}
        name={props.name}
      />
    </div>
  );
};

export default CustomInput;

import type { FieldError } from "react-hook-form";

interface InputErrorProps {
  error?: FieldError;
}

const InputError = ({ error }: InputErrorProps) => {
  if (!error?.message) return null;

  return <p className="text-red-500 text-sm mt-1">{error.message}</p>;
};

export default InputError;

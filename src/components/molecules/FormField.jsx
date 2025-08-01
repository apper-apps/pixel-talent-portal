import Label from '@/components/atoms/Label'
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  multiline = false,
  error,
  className,
  ...props 
}) => {
  const InputComponent = multiline ? Textarea : Input;
  
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <InputComponent 
        type={type}
        {...props}
        className={cn(error && "border-red-500 focus:border-red-500 focus:ring-red-500/20")}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;
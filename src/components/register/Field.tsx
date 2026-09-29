
/**
 * Shared, form-agnostic form fields (registration + contact forms).
 * The surrounding <FormProvider> supplies the react-hook-form context, so
 * these components do not depend on any specific schema.
 */
export {
  TextField,
  SelectField,
  ComboboxField,
  TextareaField,
  getError,
  inputClassName,
} from "@/components/ui/FormField";

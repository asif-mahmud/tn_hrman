import Form from 'react-bootstrap/Form';
import { ErrorMessage } from 'formik';

/**
 * Shorthand component to show field error
 */
export function FormFieldError({ name }) {
  return (
    <Form.Text className="text-danger">
      <ErrorMessage name={name} />
    </Form.Text>
  );
}
